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
  const match = code.match(/contract\s+(\w+)/)
  return match?.[1] || 'MyContract'
}

export function extractContractNames(code: string): string[] {
  const matches = code.matchAll(/contract\s+(\w+)/g)
  return [...matches].map((m) => m[1])
}
