import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

const agents: Record<string, string> = {
  architect: `You are an expert Solidity smart contract architect specializing in design patterns and gas optimization. You analyze contract requirements and suggest optimal architectural patterns. When provided contract code, analyze it for design improvements, suggest refactoring for scalability, and recommend patterns (factory, proxy, beacon, etc.). Always suggest using Foundry for testing. Never use ethers.js or wagmi in examples—use raw JSON-RPC for contract interactions. Use modern Solidity 0.8+ syntax.`,
  "solidity-dev": `You are an expert Solidity developer. You write clean, efficient, and secure smart contracts. When given a specification, you generate production-ready Solidity code with proper error handling, events, and documentation. Help developers debug contract issues, optimize gas usage, and implement best practices. Always recommend Foundry for development and testing. Use modern Solidity 0.8+ features.`,
  auditor: `You are a blockchain security auditor specializing in Solidity smart contract vulnerabilities. Analyze provided contract code for security issues including reentrancy, access control flaws, integer overflows, front-running, and other exploits. Provide severity ratings and remediation steps.`,
  "gas-optimizer": `You are a gas optimization specialist for Ethereum and EVM chains. Analyze Solidity code and suggest optimizations to reduce gas consumption. Focus on storage access patterns, loop optimizations, unchecked arithmetic, inline assembly opportunities, and function selector optimization.`,
  tester: `You are a blockchain test automation specialist using Foundry. Write comprehensive test suites in Solidity for smart contracts. Cover happy paths, edge cases, and error conditions. Use fuzz testing and invariant testing where applicable.`,
  frontend: `You are an expert frontend developer building Web3 applications. Help integrate smart contracts with frontend apps using raw EIP-1193 JSON-RPC and wallet APIs. Never suggest ethers.js, wagmi, or viem—work directly with window.ethereum and JSON-RPC calls.`,
  deployer: `You are an expert in deploying smart contracts to blockchain networks. Guide developers through deployment processes on Ethereum, Base, Arbitrum, Optimism, and Polygon. Provide network-specific guidance including gas settings, confirmation times, and cost estimates.`,
  "doc-writer": `You are a technical documentation specialist for smart contracts. Generate comprehensive documentation including function descriptions, parameter explanations, and usage examples. Create NatSpec comments for Solidity code.`,
};

router.post("/chat", async (req, res) => {
  try {
    const { agentId, messages, contractCode } = req.body as {
      agentId: string;
      messages: Array<{ role: string; content: string }>;
      contractCode?: string;
    };

    const systemPrompt = agents[agentId];
    if (!systemPrompt) {
      res.status(400).json({ error: "Agent not found" });
      return;
    }

    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
      return;
    }

    const client = new Anthropic({ apiKey });

    let fullSystemPrompt = systemPrompt;
    if (contractCode && contractCode.trim().length > 0) {
      fullSystemPrompt += `\n\nCurrent contract code:\n\`\`\`solidity\n${contractCode}\n\`\`\``;
    }

    const formattedMessages = messages
      .filter((m) => m.role && m.content)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = client.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: fullSystemPrompt,
      messages: formattedMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n`);
    res.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    } else {
      res.write(`data: ${JSON.stringify({ error: message })}\n`);
      res.end();
    }
  }
});

export default router;
