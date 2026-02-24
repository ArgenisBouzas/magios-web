// app/progreso/page.tsx
import Image from "next/image";
import Link from "next/link";

// Datos de progreso de raids (se mantienen igual)
const raids = [
  {
    id: 1,
    nombre: "Onyxia's Lair",
    imagen: "/raids/onyxia.jpg",
    jefes: 1,
    jefesDerrotados: 1,
    dificultad: "Normal",
    estado: "completado",
    color: "green",
    progreso: 100,
    ultimaDerrota: "15/01/2024",
    loot: [
      { item: "Head of Onyxia", dropRate: 100 },
      { item: "Tier 2 Helms", dropRate: 20 }
    ]
  },
  {
    id: 2,
    nombre: "Molten Core",
    imagen: "/raids/mc.jpg",
    jefes: 10,
    jefesDerrotados: 10,
    dificultad: "Normal",
    estado: "completado",
    color: "green",
    progreso: 100,
    ultimaDerrota: "12/02/2024",
    loot: [
      { item: "Legendary Items", dropRate: 0.1 },
      { item: "Tier 1 Sets", dropRate: 15 }
    ]
  },
  {
    id: 3,
    nombre: "Blackwing Lair",
    imagen: "/raids/bwl.jpg",
    jefes: 8,
    jefesDerrotados: 5,
    dificultad: "Heroico",
    estado: "en progreso",
    color: "yellow",
    progreso: 62.5,
    ultimoJefe: "Chromaggus",
    ultimaDerrota: "20/02/2024",
    loot: [
      { item: "Tier 2 Sets", dropRate: 10 },
      { item: "Weapons", dropRate: 8 }
    ]
  },
  {
    id: 4,
    nombre: "Zul'Gurub",
    imagen: "/raids/zg.jpg",
    jefes: 12,
    jefesDerrotados: 8,
    dificultad: "Normal",
    estado: "en progreso",
    color: "yellow",
    progreso: 66.7,
    ultimoJefe: "Jin'do",
    ultimaDerrota: "18/02/2024"
  },
  {
    id: 5,
    nombre: "Ruins of Ahn'Qiraj",
    imagen: "/raids/aq20.jpg",
    jefes: 6,
    jefesDerrotados: 6,
    dificultad: "Normal",
    estado: "completado",
    color: "green",
    progreso: 100,
    ultimaDerrota: "05/02/2024"
  },
  {
    id: 6,
    nombre: "Temple of Ahn'Qiraj",
    imagen: "/raids/aq40.jpg",
    jefes: 9,
    jefesDerrotados: 3,
    dificultad: "Heroico",
    estado: "en progreso",
    color: "red",
    progreso: 33.3,
    ultimoJefe: "Twin Emperors",
    ultimaDerrota: "22/02/2024"
  },
  {
    id: 7,
    nombre: "Naxxramas",
    imagen: "/raids/naxx.jpg",
    jefes: 15,
    jefesDerrotados: 0,
    dificultad: "Heroico",
    estado: "bloqueado",
    color: "red",
    progreso: 0,
    proximoIntento: "Próximamente"
  }
];

// Logros de la hermandad
const logros = [
  { nombre: "Primera muerte de Ragnaros", fecha: "10/12/2023", por: "Thraxx y la raid" },
  { nombre: "50 Onyxia kills", fecha: "15/01/2024", por: "Toda la hermandad" },
  { nombre: "MC speed run (45 min)", fecha: "20/01/2024", por: "Raid team 1" },
  { nombre: "Primer Binding drop", fecha: "25/01/2024", por: "Magnus" },
  { nombre: "Completar ZG en una noche", fecha: "01/02/2024", por: "Raid team 2" }
];

export default function ProgresoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo del Portal Oscuro (igual que en login) */}
      <div className="absolute inset-0">
        <Image
          src="/portal-oscuro.png"
          alt="Portal Oscuro"
          fill
          className="object-cover -z-10"
          priority
        />
        <Image
          src="/magios.gif"
          alt="Portal Oscuro"
          fill
          className="object-cover -z-11"
          priority
          unoptimized
        />
        {/* Overlay con degradado para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        
        {/* Partículas mágicas (efecto del portal) */}
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#00ffff] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ff00ff] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      {/* Contenido principal con z-index para estar sobre el fondo */}
      <div className="relative z-10 min-h-screen text-[#c4aa7d]">
        {/* Header con banner estilo WoW - responsive */}
        <header className="relative h-24 sm:h-32 md:h-48 w-full border-b-4 border-[#8b6f4c] bg-gradient-to-b from-[#1a1f23]/80 to-[#0a0c0e]/80 backdrop-blur-sm">
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
              <span className="bg-[#1a1f23]/80 px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 border border-[#8b6f4c] text-[8px] sm:text-xs md:text-sm whitespace-nowrap backdrop-blur-sm">
                🏆 5/7 raids
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
        <nav className="bg-[#1a1f23]/80 border-y-2 border-[#8b6f4c] py-1 sm:py-2 overflow-x-auto backdrop-blur-sm">
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
                    item.nombre === 'Progreso' ? 'text-[#f0d9b5] border-b-2 border-[#8b6f4c]' : ''
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
              PROGRESO EN RAIDS
            </h2>
            <p className="text-[#8b6f4c] mt-1 sm:mt-2 text-xs sm:text-sm md:text-lg">
              Sigue nuestro avance en las mazmorras más desafiantes de Azeroth
            </p>
          </div>

          {/* Estadísticas generales - 2 columnas en móvil, 4 en desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-6 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-3xl font-bold text-[#f0d9b5]">33/61</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] uppercase mt-0.5 sm:mt-1 md:mt-2">Jefes</p>
              <div className="w-full h-1 sm:h-1.5 md:h-2 bg-[#0a0c0e] mt-1 sm:mt-2 md:mt-3">
                <div className="h-full bg-[#f0d9b5]" style={{ width: '54%' }}></div>
              </div>
            </div>
            
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-6 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-3xl font-bold text-[#f0d9b5]">5/7</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] uppercase mt-0.5 sm:mt-1 md:mt-2">Raids</p>
              <p className="text-[8px] sm:text-[10px] md:text-sm text-green-500 mt-0.5 sm:mt-1 md:mt-2">✓ 2 prog</p>
            </div>
            
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-6 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-3xl font-bold text-[#f0d9b5]">45</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] uppercase mt-0.5 sm:mt-1 md:mt-2">Intentos</p>
              <p className="text-[8px] sm:text-[10px] md:text-sm text-[#c4aa7d] mt-0.5 sm:mt-1 md:mt-2">73% éxito</p>
            </div>
            
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-6 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-3xl font-bold text-[#f0d9b5]">8</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] uppercase mt-0.5 sm:mt-1 md:mt-2">Legendarios</p>
              <p className="text-[8px] sm:text-[10px] md:text-sm text-yellow-500 mt-0.5 sm:mt-1 md:mt-2">⚡ 2 TF</p>
            </div>
          </div>

          {/* Filtros de raids - responsive */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-4 mb-4 sm:mb-6 md:mb-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select className="bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial backdrop-blur-sm">
                  <option>Todas</option>
                  <option>Clásicas</option>
                  <option>Heroicas</option>
                </select>
                
                <select className="bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial backdrop-blur-sm">
                  <option>Estado</option>
                  <option>Completado</option>
                  <option>En progreso</option>
                  <option>Bloqueado</option>
                </select>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="bg-[#8b6f4c] text-[#0a0c0e] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm font-bold hover:bg-[#c4aa7d] transition-colors flex-1 sm:flex-initial">
                  CRONOGRAMA
                </button>
                <button className="border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm hover:bg-[#2a2f33] transition-colors flex-1 sm:flex-initial backdrop-blur-sm">
                  ESTADÍSTICAS
                </button>
              </div>
            </div>
          </div>

          {/* Grid de raids - 1 columna en móvil, 2 en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {raids.map((raid) => (
              <div 
                key={raid.id}
                className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] overflow-hidden hover:border-[#f0d9b5] transition-all duration-300 group backdrop-blur-sm"
              >
                {/* Cabecera de la raid */}
                <div className="relative h-20 sm:h-24 md:h-32 bg-gradient-to-r from-[#2a2f33]/80 to-[#1a1f23]/80 border-b-2 border-[#8b6f4c] p-2 sm:p-3 md:p-4">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0z'/%3E%3C/g%3E%3C/svg%3E')"
                  }}></div>
                  
                  <div className="relative flex items-start justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base md:text-2xl font-bold text-[#f0d9b5] group-hover:text-[#c4aa7d] transition-colors">
                        {raid.nombre}
                      </h3>
                      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 mt-0.5 sm:mt-1 md:mt-2">
                        <span className={`text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 ${
                          raid.estado === 'completado' ? 'bg-green-900/80 text-green-200 border border-green-700' :
                          raid.estado === 'en progreso' ? 'bg-yellow-900/80 text-yellow-200 border border-yellow-700' :
                          'bg-red-900/80 text-red-200 border border-red-700'
                        }`}>
                          {raid.estado === 'completado' ? '✓' :
                           raid.estado === 'en progreso' ? '⚔️' : '🔒'}
                        </span>
                        <span className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c]">
                          {raid.jefesDerrotados}/{raid.jefes}
                        </span>
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl md:text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                      {raid.nombre.includes('Onyxia') && '🐉'}
                      {raid.nombre.includes('Molten') && '🔥'}
                      {raid.nombre.includes('Blackwing') && '🐲'}
                      {raid.nombre.includes('Zul') && '🦎'}
                      {raid.nombre.includes('Ahn') && '🐜'}
                      {raid.nombre.includes('Naxx') && '💀'}
                    </span>
                  </div>
                </div>
                
                {/* Contenido de la raid */}
                <div className="p-2 sm:p-3 md:p-4">
                  {/* Barra de progreso */}
                  <div className="mb-2 sm:mb-3 md:mb-4">
                    <div className="flex justify-between text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                      <span className="text-[#8b6f4c]">Progreso</span>
                      <span className="text-[#f0d9b5] font-bold">{raid.progreso}%</span>
                    </div>
                    <div className="w-full h-2 sm:h-3 md:h-4 bg-[#0a0c0e]/80 border border-[#8b6f4c] overflow-hidden">
                      <div 
                        className={`h-full ${
                          raid.estado === 'completado' ? 'bg-green-600' :
                          raid.estado === 'en progreso' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${raid.progreso}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Detalles de la raid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4">
                    <div>
                      <p className="text-[#8b6f4c] text-[8px] sm:text-[10px] md:text-xs">Último jefe</p>
                      <p className="text-[#f0d9b5] text-[10px] sm:text-xs md:text-sm truncate">{raid.ultimoJefe || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[#8b6f4c] text-[8px] sm:text-[10px] md:text-xs">Última derrota</p>
                      <p className="text-[#f0d9b5] text-[10px] sm:text-xs md:text-sm">{raid.ultimaDerrota || 'Pendiente'}</p>
                    </div>
                  </div>
                  
                  {/* Lista de jefes */}
                  <div className="mb-2 sm:mb-3 md:mb-4">
                    <p className="text-[#8b6f4c] text-[8px] sm:text-[10px] md:text-xs mb-1 sm:mb-1.5 md:mb-2">JEFES</p>
                    <div className="flex flex-wrap gap-0.5 sm:gap-1">
                      {Array.from({ length: raid.jefesDerrotados }).map((_, i) => (
                        <span key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-900/80 border border-green-700 flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs text-green-300">
                          ✓
                        </span>
                      ))}
                      {Array.from({ length: raid.jefes - raid.jefesDerrotados }).map((_, i) => (
                        <span key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#0a0c0e]/80 border border-[#8b6f4c] flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs text-[#4a3a28]">
                          ?
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Loot destacado */}
                  {raid.loot && (
                    <div className="border-t border-[#8b6f4c] pt-2 sm:pt-2.5 md:pt-3">
                      <p className="text-[#8b6f4c] text-[8px] sm:text-[10px] md:text-xs mb-1 sm:mb-1.5 md:mb-2">LOOT</p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 md:gap-3">
                        {raid.loot.map((item, index) => (
                          <div key={index} className="text-[8px] sm:text-[10px] md:text-xs">
                            <span className="text-[#f0d9b5]">{item.item}</span>
                            <span className="text-[#8b6f4c] ml-0.5 sm:ml-1">({item.dropRate}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Logros de la hermandad */}
          <section className="mt-8 sm:mt-12 md:mt-16">
            <h3 className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5] border-b-2 border-[#8b6f4c] pb-1 sm:pb-2 inline-block mb-3 sm:mb-4 md:mb-6">
              🏆 LOGROS
            </h3>
            
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] overflow-hidden backdrop-blur-sm">
              {logros.map((logro, index) => (
                <div 
                  key={index}
                  className={`p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 ${
                    index !== logros.length - 1 ? 'border-b border-[#8b6f4c]' : ''
                  } hover:bg-[#2a2f33] transition-colors`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    <span className="text-base sm:text-lg md:text-2xl text-yellow-500">🏆</span>
                    <div>
                      <p className="text-xs sm:text-sm md:text-base text-[#f0d9b5] font-bold">{logro.nombre}</p>
                      <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c]">Por: {logro.por}</p>
                    </div>
                  </div>
                  <span className="text-[8px] sm:text-[10px] md:text-sm text-[#8b6f4c] sm:text-right ml-6 sm:ml-0">{logro.fecha}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Próximos objetivos */}
          <section className="mt-6 sm:mt-8 md:mt-12">
            <div className="bg-gradient-to-r from-[#1a1f23]/80 to-[#0a0c0e]/80 border-2 border-[#8b6f4c] p-3 sm:p-4 md:p-6 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#f0d9b5] mb-2 sm:mb-3 md:mb-4 flex items-center">
                <span className="text-lg sm:text-xl md:text-2xl mr-1 sm:mr-2">🎯</span>
                OBJETIVOS
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="bg-[#0a0c0e]/80 p-2 sm:p-3 md:p-4 border border-[#8b6f4c] backdrop-blur-sm">
                  <p className="text-xs sm:text-sm md:text-base text-[#f0d9b5] font-bold">Chromaggus</p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] mt-0.5 sm:mt-1">BWL - 80%</p>
                  <div className="w-full h-1 sm:h-1.5 md:h-2 bg-[#1a1f23] mt-1 sm:mt-1.5 md:mt-2">
                    <div className="h-full bg-yellow-600" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div className="bg-[#0a0c0e]/80 p-2 sm:p-3 md:p-4 border border-[#8b6f4c] backdrop-blur-sm">
                  <p className="text-xs sm:text-sm md:text-base text-[#f0d9b5] font-bold">Twin Emperors</p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] mt-0.5 sm:mt-1">AQ40 - 45%</p>
                  <div className="w-full h-1 sm:h-1.5 md:h-2 bg-[#1a1f23] mt-1 sm:mt-1.5 md:mt-2">
                    <div className="h-full bg-yellow-600" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="bg-[#0a0c0e]/80 p-2 sm:p-3 md:p-4 border border-[#8b6f4c] sm:col-span-2 md:col-span-1 backdrop-blur-sm">
                  <p className="text-xs sm:text-sm md:text-base text-[#f0d9b5] font-bold">Naxxramas</p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-[#8b6f4c] mt-0.5 sm:mt-1">En 2 semanas</p>
                  <div className="w-full h-1 sm:h-1.5 md:h-2 bg-[#1a1f23] mt-1 sm:mt-1.5 md:mt-2">
                    <div className="h-full bg-red-600" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#0a0c0e]/80 border-t-4 border-[#8b6f4c] py-2 sm:py-3 md:py-6 mt-4 sm:mt-6 md:mt-12 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 text-center text-[8px] sm:text-[10px] md:text-sm text-[#6b5a4c]">
            <p>© 2024 - Hermandad Magios</p>
            <p className="mt-0.5 sm:mt-1 md:mt-2">⚡ For the Horde! ⚔️ For the Alliance! ⚡</p>
          </div>
        </footer>
      </div>

      {/* Efectos de borde del portal */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}