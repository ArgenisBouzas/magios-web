// app/personajes/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Personaje {
  id: number;
  nombre_personaje: string;
  raza: string;
  clase: string;
  nivel: number;
  rango: string;
  activo: boolean;
  fecha_creacion: string;
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
  'Shaman': '/iconos wow/SHAMAN.png'
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPersonaje();
  }, [id]);

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
      setPersonaje(data.personaje || data); // Ajusta según tu API
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar el personaje');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] flex items-center justify-center">
        <p>Cargando personaje...</p>
      </div>
    );
  }

  if (error || !personaje) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con navegación */}
        <div className="mb-6">
          <Link 
            href="/personajes"
            className="text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors inline-flex items-center gap-2"
          >
            ← Volver a Mis Personajes
          </Link>
        </div>

        {/* Tarjeta de información del personaje */}
        <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icono grande de clase */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0a0c0e] border-4 border-[#8b6f4c] rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={getIconoClase(personaje.clase)}
                alt={personaje.clase}
                width={128}
                height={128}
                className="object-contain p-2"
              />
            </div>

            {/* Información detallada */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent mb-2">
                {personaje.nombre_personaje}
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-[#0a0c0e] p-3 border border-[#8b6f4c]">
                  <p className="text-[#8b6f4c] text-xs">RAZA</p>
                  <p className="text-[#f0d9b5] font-bold">{personaje.raza}</p>
                </div>
                <div className="bg-[#0a0c0e] p-3 border border-[#8b6f4c]">
                  <p className="text-[#8b6f4c] text-xs">CLASE</p>
                  <p className="text-[#f0d9b5] font-bold">{personaje.clase}</p>
                </div>
                <div className="bg-[#0a0c0e] p-3 border border-[#8b6f4c]">
                  <p className="text-[#8b6f4c] text-xs">NIVEL</p>
                  <p className="text-[#f0d9b5] font-bold">{personaje.nivel}</p>
                </div>
                <div className="bg-[#0a0c0e] p-3 border border-[#8b6f4c]">
                  <p className="text-[#8b6f4c] text-xs">RANGO</p>
                  <p className={`font-bold ${
                    personaje.rango === 'General' ? 'text-purple-400' :
                    personaje.rango === 'Oficial' ? 'text-blue-400' :
                    'text-green-400'
                  }`}>
                    {personaje.rango}
                  </p>
                </div>
              </div>

              <p className="text-[#4a3a28] text-xs mt-4">
                Miembro desde: {new Date(personaje.fecha_creacion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de equipamiento */}
        <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-[#f0d9b5] mb-6 font-permanent">
            EQUIPAMIENTO
          </h2>

          <p className="text-[#8b6f4c] text-sm mb-6 text-center italic">
            Próximamente: Sistema de equipamiento con 19 slots
          </p>

          {/* Grid de slots de equipamiento (preview) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {slotsEquipamiento.map((slot) => (
              <div
                key={slot.id}
                className="bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-center hover:border-[#f0d9b5] transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  {slot.icon}
                </div>
                <p className="text-[#8b6f4c] text-xs uppercase tracking-wider">
                  {slot.nombre}
                </p>
                <p className="text-[#4a3a28] text-[10px] mt-1">
                  Vacío
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#0a0c0e] border border-[#8b6f4c] text-center">
            <p className="text-[#c4aa7d] text-sm">
              ⚔️ Los items equipables se podrán gestionar desde aquí ⚔️
            </p>
          </div>
        </div>

        {/* Acciones del personaje */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => router.push('/personajes')}
            className="border-2 border-[#8b6f4c] px-6 py-2 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
          >
            CERRAR
          </button>
          <button
            className="bg-[#8b6f4c] px-6 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors opacity-50 cursor-not-allowed"
            disabled
            title="Próximamente"
          >
            EDITAR EQUIPAMIENTO
          </button>
        </div>
      </div>
    </div>
  );
}