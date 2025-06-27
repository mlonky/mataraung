import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MataRaung - Trip Company",
  description: "Jelajahi keindahan Indonesia bersama MataRaung",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
