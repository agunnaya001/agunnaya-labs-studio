import { Router } from "express";
import solc from "solc";

const router = Router();

router.post("/compile", async (req, res) => {
  try {
    const { code } = req.body as { code: string };

    if (!code || code.trim().length === 0) {
      res.json({
        abi: null,
        bytecode: null,
        errors: [{ message: "No code provided", severity: "error" }],
        warnings: [],
      });
      return;
    }

    const input = {
      language: "Solidity",
      sources: {
        "Contract.sol": {
          content: code,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    const errors: Array<{ message: string; severity: "error" | "warning" }> =
      [];
    const warnings: Array<{ message: string; severity: "error" | "warning" }> =
      [];

    if (output.errors) {
      for (const error of output.errors) {
        const item = {
          message: error.message,
          severity:
            error.severity === "error"
              ? ("error" as const)
              : ("warning" as const),
        };
        if (error.severity === "error") {
          errors.push(item);
        } else {
          warnings.push(item);
        }
      }
    }

    let abi = null;
    let bytecode = null;

    if (output.contracts) {
      for (const fileName in output.contracts) {
        for (const contractName in output.contracts[fileName]) {
          const contract = output.contracts[fileName][contractName];
          if (contract.abi && contract.evm?.bytecode?.object) {
            abi = contract.abi;
            bytecode = contract.evm.bytecode.object;
            break;
          }
        }
        if (abi) break;
      }
    }

    res.json({ abi, bytecode, errors, warnings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.json({
      abi: null,
      bytecode: null,
      errors: [
        { message: `Compilation error: ${message}`, severity: "error" },
      ],
      warnings: [],
    });
  }
});

export default router;
