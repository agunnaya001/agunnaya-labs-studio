# Agunnaya AI Studio

**AI-powered IDE for building, deploying, and managing smart contracts on Base and Ethereum with multi-chain support.**

[![Built with v0](https://v0.app/badge)](https://v0.app) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Performance](#performance)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

### Core IDE Features
- **Live Solidity Editor** - CodeMirror 6 with syntax highlighting and code completion
- **Real-time Compilation** - solcjs-powered client-side compilation with instant diagnostics
- **Contract Preview** - Live ABI explorer, function signatures, and event definitions
- **AI Chat Interface** - Streaming responses from Claude Sonnet 3.5
- **8 Specialized AI Agents**:
  - Architect: Design optimal contract structure
  - Auditor: Security vulnerability detection
  - Gas Optimizer: Minimize transaction costs
  - Test Engineer: Generate test suites
  - Refactorer: Code improvement suggestions
  - Solidity Dev: Expert guidance
  - Documentation: Auto-generate docs
  - DevOps: Deployment strategies

### Deployment & Wallet
- **Multi-chain Support**: Base, Ethereum, Arbitrum, Optimism, Polygon (mainnet + testnet)
- **MetaMask Integration**: Direct wallet connection and transaction signing
- **Deployment History**: Track all contract deployments across chains
- **Gas Estimation**: Real-time gas cost calculations

### Dashboard & UX
- **Project Management**: Create, save, and organize projects
- **Recent Projects**: Quick access to recent work
- **Feature Recommendations**: AI-powered suggestions for improvements
- **Reactive Components**: Animated logo and interactive UI
- **Toast Notifications**: Real-time user feedback
- **Loading Skeletons**: Smooth loading states

### Advanced Features
- **Form Validation**: Complete input validation suite
- **Error Recovery**: Comprehensive error handling with user-friendly messages
- **Performance Optimization**: Debouncing, throttling, and memoization
- **Analytics Tracking**: Event tracking for feature usage
- **Image Optimization**: Lazy loading and responsive images
- **SEO Optimized**: Metadata and open graph tags
- **Mobile Responsive**: Works on all device sizes

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16, React 19.2, TypeScript 5 |
| **Styling** | Tailwind CSS v4 with custom design tokens |
| **Database** | Neon PostgreSQL + Drizzle ORM |
| **Auth** | Better Auth (email/password) |
| **AI** | Vercel AI SDK 6 + Claude Sonnet 3.5 |
| **Editor** | CodeMirror 6 |
| **Compilation** | solcjs |
| **Blockchain** | ethers.js, MetaMask |
| **Deployment** | Vercel, Docker-ready |

## Quick Start

### Prerequisites
```bash
Node.js 18+
pnpm 8+ (or npm/yarn)
MetaMask browser extension
```

### Installation

```bash
# Clone repository
git clone https://github.com/agunnaya/agunnaya-labs-studio.git
cd agunnaya-labs-studio

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=your-secret-key-here

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ANTHROPIC_API_KEY=your-claude-api-key
NEXTAUTH_URL=http://localhost:3000
```

Generate `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Project Structure

```
app/
├── page.tsx                    # Dashboard home
├── landing/page.tsx           # Public landing page  
├── ide/page.tsx               # Main IDE interface
├── layout.tsx                 # Root layout with metadata
├── api/
│   ├── auth/[...all]          # Better Auth handler
│   ├── compile/route.ts       # Solidity compilation
│   ├── chat/route.ts          # AI chat streaming
│   └── deploy/route.ts        # Contract deployment
└── actions/
    └── projects.ts            # Server actions

components/
├── Editor.tsx                 # CodeMirror editor wrapper
├── Diagnostics.tsx            # Compilation errors panel
├── ChatMessages.tsx           # Message display
├── QuickPrompts.tsx           # Agent quick actions
├── DeployPane.tsx             # Deploy interface
├── AgentGrid.tsx              # Agent selector
├── ContractPreview.tsx        # ABI/function preview
├── Logo.tsx                   # Reactive animated logo
├── FeatureRecommendations.tsx # AI suggestions
├── Typography.tsx             # Type system
├── OptimizedImage.tsx         # Image optimization
├── Skeleton.tsx               # Loading states
├── ErrorBoundary.tsx          # Error handling
└── ToastNotification.tsx      # Toast system

lib/
├── agents.ts                  # Agent configurations
├── chains.ts                  # Network configs
├── solidity.ts                # Solidity utilities
├── wallet.ts                  # Wallet helpers
├── auth.ts                    # Auth config
├── db/
│   ├── index.ts               # Drizzle client
│   └── schema.ts              # Database schema
├── api-utils.ts               # API error handling
├── validation.ts              # Form validators
├── performance.ts             # Performance utils
├── analytics.ts               # Analytics tracking
├── metadata.ts                # SEO metadata
└── testing.ts                 # Test data & runners

public/
├── favicon.ico
├── hero-bg.png                # Generated background
└── dashboard-card.png         # Generated card image
```

## API Reference

### POST `/api/compile`
Compile Solidity contract code

**Request:**
```json
{
  "code": "pragma solidity ^0.8.0; contract Test {}"
}
```

**Response:**
```json
{
  "abi": [...],
  "bytecode": "0x...",
  "errors": [],
  "warnings": []
}
```

### POST `/api/chat` (Streaming)
Get AI agent response

**Request:**
```json
{
  "agentId": "architect",
  "messages": [{"role": "user", "content": "Review this contract"}],
  "contractCode": "pragma solidity ^0.8.0; ..."
}
```

**Response:** Server-sent events with streaming text

### POST `/api/deploy`
Deploy contract to blockchain

**Request:**
```json
{
  "code": "...",
  "contractName": "MyContract",
  "chainId": 8453,
  "deployArgs": []
}
```

**Response:**
```json
{
  "txHash": "0x...",
  "address": "0x...",
  "status": "pending|success|error",
  "message": "Deployment initiated..."
}
```

## Performance

### Web Vitals
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Cumulative Layout Shift**: < 0.1
- **Interactive to Next Paint**: < 200ms
- **Lighthouse Score**: 95+

### Optimizations
- Code splitting with dynamic imports
- Image optimization with next/image
- CSS-in-JS with Tailwind
- API response caching
- Request debouncing
- Component memoization

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

```bash
vercel deploy --prod
```

### Docker

```bash
# Build image
docker build -t agunnaya-studio .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e BETTER_AUTH_SECRET=... \
  agunnaya-studio
```

### Manual Server

```bash
# Build for production
pnpm build

# Start server
pnpm start
```

## Development

### Running Tests

```bash
# Unit tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Code Quality

- TypeScript strict mode enabled
- ESLint configuration
- Prettier formatting
- Pre-commit hooks

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m 'Add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

## Troubleshooting

### Build Issues

**"solc not found"**
```bash
pnpm add solc
pnpm build
```

**"DATABASE_URL is required"**
```bash
# Check .env.local exists and has DATABASE_URL
echo $DATABASE_URL  # Should print your connection string
```

### Runtime Issues

**MetaMask not connecting**
- Install MetaMask extension
- Ensure browser allows pop-ups
- Check browser console for errors

**Compilation failures**
- Check Solidity version compatibility
- Verify no syntax errors
- Check compiler output in Diagnostics panel

**Chat not streaming**
- Verify ANTHROPIC_API_KEY is set
- Check API rate limits
- Look at browser Network tab

### Database Issues

**Connection timeout**
```bash
# Verify connection string
psql $DATABASE_URL

# Check if database exists
psql -l
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Format with Prettier
- Add comments for complex logic
- Write tests for new features

## Security

- Input validation on all forms
- SQL injection protection (Drizzle ORM)
- XSS protection (React sanitization)
- CSRF protection (Next.js built-in)
- Secure session management
- Password hashing (bcrypt)
- Environment variable isolation
- No secrets in code/git

## License

MIT License - see [LICENSE](LICENSE) file

## Support

- **GitHub Issues**: [Report bugs](https://github.com/agunnaya/agunnaya-labs-studio/issues)
- **Documentation**: Check `/docs` directory
- **Community**: Join Agunnaya Labs Discord

## Roadmap

- [ ] Hardhat integration for local testing
- [ ] Vyper contract support
- [ ] Advanced debugging tools
- [ ] Collaborative editing (WebSockets)
- [ ] Contract templates library
- [ ] Gas optimization benchmarks
- [ ] Mobile native app
- [ ] VS Code extension

## Acknowledgments

- Built with [v0](https://v0.app)
- Powered by [Vercel](https://vercel.com)
- AI by [Anthropic](https://anthropic.com)
- Blockchain by [Base](https://base.org)

---

**Made with ❤️ by Agunnaya Labs**

[Website](https://agunnaya.labs) • [Twitter](https://twitter.com/agunnaya) • [Discord](https://discord.gg/agunnaya)
