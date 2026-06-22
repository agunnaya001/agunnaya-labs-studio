import { Metadata } from 'next'

export const siteMetadata = {
  title: 'Agunnaya Labs Studio - Build Web3 Apps With AI',
  description: 'AI-powered IDE for building, deploying, and managing smart contracts on Base and Ethereum with multi-chain support.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://studio.agunnaya.labs',
  image: '/og-image.png',
  author: 'Agunnaya Labs',
  twitter: '@agunnaya',
}

export const getCommonMetadata = (): Metadata => ({
  title: {
    template: '%s | Agunnaya Labs Studio',
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteMetadata.url,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [
      {
        url: siteMetadata.image,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.image],
    creator: siteMetadata.twitter,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
})

export const pageMetadata = {
  landing: {
    title: 'Agunnaya Labs Studio',
    description: 'Build anything with AI. Generate apps, smart contracts, games, and deploy to Base mainnet.',
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Manage your projects, track deployments, and collaborate with AI agents.',
  },
  ide: {
    title: 'IDE',
    description: 'Write, compile, and deploy Solidity smart contracts with AI assistance.',
  },
}
