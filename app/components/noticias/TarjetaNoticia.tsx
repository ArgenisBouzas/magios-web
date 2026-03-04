// components/noticias/TarjetaNoticia.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

interface Props {
  noticia: Noticia;
}

export default function TarjetaNoticia({ noticia }: Props) {
  const [imagenActual, setImagenActual] = useState(0);
  const [imagenesValidas, setImagenesValidas] = useState<string[]>([]);
  const [videosInfo, setVideosInfo] = useState<Array<{id: string, url: string}>>([]);
  const [mostrarVideo, setMostrarVideo] = useState(false);

  // Función para detectar videos de YouTube y obtener su miniatura
  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : null;
  };

  const getYoutubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Función para extraer URLs de imágenes del contenido (con parámetros)
  const extraerImagenes = (contenido: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?/gi;
    return contenido.match(urlRegex) || [];
  };

  // Función para extraer videos de YouTube del contenido
  const extraerVideos = (contenido: string): Array<{id: string, url: string}> => {
    const urlRegex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+)/gi;
    const urls = contenido.match(urlRegex) || [];
    
    return urls
      .map(url => {
        const id = getYoutubeVideoId(url);
        return id ? { id, url } : null;
      })
      .filter((item): item is {id: string, url: string} => item !== null);
  };

  // Función para limpiar el contenido de markdown para el resumen
  const limpiarMarkdownParaResumen = (texto: string): string => {
    if (!texto) return '';
    
    let limpio = texto;
    
    // Eliminar tags de color: <color=#hex>texto</color> -> texto
    limpio = limpio.replace(/<color=#[^>]+>(.*?)<\/color>/g, '$1');
    
    // Eliminar enlaces: [texto](url) -> texto
    limpio = limpio.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Eliminar negritas: **texto** -> texto
    limpio = limpio.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Eliminar títulos: # texto, ## texto, ### texto -> texto
    limpio = limpio.replace(/#{1,3}\s/g, '');
    
    // Eliminar URLs de imágenes y videos
    const urlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?/gi;
    const youtubeRegex = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/gi;
    limpio = limpio.replace(urlRegex, '').replace(youtubeRegex, '');
    
    // Normalizar espacios
    limpio = limpio.replace(/\s+/g, ' ').trim();
    
    return limpio;
  };

  useEffect(() => {
    // Extraer imágenes del contenido
    const imagenesExtraidas = extraerImagenes(noticia.contenido);
    
    // Filtrar imágenes que parecen válidas
    const imagenesFiltradas = imagenesExtraidas.filter(img => 
      !img.includes('youtube') && !img.includes('youtu.be')
    );
    
    setImagenesValidas(imagenesFiltradas);
    
    // Detectar videos de YouTube
    const videosExtraidos = extraerVideos(noticia.contenido);
    setVideosInfo(videosExtraidos);
    
    // Decidir qué mostrar: si hay imágenes, mostrar imágenes; si no, mostrar el primer video
    setMostrarVideo(imagenesFiltradas.length === 0 && videosExtraidos.length > 0);
  }, [noticia.contenido]);

  const tieneImagenes = imagenesValidas.length > 0;
  const tieneVideos = videosInfo.length > 0;

  const extractResumen = (contenido: string) => {
    const textoLimpio = limpiarMarkdownParaResumen(contenido);
    return textoLimpio.substring(0, 100) + (textoLimpio.length > 100 ? '...' : '');
  };

  const siguienteImagen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagenActual < imagenesValidas.length - 1) {
      setImagenActual(imagenActual + 1);
    }
  };

  const anteriorImagen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imagenActual > 0) {
      setImagenActual(imagenActual - 1);
    }
  };

  return (
    <Link href={`/noticias/${noticia.id}`}>
      <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] hover:border-[#f0d9b5] transition-all group backdrop-blur-sm h-full flex flex-col">
        {/* Carrusel de imágenes o miniatura de video */}
        {(tieneImagenes || (mostrarVideo && tieneVideos)) && (
          <div className="relative h-48 border-b-2 border-[#8b6f4c] overflow-hidden bg-[#0a0c0e]">
            {mostrarVideo && tieneVideos ? (
              // Mostrar miniatura del video (sin reproducir)
              <div className="relative w-full h-full">
                <Image
                  src={getYoutubeThumbnail(videosInfo[0].id)}
                  alt={`Miniatura de video para ${noticia.titulo}`}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Si falla la miniatura de máxima calidad, intentar con la de calidad media
                    const img = e.target as HTMLImageElement;
                    img.src = `https://img.youtube.com/vi/${videosInfo[0].id}/hqdefault.jpg`;
                  }}
                />
                {/* Overlay con ícono de play (solo decorativo) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 bg-[#8b6f4c]/90 rounded-full flex items-center justify-center">
                    <span className="text-4xl text-[#0a0c0e] ml-1">▶</span>
                  </div>
                </div>
                {/* Badge de video */}
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded">
                  📺 VIDEO
                </div>
              </div>
            ) : tieneImagenes ? (
              // Mostrar imágenes
              <>
                <div className="relative w-full h-full">
                  <Image
                    src={imagenesValidas[imagenActual]}
                    alt={`Imagen ${imagenActual + 1} de ${noticia.titulo}`}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      console.error('Error cargando imagen:', imagenesValidas[imagenActual]);
                      if (imagenActual < imagenesValidas.length - 1) {
                        setImagenActual(imagenActual + 1);
                      }
                    }}
                  />
                </div>
                
                {/* Indicadores de imagen */}
                {imagenesValidas.length > 1 && (
                  <>
                    <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
                      {imagenesValidas.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            idx === imagenActual ? 'bg-[#f0d9b5]' : 'bg-[#8b6f4c]'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Botones de navegación */}
                    <button
                      onClick={anteriorImagen}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-[#8b6f4c] transition-opacity ${
                        imagenActual === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      disabled={imagenActual === 0}
                    >
                      ←
                    </button>
                    <button
                      onClick={siguienteImagen}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-[#8b6f4c] transition-opacity ${
                        imagenActual === imagenesValidas.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      disabled={imagenActual === imagenesValidas.length - 1}
                    >
                      →
                    </button>
                  </>
                )}
                
                {/* Contador de imágenes */}
                {imagenesValidas.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {imagenActual + 1} / {imagenesValidas.length}
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        <div className="p-4 flex-1">
          {noticia.destacada && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-500 text-xs">⭐</span>
              <span className="text-yellow-500 text-[10px] uppercase tracking-wider">Destacada</span>
            </div>
          )}

          <h3 className="text-lg font-bold text-[#f0d9b5] mb-2 group-hover:text-[#c4aa7d] transition-colors line-clamp-2">
            {noticia.titulo}
          </h3>

          {/* Categorías */}
          <div className="flex flex-wrap gap-1 mb-3">
            {noticia.categorias.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="text-[8px] px-1.5 py-0.5 border"
                style={{ borderColor: cat.color, color: cat.color }}
              >
                {cat.nombre}
              </span>
            ))}
          </div>

          <p className="text-xs text-[#c4aa7d] mb-3 line-clamp-2">
            {extractResumen(noticia.contenido)}
          </p>

          {/* Autor y metadata */}
          <div className="flex items-center justify-between text-[10px] border-t border-[#8b6f4c] pt-2 mt-auto">
            <span className="text-[#8b6f4c]">
              Por: {noticia.autor_nombre}
              <span className={`ml-1 ${
                noticia.autor_rango === 'Guild Master' ? 'text-purple-400' :
                noticia.autor_rango === 'Officer' ? 'text-blue-400' :
                noticia.autor_rango === 'Alter' ? 'text-yellow-400' :
                noticia.autor_rango === 'Member' ? 'text-green-400' :
                'text-gray-400'
              }`}>
                ({noticia.autor_rango})
              </span>
            </span>
            <div className="flex items-center gap-2">
              {tieneVideos && !tieneImagenes && (
                <span className="text-[#8b6f4c]" title="Video de YouTube">
                  📺 {videosInfo.length}
                </span>
              )}
              {tieneImagenes && (
                <span className="text-[#8b6f4c]" title={`${imagenesValidas.length} imágenes`}>
                  🖼️ {imagenesValidas.length}
                </span>
              )}
              <span className="text-[#8b6f4c]">👁️ {noticia.vistas}</span>
              <span className="text-[#8b6f4c]">
                {new Date(noticia.fecha_publicacion).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}