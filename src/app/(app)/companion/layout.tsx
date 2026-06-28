import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Companion — Sovereign', description: 'Consult the oracle.' }
export default function CompanionLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
