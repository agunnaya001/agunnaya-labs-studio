import { NextRequest, NextResponse } from 'next/server'
import solc from 'solc'

interface CompileRequest {
  code: string
}

interface CompileResponse {
  abi: unknown[] | null
  bytecode: string | null
  errors: Array<{ message: string; severity: 'error' | 'warning' }>
  warnings: Array<{ message: string; severity: 'error' | 'warning' }>
}

export async function POST(request: NextRequest): Promise<NextResponse<CompileResponse>> {
  try {
    const { code } = (await request.json()) as CompileRequest

    if (!code || code.trim().length === 0) {
      return NextResponse.json({
        abi: null,
        bytecode: null,
        errors: [{ message: 'No code provided', severity: 'error' }],
        warnings: [],
      })
    }

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

    const output = JSON.parse(solc.compile(JSON.stringify(input)))

    const errors: Array<{ message: string; severity: 'error' | 'warning' }> = []
    const warnings: Array<{ message: string; severity: 'error' | 'warning' }> = []

    if (output.errors) {
      for (const error of output.errors) {
        const item = {
          message: error.message,
          severity: error.severity === 'error' ? ('error' as const) : ('warning' as const),
        }
        if (error.severity === 'error') {
          errors.push(item)
        } else {
          warnings.push(item)
        }
      }
    }

    let abi = null
    let bytecode = null

    if (output.contracts) {
      for (const fileName in output.contracts) {
        for (const contractName in output.contracts[fileName]) {
          const contract = output.contracts[fileName][contractName]
          if (contract.abi && contract.evm?.bytecode?.object) {
            abi = contract.abi
            bytecode = contract.evm.bytecode.object
            break
          }
        }
      }
    }

    return NextResponse.json({
      abi,
      bytecode,
      errors,
      warnings,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      abi: null,
      bytecode: null,
      errors: [{ message: `Compilation error: ${message}`, severity: 'error' }],
      warnings: [],
    })
  }
}
