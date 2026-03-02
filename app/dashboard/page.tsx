// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header_secundario from '../components/layout/Header_secundario';
import Barra_navegacion from '../components/layout/Barra_navegacion';
import Footer from '../components/layout/Footer';

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rango: string;
  fecha_registro: string;
}

interface Personaje {
  id: number;
  nombre_personaje: string;
  raza: string;
  clase: string;
  nivel: number;
  rango: string;
  fecha_creacion: string;
  usuario_id: number;
  nombre_usuario?: string;
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

const getIconoClase = (clase: string) => {
  return iconosClases[clase] || '/iconos wow/default.png';
};

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [todosPersonajes, setTodosPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [stats, setStats] = useState({
    totalPersonajes: 0,
    nivel60: 0,
    personajePrincipal: null as Personaje | null
  });

  // Estados para filtros de personajes globales
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRango, setFiltroRango] = useState('');
  const [filtroClase, setFiltroClase] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const personajesPorPagina = 8;

  // Estado para modal de cambio de rango
  const [modalRangoAbierto, setModalRangoAbierto] = useState(false);
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState<Personaje | null>(null);
  const [nuevoRango, setNuevoRango] = useState('');

  // Estado para modal de confirmación de eliminación
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [personajeAEliminar, setPersonajeAEliminar] = useState<Personaje | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Obtener datos del usuario
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        if (userRes.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar usuario');
      }
      const userData = await userRes.json();
      setUsuario(userData.usuario);

      // Obtener personajes del usuario
      const personajesRes = await fetch('/api/personajes');
      if (!personajesRes.ok) {
        throw new Error('Error al cargar personajes');
      }
      const personajesData = await personajesRes.json();
      setPersonajes(personajesData);

      // Si es General u Oficial, obtener todos los personajes
      if (userData.usuario.rango === 'General' || userData.usuario.rango === 'Oficial') {
        const todosRes = await fetch('/api/personajes/todos');
        if (todosRes.ok) {
          const todosData = await todosRes.json();
          setTodosPersonajes(todosData);
        }
      }

      // Calcular estadísticas
      const nivel60 = personajesData.filter((p: Personaje) => p.nivel === 60).length;
      const principal = personajesData.sort((a: Personaje, b: Personaje) => b.nivel - a.nivel)[0] || null;

      setStats({
        totalPersonajes: personajesData.length,
        nivel60,
        personajePrincipal: principal
      });

    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const cambiarRangoPersonaje = async () => {
    if (!personajeSeleccionado || !nuevoRango) return;

    try {
      setError('');
      const res = await fetch(`/api/personajes/${personajeSeleccionado.id}/rango`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoRango })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al cambiar rango');
      }

      setExito(`Rango de ${personajeSeleccionado.nombre_personaje} cambiado a ${nuevoRango}`);
      setModalRangoAbierto(false);
      
      // Recargar datos
      await fetchDashboardData();
      
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const eliminarPersonaje = async () => {
    if (!personajeAEliminar) return;

    try {
      setError('');
      const res = await fetch(`/api/personajes/${personajeAEliminar.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al eliminar personaje');
      }

      setExito(`Personaje ${personajeAEliminar.nombre_personaje} eliminado correctamente`);
      setModalEliminarAbierto(false);
      setPersonajeAEliminar(null);
      
      // Recargar datos
      await fetchDashboardData();
      
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filtrar personajes globales
  const personajesFiltrados = todosPersonajes.filter(p => {
    if (filtroNombre && !p.nombre_personaje.toLowerCase().includes(filtroNombre.toLowerCase())) return false;
    if (filtroRango && p.rango !== filtroRango) return false;
    if (filtroClase && p.clase !== filtroClase) return false;
    return true;
  });

  // Paginación
  const totalPaginas = Math.ceil(personajesFiltrados.length / personajesPorPagina);
  const personajesPaginados = personajesFiltrados.slice(
    (paginaActual - 1) * personajesPorPagina,
    paginaActual * personajesPorPagina
  );

  // Obtener rangos únicos para filtro
  const rangosUnicos = [...new Set(todosPersonajes.map(p => p.rango))].sort();
  const clasesUnicas = [...new Set(todosPersonajes.map(p => p.clase))].sort();

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
          <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-[#c4aa7d] text-xl">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo del Portal Oscuro */}
      <div className="absolute inset-0">
        <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
        <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
      </div>

      <div className="relative z-10 min-h-screen text-[#c4aa7d]">
        <Header_secundario />
        <Barra_navegacion />

        <main className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          {/* Mensajes de error/éxito */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}
          {exito && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 text-green-200 rounded">
              {exito}
            </div>
          )}

          {/* Título y bienvenida */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent mb-2">
              DASHBOARD
            </h1>
            <p className="text-[#8b6f4c] text-sm md:text-base">
              Bienvenido de vuelta, <span className="text-[#f0d9b5] font-bold">{usuario.nombre_usuario}</span>
            </p>
          </div>

          {/* Grid principal del dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Info del usuario */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tarjeta de perfil */}
              <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-[#f0d9b5] mb-4 font-permanent border-b border-[#8b6f4c] pb-2">
                  MI PERFIL
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#8b6f4c] text-xs">USUARIO</p>
                    <p className="text-[#f0d9b5] font-bold">{usuario.nombre_usuario}</p>
                  </div>
                  <div>
                    <p className="text-[#8b6f4c] text-xs">EMAIL</p>
                    <p className="text-[#f0d9b5] text-sm break-all">{usuario.email}</p>
                  </div>
                  <div>
                    <p className="text-[#8b6f4c] text-xs">RANGO</p>
                    <span className={`inline-block px-3 py-1 text-xs font-bold ${
                      usuario.rango === 'General' ? 'bg-purple-900 text-purple-200 border border-purple-700' :
                      usuario.rango === 'Oficial' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                      'bg-green-900 text-green-200 border border-green-700'
                    }`}>
                      {usuario.rango}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#8b6f4c] text-xs">MIEMBRO DESDE</p>
                    <p className="text-[#f0d9b5] text-sm">
                      {new Date(usuario.fecha_registro).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link
                  href="/perfil"
                  className="block w-full text-center mt-4 bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5]"
                >
                  EDITAR PERFIL
                </Link>
              </div>

              {/* Acceso rápido a admin (solo para admins) */}
              {(usuario.rango === 'General' || usuario.rango === 'Oficial') && (
                <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-[#f0d9b5] mb-4 font-permanent border-b border-[#8b6f4c] pb-2">
                    PANEL DE ADMIN
                  </h2>
                  <div className="space-y-3">
                    <Link
                      href="/admin/tokens"
                      className="block bg-[#0a0c0e] border border-[#8b6f4c] p-3 hover:border-[#f0d9b5] transition-colors"
                    >
                      <p className="text-[#f0d9b5] font-bold">🔑 Tokens de Invitación y Usuarios</p>
                      <p className="text-[#8b6f4c] text-xs mt-1">Genera y administra tokens y usuarios</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha - Personajes y estadísticas */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-4 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold text-[#f0d9b5]">{stats.totalPersonajes}</p>
                  <p className="text-[10px] text-[#8b6f4c] uppercase">Mis Personajes</p>
                </div>
                <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-4 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold text-[#f0d9b5]">{stats.nivel60}</p>
                  <p className="text-[10px] text-[#8b6f4c] uppercase">Nivel 60</p>
                </div>
                <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-4 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold text-[#f0d9b5]">{10 - stats.totalPersonajes}</p>
                  <p className="text-[10px] text-[#8b6f4c] uppercase">Espacios libres</p>
                </div>
                <div className="bg-[#1a1f23]/80 border border-[#8b6f4c] p-4 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold text-[#f0d9b5]">
                    {stats.personajePrincipal?.nivel || '-'}
                  </p>
                  <p className="text-[10px] text-[#8b6f4c] uppercase">Nivel máximo</p>
                </div>
              </div>

              {/* Personaje principal destacado */}
              {stats.personajePrincipal && (
                <div className="bg-[#1a1f23]/80 border-2 border-[#f0d9b5] p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500 text-xl">⭐</span>
                    <h2 className="text-xl font-bold text-[#f0d9b5] font-permanent">
                      PERSONAJE PRINCIPAL
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0a0c0e] border-2 border-[#8b6f4c] rounded-lg overflow-hidden">
                      <Image
                        src={getIconoClase(stats.personajePrincipal.clase)}
                        alt={stats.personajePrincipal.clase}
                        width={80}
                        height={80}
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#f0d9b5]">
                        {stats.personajePrincipal.nombre_personaje}
                      </h3>
                      <p className="text-[#c4aa7d]">
                        {stats.personajePrincipal.raza} • {stats.personajePrincipal.clase}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <span className="bg-[#8b6f4c] text-[#0a0c0e] text-xs px-2 py-1 font-bold">
                          Nv. {stats.personajePrincipal.nivel}
                        </span>
                        <span className={`text-xs px-2 py-1 ${
                          stats.personajePrincipal.rango === 'General' ? 'bg-purple-900 text-purple-200 border border-purple-700' :
                          stats.personajePrincipal.rango === 'Oficial' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                          'bg-green-900 text-green-200 border border-green-700'
                        }`}>
                          {stats.personajePrincipal.rango}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/personajes/${stats.personajePrincipal.id}`}
                      className="bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors whitespace-nowrap"
                    >
                      VER DETALLES
                    </Link>
                  </div>
                </div>
              )}

              {/* Lista de mis personajes */}
              <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#f0d9b5] font-permanent border-b border-[#8b6f4c] pb-2">
                    MIS PERSONAJES
                  </h2>
                  <Link
                    href="/personajes"
                    className="text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors text-sm"
                  >
                    Ver todos →
                  </Link>
                </div>

                {personajes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#8b6f4c] mb-4">No tienes personajes creados</p>
                    <Link
                      href="/personajes"
                      className="bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors inline-block"
                    >
                      CREAR PRIMER PERSONAJE
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {personajes.slice(0, 5).map((personaje) => (
                      <div
                        key={personaje.id}
                        className="bg-[#0a0c0e] border border-[#8b6f4c] p-3 hover:border-[#f0d9b5] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Link href={`/personajes/${personaje.id}`} className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-[#1a1f23] border border-[#8b6f4c] rounded overflow-hidden">
                              <Image
                                src={getIconoClase(personaje.clase)}
                                alt={personaje.clase}
                                width={40}
                                height={40}
                                className="object-contain p-0.5"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-[#f0d9b5] font-bold">{personaje.nombre_personaje}</p>
                                <span className="text-[8px] bg-[#8b6f4c] text-[#0a0c0e] px-1 py-0.5 font-bold">
                                  Nv.{personaje.nivel}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#c4aa7d]">
                                {personaje.raza} • {personaje.clase}
                              </p>
                            </div>
                          </Link>
                          
                          {/* Botón eliminar personaje */}
                          <button
                            onClick={() => {
                              setPersonajeAEliminar(personaje);
                              setModalEliminarAbierto(true);
                            }}
                            className="bg-red-600/80 hover:bg-red-700 px-2 py-1 text-xs text-white rounded transition-colors"
                            title="Eliminar personaje"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                    {personajes.length > 5 && (
                      <p className="text-center text-[#8b6f4c] text-xs mt-2">
                        +{personajes.length - 5} personajes más
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sección para Generales y Oficiales: Todos los personajes de la hermandad */}
{(usuario.rango === 'General' || usuario.rango === 'Oficial') && (
  <div className="mt-8 bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 backdrop-blur-sm">
    <h2 className="text-2xl font-bold text-[#f0d9b5] mb-4 font-permanent border-b-2 border-[#8b6f4c] pb-2">
      ⚔️ TODOS LOS PERSONAJES DE LA HERMANDAD ({todosPersonajes.length})
    </h2>

    {/* Filtros */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div>
        <label className="block text-[#c4aa7d] text-xs mb-1">Buscar por nombre</label>
        <input
          type="text"
          value={filtroNombre}
          onChange={(e) => {
            setFiltroNombre(e.target.value);
            setPaginaActual(1);
          }}
          placeholder="Nombre del personaje..."
          className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-[#c4aa7d] text-xs mb-1">Filtrar por rango</label>
        <select
          value={filtroRango}
          onChange={(e) => {
            setFiltroRango(e.target.value);
            setPaginaActual(1);
          }}
          className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
        >
          <option value="">Todos los rangos</option>
          {rangosUnicos.map(rango => (
            <option key={rango} value={rango}>{rango}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[#c4aa7d] text-xs mb-1">Filtrar por clase</label>
        <select
          value={filtroClase}
          onChange={(e) => {
            setFiltroClase(e.target.value);
            setPaginaActual(1);
          }}
          className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
        >
          <option value="">Todas las clases</option>
          {clasesUnicas.map(clase => (
            <option key={clase} value={clase}>{clase}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          onClick={() => {
            setFiltroNombre('');
            setFiltroRango('');
            setFiltroClase('');
            setPaginaActual(1);
          }}
          className="w-full bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors text-sm"
        >
          LIMPIAR FILTROS
        </button>
      </div>
    </div>

    {personajesFiltrados.length === 0 ? (
      <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-8 text-center">
        <p className="text-[#8b6f4c]">No se encontraron personajes con esos filtros.</p>
      </div>
    ) : (
      <>
        {/* Grid de personajes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personajesPaginados.map((personaje) => (
            <div
              key={personaje.id}
              className="bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 hover:border-[#f0d9b5] transition-colors"
            >
              <div className="flex items-start gap-2">
                <Link href={`/personajes/${personaje.id}`} className="flex items-start gap-2 flex-1">
                  <div className="w-10 h-10 bg-[#1a1f23] border border-[#8b6f4c] rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={getIconoClase(personaje.clase)}
                      alt={personaje.clase}
                      width={40}
                      height={40}
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[#f0d9b5] font-bold text-sm truncate">
                        {personaje.nombre_personaje}
                      </p>
                      <span className="text-[8px] bg-[#8b6f4c] text-[#0a0c0e] px-1 py-0.5 font-bold whitespace-nowrap">
                        Nv.{personaje.nivel}
                      </span>
                    </div>
                    <p className="text-[#c4aa7d] text-[10px] truncate">
                      {personaje.raza} • {personaje.clase}
                    </p>
                    <p className="text-[#8b6f4c] text-[8px] mt-1">
                      Dueño: {personaje.nombre_usuario || 'Desconocido'}
                    </p>
                  </div>
                </Link>

                {/* Botón eliminar (solo para Generales) */}
                {usuario.rango === 'General' && (
                  <button
                    onClick={() => {
                      setPersonajeAEliminar(personaje);
                      setModalEliminarAbierto(true);
                    }}
                    className="bg-red-600/80 hover:bg-red-700 px-1.5 py-1 text-[10px] text-white rounded transition-colors"
                    title="Eliminar personaje"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Selector de rango (solo para Generales) - AHORA CON NUEVOS RANGOS */}
              {usuario.rango === 'General' && (
                <div className="mt-3 pt-2 border-t border-[#8b6f4c]">
                  <label className="block text-[#c4aa7d] text-[8px] mb-1">Cambiar rango</label>
                  <select
                    value={personaje.rango}
                    onChange={(e) => {
                      setPersonajeSeleccionado(personaje);
                      setNuevoRango(e.target.value);
                      setModalRangoAbierto(true);
                    }}
                    className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] text-[10px] px-2 py-1"
                  >
                    <option value="Guild Master">Guild Master</option>
                    <option value="Officer">Officer</option>
                    <option value="Alter">Alter</option>
                    <option value="Member">Member</option>
                    <option value="Initiate">Initiate</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className="w-8 h-8 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <span className="text-[#c4aa7d] text-sm">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
              disabled={paginaActual === totalPaginas}
              className="w-8 h-8 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}

        <p className="text-[#8b6f4c] text-xs mt-4 text-center">
          Mostrando {personajesPaginados.length} de {personajesFiltrados.length} personajes
        </p>
      </>
    )}
  </div>
)}
          {/* Acciones rápidas */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Link
              href="/personajes"
              className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 text-center hover:border-[#f0d9b5] transition-colors backdrop-blur-sm"
            >
              <p className="text-2xl mb-2">⚔️</p>
              <p className="text-[#f0d9b5] font-bold">Gestionar Personajes</p>
              <p className="text-[#8b6f4c] text-xs mt-1">Crea y edita tus personajes</p>
            </Link>
            <Link
              href="/progreso"
              className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 text-center hover:border-[#f0d9b5] transition-colors backdrop-blur-sm"
            >
              <p className="text-2xl mb-2">📊</p>
              <p className="text-[#f0d9b5] font-bold">Ver Progreso</p>
              <p className="text-[#8b6f4c] text-xs mt-1">Estadísticas de la hermandad</p>
            </Link>
          </div>
        </main>

        <Footer />
      </div>

      {/* Modal para confirmar cambio de rango */}
      {modalRangoAbierto && personajeSeleccionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#f0d9b5] mb-4">
              Cambiar rango de {personajeSeleccionado.nombre_personaje}
            </h3>
            <p className="text-[#c4aa7d] text-sm mb-4">
              ¿Estás seguro de que quieres cambiar el rango a <span className="font-bold">{nuevoRango}</span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={cambiarRangoPersonaje}
                className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
              >
                CONFIRMAR
              </button>
              <button
                onClick={() => {
                  setModalRangoAbierto(false);
                  setPersonajeSeleccionado(null);
                }}
                className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      {modalEliminarAbierto && personajeAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-red-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-400 mb-4">
              ⚠️ Eliminar personaje
            </h3>
            <p className="text-[#c4aa7d] text-sm mb-2">
              ¿Estás SEGURO de que quieres eliminar a <span className="font-bold text-[#f0d9b5]">{personajeAEliminar.nombre_personaje}</span>?
            </p>
            <p className="text-red-400 text-xs mb-6">
              Esta acción no se puede deshacer. El personaje será desactivado permanentemente.
            </p>
            <div className="flex gap-4">
              <button
                onClick={eliminarPersonaje}
                className="flex-1 bg-red-700 py-3 text-white font-bold hover:bg-red-600 transition-colors"
              >
                ELIMINAR
              </button>
              <button
                onClick={() => {
                  setModalEliminarAbierto(false);
                  setPersonajeAEliminar(null);
                }}
                className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Efectos de borde */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}