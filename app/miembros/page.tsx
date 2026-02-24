// app/miembros/page.tsx
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo de los miembros
const miembros = [
  {
    id: 1,
    nombre: "Beat",
    raza: "Orco",
    clase: "Guerrero",
    nivel: 60,
    rango: "General",
    profesiones: ["Minería", "Herrería"],
    equipo: 85,
    avatar: "/avatars/warrior.jpg",
    online: true,
  },
  {
    id: 2,
    nombre: "manathil",
    raza: "Elfa de la Noche",
    clase: "Druida",
    nivel: 60,
    rango: "Oficial",
    profesiones: ["Herboristería", "Alquimia"],
    equipo: 92,
    avatar: "/avatars/druid.jpg",
    online: true,
  },
  {
    id: 3,
    nombre: "Papelmache",
    raza: "Enano",
    clase: "Paladín",
    nivel: 60,
    rango: "Miembro",
    profesiones: ["Ingeniería", "Minería"],
    equipo: 78,
    avatar: "/avatars/paladin.jpg",
    online: false,
  },
  {
    id: 4,
    nombre: "warpin",
    raza: "Trol",
    clase: "Cazador",
    nivel: 58,
    rango: "Aspirante",
    profesiones: ["Desuello", "Peletería"],
    equipo: 65,
    avatar: "/avatars/hunter.jpg",
    online: true,
  },
  {
    id: 5,
    nombre: "Blackbird",
    raza: "Humano",
    clase: "Sacerdote",
    nivel: 60,
    rango: "Oficial",
    profesiones: ["Botánica", "Cocina"],
    equipo: 88,
    avatar: "/avatars/priest.jpg",
    online: false,
  },
  {
    id: 6,
    nombre: "Jerochi",
    raza: "Orco",
    clase: "Rogue",
    nivel: 60,
    rango: "Miembro",
    profesiones: ["Minería", "Herrería"],
    equipo: 81,
    avatar: "/avatars/warrior2.jpg",
    online: true,
  },
  {
    id: 7,
    nombre: "Blackargen",
    raza: "Humano",
    clase: "Warlock",
    nivel: 19,
    rango: "Miembro",
    profesiones: ["Enchant", "Tailoring"],
    equipo: 81,
    avatar: "/avatars/warrior2.jpg",
    online: true,
  },
];

export default function MiembrosPage() {
  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d]">
      {/* Header con banner estilo WoW - responsive */}
      <header className="relative h-24 sm:h-32 md:h-48 w-full border-b-4 border-[#8b6f4c] bg-gradient-to-b from-[#1a1f23] to-[#0a0c0e]">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundRepeat: 'repeat'
        }}></div>
        
        <div className="relative h-full flex items-center justify-between px-2 sm:px-4 md:px-8">
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-gradient-to-br from-[#8b6f4c] to-[#4a3a28] rounded-full border-2 border-[#c4aa7d] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-sm sm:text-base md:text-2xl drop-shadow-lg">⚔️</span>
            </div>
            <h1 className="text-base sm:text-lg md:text-3xl font-bold text-[#f0d9b5] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider font-permanent">
              MAGIOS
            </h1>
          </Link>
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <span className="bg-[#1a1f23] px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 border border-[#8b6f4c] text-[8px] sm:text-xs md:text-sm whitespace-nowrap">
              🏰 {miembros.length}/40
            </span>
            <Link 
              href="/login" 
              className="bg-[#8b6f4c] px-2 sm:px-3 md:px-6 py-0.5 sm:py-1 md:py-2 text-[8px] sm:text-xs md:text-base text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] whitespace-nowrap"
            >
              UNIRTE
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de navegación - responsive con scroll */}
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
      <main className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
        {/* Título de la página */}
        <div className="mb-4 sm:mb-6 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#f0d9b5] border-b-2 border-[#8b6f4c] pb-1 sm:pb-2 inline-block font-permanent">
            MIEMBROS
          </h2>
          <p className="text-[#8b6f4c] mt-1 sm:mt-2 text-xs sm:text-sm md:text-lg">
            Los aventureros de nuestra hermandad
          </p>
        </div>

        {/* Filtros y búsqueda - responsive */}
        <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial">
                <option>Todas las clases</option>
                <option>Guerrero</option>
                <option>Paladín</option>
                <option>Druida</option>
                <option>Cazador</option>
                <option>Sacerdote</option>
                <option>Mago</option>
                <option>Brujo</option>
                <option>Pícaro</option>
              </select>
              
              <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial">
                <option>Todos los rangos</option>
                <option>General</option>
                <option>Oficial</option>
                <option>Miembro</option>
                <option>Aspirante</option>
              </select>
              
              <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial">
                <option>Estado</option>
                <option>En línea</option>
                <option>Desconectado</option>
              </select>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Buscar miembro..."
                className="w-full sm:w-auto bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 pr-8 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5]"
              />
              <span className="absolute right-2 top-1.5 sm:top-2 text-[#8b6f4c] text-xs sm:text-sm">🔍</span>
            </div>
          </div>
        </div>

        {/* Grid de miembros - 1 columna en móvil, 2 en tablet, 3 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {miembros.map((miembro) => (
            <div 
              key={miembro.id}
              className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-3 sm:p-4 hover:border-[#f0d9b5] transition-all duration-300 group relative overflow-hidden"
            >
              {/* Efecto de fondo al hacer hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#8b6f4c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Estado online/offline */}
              <div className={`absolute top-2 right-2 w-2 sm:w-3 h-2 sm:h-3 rounded-full ${
                miembro.online ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              
              <div className="relative flex items-start space-x-2 sm:space-x-3 md:space-x-4">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#8b6f4c] to-[#4a3a28] rounded-full border-2 border-[#c4aa7d] flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl">
                    {miembro.clase === 'Guerrero' && '⚔️'}
                    {miembro.clase === 'Druida' && '🐻'}
                    {miembro.clase === 'Paladín' && '🛡️'}
                    {miembro.clase === 'Cazador' && '🏹'}
                    {miembro.clase === 'Sacerdote' && '✨'}
                    {miembro.clase === 'Rogue' && '🗡️'}
                    {miembro.clase === 'Warlock' && '👿'}
                  </div>
                </div>
                
                {/* Info del miembro */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#f0d9b5] font-permanent truncate">
                      {miembro.nombre}
                    </h3>
                    <span className="text-[8px] sm:text-xs bg-[#8b6f4c] text-[#0a0c0e] px-1 sm:px-2 py-0.5 sm:py-1 font-bold whitespace-nowrap">
                      Nv.{miembro.nivel}
                    </span>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs md:text-sm text-[#c4aa7d] mt-0.5 sm:mt-1 truncate">
                    {miembro.raza} • {miembro.clase}
                  </p>
                  
                  <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
                    <span className={`text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 whitespace-nowrap ${
                      miembro.rango === 'General' ? 'bg-purple-900 text-purple-200 border border-purple-700' :
                      miembro.rango === 'Oficial' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                      miembro.rango === 'Miembro' ? 'bg-green-900 text-green-200 border border-green-700' :
                      'bg-gray-900 text-gray-200 border border-gray-700'
                    }`}>
                      {miembro.rango}
                    </span>
                    
                    {/* Barra de equipo */}
                    <div className="flex-1 h-1 sm:h-1.5 md:h-2 bg-[#0a0c0e] border border-[#8b6f4c]">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8b6f4c] to-[#f0d9b5]"
                        style={{ width: `${miembro.equipo}%` }}
                      ></div>
                    </div>
                    <span className="text-[8px] sm:text-xs text-[#8b6f4c]">{miembro.equipo}%</span>
                  </div>
                </div>
              </div>
              
              {/* Profesiones */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#8b6f4c]">
                <p className="text-[8px] sm:text-xs text-[#8b6f4c] mb-1 sm:mb-2">PROFESIONES</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {miembro.profesiones.map((prof, index) => (
                    <span 
                      key={index}
                      className="text-[8px] sm:text-xs bg-[#0a0c0e] px-1.5 sm:px-2 py-0.5 sm:py-1 border border-[#8b6f4c] text-[#c4aa7d]"
                    >
                      {prof}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Botón de perfil */}
              <button className="absolute bottom-2 right-2 text-[8px] sm:text-xs text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors">
                Ver perfil →
              </button>
            </div>
          ))}
        </div>

        {/* Paginación - responsive */}
        <div className="mt-6 sm:mt-8 md:mt-12 flex justify-center items-center space-x-1 sm:space-x-2">
          <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base">
            ←
          </button>
          <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] bg-[#8b6f4c] text-[#0a0c0e] font-bold text-xs sm:text-sm md:text-base">
            1
          </button>
          <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base">
            2
          </button>
          <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base">
            3
          </button>
          <span className="text-[#8b6f4c] text-xs sm:text-sm">...</span>
          <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base">
            5
          </button>
          <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base">
            →
          </button>
        </div>

        {/* Estadísticas rápidas - 2 columnas en móvil, 4 en desktop */}
        <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center">
            <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">{miembros.length}</p>
            <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">Miembros</p>
          </div>
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center">
            <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
              {miembros.filter(m => m.nivel === 60).length}
            </p>
            <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">Nivel 60</p>
          </div>
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center">
            <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
              {miembros.filter(m => m.online).length}
            </p>
            <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">En línea</p>
          </div>
          <div className="bg-[#1a1f23] border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center">
            <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
              {new Set(miembros.map(m => m.clase)).size}
            </p>
            <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">Clases</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0c0e] border-t-4 border-[#8b6f4c] py-2 sm:py-3 md:py-6 mt-4 sm:mt-6 md:mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-[8px] sm:text-[10px] md:text-sm text-[#6b5a4c]">
          <p>© 2024 - Hermandad Magios</p>
          <p className="mt-0.5 sm:mt-1 md:mt-2">⚡ For the Horde! ⚔️ For the Alliance! ⚡</p>
        </div>
      </footer>
    </div>
  );
}