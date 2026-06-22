import { Router } from "express";
import solc from "solc";

const router = Router();

const chains: Record<number, { name: string; rpc: string; explorer: string }> =
  {
    8453: {
      name: "Base Mainnet",
      rpc: "https://mainnet.base.org",
      explorer: "https://basescan.org",
    },
    84532: {
      name: "Base Sepolia",
      rpc: "https://sepolia.base.org",
      explorer: "https://sepolia.basescan.org",
    },
    1: {
      name: "Ethereum Mainnet",
      rpc: "https://eth.llamarpc.com",
      explorer: "https://etherscan.io",
    },
    11155111: {
      name: "Ethereum Sepolia",
      rpc: "https://eth-sepolia.public.blastapi.io",
      explorer: "https://sepolia.etherscan.io",
    },
    42161: {
      name: "Arbitrum One",
      rpc: "https://arb1.arbitrum.io/rpc",
      explorer: "https://arbiscan.io",
    },
    10: {
      name: "Optimism Mainnet",
      rpc: "https://mainnet.optimism.io",
      explorer: "https://optimistic.etherscan.io",
    },
    137: {
      name: "Polygon Mainnet",
      rpc: "https://polygon-rpc.com",
      explorer: "https://polygonscan.com",
    },
  };

router.post("/deploy", async (req, res) => {
  try {
    const {
      code,
      contractName,
      chainId,
      deployArgs = [],
    } = req.body as {
      code: string;
      contractName: string;
      chainId: number;
      deployArgs?: unknown[];
    };

    const chain = chains[chainId];
    if (!chain) {
      res.json({ status: "error", message: `Chain ${chainId} not supported` });
      return;
    }

    const input = {
      language: "Solidity",
      sources: { "Contract.sol": { content: code } },
      settings: {
        outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
        optimizer: { enabled: true, runs: 200 },
      },
    };

    const compileOutput = JSON.parse(solc.compile(JSON.stringify(input)));

    if (
      compileOutput.errors?.some(
        (e: { severity: string }) => e.severity === "error",
      )
    ) {
      res.json({ status: "error", message: "Compilation failed" });
      return;
    }

    let bytecode = "";
    let abi: unknown[] = [];

    for (const fileName in compileOutput.contracts) {
      for (const name in compileOutput.contracts[fileName]) {
        if (name === contractName || !bytecode) {
          const contract = compileOutput.contracts[fileName][name];
          bytecode = contract.evm?.bytecode?.object || "";
          abi = contract.abi || [];
        }
      }
    }

    if (!bytecode) {
      res.json({
        status: "error",
        message: `Contract ${contractName} not found in compilation output`,
      });
      return;
    }

    // Actual deployment requires a wallet private key / MetaMask signing on frontend
    // This endpoint validates and compiles, returning the bytecode for client-side deployment
    res.json({
      status: "pending",
      message: `Contract compiled successfully for ${chain.name}. Connect MetaMask to deploy.`,
      txHash: `0x${"0".repeat(64)}`,
      bytecode,
      abi,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.json({ status: "error", message: `Deployment error: ${message}` });
  }
});

export default router;
