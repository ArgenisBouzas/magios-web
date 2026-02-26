import Link from "next/link";

export default function Barra_navegacion(){
    return (
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
                    item.nombre === 'Inicio' ? 'text-[#f0d9b5] border-b-2 border-[#8b6f4c]' : ''
                  }`}
                >
                  {item.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

    )
}