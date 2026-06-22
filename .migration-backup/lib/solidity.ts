export const defaultSolidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MyContract
 * @dev A sample smart contract template
 */
contract MyContract {
    // State variables
    uint256 public counter;
    address public owner;

    // Events
    event CounterIncremented(uint256 newValue);
    event CounterReset();

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        counter = 0;
    }

    /**
     * @dev Increment the counter
     */
    function increment() public {
        counter++;
        emit CounterIncremented(counter);
    }

    /**
     * @dev Reset the counter to zero
     */
    function reset() public onlyOwner {
        counter = 0;
        emit CounterReset();
    }

    /**
     * @dev Get the current counter value
     * @return The current counter value
     */
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
`

export function extractContractName(code: string): string {
  const match = code.match(/contract\s+(\w+)/i)
  return match ? match[1] : 'Contract'
}

export function generateSolidityErrorMessage(error: string): string {
  // Parse common Solidity compiler errors
  if (error.includes('SyntaxError')) {
    return `Syntax Error: Check your code syntax`
  }
  if (error.includes('TypeError')) {
    return `Type Error: Check variable types and function signatures`
  }
  if (error.includes('is not defined')) {
    return `Undefined: Variable or function not declared`
  }
  return error
}
