import { Mountain, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl">MataRaung</span>
            </div>
            <p className="text-gray-300 mb-4">
              Jelajahi keindahan Indonesia bersama MataRaung. Kami menyediakan paket trip terbaik dengan pemandu
              berpengalaman untuk petualangan tak terlupakan.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">info@mataraung.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Menu</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-green-400 transition-colors">
                Beranda
              </a>
              <a href="/blog" className="block text-gray-300 hover:text-green-400 transition-colors">
                Blog
              </a>
              <a href="/teams" className="block text-gray-300 hover:text-green-400 transition-colors">
                Tim Kami
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 MataRaung. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
