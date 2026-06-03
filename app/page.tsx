'use client'

import { useState } from 'react'
import Image from 'next/image'
import { TrendingUp, Users, Wallet, Zap, Share2, ArrowRight, Check, Smartphone } from 'lucide-react'

export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="ChonkPump"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
            </div>
            <span className="text-xl font-bold text-primary">ChonkPump</span>
          </div>
          <a
            href="#"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/50"
          >
            Open Bot
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <div className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
              <span className="text-sm font-medium text-primary">🐷 Trade CHONK9K Directly from Telegram</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Trade Crypto
              <span className="text-primary"> Without Leaving</span>
              Telegram
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Real-time balance checking, instant swaps, live leaderboards, and portfolio tracking—all in your Telegram bot. Trade CHONK9K tokens on Base network with MetaMask or Telegram Wallet.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#"
              className="group flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/50"
            >
              Launch Bot <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 px-8 py-4 text-sm font-semibold transition-all hover:bg-primary/5"
            >
              Learn More
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">7</p>
              <p className="text-sm text-muted-foreground">Core Features</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">2</p>
              <p className="text-sm text-muted-foreground">Wallet Modes</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">1</p>
              <p className="text-sm text-muted-foreground">Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to trade CHONK9K tokens directly from Telegram
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            {[
              {
                icon: Wallet,
                title: 'Balance Checking',
                description: 'Real-time CHONK9K balance from your connected wallet',
                status: 'Live'
              },
              {
                icon: Zap,
                title: 'Instant Swaps',
                description: 'Quick links to ChonkPump for token trading',
                status: 'Live'
              },
              {
                icon: Users,
                title: 'Live Leaderboard',
                description: 'See top 10 CHONK9K holders with real-time updates',
                status: 'Live'
              },
              {
                icon: TrendingUp,
                title: 'Portfolio Tracking',
                description: 'Your holdings, trading history, and P&L analysis',
                status: 'Live'
              },
              {
                icon: Wallet,
                title: 'MetaMask Connect',
                description: 'Connect existing Ethereum wallets securely',
                status: 'Live'
              },
              {
                icon: Share2,
                title: 'Referral System',
                description: 'Unique referral links with earnings tracking',
                status: 'Live'
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary">✓ {feature.status}</span>
                  </div>
                  <h3 className="mt-4 font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wallet Modes Section */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold">Dual Wallet Modes</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose how you want to trade
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-primary/50 bg-gradient-to-br from-primary/5 to-transparent p-8">
              <div className="inline-block rounded-lg bg-primary/20 p-3 mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">MetaMask</h3>
              <p className="mt-2 text-muted-foreground">
                Connect your existing Ethereum wallet. Read balances and link to swaps.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm">Fast connection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm">No key storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm">Ready now</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-8">
              <div className="inline-block rounded-lg bg-primary/10 p-3 mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Telegram Wallet</h3>
              <p className="mt-2 text-muted-foreground">
                Create a secure wallet directly in Telegram. Trade without leaving the app.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Encrypted storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Execute trades</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold">Built with Modern Tech</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Production-ready stack for reliability and performance
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Next.js 16', desc: 'React framework' },
              { name: 'Telegram API', desc: 'Bot integration' },
              { name: 'ethers.js v6', desc: 'Blockchain' },
              { name: 'Neon DB', desc: 'PostgreSQL' },
              { name: 'Base Network', desc: 'Layer 2' },
              { name: 'Vercel', desc: 'Deployment' },
              { name: 'TypeScript', desc: 'Type safety' },
              { name: 'Tailwind CSS', desc: 'Styling' }
            ].map((tech, i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-card/50 p-4 text-center">
                <p className="font-semibold text-primary">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent p-12 text-center">
          <h2 className="text-3xl font-bold">Ready to Trade?</h2>
          <p className="mt-4 text-muted-foreground">
            Find ChonkPump on Telegram and send <code className="text-primary">/start</code> to begin trading CHONK9K tokens instantly.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/50"
          >
            Launch Bot <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="font-semibold text-primary">ChonkPump</p>
              <p className="mt-2 text-sm text-muted-foreground">Trade CHONK9K from Telegram</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Features</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Balance Check</a></li>
                <li><a href="#" className="hover:text-foreground">Leaderboard</a></li>
                <li><a href="#" className="hover:text-foreground">Portfolio</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Network</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Base Chain</a></li>
                <li><a href="#" className="hover:text-foreground">Ethereum</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Links</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground">Telegram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>ChonkPump © 2024. Built with Next.js and Telegram Bot API.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
