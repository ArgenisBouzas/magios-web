import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d]">
      {/* Header con banner estilo WoW - ajustado para móvil */}
      <header className="relative h-48 sm:h-64 w-full border-b-4 border-[#8b6f4c]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f23] to-[#0a0c0e]">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        {/* Logo y título - tamaños reducidos en móvil */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-[#8b6f4c] to-[#4a3a28] rounded-full border-4 border-[#c4aa7d] flex items-center justify-center mb-2 sm:mb-4">
            <span className="text-3xl sm:text-5xl drop-shadow-lg">⚔️</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#f0d9b5] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider text-center">
            MAGIOS GUILD
          </h1>
          <p className="text-sm sm:text-xl text-[#8b6f4c] mt-1 sm:mt-2 text-center px-2">
            • World of Warcraft Classic •
          </p>
        </div>
      </header>

      {/* Barra de navegación estilo WoW - responsive con scroll horizontal en móvil */}
 <nav className="bg-[#1a1f23] border-y-2 border-[#8b6f4c] py-1 sm:py-2 overflow-x-auto">
        <ul className="flex justify-start sm:justify-center space-x-2 sm:space-x-4 md:space-x-8 text-[#c4aa7d] px-2 min-w-max sm:min-w-0">
          {[
            { nombre: 'Inicio', ruta: '/' },
            { nombre: 'Miembros', ruta: '/miembros' },
            { nombre: 'Progreso', ruta: '/progreso' },
            { nombre: 'Noticias', ruta: '/noticias' },
            { nombre: 'Unirte', ruta: '/login' }
          ].map((item) => (
            <li key={item.nombre}>
              <Link 
                href={item.ruta}
                className={`px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 hover:text-[#f0d9b5] hover:bg-[#2a2f33] transition-all duration-300 border-b-2 border-transparent hover:border-[#8b6f4c] uppercase tracking-wider text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap ${
                  item.nombre === 'Miembros' ? 'text-[#f0d9b5] border-b-2 border-[#8b6f4c]' : ''
                }`}
              >
                {item.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>


      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Sección de bienvenida estilo pergamino */}
        <section className="relative bg-[#1a1f23] border-2 border-[#8b6f4c] p-4 sm:p-8 mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] opacity-10"></div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0d9b5] mb-4 sm:mb-6 border-b-2 border-[#8b6f4c] pb-2 inline-block">
              Bienvenido, aventurero
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Únete a nuestra hermandad en la búsqueda de la gloria en Azeroth. 
              Forjamos alianzas, conquistamos mazmorras y escribimos nuestras 
              propias leyendas en World of Warcraft Classic.
            </p>
            
            {/* Stats en columna en móvil, fila en desktop */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
              <span className="bg-[#2a2f33] px-3 sm:px-4 py-1.5 sm:py-2 border border-[#8b6f4c] text-xs sm:text-sm text-center">
                🏰 Miembros: 25/40
              </span>
              <span className="bg-[#2a2f33] px-3 sm:px-4 py-1.5 sm:py-2 border border-[#8b6f4c] text-xs sm:text-sm text-center">
                ⚔️ Nivel: 60
              </span>
              <span className="bg-[#2a2f33] px-3 sm:px-4 py-1.5 sm:py-2 border border-[#8b6f4c] text-xs sm:text-sm text-center">
                🐉 Facción: Horda/Alianza
              </span>
            </div>
          </div>
        </section>

        {/* Grid de información - 1 columna en móvil, 3 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Progreso en raids */}
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#f0d9b5] mb-3 sm:mb-4">🏆 Progreso</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex justify-between">
                <span>Onyxia</span>
                <span className="text-green-500">✓ Derrotado</span>
              </li>
              <li className="flex justify-between">
                <span>MC</span>
                <span className="text-green-500">✓ 10/10</span>
              </li>
              <li className="flex justify-between">
                <span>BWL</span>
                <span className="text-yellow-500">⏳ 5/8</span>
              </li>
            </ul>
          </div>

          {/* Próximos eventos */}
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#f0d9b5] mb-3 sm:mb-4">📅 Eventos</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-[#8b6f4c] text-xs sm:text-sm">Viernes 20:00</span>
                <p className="text-xs sm:text-sm">Blackwing Lair - Farm</p>
              </li>
              <li>
                <span className="text-[#8b6f4c] text-xs sm:text-sm">Sábado 21:00</span>
                <p className="text-xs sm:text-sm">Molten Core - Run</p>
              </li>
            </ul>
          </div>

          {/* Últimas noticias */}
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#f0d9b5] mb-3 sm:mb-4">📰 Noticias</h3>
            <div className="space-y-3">
              <p className="text-xs sm:text-sm">
                <span className="text-[#8b6f4c]">Hace 2 días:</span> Nuevo recluta - ¡Bienvenido Thraxx!
              </p>
              <p className="text-xs sm:text-sm">
                <span className="text-[#8b6f4c]">Hace 5 días:</span> ¡Ragnaros ha caído de nuevo!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer estilo WoW */}
      <footer className="bg-[#0a0c0e] border-t-4 border-[#8b6f4c] py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs sm:text-sm text-[#6b5a4c]">
          <p>© 2024 - Hermandad de World of Warcraft Classic</p>
          <p className="mt-1 sm:mt-2">⚡ For the Horde! ⚔️ For the Alliance! ⚡</p>
        </div>
      </footer>
    </div>
  );
}