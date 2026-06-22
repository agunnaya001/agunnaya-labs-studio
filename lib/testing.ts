/**
 * Testing utilities and mock data generators
 */

export const mockContracts = {
  counter: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;
    address public owner;
    
    event CountIncremented(uint256 newValue);
    event CountDecremented(uint256 newValue);
    
    constructor() {
        owner = msg.sender;
        count = 0;
    }
    
    function increment() public {
        count++;
        emit CountIncremented(count);
    }
    
    function decrement() public {
        require(count > 0, "Count cannot go below zero");
        count--;
        emit CountDecremented(count);
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}`,

  token: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleToken {
    string public name = "Simple Token";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0));
        require(balanceOf[msg.sender] >= value);
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}`,
}

export const mockDeployments = [
  {
    id: '1',
    chainId: 8453,
    chainName: 'Base',
    contractAddress: '0x1234567890123456789012345678901234567890',
    txHash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    blockNumber: 12345678,
    gasUsed: 125000,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'success',
  },
  {
    id: '2',
    chainId: 1,
    chainName: 'Ethereum',
    contractAddress: '0xfedcba9876543210fedcba9876543210fedcba98',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockNumber: 19876543,
    gasUsed: 189000,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'success',
  },
]

export const mockProjects = [
  {
    id: 1,
    name: 'Counter Contract',
    code: mockContracts.counter,
    description: 'A simple counter contract for testing',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    name: 'Token Contract',
    code: mockContracts.token,
    description: 'ERC-20 compatible simple token',
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

export const mockABI = [
  {
    inputs: [],
    name: 'count',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'increment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decrement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'newValue', type: 'uint256' }],
    name: 'CountIncremented',
    type: 'event',
  },
]

export function generateMockChatMessage(role: 'user' | 'assistant', content: string) {
  return {
    role,
    content,
    timestamp: new Date().toISOString(),
  }
}

export function generateMockDeployment(chainId: number) {
  return {
    chainId,
    address: `0x${Math.random().toString(16).slice(2).padStart(40, '0')}`,
    txHash: `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  }
}

// Test runners
export async function testCompilation(code: string) {
  try {
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    return await response.json()
  } catch (error) {
    console.error('[v0] Compilation test failed:', error)
    return { error: 'Compilation failed' }
  }
}

export async function testChat(message: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: 'architect',
        messages: [{ role: 'user', content: message }],
        contractCode: mockContracts.counter,
      }),
    })
    return response.ok ? 'Chat API working' : 'Chat API failed'
  } catch (error) {
    console.error('[v0] Chat test failed:', error)
    return 'Chat API error'
  }
}
