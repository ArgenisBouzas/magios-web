// app/progreso/page.tsx
import Image from "next/image";
import Link from "next/link";

// Datos de progreso de raids
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
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d]">
      {/* Header con banner estilo WoW */}
      <header className="relative h-48 w-full border-b-4 border-[#8b6f4c] bg-gradient-to-b from-[#1a1f23] to-[#0a0c0e]">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundRepeat: 'repeat'
        }}></div>
        
        <div className="relative h-full flex items-center justify-between px-8">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8b6f4c] to-[#4a3a28] rounded-full border-2 border-[#c4aa7d] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl drop-shadow-lg">⚔️</span>
            </div>
            <h1 className="text-3xl font-bold text-[#f0d9b5] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
              HERMANDAD
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="bg-[#1a1f23] px-4 py-2 border border-[#8b6f4c] text-sm">
              🏆 Progreso: 5/7 raids
            </span>
            <Link 
              href="/login" 
              className="bg-[#8b6f4c] px-6 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5]"
            >
              UNIRTE
            </Link>
          </div>
        </div>
      </header>

      {/* Barra de navegación */}
      <nav className="bg-[#1a1f23] border-y-2 border-[#8b6f4c] py-2">
        <ul className="flex justify-center space-x-8 text-[#c4aa7d]">
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
                className={`px-4 py-2 hover:text-[#f0d9b5] hover:bg-[#2a2f33] transition-all duration-300 border-b-2 border-transparent hover:border-[#8b6f4c] uppercase tracking-wider text-sm font-semibold ${
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
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Título de la página */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-[#f0d9b5] border-b-2 border-[#8b6f4c] pb-2 inline-block font-permanent">
            PROGRESO EN RAIDS
          </h2>
          <p className="text-[#8b6f4c] mt-2 text-lg">
            Sigue nuestro avance en las mazmorras más desafiantes de Azeroth
          </p>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-6 text-center">
            <p className="text-3xl font-bold text-[#f0d9b5]">33/61</p>
            <p className="text-xs text-[#8b6f4c] uppercase mt-2">Jefes derrotados</p>
            <div className="w-full h-2 bg-[#0a0c0e] mt-3">
              <div className="h-full bg-[#f0d9b5]" style={{ width: '54%' }}></div>
            </div>
          </div>
          
          <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-6 text-center">
            <p className="text-3xl font-bold text-[#f0d9b5]">5/7</p>
            <p className="text-xs text-[#8b6f4c] uppercase mt-2">Raids completadas</p>
            <p className="text-sm text-green-500 mt-2">✓ 2 en progreso</p>
          </div>
          
          <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-6 text-center">
            <p className="text-3xl font-bold text-[#f0d9b5]">45</p>
            <p className="text-xs text-[#8b6f4c] uppercase mt-2">Intentos totales</p>
            <p className="text-sm text-[#c4aa7d] mt-2">Tasa de éxito: 73%</p>
          </div>
          
          <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-6 text-center">
            <p className="text-3xl font-bold text-[#f0d9b5]">8</p>
            <p className="text-xs text-[#8b6f4c] uppercase mt-2">Legendarios obtenidos</p>
            <p className="text-sm text-yellow-500 mt-2">⚡ 2 Thunderfury</p>
          </div>
        </div>

        {/* Filtros de raids */}
        <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-wrap">
            <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-4 py-2 focus:outline-none focus:border-[#f0d9b5]">
              <option>Todas las raids</option>
              <option>Clásicas</option>
              <option>Heroicas</option>
            </select>
            
            <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-4 py-2 focus:outline-none focus:border-[#f0d9b5]">
              <option>Todos los estados</option>
              <option>Completado</option>
              <option>En progreso</option>
              <option>Bloqueado</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-[#8b6f4c] text-[#0a0c0e] px-4 py-2 text-sm font-bold hover:bg-[#c4aa7d] transition-colors">
              VER CRONOGRAMA
            </button>
            <button className="border border-[#8b6f4c] text-[#c4aa7d] px-4 py-2 text-sm hover:bg-[#2a2f33] transition-colors">
              ESTADÍSTICAS
            </button>
          </div>
        </div>

        {/* Grid de raids */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {raids.map((raid) => (
            <div 
              key={raid.id}
              className="bg-[#1a1f23] border-2 border-[#8b6f4c] overflow-hidden hover:border-[#f0d9b5] transition-all duration-300 group"
            >
              {/* Cabecera de la raid */}
              <div className="relative h-32 bg-gradient-to-r from-[#2a2f33] to-[#1a1f23] border-b-2 border-[#8b6f4c] p-4">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0z'/%3E%3C/g%3E%3C/svg%3E')"
                }}></div>
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#f0d9b5] group-hover:text-[#c4aa7d] transition-colors">
                      {raid.nombre}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`text-xs px-2 py-1 ${
                        raid.estado === 'completado' ? 'bg-green-900 text-green-200 border border-green-700' :
                        raid.estado === 'en progreso' ? 'bg-yellow-900 text-yellow-200 border border-yellow-700' :
                        'bg-red-900 text-red-200 border border-red-700'
                      }`}>
                        {raid.estado === 'completado' ? '✓ COMPLETADO' :
                         raid.estado === 'en progreso' ? '⚔️ EN PROGRESO' : '🔒 BLOQUEADO'}
                      </span>
                      <span className="text-xs text-[#8b6f4c]">
                        {raid.jefesDerrotados}/{raid.jefes} jefes
                      </span>
                    </div>
                  </div>
                  <span className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
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
              <div className="p-4">
                {/* Barra de progreso */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8b6f4c]">Progreso</span>
                    <span className="text-[#f0d9b5] font-bold">{raid.progreso}%</span>
                  </div>
                  <div className="w-full h-4 bg-[#0a0c0e] border border-[#8b6f4c] overflow-hidden">
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
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-[#8b6f4c] text-xs">Último jefe</p>
                    <p className="text-[#f0d9b5]">{raid.ultimoJefe || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[#8b6f4c] text-xs">Última derrota</p>
                    <p className="text-[#f0d9b5]">{raid.ultimaDerrota || 'Pendiente'}</p>
                  </div>
                </div>
                
                {/* Lista de jefes (simplificada) */}
                <div className="mb-4">
                  <p className="text-[#8b6f4c] text-xs mb-2">JEFES DERROTADOS</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: raid.jefesDerrotados }).map((_, i) => (
                      <span key={i} className="w-6 h-6 bg-green-900 border border-green-700 flex items-center justify-center text-xs text-green-300">
                        ✓
                      </span>
                    ))}
                    {Array.from({ length: raid.jefes - raid.jefesDerrotados }).map((_, i) => (
                      <span key={i} className="w-6 h-6 bg-[#0a0c0e] border border-[#8b6f4c] flex items-center justify-center text-xs text-[#4a3a28]">
                        ?
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Loot destacado */}
                {raid.loot && (
                  <div className="border-t border-[#8b6f4c] pt-3">
                    <p className="text-[#8b6f4c] text-xs mb-2">LOOT DESTACADO</p>
                    <div className="flex gap-3">
                      {raid.loot.map((item, index) => (
                        <div key={index} className="text-xs">
                          <span className="text-[#f0d9b5]">{item.item}</span>
                          <span className="text-[#8b6f4c] ml-1">({item.dropRate}%)</span>
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
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-[#f0d9b5] border-b-2 border-[#8b6f4c] pb-2 inline-block mb-6">
            🏆 LOGROS DE LA HERMANDAD
          </h3>
          
          <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] overflow-hidden">
            {logros.map((logro, index) => (
              <div 
                key={index}
                className={`p-4 flex items-center justify-between ${
                  index !== logros.length - 1 ? 'border-b border-[#8b6f4c]' : ''
                } hover:bg-[#2a2f33] transition-colors`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl text-yellow-500">🏆</span>
                  <div>
                    <p className="text-[#f0d9b5] font-bold">{logro.nombre}</p>
                    <p className="text-xs text-[#8b6f4c]">Por: {logro.por}</p>
                  </div>
                </div>
                <span className="text-sm text-[#8b6f4c]">{logro.fecha}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Próximos objetivos */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-[#1a1f23] to-[#0a0c0e] border-2 border-[#8b6f4c] p-6">
            <h3 className="text-xl font-bold text-[#f0d9b5] mb-4 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              PRÓXIMOS OBJETIVOS
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#0a0c0e] p-4 border border-[#8b6f4c]">
                <p className="text-[#f0d9b5] font-bold">Chromaggus</p>
                <p className="text-xs text-[#8b6f4c] mt-1">BWL - 80% de probabilidad</p>
                <div className="w-full h-2 bg-[#1a1f23] mt-2">
                  <div className="h-full bg-yellow-600" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="bg-[#0a0c0e] p-4 border border-[#8b6f4c]">
                <p className="text-[#f0d9b5] font-bold">Twin Emperors</p>
                <p className="text-xs text-[#8b6f4c] mt-1">AQ40 - 45% de probabilidad</p>
                <div className="w-full h-2 bg-[#1a1f23] mt-2">
                  <div className="h-full bg-yellow-600" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div className="bg-[#0a0c0e] p-4 border border-[#8b6f4c]">
                <p className="text-[#f0d9b5] font-bold">Naxxramas</p>
                <p className="text-xs text-[#8b6f4c] mt-1">Primer intento en 2 semanas</p>
                <div className="w-full h-2 bg-[#1a1f23] mt-2">
                  <div className="h-full bg-red-600" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0c0e] border-t-4 border-[#8b6f4c] py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[#6b5a4c]">
          <p>© 2024 - Hermandad de World of Warcraft Classic</p>
          <p className="mt-2">For the Horde! ⚔️ For the Alliance!</p>
        </div>
      </footer>
    </div>
  );
}