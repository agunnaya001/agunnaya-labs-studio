import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'
import solc from 'solc'
import { getChain } from '@/lib/chains'

interface DeployRequest {
  code: string
  contractName: string
  chainId: number
  deployArgs?: unknown[]
}

interface DeployResponse {
  txHash?: string
  address?: string
  status: 'pending' | 'success' | 'error'
  message: string
}

export async function POST(request: NextRequest): Promise<NextResponse<DeployResponse>> {
  try {
    const { code, contractName, chainId, deployArgs = [] } = (await request.json()) as DeployRequest

    // Get chain RPC
    const chain = getChain(chainId)
    if (!chain) {
      return NextResponse.json({
        status: 'error',
        message: `Chain ${chainId} not supported`,
      })
    }

    // Compile contract
    const input = {
      language: 'Solidity',
      sources: {
        'Contract.sol': {
          content: code,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode'],
          },
        },
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    }

    const compileOutput = JSON.parse(solc.compile(JSON.stringify(input)))

    if (compileOutput.errors?.some((e: { severity: string }) => e.severity === 'error')) {
      return NextResponse.json({
        status: 'error',
        message: 'Compilation failed',
      })
    }

    // Extract bytecode and ABI
    let bytecode = ''
    let abi: unknown[] = []

    for (const fileName in compileOutput.contracts) {
      for (const name in compileOutput.contracts[fileName]) {
        if (name === contractName || !bytecode) {
          const contract = compileOutput.contracts[fileName][name]
          bytecode = contract.evm?.bytecode?.object
          abi = contract.abi
        }
      }
    }

    if (!bytecode) {
      return NextResponse.json({
        status: 'error',
        message: `Contract ${contractName} not found in compilation output`,
      })
    }

    // Note: Actual deployment would require a wallet private key and signing
    // This is a demo endpoint that returns a mock response
    // In production, integrate with MetaMask or similar

    return NextResponse.json({
      status: 'pending',
      message: `Deploy initiated for ${contractName} on ${chain.name}. Note: Frontend wallet signing required for actual deployment.`,
      txHash: `0x${'0'.repeat(64)}`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      status: 'error',
      message: `Deployment error: ${message}`,
    })
  }
}
