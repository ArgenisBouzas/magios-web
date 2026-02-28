// app/personajes/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header_secundario from '../../components/layout/Header_secundario';
import Barra_navegacion from '../../components/layout/Barra_navegacion';
import Footer from '../../components/layout/Footer';

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
  nombre_usuario?: string;
}

interface Usuario {
  id: number;
  nombre_usuario: string;
  rango: string;
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

// Mapeo de razas a sus facciones
const facciones: Record<string, string> = {
  'Humano': 'Alianza',
  'Enano': 'Alianza',
  'Elfo de la Noche': 'Alianza',
  'Gnomo': 'Alianza',
  'Draenei': 'Alianza',
  'Orco': 'Horda',
  'No-muerto': 'Horda',
  'Tauren': 'Horda',
  'Trol': 'Horda',
  'Elfo de Sangre': 'Horda'
};

// Función para obtener el icono de clase
const getIconoClase = (clase: string) => {
  return iconosClases[clase] || '/iconos wow/default.png';
};

// Datos de ejemplo para slots (esto luego vendrá de la BD)
const slotsEquipamiento = [
  { id: 1, nombre: 'Cabeza', slot: 'head', icon: '🪖' },
  { id: 2, nombre: 'Cuello', slot: 'neck', icon: '📿' },
  { id: 3, nombre: 'Hombros', slot: 'shoulders', icon: '🛡️' },
  { id: 4, nombre: 'Espalda', slot: 'back', icon: '🧥' },
  { id: 5, nombre: 'Pecho', slot: 'chest', icon: '👕' },
  { id: 6, nombre: 'Camisa', slot: 'shirt', icon: '👔' },
  { id: 7, nombre: 'Tabardo', slot: 'tabard', icon: '🏷️' },
  { id: 8, nombre: 'Muñecas', slot: 'wrist', icon: '⌚' },
  { id: 9, nombre: 'Manos', slot: 'hands', icon: '🧤' },
  { id: 10, nombre: 'Cintura', slot: 'waist', icon: '🔗' },
  { id: 11, nombre: 'Piernas', slot: 'legs', icon: '👖' },
  { id: 12, nombre: 'Pies', slot: 'feet', icon: '👢' },
  { id: 13, nombre: 'Dedo 1', slot: 'finger1', icon: '💍' },
  { id: 14, nombre: 'Dedo 2', slot: 'finger2', icon: '💍' },
  { id: 15, nombre: 'Abalorio 1', slot: 'trinket1', icon: '🔮' },
  { id: 16, nombre: 'Abalorio 2', slot: 'trinket2', icon: '🔮' },
  { id: 17, nombre: 'Mano Principal', slot: 'mainhand', icon: '⚔️' },
  { id: 18, nombre: 'Mano Secundaria', slot: 'offhand', icon: '🛡️' },
  { id: 19, nombre: 'A Distancia', slot: 'ranged', icon: '🏹' }
];

export default function PersonajeDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [personaje, setPersonaje] = useState<Personaje | null>(null);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [esPropietario, setEsPropietario] = useState(false);

  // Estado para el modal de cambio de rango (solo para Generales)
  const [modalRangoAbierto, setModalRangoAbierto] = useState(false);
  const [nuevoRango, setNuevoRango] = useState('');

  useEffect(() => {
    fetchPersonaje();
    fetchUsuarioActual();
  }, [id]);

  const fetchUsuarioActual = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUsuarioActual(data.usuario);
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    }
  };

  const fetchPersonaje = async () => {
    try {
      const res = await fetch(`/api/personajes/${id}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 404) {
          setError('Personaje no encontrado');
          return;
        }
        throw new Error('Error al cargar personaje');
      }
      const data = await res.json();
      setPersonaje(data.personaje || data);
      
      // Verificar si el usuario actual es el propietario
      if (usuarioActual) {
        setEsPropietario(data.personaje?.usuario_id === usuarioActual.id);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar el personaje');
    } finally {
      setLoading(false);
    }
  };

  const cambiarRango = async () => {
    if (!personaje || !nuevoRango) return;

    try {
      const res = await fetch(`/api/personajes/${personaje.id}/rango`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoRango })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al cambiar rango');
      }

      // Actualizar el personaje con el nuevo rango
      setPersonaje({ ...personaje, rango: nuevoRango });
      setModalRangoAbierto(false);
      
      // Mostrar mensaje de éxito (podrías agregar un estado para esto)
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
          <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-[#c4aa7d] text-xl">Cargando personaje...</p>
        </div>
      </div>
    );
  }

  if (error || !personaje) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
          <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-4">😢</p>
            <p className="text-red-400">{error || 'Personaje no encontrado'}</p>
            <Link 
              href="/personajes"
              className="inline-block mt-4 bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
            >
              Volver a Mis Personajes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const faccion = facciones[personaje.raza] || 'Neutral';

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

      <div className="relative z-10 min-h-screen text-[#c4aa7d]">
        <Header_secundario />
        <Barra_navegacion />

        <main className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          {/* Header con navegación */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link 
              href="/personajes"
              className="text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            >
              ← Volver a Mis Personajes
            </Link>
            
            {/* Badge de facción */}
            <span className={`px-3 py-1 text-xs font-bold w-fit ${
              faccion === 'Alianza' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
              faccion === 'Horda' ? 'bg-red-900 text-red-200 border border-red-700' :
              'bg-gray-900 text-gray-200 border border-gray-700'
            }`}>
              {faccion}
            </span>
          </div>

          {/* Tarjeta de información del personaje */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 sm:p-6 mb-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              {/* Icono grande de clase */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-[#0a0c0e] border-4 border-[#8b6f4c] rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={getIconoClase(personaje.clase)}
                  alt={personaje.clase}
                  width={128}
                  height={128}
                  className="object-contain p-2"
                />
              </div>

              {/* Información detallada */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent">
                    {personaje.nombre_personaje}
                  </h1>
                  
                  {/* Badge de propietario (si no es el usuario actual) */}
                  {!esPropietario && personaje.nombre_usuario && (
                    <span className="text-xs bg-[#8b6f4c] text-[#0a0c0e] px-2 py-1 font-bold w-fit">
                      Dueño: {personaje.nombre_usuario}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
                  <div className="bg-[#0a0c0e] p-2 sm:p-3 border border-[#8b6f4c]">
                    <p className="text-[#8b6f4c] text-[10px] sm:text-xs">RAZA</p>
                    <p className="text-[#f0d9b5] font-bold text-sm sm:text-base">{personaje.raza}</p>
                  </div>
                  <div className="bg-[#0a0c0e] p-2 sm:p-3 border border-[#8b6f4c]">
                    <p className="text-[#8b6f4c] text-[10px] sm:text-xs">CLASE</p>
                    <p className="text-[#f0d9b5] font-bold text-sm sm:text-base">{personaje.clase}</p>
                  </div>
                  <div className="bg-[#0a0c0e] p-2 sm:p-3 border border-[#8b6f4c]">
                    <p className="text-[#8b6f4c] text-[10px] sm:text-xs">NIVEL</p>
                    <p className="text-[#f0d9b5] font-bold text-sm sm:text-base">{personaje.nivel}</p>
                  </div>
                  <div className="bg-[#0a0c0e] p-2 sm:p-3 border border-[#8b6f4c]">
                    <p className="text-[#8b6f4c] text-[10px] sm:text-xs">RANGO</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm sm:text-base ${
                        personaje.rango === 'General' ? 'text-purple-400' :
                        personaje.rango === 'Oficial' ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {personaje.rango}
                      </span>
                      
                      {/* Botón para cambiar rango (solo para Generales) */}
                      {usuarioActual?.rango === 'General' && (
                        <button
                          onClick={() => {
                            setNuevoRango(personaje.rango);
                            setModalRangoAbierto(true);
                          }}
                          className="bg-blue-600/80 hover:bg-blue-700 px-1.5 py-0.5 text-[10px] text-white rounded transition-colors"
                          title="Cambiar rango"
                        >
                          ⚡
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[#4a3a28] text-[10px] sm:text-xs mt-4">
                  Miembro desde: {new Date(personaje.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de equipamiento */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0d9b5] mb-4 sm:mb-6 font-permanent">
              EQUIPAMIENTO
            </h2>

            <p className="text-[#8b6f4c] text-xs sm:text-sm mb-4 sm:mb-6 text-center italic">
              Próximamente: Sistema de equipamiento con 19 slots
            </p>

            {/* Grid de slots de equipamiento (preview) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {slotsEquipamiento.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-[#0a0c0e] border-2 border-[#8b6f4c] p-2 sm:p-3 text-center hover:border-[#f0d9b5] transition-all cursor-pointer group"
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {slot.icon}
                  </div>
                  <p className="text-[#8b6f4c] text-[8px] sm:text-xs uppercase tracking-wider">
                    {slot.nombre}
                  </p>
                  <p className="text-[#4a3a28] text-[8px] sm:text-[10px] mt-1">
                    Vacío
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-[#0a0c0e] border border-[#8b6f4c] text-center">
              <p className="text-[#c4aa7d] text-xs sm:text-sm">
                ⚔️ Los items equipables se podrán gestionar desde aquí ⚔️
              </p>
            </div>
          </div>

          {/* Acciones del personaje */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => router.push('/personajes')}
              className="border-2 border-[#8b6f4c] px-4 sm:px-6 py-2 text-xs sm:text-sm text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
            >
              CERRAR
            </button>
            {esPropietario && (
              <button
                className="bg-[#8b6f4c] px-4 sm:px-6 py-2 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
                onClick={() => router.push(`/personajes/${personaje.id}/editar`)}
              >
                EDITAR PERSONAJE
              </button>
            )}
            <button
              className="bg-[#8b6f4c] px-4 sm:px-6 py-2 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors opacity-50 cursor-not-allowed"
              disabled
              title="Próximamente"
            >
              EDITAR EQUIPAMIENTO
            </button>
          </div>
        </main>

        <Footer />
      </div>

      {/* Modal para cambiar rango */}
      {modalRangoAbierto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-[#f0d9b5] mb-4">
              Cambiar rango de {personaje.nombre_personaje}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#c4aa7d] text-xs sm:text-sm mb-2">Nuevo rango</label>
                <select
                  value={nuevoRango}
                  onChange={(e) => setNuevoRango(e.target.value)}
                  className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-2 sm:p-3 text-sm sm:text-base text-[#f0d9b5]"
                >
                  <option value="General">General</option>
                  <option value="Oficial">Oficial</option>
                  <option value="Miembro">Miembro</option>
                  <option value="Aspirante">Aspirante</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={cambiarRango}
                  className="flex-1 bg-[#8b6f4c] py-2 sm:py-3 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d]"
                >
                  GUARDAR
                </button>
                <button
                  onClick={() => setModalRangoAbierto(false)}
                  className="flex-1 border-2 border-[#8b6f4c] py-2 sm:py-3 text-xs sm:text-sm text-[#c4aa7d] hover:bg-[#2a2f33]"
                >
                  CANCELAR
                </button>
              </div>
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