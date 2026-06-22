import React, { createContext, useContext, useState } from "react";

const DEFAULT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MyContract
 * @dev A sample smart contract
 */
contract MyContract {
    uint256 public counter;
    address public owner;

    event CounterIncremented(uint256 newValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        counter = 0;
    }

    function increment() public {
        counter++;
        emit CounterIncremented(counter);
    }

    function reset() public onlyOwner {
        counter = 0;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}`;

interface Diagnostic {
  message: string;
  severity: "error" | "warning" | "info";
}

interface IDEContextType {
  code: string;
  setCode: (code: string) => void;
  diagnostics: Diagnostic[];
  setDiagnostics: (d: Diagnostic[]) => void;
  compiledAbi: unknown[];
  setCompiledAbi: (abi: unknown[]) => void;
  compiledBytecode: string;
  setCompiledBytecode: (b: string) => void;
  isCompiling: boolean;
  setIsCompiling: (v: boolean) => void;
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
}

const IDEContext = createContext<IDEContextType>({
  code: DEFAULT_CODE,
  setCode: () => {},
  diagnostics: [],
  setDiagnostics: () => {},
  compiledAbi: [],
  setCompiledAbi: () => {},
  compiledBytecode: "",
  setCompiledBytecode: () => {},
  isCompiling: false,
  setIsCompiling: () => {},
  selectedAgentId: "architect",
  setSelectedAgentId: () => {},
});

export function IDEProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [compiledAbi, setCompiledAbi] = useState<unknown[]>([]);
  const [compiledBytecode, setCompiledBytecode] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("architect");

  return (
    <IDEContext.Provider
      value={{
        code, setCode,
        diagnostics, setDiagnostics,
        compiledAbi, setCompiledAbi,
        compiledBytecode, setCompiledBytecode,
        isCompiling, setIsCompiling,
        selectedAgentId, setSelectedAgentId,
      }}
    >
      {children}
    </IDEContext.Provider>
  );
}

export function useIDE() {
  return useContext(IDEContext);
}

export const AGENTS = [
  { id: "architect", name: "Architect", icon: "layers" as const, role: "Design" },
  { id: "solidity-dev", name: "Solidity Dev", icon: "code" as const, role: "Development" },
  { id: "auditor", name: "Auditor", icon: "shield" as const, role: "Security" },
  { id: "gas-optimizer", name: "Gas Optimizer", icon: "zap" as const, role: "Optimization" },
  { id: "tester", name: "Test Engineer", icon: "check-circle" as const, role: "Testing" },
  { id: "frontend", name: "Frontend Dev", icon: "monitor" as const, role: "Frontend" },
  { id: "deployer", name: "Deployer", icon: "upload-cloud" as const, role: "Deploy" },
  { id: "doc-writer", name: "Doc Writer", icon: "file-text" as const, role: "Docs" },
];
