import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { getAgent } from '@/lib/agents'

interface ChatRequest {
  agentId: string
  messages: Array<{ role: string; content: string }>
  contractCode?: string
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, messages, contractCode } = (await request.json()) as ChatRequest

    const agent = getAgent(agentId)
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 400 }
      )
    }

    // Convert messages to proper format
    const formattedMessages = messages
      .filter((m) => m.role && m.content)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    // Build context with contract code if provided
    let systemPrompt = agent.systemPrompt
    if (contractCode && contractCode.trim().length > 0) {
      systemPrompt += `\n\nCurrent contract code:\n\`\`\`solidity\n${contractCode}\n\`\`\``
    }

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      messages: formattedMessages,
      temperature: 0.7,
    })

    // Convert to a readable stream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n`))
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n`))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Chat error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Chat failed',
      },
      { status: 500 }
    )
  }
}
