// app/noticias/page.tsx
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo de noticias (se mantienen igual)
const noticias = [
  {
    id: 1,
    titulo: "¡Ragnaros ha caído de nuevo!",
    fecha: "25/02/2024",
    autor: "Thraxx",
    categoria: "Raid",
    imagen: "/noticias/ragnaros.jpg",
    resumen: "Nuestra raid team ha derrotado a Ragnaros por décima vez esta temporada. Gran trabajo de todos los participantes.",
    contenido: "Después de una intensa batalla en el corazón de Molten Core, nuestra hermandad ha logrado derrotar al Señor del Fuego una vez más. La coordinación y el esfuerzo de todos los miembros fueron clave para esta victoria. Mención especial a nuestros tanks por aguantar los golpes del elemental y a los healers por mantenernos con vida. ¡Seguimos sumando experiencia y loot para futuros desafíos!",
    comentarios: 12,
    reacciones: 45,
    destacada: true
  },
  {
    id: 2,
    titulo: "Nuevo recluta: ¡Bienvenido Magni!",
    fecha: "23/02/2024",
    autor: "Elyndra",
    categoria: "Miembros",
    imagen: "/noticias/recluta.jpg",
    resumen: "Un nuevo guerrero enano se une a nuestras filas. ¡Démosle la bienvenida!",
    contenido: "Nos complace anunciar la incorporación de Magni, un experimentado guerrero enano que viene a reforzar nuestras líneas del frente. Con experiencia previa en varias hermandades y un equipo decente, estamos seguros de que será un gran aporte para nuestros raids. ¡Bienvenido a la familia, Magni!",
    comentarios: 8,
    reacciones: 32,
    destacada: false
  },
  {
    id: 3,
    titulo: "Cambios en el horario de raids",
    fecha: "20/02/2024",
    autor: "Morrigan",
    categoria: "Anuncio",
    imagen: "/noticias/horario.jpg",
    resumen: "Ajustamos los horarios para adaptarnos mejor a la disponibilidad de todos.",
    contenido: "Después de recoger vuestras opiniones, hemos decidido ajustar los horarios de los raids. A partir de la próxima semana, los raids de Molten Core serán los martes y jueves a las 21:00, mientras que Blackwing Lair se mantendrá los sábados a las 20:00. Por favor, confirmad vuestra disponibilidad en el canal de Discord.",
    comentarios: 15,
    reacciones: 28,
    destacada: true
  },
  {
    id: 4,
    titulo: "Primer Binding de Thunderfury",
    fecha: "18/02/2024",
    autor: "Grommash",
    categoria: "Logro",
    imagen: "/noticias/thunderfury.jpg",
    resumen: "¡Conseguimos nuestro primer Binding! El camino hacia Thunderfury comienza.",
    contenido: "Esta semana tuvimos una gran sorpresa en Molten Core: ¡dropó el Binding izquierdo de Thunderfury! Ha sido asignado a nuestro querido tank principal, Thraxx, quien ya está recolectando los materiales para forjar esta legendaria arma. ¡Enhorabuena y a seguir farmeando el otro Binding!",
    comentarios: 24,
    reacciones: 67,
    destacada: true
  },
  {
    id: 5,
    titulo: "Guía de Zul'Gurub para principiantes",
    fecha: "15/02/2024",
    autor: "Magnus",
    categoria: "Guía",
    imagen: "/noticias/zg-guide.jpg",
    resumen: "Compartimos una guía completa para nuevos miembros que quieran unirse a ZG.",
    contenido: "Hemos preparado una guía detallada de Zul'Gurub para aquellos que aún no han tenido oportunidad de visitar esta raid. Incluye estrategias para cada jefe, asignación de roles y consejos para evitar las mecánicas más peligrosas. La encontraréis en el canal de recursos de Discord. ¡Estudiadla antes de nuestro próximo raid!",
    comentarios: 7,
    reacciones: 19,
    destacada: false
  },
  {
    id: 6,
    titulo: "Celebración del aniversario de la hermandad",
    fecha: "10/02/2024",
    autor: "Zul'jin",
    categoria: "Evento",
    imagen: "/noticias/aniversario.jpg",
    resumen: "¡Hace un año que fundamos esta hermandad! Lo celebraremos con eventos especiales.",
    contenido: "El próximo sábado celebramos nuestro primer aniversario como hermandad. Tendremos eventos especiales toda la tarde: carreras de monturas en Barrens, duelos amistosos en Gurubashi, y por supuesto, un raid de MC con sorteo de loot entre todos los asistentes. ¡No faltéis!",
    comentarios: 31,
    reacciones: 89,
    destacada: true
  }
];

// Categorías para filtros
const categorias = [
  "Todas",
  "Raid",
  "Miembros",
  "Anuncio",
  "Logro",
  "Guía",
  "Evento"
];

export default function NoticiasPage() {
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
                📰 Hoy
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
                    item.nombre === 'Noticias' ? 'text-[#f0d9b5] border-b-2 border-[#8b6f4c]' : ''
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
              NOTICIAS
            </h2>
            <p className="text-[#8b6f4c] mt-1 sm:mt-2 text-xs sm:text-sm md:text-lg">
              Últimas novedades de la hermandad
            </p>
          </div>

          {/* Filtros y búsqueda - responsive */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-4 mb-4 sm:mb-6 md:mb-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select className="bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial backdrop-blur-sm">
                  {categorias.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
                
                <select className="bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial backdrop-blur-sm">
                  <option>Recientes</option>
                  <option>Antiguos</option>
                  <option>Comentados</option>
                </select>
              </div>
              
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Buscar..."
                  className="w-full sm:w-auto bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 pr-8 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] backdrop-blur-sm"
                />
                <span className="absolute right-2 top-1.5 sm:top-2 text-[#8b6f4c] text-xs sm:text-sm">🔍</span>
              </div>
            </div>
          </div>

          {/* Noticia destacada - responsive */}
          {noticias.filter(n => n.destacada)[0] && (
            <div className="mb-6 sm:mb-8 md:mb-12 relative">
              <div className="absolute -top-2 sm:-top-3 left-2 sm:left-4 bg-[#8b6f4c] text-[#0a0c0e] px-2 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-sm font-bold uppercase tracking-wider border-2 border-[#f0d9b5] z-10">
                ⭐ DESTACADA
              </div>
              <div className="bg-gradient-to-r from-[#1a1f23]/80 to-[#2a2f33]/80 border-2 border-[#8b6f4c] p-3 sm:p-4 md:p-6 pt-4 sm:pt-6 md:pt-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-video bg-[#0a0c0e]/80 border-2 border-[#8b6f4c] flex items-center justify-center backdrop-blur-sm">
                      <span className="text-3xl sm:text-4xl md:text-6xl opacity-30">📰</span>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3">
                      <span className="bg-[#8b6f4c] text-[#0a0c0e] text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 font-bold">
                        {noticias.filter(n => n.destacada)[0].categoria}
                      </span>
                      <span className="text-[8px] sm:text-xs text-[#8b6f4c]">
                        {noticias.filter(n => n.destacada)[0].fecha}
                      </span>
                      <span className="text-[8px] sm:text-xs text-[#8b6f4c]">
                        Por: {noticias.filter(n => n.destacada)[0].autor}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-2xl font-bold text-[#f0d9b5] mb-2 sm:mb-3">
                      {noticias.filter(n => n.destacada)[0].titulo}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-[#c4aa7d] mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                      {noticias.filter(n => n.destacada)[0].contenido}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-sm">
                      <span className="text-[#8b6f4c]">💬 {noticias.filter(n => n.destacada)[0].comentarios}</span>
                      <span className="text-[#8b6f4c]">❤️ {noticias.filter(n => n.destacada)[0].reacciones}</span>
                      <button className="text-[#f0d9b5] hover:underline ml-auto text-xs sm:text-sm">
                        Leer más →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid de noticias - 1 columna en móvil, 2 en tablet, 3 en desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            {noticias.map((noticia) => (
              <div 
                key={noticia.id}
                className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] overflow-hidden hover:border-[#f0d9b5] transition-all duration-300 group backdrop-blur-sm"
              >
                {/* Imagen de la noticia */}
                <div className="relative h-28 sm:h-32 md:h-40 bg-gradient-to-br from-[#2a2f33]/80 to-[#1a1f23]/80 border-b-2 border-[#8b6f4c]">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0z'/%3E%3C/g%3E%3C/svg%3E')"
                  }}></div>
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#8b6f4c] text-[#0a0c0e] text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 font-bold z-10">
                    {noticia.categoria}
                  </div>
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-[8px] sm:text-xs text-[#8b6f4c] z-10">
                    {noticia.fecha}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl md:text-5xl opacity-30 group-hover:opacity-50 transition-opacity">
                      {noticia.categoria === 'Raid' && '⚔️'}
                      {noticia.categoria === 'Miembros' && '👥'}
                      {noticia.categoria === 'Anuncio' && '📢'}
                      {noticia.categoria === 'Logro' && '🏆'}
                      {noticia.categoria === 'Guía' && '📚'}
                      {noticia.categoria === 'Evento' && '🎉'}
                    </span>
                  </div>
                </div>
                
                {/* Contenido de la noticia */}
                <div className="p-2 sm:p-3 md:p-4">
                  <h3 className="text-xs sm:text-sm md:text-lg font-bold text-[#f0d9b5] mb-1 sm:mb-2 line-clamp-2 group-hover:text-[#c4aa7d] transition-colors">
                    {noticia.titulo}
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-[#c4aa7d] mb-2 sm:mb-3 line-clamp-2">
                    {noticia.resumen}
                  </p>
                  
                  {/* Autor y estadísticas */}
                  <div className="flex items-center justify-between text-[8px] sm:text-xs border-t border-[#8b6f4c] pt-2 sm:pt-3 mt-1 sm:mt-2">
                    <span className="text-[#8b6f4c] truncate max-w-[60px] sm:max-w-none">
                      {noticia.autor}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-3">
                      <span className="text-[#8b6f4c]" title="Comentarios">
                        💬 {noticia.comentarios}
                      </span>
                      <span className="text-[#8b6f4c]" title="Reacciones">
                        ❤️ {noticia.reacciones}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botón leer más */}
                  <button className="w-full mt-2 sm:mt-3 text-left text-[10px] sm:text-xs md:text-sm text-[#f0d9b5] hover:text-[#c4aa7d] transition-colors">
                    Leer más →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación - responsive */}
          <div className="flex justify-center items-center space-x-1 sm:space-x-2">
            <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm">
              ←
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] bg-[#8b6f4c] text-[#0a0c0e] font-bold text-xs sm:text-sm md:text-base">
              1
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm">
              2
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm">
              3
            </button>
            <span className="text-[#8b6f4c] text-xs sm:text-sm">...</span>
            <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm">
              5
            </button>
            <button className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm">
              →
            </button>
          </div>

          {/* Suscripción a newsletter - responsive */}
          <div className="mt-8 sm:mt-12 md:mt-16 bg-gradient-to-r from-[#1a1f23]/80 to-[#0a0c0e]/80 border-2 border-[#8b6f4c] p-3 sm:p-4 md:p-8 backdrop-blur-sm">
            <div className="text-center mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-sm sm:text-base md:text-2xl font-bold text-[#f0d9b5] mb-1 sm:mb-2">
                📬 ¿Noticias en tu correo?
              </h3>
              <p className="text-[10px] sm:text-xs md:text-base text-[#8b6f4c]">
                Suscríbete para recibir novedades
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 sm:gap-0">
              <input 
                type="email" 
                placeholder="Tu email"
                className="flex-1 bg-[#0a0c0e]/80 border-2 border-[#8b6f4c] sm:border-r-0 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#f0d9b5] backdrop-blur-sm"
              />
              <button className="bg-[#8b6f4c] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#8b6f4c] sm:border-l-0 whitespace-nowrap">
                Suscribirme
              </button>
            </div>
            
            <p className="text-center text-[8px] sm:text-xs text-[#4a3a28] mt-2 sm:mt-3 md:mt-4">
              No compartimos tu email. Puedes darte de baja.
            </p>
          </div>
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