// app/miembros/page.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header_secundario from "../components/layout/Header_secundario";
import Barra_navegacion from "../components/layout/Barra_navegacion";
import Footer from "../components/layout/Footer";

interface Personaje {
  id: number;
  nombre_personaje: string;
  raza: string;
  clase: string;
  nivel: number;
  rango: string;
  activo: boolean;
  fecha_creacion: string;
  usuario_id: number;
}

// Mapeo de clases a sus iconos
const iconosClases: Record<string, string> = {
  'Druida': '/iconos wow/DRUID.png',
  'Cazador': '/iconos wow/HUNTER.png',
  'Mago': '/iconos wow/MAGE.png',
  'Paladín': '/iconos wow/PALADIN.png',
  'Sacerdote': '/iconos wow/PRIEST.png',
  'Pícaro': '/iconos wow/ROGUE.png',
  'Brujo': '/iconos wow/WARLOCK.png',
  'Guerrero': '/iconos wow/WARRIOR.png',
  'Chamán': '/iconos wow/SHAMAN.png',
  'Shaman': '/iconos wow/SHAMAN.png'
};

// Función para obtener el icono de clase
const getIconoClase = (clase: string) => {
  return iconosClases[clase] || '/iconos wow/default.png';
};

// Orden de rangos (del mayor al menor)
const ordenRangos: Record<string, number> = {
  'Guild Master': 1,
  'Officer': 2,
  'Alter': 3,
  'Member': 4,
  'Initiate': 5,
  // Mantener compatibilidad con rangos antiguos
  'General': 1,
  'Oficial': 2,
  'Miembro': 4,
  'Aspirante': 5
};

export default function MiembrosPage() {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para filtros
  const [filtroClase, setFiltroClase] = useState('');
  const [filtroRango, setFiltroRango] = useState('');
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const personajesPorPagina = 9;

  // Cargar personajes desde la API
  useEffect(() => {
    fetchPersonajes();
  }, []);

  const fetchPersonajes = async () => {
    try {
      const res = await fetch('/api/personajes/todos');
      if (!res.ok) {
        throw new Error('Error al cargar personajes');
      }
      const data = await res.json();
      setPersonajes(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los personajes');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros y ordenamiento
  const personajesFiltrados = personajes
    .filter(p => p.activo) // Solo personajes activos
    .filter(p => !filtroClase || p.clase === filtroClase)
    .filter(p => !filtroRango || p.rango === filtroRango)
    .filter(p => p.nombre_personaje.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      // 1. Ordenar por rango (usando el mapa de orden)
      const ordenA = ordenRangos[a.rango] || 999;
      const ordenB = ordenRangos[b.rango] || 999;
      
      if (ordenA !== ordenB) {
        return ordenA - ordenB; // Menor número = mayor rango
      }
      
      // 2. Si mismo rango, ordenar por nivel (de mayor a menor)
      if (b.nivel !== a.nivel) {
        return b.nivel - a.nivel;
      }
      
      // 3. Si mismo nivel, ordenar alfabéticamente por nombre
      return a.nombre_personaje.localeCompare(b.nombre_personaje);
    });

  // Paginación
  const totalPaginas = Math.ceil(personajesFiltrados.length / personajesPorPagina);
  const personajesPaginados = personajesFiltrados.slice(
    (paginaActual - 1) * personajesPorPagina,
    paginaActual * personajesPorPagina
  );

  // Obtener clases únicas para el filtro
  const clasesUnicas = [...new Set(personajes.map(p => p.clase))].sort();
  
  // Obtener rangos únicos y ordenarlos según el mapa de orden
  const rangosUnicos = [...new Set(personajes.map(p => p.rango))].sort((a, b) => 
    (ordenRangos[a] || 999) - (ordenRangos[b] || 999)
  );

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
          <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-[#c4aa7d] text-xl">Cargando miembros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
          <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-xl">{error}</p>
            <button 
              onClick={fetchPersonajes}
              className="mt-4 bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo del Portal Oscuro */}
      <div className="absolute inset-0">
        <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
        <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#00ffff] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ff00ff] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen text-[#c4aa7d]">
        <Header_secundario />
        <Barra_navegacion />

        <main className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          {/* Título de la página */}
          <div className="mb-4 sm:mb-6 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#f0d9b5] border-b-2 border-[#8b6f4c] pb-1 sm:pb-2 inline-block font-permanent">
              MIEMBROS DE LA HERMANDAD
            </h2>
            <p className="text-[#8b6f4c] mt-1 sm:mt-2 text-xs sm:text-sm md:text-lg">
              {personajesFiltrados.length} aventureros forjan nuestra leyenda en Azeroth
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-2 sm:p-3 md:p-4 mb-4 sm:mb-6 md:mb-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select 
                  className="bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial backdrop-blur-sm"
                  value={filtroClase}
                  onChange={(e) => setFiltroClase(e.target.value)}
                >
                  <option value="">Todas las clases</option>
                  {clasesUnicas.map(clase => (
                    <option key={clase} value={clase}>{clase}</option>
                  ))}
                </select>

                <select 
                  className="bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] flex-1 sm:flex-initial backdrop-blur-sm"
                  value={filtroRango}
                  onChange={(e) => setFiltroRango(e.target.value)}
                >
                  <option value="">Todos los rangos</option>
                  {rangosUnicos.map(rango => (
                    <option key={rango} value={rango}>{rango}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="w-full sm:w-auto bg-[#0a0c0e]/80 border border-[#8b6f4c] text-[#c4aa7d] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 pr-8 text-xs sm:text-sm focus:outline-none focus:border-[#f0d9b5] backdrop-blur-sm"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <span className="absolute right-2 top-1.5 sm:top-2 text-[#8b6f4c] text-xs sm:text-sm">🔍</span>
              </div>
            </div>
          </div>

          {/* Grid de miembros */}
          {personajesPaginados.length === 0 ? (
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-12 text-center backdrop-blur-sm">
              <p className="text-2xl mb-4">😢</p>
              <p className="text-[#8b6f4c] text-lg">No se encontraron miembros</p>
              <p className="text-sm text-[#4a3a28] mt-2">
                Prueba con otros filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {personajesPaginados.map((personaje) => (
                <Link
                  key={personaje.id}
                  href={`/personajes/${personaje.id}`}
                  className="block bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-3 sm:p-4 hover:border-[#f0d9b5] transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
                >
                  {/* Efecto de fondo al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8b6f4c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative flex items-start gap-3">
                    {/* Icono de clase */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 bg-[#0a0c0e] border-2 border-[#8b6f4c] rounded-lg overflow-hidden">
                      <Image
                        src={getIconoClase(personaje.clase)}
                        alt={personaje.clase}
                        width={64}
                        height={64}
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Info del miembro */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#f0d9b5] font-permanent truncate">
                          {personaje.nombre_personaje}
                        </h3>
                        <span className="text-[8px] sm:text-xs bg-[#8b6f4c] text-[#0a0c0e] px-1 sm:px-2 py-0.5 sm:py-1 font-bold whitespace-nowrap">
                          Nv.{personaje.nivel}
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-xs md:text-sm text-[#c4aa7d] mt-0.5 sm:mt-1 truncate">
                        {personaje.raza} • {personaje.clase}
                      </p>

                      <div className="mt-1 sm:mt-2 flex items-center gap-2">
                        <span
                          className={`text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 whitespace-nowrap inline-block ${
                            personaje.rango === "Guild Master" || personaje.rango === "General"
                              ? "bg-purple-900/80 text-purple-200 border border-purple-700"
                              : personaje.rango === "Officer" || personaje.rango === "Oficial"
                                ? "bg-blue-900/80 text-blue-200 border border-blue-700"
                                : personaje.rango === "Alter"
                                  ? "bg-yellow-900/80 text-yellow-200 border border-yellow-700"
                                  : personaje.rango === "Member" || personaje.rango === "Miembro"
                                    ? "bg-green-900/80 text-green-200 border border-green-700"
                                    : "bg-gray-900/80 text-gray-200 border border-gray-700"
                          }`}
                        >
                          {personaje.rango}
                        </span>
                        
                        {/* Indicador de nivel para personajes de alto nivel */}
                        {personaje.nivel === 60 && (
                          <span className="text-[8px] sm:text-xs text-yellow-500 border border-yellow-700 bg-yellow-900/30 px-1 sm:px-2 py-0.5">
                            ⭐ MAX
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flecha indicadora */}
                  <div className="absolute bottom-2 right-2 text-[#8b6f4c] group-hover:text-[#f0d9b5] transition-colors text-xs">
                    Ver perfil →
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="mt-6 sm:mt-8 md:mt-12 flex justify-center items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              
              {[...Array(totalPaginas)].map((_, i) => {
                const pagina = i + 1;
                if (
                  pagina === 1 ||
                  pagina === totalPaginas ||
                  (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)
                ) {
                  return (
                    <button
                      key={pagina}
                      onClick={() => setPaginaActual(pagina)}
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] transition-colors text-xs sm:text-sm md:text-base ${
                        paginaActual === pagina
                          ? 'bg-[#8b6f4c] text-[#0a0c0e] font-bold'
                          : 'text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] backdrop-blur-sm'
                      }`}
                    >
                      {pagina}
                    </button>
                  );
                } else if (
                  pagina === paginaActual - 2 ||
                  pagina === paginaActual + 2
                ) {
                  return <span key={pagina} className="text-[#8b6f4c] text-xs sm:text-sm">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                disabled={paginaActual === totalPaginas}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm md:text-base backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}

          {/* Estadísticas rápidas */}
          <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
                {personajes.length}
              </p>
              <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">
                Personajes totales
              </p>
            </div>
            <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
                {personajes.filter(p => p.nivel === 60).length}
              </p>
              <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">
                Nivel 60
              </p>
            </div>
            <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
                {clasesUnicas.length}
              </p>
              <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">
                Clases diferentes
              </p>
            </div>
            <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-2 sm:p-3 md:p-4 text-center backdrop-blur-sm">
              <p className="text-base sm:text-lg md:text-2xl font-bold text-[#f0d9b5]">
                {personajes.filter(p => 
                  p.rango === 'Guild Master' || 
                  p.rango === 'General' || 
                  p.rango === 'Officer' || 
                  p.rango === 'Oficial' || 
                  p.rango === 'Alter'
                ).length}
              </p>
              <p className="text-[8px] sm:text-xs text-[#8b6f4c] uppercase">
                Liderazgo
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Efectos de borde del portal */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}