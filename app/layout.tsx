// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { GroundReturn } from '../components/GroundReturn'


export const metadata: Metadata = {
  title: 'My Social',
  description: 'A social app',
  // add other fields as needed like openGraph, robots, icons...
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100">
        {children}
        <GroundReturn />
      </body>
    </html>
  )
}


function Header() {
  return (
    <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <a href="/">Home</a> | <a href="/create">Create</a>
      <span style={{ float: "right" }}>
        <a href="/auth">Auth</a>
      </span>
    </header>
  );
}
