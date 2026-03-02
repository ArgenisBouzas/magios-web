// app/personajes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
  'Shaman':'/iconos wow/SHAMAN.png'
};

// Función para obtener la ruta del icono
const getIconoClase = (clase: string) => {
  return iconosClases[clase] || '/iconos wow/default.png';
};

export default function PersonajesPage() {
  const router = useRouter();
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Estado para nuevo personaje
  const [nuevoPersonaje, setNuevoPersonaje] = useState({
    nombre_personaje: '',
    raza: '',
    clase: '',
    nivel: 1
  });

  // Estado para edición de nivel
  const [editandoNivel, setEditandoNivel] = useState<number | null>(null);
  const [nuevoNivel, setNuevoNivel] = useState<number>(1);

  // Opciones para selects
  const razas = [
    'Humano', 'Enano', 'Elfo de la Noche', 'Gnomo', 'Draenei',
    'Orco', 'No-muerto', 'Tauren', 'Trol', 'Elfo de Sangre'
  ];

  const clases = [
    'Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote',
    'Mago', 'Brujo', 'Druida','Shaman'
  ];

  // Cargar personajes al montar el componente
  useEffect(() => {
    fetchPersonajes();
  }, []);

  const fetchPersonajes = async () => {
    try {
      const res = await fetch('/api/personajes');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
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

  const crearPersonaje = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!nuevoPersonaje.nombre_personaje.trim()) {
      setError('El nombre del personaje es requerido');
      return;
    }

    if (!nuevoPersonaje.raza) {
      setError('Debes seleccionar una raza');
      return;
    }

    if (!nuevoPersonaje.clase) {
      setError('Debes seleccionar una clase');
      return;
    }

    if (nuevoPersonaje.nivel < 1 || nuevoPersonaje.nivel > 60) {
      setError('El nivel debe estar entre 1 y 60');
      return;
    }

    try {
      const res = await fetch('/api/personajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPersonaje)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.error?.includes('máximo 10')) {
          setError('¡Has alcanzado el límite de 10 personajes por cuenta!');
        } else {
          throw new Error(data.error || 'Error al crear personaje');
        }
        return;
      }

      setExito('¡Personaje creado exitosamente!');
      setNuevoPersonaje({ nombre_personaje: '', raza: '', clase: '', nivel: 1 });
      setMostrarFormulario(false);
      fetchPersonajes();
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const actualizarNivel = async (id: number) => {
    if (nuevoNivel < 1 || nuevoNivel > 60) {
      setError('El nivel debe estar entre 1 y 60');
      return;
    }

    try {
      const res = await fetch(`/api/personajes/${id}/nivel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nivel: nuevoNivel })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar nivel');
      }

      setExito('¡Nivel actualizado correctamente!');
      setEditandoNivel(null);
      fetchPersonajes();
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const desactivarPersonaje = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este personaje?')) {
      return;
    }

    try {
      const res = await fetch(`/api/personajes/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Error al desactivar personaje');
      }

      fetchPersonajes();
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo desactivar el personaje');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center">Cargando personajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent">
              MIS PERSONAJES
            </h1>
            <p className="text-[#8b6f4c] mt-2">
              Administra tus personajes en la hermandad
            </p>
          </div>
          
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] flex items-center gap-2 justify-center"
            disabled={personajes.length >= 10}
          >
            <span className="text-xl">+</span>
            {personajes.length >= 10 ? 'LÍMITE ALCANZADO' : 'CREAR PERSONAJE'}
          </button>
        </div>

        {/* Contador de personajes */}
        <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 mb-8 backdrop-blur-sm">
          <p className="text-[#c4aa7d]">
            Personajes: <span className="text-[#f0d9b5] font-bold">{personajes.length}</span> / 10
          </p>
          <div className="w-full h-2 bg-[#0a0c0e] mt-2">
            <div 
              className="h-full bg-gradient-to-r from-[#8b6f4c] to-[#f0d9b5] transition-all duration-300"
              style={{ width: `${(personajes.length / 10) * 100}%` }}
            ></div>
          </div>
        </div>

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

        {/* Formulario de creación */}
        {mostrarFormulario && (
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 mb-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[#f0d9b5] mb-4">NUEVO PERSONAJE</h2>
            
            <form onSubmit={crearPersonaje} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-[#c4aa7d] text-sm mb-2">Nombre del Personaje</label>
                  <input
                    type="text"
                    value={nuevoPersonaje.nombre_personaje}
                    onChange={(e) => setNuevoPersonaje({...nuevoPersonaje, nombre_personaje: e.target.value})}
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                    placeholder="Ej: Thraxx"
                    required
                  />
                </div>

                {/* Raza */}
                <div>
                  <label className="block text-[#c4aa7d] text-sm mb-2">Raza</label>
                  <select
                    value={nuevoPersonaje.raza}
                    onChange={(e) => setNuevoPersonaje({...nuevoPersonaje, raza: e.target.value})}
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                    required
                  >
                    <option value="">Selecciona una raza</option>
                    {razas.map(raza => (
                      <option key={raza} value={raza}>{raza}</option>
                    ))}
                  </select>
                </div>

                {/* Clase con icono */}
                <div>
                  <label className="block text-[#c4aa7d] text-sm mb-2">Clase</label>
                  <div className="relative">
                    <select
                      value={nuevoPersonaje.clase}
                      onChange={(e) => setNuevoPersonaje({...nuevoPersonaje, clase: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 pl-12 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5] appearance-none"
                      required
                    >
                      <option value="">Selecciona una clase</option>
                      {clases.map(clase => (
                        <option key={clase} value={clase}>{clase}</option>
                      ))}
                    </select>
                    {nuevoPersonaje.clase && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6">
                        <Image
                          src={getIconoClase(nuevoPersonaje.clase)}
                          alt={nuevoPersonaje.clase}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Nivel */}
                <div>
                  <label className="block text-[#c4aa7d] text-sm mb-2">Nivel</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={nuevoPersonaje.nivel}
                    onChange={(e) => setNuevoPersonaje({...nuevoPersonaje, nivel: parseInt(e.target.value) || 1})}
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
                >
                  CREAR PERSONAJE
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="border-2 border-[#8b6f4c] px-6 py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de personajes */}
        {personajes.length === 0 ? (
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-12 text-center backdrop-blur-sm">
            <p className="text-2xl mb-4">⚔️</p>
            <p className="text-[#8b6f4c] text-lg">No tienes personajes creados</p>
            <p className="text-sm text-[#4a3a28] mt-2">
              ¡Crea tu primer personaje para unirte a la hermandad!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personajes.map((personaje) => (
              <div
                key={personaje.id}
                className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 hover:border-[#f0d9b5] transition-all group backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Icono de clase */}
                  <div className="w-12 h-12 flex-shrink-0 bg-[#0a0c0e] border-2 border-[#8b6f4c] rounded-lg overflow-hidden">
                    <Image
                      src={getIconoClase(personaje.clase)}
                      alt={personaje.clase}
                      width={48}
                      height={48}
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#f0d9b5] font-permanent">
                      {personaje.nombre_personaje}
                    </h3>
                    <p className="text-[#c4aa7d] text-sm mt-1">
                      {personaje.raza} • {personaje.clase}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="bg-[#8b6f4c] text-[#0a0c0e] text-xs px-2 py-1 font-bold">
                        Nv. {personaje.nivel}
                      </span>
                      <span className={`text-xs px-2 py-1 ${
                        personaje.rango === 'General' ? 'bg-purple-900 text-purple-200 border border-purple-700' :
                        personaje.rango === 'Oficial' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                        'bg-green-900 text-green-200 border border-green-700'
                      }`}>
                        {personaje.rango}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#4a3a28] mt-3">
                      Creado: {new Date(personaje.fecha_creacion).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/personajes/${personaje.id}`}
                      className="text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors p-1"
                      title="Ver detalles"
                    >
                      👁️
                    </Link>
                    
                    {/* Botón editar nivel */}
                    <button
                      onClick={() => {
                        setEditandoNivel(personaje.id);
                        setNuevoNivel(personaje.nivel);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                      title="Editar nivel"
                    >
                      📈
                    </button>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => desactivarPersonaje(personaje.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Desactivar personaje"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Formulario de edición de nivel */}
                {editandoNivel === personaje.id && (
                  <div className="mt-4 pt-4 border-t border-[#8b6f4c]">
                    <label className="block text-[#c4aa7d] text-xs mb-2">
                      Editar nivel de {personaje.nombre_personaje}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={nuevoNivel}
                        onChange={(e) => setNuevoNivel(parseInt(e.target.value) || 1)}
                        className="flex-1 bg-[#0a0c0e] border border-[#8b6f4c] p-2 text-[#f0d9b5] text-sm"
                      />
                      <button
                        onClick={() => actualizarNivel(personaje.id)}
                        className="bg-green-700 px-3 py-1 text-xs text-white rounded hover:bg-green-600"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditandoNivel(null)}
                        className="bg-red-700 px-3 py-1 text-xs text-white rounded hover:bg-red-600"
                      >
                        ✗
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}