// app/noticias/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header_secundario from '../components/layout/Header_secundario';
import Barra_navegacion from '../components/layout/Barra_navegacion';
import Footer from '../components/layout/Footer';
import TarjetaNoticia from '../components/noticias/TarjetaNoticia';

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  autor_nombre: string;
  autor_rango: string;
  vistas: number;
  destacada: boolean;
  categorias: Array<{
    id: number;
    nombre: string;
    color: string;
  }>;
  imagenes?: string[];
}

interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  color: string; // 👈 AÑADIR ESTA LÍNEA
}

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rango: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

export default function NoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Estado para el modal de eliminación
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<Noticia | null>(null);

  useEffect(() => {
    fetchUsuario();
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchNoticias();
  }, [categoriasSeleccionadas, paginaActual]);

  const fetchUsuario = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch('/api/noticias/categorias');
      if (res.ok) {
        const data = await res.json();
        setCategorias(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchNoticias = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/noticias?pagina=${paginaActual}`;
      
      if (categoriasSeleccionadas.length > 0) {
        categoriasSeleccionadas.forEach(cat => {
          url += `&categoria=${encodeURIComponent(cat)}`;
        });
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al cargar noticias');
      }
      
      const noticiasConImagenes = data.noticias.map((noticia: Noticia) => ({
        ...noticia,
        imagenes: extraerImagenes(noticia.contenido)
      }));
      
      setNoticias(noticiasConImagenes || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (error: unknown) {
      let errorMessage = 'Error al cargar las noticias';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
      console.error('Error al cargar noticias:', error);
      setError(errorMessage);
      setNoticias([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para extraer URLs de imágenes del contenido
  const extraerImagenes = (contenido: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    return contenido.match(urlRegex) || [];
  };

  const toggleCategoria = (categoria: string) => {
    setCategoriasSeleccionadas(prev => {
      if (prev.includes(categoria)) {
        return prev.filter(c => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setCategoriasSeleccionadas([]);
    setPaginaActual(1);
  };

  const eliminarNoticia = async () => {
    if (!noticiaAEliminar) return;

    try {
      const res = await fetch(`/api/noticias/${noticiaAEliminar.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json() as ErrorResponse;
        throw new Error(data.error || 'Error al eliminar noticia');
      }

      setNoticias(noticias.filter(n => n.id !== noticiaAEliminar.id));
      setModalEliminarAbierto(false);
      setNoticiaAEliminar(null);
    } catch (error: unknown) {
      let errorMessage = 'Error al eliminar noticia';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error al eliminar noticia:', error);
      setError(errorMessage);
    }
  };

  const puedeModerar = usuario && (usuario.rango === 'General' || usuario.rango === 'Oficial');
  const puedeEliminar = usuario && usuario.rango === 'General';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
        <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
      </div>

      <div className="relative z-10 min-h-screen text-[#c4aa7d]">
        <Header_secundario />
        <Barra_navegacion />

        <main className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          {/* Header con botones de acción */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent">
                NOTICIAS DE LA HERMANDAD
              </h1>
              <p className="text-[#8b6f4c] text-sm mt-1">
                Mantente al día con las últimas novedades
              </p>
            </div>
            
            <div className="flex gap-3">
              {puedeModerar && (
                <Link
                  href="/noticias/admin"
                  className="bg-[#2a2f33] border-2 border-[#8b6f4c] px-4 py-2 text-sm text-[#c4aa7d] font-bold hover:bg-[#3a3f43] hover:border-[#f0d9b5] transition-colors flex items-center gap-2"
                >
                  ⚙️ MODERAR
                </Link>
              )}
              
              {usuario && (
                <Link
                  href="/noticias/crear"
                  className="bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  CREAR
                </Link>
              )}
            </div>
          </div>

          {/* Filtros de categorías */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h2 className="text-sm font-bold text-[#f0d9b5]">
                Filtrar por categorías:
                {categoriasSeleccionadas.length > 0 && (
                  <span className="ml-2 text-[#8b6f4c] font-normal">
                    ({categoriasSeleccionadas.length} seleccionadas)
                  </span>
                )}
              </h2>
              
              {categoriasSeleccionadas.length > 0 && (
                <button
                  onClick={limpiarFiltros}
                  className="text-xs bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-[#c4aa7d] hover:bg-[#3a3f43] transition-colors"
                >
                  LIMPIAR FILTROS
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categoriasSeleccionadas.length === 0 && (
                <button
                  className="px-3 py-1 text-xs border-2 border-[#f0d9b5] bg-[#8b6f4c] text-[#0a0c0e]"
                >
                  Todas
                </button>
              )}
              
              {categorias.map((cat) => {
                const seleccionada = categoriasSeleccionadas.includes(cat.nombre);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategoria(cat.nombre)}
                    className={`px-3 py-1 text-xs border-2 transition-all ${
                      seleccionada
                        ? 'border-[#f0d9b5] bg-[#8b6f4c] text-[#0a0c0e]'
                        : 'border-[#8b6f4c] text-[#c4aa7d] hover:border-[#f0d9b5]'
                    }`}
                    style={{ 
                      borderColor: seleccionada ? '#f0d9b5' : cat.color,
                      backgroundColor: seleccionada ? '#8b6f4c' : 'transparent'
                    }}
                  >
                    {cat.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Grid de noticias */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#c4aa7d]">Cargando noticias...</p>
            </div>
          ) : noticias.length === 0 ? (
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-12 text-center">
              <p className="text-2xl mb-4">📰</p>
              <p className="text-[#8b6f4c] text-lg">
                {categoriasSeleccionadas.length > 0
                  ? 'No hay noticias con las categorías seleccionadas'
                  : 'No hay noticias publicadas aún'}
              </p>
              {usuario && (
                <Link
                  href="/noticias/crear"
                  className="inline-block mt-4 bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d]"
                >
                  Crear la primera noticia
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {noticias.map((noticia) => (
                  <div key={noticia.id} className="relative group">
                    <TarjetaNoticia noticia={noticia} />
                    
                    {puedeEliminar && (
                      <button
                        onClick={() => {
                          setNoticiaAEliminar(noticia);
                          setModalEliminarAbierto(true);
                        }}
                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        title="Eliminar noticia"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                    disabled={paginaActual === 1}
                    className="w-8 h-8 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="text-[#c4aa7d] text-sm">
                    Página {paginaActual} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaActual === totalPaginas}
                    className="w-8 h-8 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* Modal de confirmación para eliminar noticia */}
      {modalEliminarAbierto && noticiaAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-red-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-400 mb-4">
              ⚠️ Eliminar noticia
            </h3>
            <p className="text-[#c4aa7d] text-sm mb-2">
              ¿Estás SEGURO de que quieres eliminar la noticia:
            </p>
            <p className="text-[#f0d9b5] font-bold mb-4">
              "{noticiaAEliminar.titulo}"?
            </p>
            <p className="text-red-400 text-xs mb-6">
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
            </p>
            <div className="flex gap-4">
              <button
                onClick={eliminarNoticia}
                className="flex-1 bg-red-700 py-3 text-white font-bold hover:bg-red-600 transition-colors"
              >
                ELIMINAR
              </button>
              <button
                onClick={() => {
                  setModalEliminarAbierto(false);
                  setNoticiaAEliminar(null);
                }}
                className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}