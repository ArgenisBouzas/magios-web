// components/noticias/TarjetaNoticia.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  const tieneImagenes = noticia.imagenes && noticia.imagenes.length > 0;

  const extractResumen = (contenido: string) => {
    // Eliminar URLs de imágenes y markdown para el resumen
    const sinUrls = contenido.replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi, '');
    const sinMarkdown = sinUrls.replace(/\*\*/g, '');
    return sinMarkdown.substring(0, 100) + '...';
  };

  const siguienteImagen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (noticia.imagenes && imagenActual < noticia.imagenes.length - 1) {
      setImagenActual(imagenActual + 1);
    }
  };

  const anteriorImagen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (noticia.imagenes && imagenActual > 0) {
      setImagenActual(imagenActual - 1);
    }
  };

  return (
    <Link href={`/noticias/${noticia.id}`}>
      <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] hover:border-[#f0d9b5] transition-all group backdrop-blur-sm h-full flex flex-col">
        {/* Carrusel de imágenes (si hay) */}
        {tieneImagenes && (
          <div className="relative h-48 border-b-2 border-[#8b6f4c] overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={noticia.imagenes![imagenActual]}
                alt={`Imagen ${imagenActual + 1} de ${noticia.titulo}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Indicadores de imagen */}
            {noticia.imagenes!.length > 1 && (
              <>
                <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
                  {noticia.imagenes!.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === imagenActual ? 'bg-[#f0d9b5]' : 'bg-[#8b6f4c]'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Botones de navegación (aparecen al hover) */}
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
                    imagenActual === noticia.imagenes!.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  disabled={imagenActual === noticia.imagenes!.length - 1}
                >
                  →
                </button>
              </>
            )}
            
            {/* Contador de imágenes */}
            {noticia.imagenes!.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {imagenActual + 1} / {noticia.imagenes!.length}
              </div>
            )}
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
                noticia.autor_rango === 'General' ? 'text-purple-400' :
                noticia.autor_rango === 'Oficial' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                ({noticia.autor_rango})
              </span>
            </span>
            <div className="flex items-center gap-2">
              {tieneImagenes && (
                <span className="text-[#8b6f4c]" title={`${noticia.imagenes!.length} imágenes`}>
                  🖼️ {noticia.imagenes!.length}
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