// app/noticias/page.tsx
import Image from "next/image";
import Link from "next/link";

// Datos de ejemplo de noticias
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
              📰 Última actualización: Hoy
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
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Título de la página */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-[#f0d9b5] border-b-2 border-[#8b6f4c] pb-2 inline-block font-permanent">
            NOTICIAS Y ANUNCIOS
          </h2>
          <p className="text-[#8b6f4c] mt-2 text-lg">
            Mantente al día con las últimas novedades de la hermandad
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-[#1a1f23] border-2 border-[#8b6f4c] p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-wrap">
            <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-4 py-2 focus:outline-none focus:border-[#f0d9b5]">
              {categorias.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            
            <select className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-4 py-2 focus:outline-none focus:border-[#f0d9b5]">
              <option>Más recientes</option>
              <option>Más antiguos</option>
              <option>Más comentados</option>
              <option>Más reacciones</option>
            </select>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar noticias..."
              className="bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-4 py-2 pr-10 focus:outline-none focus:border-[#f0d9b5]"
            />
            <span className="absolute right-3 top-2.5 text-[#8b6f4c]">🔍</span>
          </div>
        </div>

        {/* Noticia destacada */}
        {noticias.filter(n => n.destacada)[0] && (
          <div className="mb-12 relative">
            <div className="absolute -top-3 left-4 bg-[#8b6f4c] text-[#0a0c0e] px-4 py-1 text-sm font-bold uppercase tracking-wider border-2 border-[#f0d9b5]">
              ⭐ Noticia Destacada
            </div>
            <div className="bg-gradient-to-r from-[#1a1f23] to-[#2a2f33] border-2 border-[#8b6f4c] p-6 pt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-video bg-[#0a0c0e] border-2 border-[#8b6f4c] flex items-center justify-center">
                    <span className="text-6xl opacity-30">📰</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#8b6f4c] text-[#0a0c0e] text-xs px-2 py-1 font-bold">
                      {noticias.filter(n => n.destacada)[0].categoria}
                    </span>
                    <span className="text-xs text-[#8b6f4c]">
                      {noticias.filter(n => n.destacada)[0].fecha}
                    </span>
                    <span className="text-xs text-[#8b6f4c]">
                      Por: {noticias.filter(n => n.destacada)[0].autor}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#f0d9b5] mb-3">
                    {noticias.filter(n => n.destacada)[0].titulo}
                  </h3>
                  <p className="text-[#c4aa7d] mb-4">
                    {noticias.filter(n => n.destacada)[0].contenido}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#8b6f4c]">💬 {noticias.filter(n => n.destacada)[0].comentarios} comentarios</span>
                    <span className="text-[#8b6f4c]">❤️ {noticias.filter(n => n.destacada)[0].reacciones} reacciones</span>
                    <button className="text-[#f0d9b5] hover:underline ml-auto">
                      Leer más →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de noticias */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {noticias.map((noticia) => (
            <div 
              key={noticia.id}
              className="bg-[#1a1f23] border-2 border-[#8b6f4c] overflow-hidden hover:border-[#f0d9b5] transition-all duration-300 group"
            >
              {/* Imagen de la noticia */}
              <div className="relative h-40 bg-gradient-to-br from-[#2a2f33] to-[#1a1f23] border-b-2 border-[#8b6f4c]">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0z'/%3E%3C/g%3E%3C/svg%3E')"
                }}></div>
                <div className="absolute top-2 left-2 bg-[#8b6f4c] text-[#0a0c0e] text-xs px-2 py-1 font-bold z-10">
                  {noticia.categoria}
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-[#8b6f4c] z-10">
                  {noticia.fecha}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity">
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
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#f0d9b5] mb-2 line-clamp-2 group-hover:text-[#c4aa7d] transition-colors">
                  {noticia.titulo}
                </h3>
                <p className="text-sm text-[#c4aa7d] mb-3 line-clamp-2">
                  {noticia.resumen}
                </p>
                
                {/* Autor y estadísticas */}
                <div className="flex items-center justify-between text-xs border-t border-[#8b6f4c] pt-3 mt-2">
                  <span className="text-[#8b6f4c]">
                    Por: {noticia.autor}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#8b6f4c]" title="Comentarios">
                      💬 {noticia.comentarios}
                    </span>
                    <span className="text-[#8b6f4c]" title="Reacciones">
                      ❤️ {noticia.reacciones}
                    </span>
                  </div>
                </div>
                
                {/* Botón leer más */}
                <button className="w-full mt-3 text-left text-sm text-[#f0d9b5] hover:text-[#c4aa7d] transition-colors group">
                  Leer noticia completa →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center space-x-2">
          <button className="w-10 h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors">
            ←
          </button>
          <button className="w-10 h-10 border-2 border-[#8b6f4c] bg-[#8b6f4c] text-[#0a0c0e] font-bold">
            1
          </button>
          <button className="w-10 h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors">
            2
          </button>
          <button className="w-10 h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors">
            3
          </button>
          <span className="text-[#8b6f4c]">...</span>
          <button className="w-10 h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors">
            5
          </button>
          <button className="w-10 h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors">
            →
          </button>
        </div>

        {/* Suscripción a newsletter */}
        <div className="mt-16 bg-gradient-to-r from-[#1a1f23] to-[#0a0c0e] border-2 border-[#8b6f4c] p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#f0d9b5] mb-2">
              📬 ¿Quieres recibir noticias en tu correo?
            </h3>
            <p className="text-[#8b6f4c]">
              Suscríbete para recibir las últimas novedades de la hermandad
            </p>
          </div>
          
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Tu correo electrónico"
              className="flex-1 bg-[#0a0c0e] border-2 border-[#8b6f4c] border-r-0 px-4 py-3 text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#f0d9b5]"
            />
            <button className="bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#8b6f4c]">
              Suscribirme
            </button>
          </div>
          
          <p className="text-center text-xs text-[#4a3a28] mt-4">
            No compartiremos tu correo con nadie. Puedes darte de baja en cualquier momento.
          </p>
        </div>
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