import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'
import NavBar from '@/components/common/navbar'
import {DealsStoreProvider, StoreInitializer} from '@/store/provider'
import {ReactNode} from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Deals Monitor',
  description: 'Automated deal finder & stock tracker',
}

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DealsStoreProvider>
          <StoreInitializer />
          <NavBar />
          {/* The main content of the page */}
          {children}
        </DealsStoreProvider>
      </body>
    </html>
  )
}
