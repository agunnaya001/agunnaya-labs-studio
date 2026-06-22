'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { solidityProjects, deployments, chatHistory } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveProject(data: {
  name: string
  code: string
  description?: string
  tags?: string[]
}) {
  const userId = await getUserId()

  const result = await db
    .insert(solidityProjects)
    .values({
      userId,
      name: data.name,
      code: data.code,
      description: data.description,
      tags: data.tags,
    })
    .returning()

  revalidatePath('/')
  return result[0]
}

export async function getProjects() {
  const userId = await getUserId()
  return db
    .select()
    .from(solidityProjects)
    .where(eq(solidityProjects.userId, userId))
    .orderBy(desc(solidityProjects.createdAt))
}

export async function getProject(id: number) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(solidityProjects)
    .where(
      and(eq(solidityProjects.id, id), eq(solidityProjects.userId, userId))
    )

  if (!result[0]) throw new Error('Project not found')
  return result[0]
}

export async function updateProject(
  id: number,
  data: { name?: string; code?: string; description?: string; tags?: string[] }
) {
  const userId = await getUserId()

  const result = await db
    .update(solidityProjects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(eq(solidityProjects.id, id), eq(solidityProjects.userId, userId))
    )
    .returning()

  if (!result[0]) throw new Error('Project not found')
  revalidatePath('/')
  return result[0]
}

export async function deleteProject(id: number) {
  const userId = await getUserId()

  await db
    .delete(solidityProjects)
    .where(
      and(eq(solidityProjects.id, id), eq(solidityProjects.userId, userId))
    )

  revalidatePath('/')
}

export async function saveDeployment(data: {
  projectId: number
  contractAddress?: string
  txHash: string
  chainId: number
  chainName: string
  blockNumber?: number
  gasUsed?: number
  status?: string
  error?: string
}) {
  const userId = await getUserId()

  const result = await db
    .insert(deployments)
    .values({
      userId,
      ...data,
    })
    .returning()

  revalidatePath('/')
  return result[0]
}

export async function getDeployments(projectId?: number) {
  const userId = await getUserId()

  const whereClause = projectId
    ? and(eq(deployments.userId, userId), eq(deployments.projectId, projectId))
    : eq(deployments.userId, userId)

  return db
    .select()
    .from(deployments)
    .where(whereClause)
    .orderBy(desc(deployments.createdAt))
}

export async function saveChatMessage(data: {
  projectId?: number
  agentId: string
  role: 'user' | 'assistant'
  content: string
}) {
  const userId = await getUserId()

  const result = await db
    .insert(chatHistory)
    .values({
      userId,
      ...data,
    })
    .returning()

  return result[0]
}

export async function getChatHistory(agentId: string, projectId?: number) {
  const userId = await getUserId()

  const whereClause = projectId
    ? and(
        eq(chatHistory.userId, userId),
        eq(chatHistory.agentId, agentId),
        eq(chatHistory.projectId, projectId)
      )
    : and(eq(chatHistory.userId, userId), eq(chatHistory.agentId, agentId))

  return db
    .select()
    .from(chatHistory)
    .where(whereClause)
    .orderBy(desc(chatHistory.createdAt))
}
