import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Kingdom — Sovereign', description: 'Build your dominion.' }
export default function KingdomLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
