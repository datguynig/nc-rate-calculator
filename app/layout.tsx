import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NewComma Day Rate Calculator | Fair Freelance Pricing Tool',
  description: 'Calculate fair freelance day, hourly, and project rates for creative professionals. Get personalised pricing recommendations in under a minute.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <main className="min-h-full">{children}</main>
      </body>
    </html>
  )
}
