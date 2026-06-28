import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Character — Sovereign', description: 'Your stats and abilities.' }
export default function CharacterLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
