import { Metadata } from 'next'
export const metadata: Metadata = { title: 'Dashboard — Sovereign', description: 'Your domain awaits.' }
export default function DashboardLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
