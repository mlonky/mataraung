
"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Mountain } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-green-600" />
              <span className="font-bold text-xl text-gray-900">MataRaung</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Beranda
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-green-600 transition-colors">
              Blog
            </Link>
            <Link href="/teams" className="text-gray-700 hover:text-green-600 transition-colors">
              Tim Kami
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/teams"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
                onClick={() => setIsOpen(false)}
              >
                Tim Kami
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
