import type { Metadata } from 'next'
import { inter } from '@/config/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s - We | Store',
    default: 'Home - We | Store'
  },
  description: 'Tu Marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
