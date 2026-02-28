// app/noticias/[id]/page.tsx
'use client';

import { useState, useEffect, use, JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header_secundario from '../../components/layout/Header_secundario';
import Barra_navegacion from '../../components/layout/Barra_navegacion';
import Footer from '../../components/layout/Footer';

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  fecha_creacion: string;
  autor_id: number;
  autor_nombre: string;
  autor_rango: string;
  vistas: number;
  destacada: boolean;
  estado: string;
  categorias: Array<{
    id: number;
    nombre: string;
    color: string;
  }>;
}

export default function NoticiaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    fetchUsuario();
    fetchNoticia();
  }, [id]);

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

  const fetchNoticia = async () => {
    try {
      const res = await fetch(`/api/noticias/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Noticia no encontrada');
          return;
        }
        throw new Error('Error al cargar la noticia');
      }
      const data = await res.json();
      setNoticia(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar la noticia');
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar el contenido con soporte para títulos, negritas e imágenes
 // Reemplaza toda la función renderizarContenido con esta versión corregida

const renderizarContenido = (texto: string) => {
  if (!texto) return null;

  const lineas = texto.split('\n');
  const elementos: JSX.Element[] = [];

  lineas.forEach((linea, indexLinea) => {
    if (!linea.trim()) {
      elementos.push(<br key={`br-${indexLinea}`} />);
      return;
    }

    // Detectar títulos
    if (linea.startsWith('# ')) {
      elementos.push(
        <h1 key={`h1-${indexLinea}`} className="text-2xl md:text-4xl font-bold text-[#f0d9b5] mt-6 md:mt-8 mb-3 md:mb-4">
          {linea.substring(2)}
        </h1>
      );
      return;
    }
    if (linea.startsWith('## ')) {
      elementos.push(
        <h2 key={`h2-${indexLinea}`} className="text-xl md:text-3xl font-bold text-[#f0d9b5] mt-5 md:mt-6 mb-2 md:mb-3">
          {linea.substring(3)}
        </h2>
      );
      return;
    }
    if (linea.startsWith('### ')) {
      elementos.push(
        <h3 key={`h3-${indexLinea}`} className="text-lg md:text-2xl font-bold text-[#f0d9b5] mt-4 md:mt-5 mb-2">
          {linea.substring(4)}
        </h3>
      );
      return;
    }

    // Detectar URLs de imágenes
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    
    // Si la línea es solo una URL de imagen, la añadimos directamente (fuera de <p>)
    if (linea.match(urlRegex) && !linea.replace(urlRegex, '').trim()) {
      elementos.push(
        <div key={`img-${indexLinea}`} className="my-6 md:my-8">
          <div className="relative w-full h-48 md:h-96 bg-[#0a0c0e] border-2 border-[#8b6f4c] rounded-lg overflow-hidden">
            <Image
              src={linea}
              alt="Imagen en noticia"
              fill
              className="object-contain"
              unoptimized
              priority={indexLinea < 2}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      );
      return;
    }

    // Procesar líneas que contienen texto (posiblemente con URLs de imágenes incrustadas)
    const partes = linea.split(urlRegex);
    // Nuevo array para acumular elementos de ESTA línea, separando texto de imágenes
    const elementosLinea: JSX.Element[] = [];
    const fragmentosTexto: JSX.Element[] = []; // Para acumular texto de esta línea

    partes.forEach((parte, indexParte) => {
      if (parte.match(urlRegex)) {
        // --- ES UNA IMAGEN ---
        // Si había texto acumulado antes, lo añadimos como <p> primero
        if (fragmentosTexto.length > 0) {
          elementosLinea.push(
            <p key={`p-texto-${indexLinea}-${indexParte}`} className="mb-3 md:mb-4 text-sm md:text-base text-[#c4aa7d]">
              {fragmentosTexto}
            </p>
          );
          // Limpiamos el array de fragmentos de texto
          fragmentosTexto.length = 0;
        }
        // Añadimos la imagen como un bloque independiente (FUERA de <p>)
        elementosLinea.push(
          <div key={`img-inline-${indexLinea}-${indexParte}`} className="my-3 md:my-4">
            <div className="relative w-full h-40 md:h-64 bg-[#0a0c0e] border border-[#8b6f4c] rounded overflow-hidden">
              <Image
                src={parte}
                alt="Imagen en noticia"
                fill
                className="object-contain"
                unoptimized
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </div>
        );
      } else if (parte.trim()) {
        // --- ES TEXTO ---
        // Procesar negritas en el texto y acumularlo en fragmentosTexto
        const boldRegex = /\*\*(.*?)\*\*/g;
        const textParts = parte.split(boldRegex);
        
        if (textParts.length === 1) {
          fragmentosTexto.push(<span key={`text-${indexLinea}-${indexParte}-${parte.substring(0,20)}`}>{parte}</span>);
        } else {
          fragmentosTexto.push(
            <span key={`bold-${indexLinea}-${indexParte}`}>
              {textParts.map((text, i) => {
                if (i % 2 === 1) {
                  return <strong key={`strong-${i}`} className="text-[#f0d9b5] font-bold">{text}</strong>;
                }
                return <span key={`normal-${i}`}>{text}</span>;
              })}
            </span>
          );
        }
      }
    });

    // Al final de la línea, si quedó texto acumulado, lo añadimos como <p>
    if (fragmentosTexto.length > 0) {
      elementosLinea.push(
        <p key={`p-final-${indexLinea}`} className="mb-3 md:mb-4 text-sm md:text-base text-[#c4aa7d]">
          {fragmentosTexto}
        </p>
      );
    }

    // Añadimos todos los elementos generados para esta línea al resultado final
    elementos.push(...elementosLinea);
  });

  return elementos;
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
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#8b6f4c] border-t-[#f0d9b5] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#c4aa7d] text-lg">Cargando noticia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
          <Image src="/magios.gif" alt="Portal Oscuro" fill className="object-cover -z-11" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-8 max-w-md">
            <p className="text-4xl mb-4">📰</p>
            <p className="text-red-400 mb-4">{error || 'Noticia no encontrada'}</p>
            <Link 
              href="/noticias"
              className="inline-block bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
            >
              Volver a Noticias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const puedeModerar = usuario && (usuario.rango === 'General' || usuario.rango === 'Oficial');
  const esAutor = usuario && usuario.id === noticia.autor_id;

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

        <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12">
          {/* Navegación */}
          <div className="mb-4 sm:mb-6">
            <Link 
              href="/noticias"
              className="text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors inline-flex items-center gap-1 text-sm sm:text-base"
            >
              ← Volver a Noticias
            </Link>
          </div>

          {/* Noticia */}
          <article className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 sm:p-6 md:p-8 backdrop-blur-sm">
            {/* Header de la noticia */}
            <div className="mb-4 sm:mb-6">
              {noticia.destacada && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-yellow-500 text-[10px] sm:text-xs uppercase tracking-wider">Noticia Destacada</span>
                </div>
              )}
              
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#f0d9b5] font-permanent mb-3 sm:mb-4">
                {noticia.titulo}
              </h1>

              {/* Categorías */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {noticia.categorias.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 border"
                    style={{ borderColor: cat.color, color: cat.color }}
                  >
                    {cat.nombre}
                  </span>
                ))}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm border-t border-b border-[#8b6f4c] py-2 sm:py-3">
                <span className="text-[#8b6f4c]">
                  <span className="hidden sm:inline">Por: </span>
                  <span className="text-[#f0d9b5] font-bold">{noticia.autor_nombre}</span>
                  <span className={`ml-1 text-[10px] sm:text-xs ${
                    noticia.autor_rango === 'General' ? 'text-purple-400' :
                    noticia.autor_rango === 'Oficial' ? 'text-blue-400' :
                    'text-green-400'
                  }`}>
                    ({noticia.autor_rango})
                  </span>
                </span>
                <span className="text-[#8b6f4c] text-[10px] sm:text-xs">
                  📅 {new Date(noticia.fecha_publicacion || noticia.fecha_creacion).toLocaleDateString()}
                </span>
                <span className="text-[#8b6f4c] text-[10px] sm:text-xs">
                  👁️ {noticia.vistas}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="prose prose-invert max-w-none text-[#c4aa7d] leading-relaxed">
              {renderizarContenido(noticia.contenido)}
            </div>
          </article>

          {/* Acciones (solo para autor o moderadores) */}
          {(esAutor || puedeModerar) && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <Link
                href={`/noticias/editar/${noticia.id}`}
                className="text-center border-2 border-[#8b6f4c] px-4 py-2 text-xs sm:text-sm text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
              >
                EDITAR
              </Link>
              {puedeModerar && noticia.estado === 'pendiente' && (
                <>
                  <button
                    onClick={async () => {
                      if (confirm('¿Aprobar esta noticia?')) {
                        try {
                          const res = await fetch(`/api/noticias/${noticia.id}/estado`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ estado: 'publicado' })
                          });
                          if (res.ok) {
                            router.push('/noticias/admin');
                          }
                        } catch (error) {
                          console.error('Error al aprobar:', error);
                        }
                      }
                    }}
                    className="text-center bg-green-700 px-4 py-2 text-xs sm:text-sm text-white hover:bg-green-600"
                  >
                    ✅ APROBAR
                  </button>
                  <button
                    onClick={() => {
                      const motivo = prompt('Motivo del rechazo:');
                      if (motivo) {
                        fetch(`/api/noticias/${noticia.id}/estado`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ estado: 'rechazado', motivo_rechazo: motivo })
                        }).then(() => router.push('/noticias/admin'));
                      }
                    }}
                    className="text-center bg-red-700 px-4 py-2 text-xs sm:text-sm text-white hover:bg-red-600"
                  >
                    ❌ RECHAZAR
                  </button>
                </>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}