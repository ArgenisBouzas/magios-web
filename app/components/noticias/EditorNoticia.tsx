// components/noticias/EditorNoticia.tsx
'use client';

import { useState, useRef, useEffect, JSX } from 'react';
import Image from 'next/image';

interface Props {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type FormatType = 'bold' | 'h1' | 'h2' | 'h3';

export default function EditorNoticia({ initialContent = '', onChange, placeholder }: Props) {
  const [content, setContent] = useState(initialContent);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extraer URLs de imágenes del contenido para vista previa
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    const urls = content.match(urlRegex) || [];
    setPreviewImages(urls);
  }, [content]);

  const insertFormat = (format: FormatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newContent = '';

    switch (format) {
      case 'bold':
        newContent = content.substring(0, start) + '**' + selectedText + '**' + content.substring(end);
        break;
      case 'h1':
        newContent = content.substring(0, start) + '# ' + selectedText + content.substring(end);
        break;
      case 'h2':
        newContent = content.substring(0, start) + '## ' + selectedText + content.substring(end);
        break;
      case 'h3':
        newContent = content.substring(0, start) + '### ' + selectedText + content.substring(end);
        break;
    }

    setContent(newContent);
    onChange(newContent);
  };

  const insertImage = () => {
    if (!imageUrl) return;
    
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    if (!imageUrl.match(urlRegex)) {
      alert('Por favor, ingresa una URL válida de imagen');
      return;
    }

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + imageUrl + content.substring(end);
      setContent(newContent);
      onChange(newContent);
      setImageUrl('');
      setImageError(false);
      setShowImageModal(false);
    }
  };

  const testImageUrl = (url: string) => {
    const ejemplos: Record<string, string> = {
      'wow1': 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
      'wow2': 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate_06.jpg',
      'wow3': 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg',
    };
    if (ejemplos[url]) {
      setImageUrl(ejemplos[url]);
    }
  };

  // Vista previa en tiempo real - CORREGIDA
  const renderPreview = () => {
    if (!content) return null;

    const lines = content.split('\n');
    const elementos: JSX.Element[] = [];

    lines.forEach((line, lineIndex) => {
      if (!line.trim()) {
        elementos.push(<br key={`br-${lineIndex}`} />);
        return;
      }

      // Detectar títulos
      if (line.startsWith('# ')) {
        elementos.push(
          <h1 key={`h1-${lineIndex}`} className="text-4xl font-bold text-[#f0d9b5] mt-6 mb-4">
            {line.substring(2)}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elementos.push(
          <h2 key={`h2-${lineIndex}`} className="text-3xl font-bold text-[#f0d9b5] mt-5 mb-3">
            {line.substring(3)}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elementos.push(
          <h3 key={`h3-${lineIndex}`} className="text-2xl font-bold text-[#f0d9b5] mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
        return;
      }

      // Detectar URLs de imágenes
      const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp))/gi;
      
      // Si la línea es solo una URL de imagen
      if (line.match(urlRegex) && !line.replace(urlRegex, '').trim()) {
        elementos.push(
          <div key={`img-${lineIndex}`} className="my-6">
            <div className="relative w-full h-64 bg-[#0a0c0e] border-2 border-[#8b6f4c] rounded-lg overflow-hidden">
              <Image
                src={line}
                alt="Imagen"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        );
        return;
      }

      // Procesar líneas que mezclan texto e imágenes
      const partes = line.split(urlRegex);
      const fragmentosTexto: JSX.Element[] = [];
      const elementosLinea: JSX.Element[] = [];

      partes.forEach((parte, idx) => {
        if (parte.match(urlRegex)) {
          // Es una imagen - primero sacamos el texto acumulado si existe
          if (fragmentosTexto.length > 0) {
            elementosLinea.push(
              <p key={`p-${lineIndex}-${idx}`} className="mb-4 text-[#c4aa7d]">
                {fragmentosTexto}
              </p>
            );
            fragmentosTexto.length = 0;
          }
          // Luego añadimos la imagen como bloque separado
          elementosLinea.push(
            <div key={`img-${lineIndex}-${idx}`} className="my-4">
              <div className="relative w-full h-48 bg-[#0a0c0e] border border-[#8b6f4c] rounded overflow-hidden">
                <Image
                  src={parte}
                  alt="Imagen"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          );
        } else if (parte.trim()) {
          // Es texto - procesar negritas
          const boldRegex = /\*\*(.*?)\*\*/g;
          const textParts = parte.split(boldRegex);
          
          if (textParts.length === 1) {
            fragmentosTexto.push(<span key={`text-${lineIndex}-${idx}`}>{parte}</span>);
          } else {
            fragmentosTexto.push(
              <span key={`bold-${lineIndex}-${idx}`}>
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

      // Si quedó texto acumulado al final
      if (fragmentosTexto.length > 0) {
        elementosLinea.push(
          <p key={`p-final-${lineIndex}`} className="mb-4 text-[#c4aa7d]">
            {fragmentosTexto}
          </p>
        );
      }

      elementos.push(...elementosLinea);
    });

    return elementos;
  };

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-[#1a1f23]/80 border border-[#8b6f4c] rounded">
        <button
          onClick={() => insertFormat('h1')}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Título grande (H1)"
        >
          H1
        </button>
        <button
          onClick={() => insertFormat('h2')}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Subtítulo (H2)"
        >
          H2
        </button>
        <button
          onClick={() => insertFormat('h3')}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Subtítulo pequeño (H3)"
        >
          H3
        </button>
        <div className="w-px h-6 bg-[#8b6f4c] mx-1"></div>
        <button
          onClick={() => insertFormat('bold')}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Negrita"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Insertar imagen"
        >
          🖼️
        </button>
        <span className="text-[#8b6f4c] text-xs ml-auto hidden sm:block">
          Usa # para títulos, ## para subtítulos, **texto** para negrita
        </span>
      </div>

      {/* Área de edición */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder || `Escribe tu noticia...

# Título principal
## Subtítulo
### Título más pequeño
**texto en negrita**

Ejemplos de imágenes (copia y pega estas URLs para probar):
https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg
https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate_06.jpg
https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg`}
        className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-4 text-[#f0d9b5] min-h-[300px] font-mono text-sm focus:border-[#f0d9b5] outline-none"
      />

      {/* Modal para insertar imagen */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#f0d9b5] mb-4">
              Insertar imagen por URL
            </h3>
            
            <div className="mb-4">
              <p className="text-[#8b6f4c] text-xs mb-2">Ejemplos de imágenes de WoW:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => testImageUrl('wow1')}
                  className="text-xs bg-[#2a2f33] border border-[#8b6f4c] px-2 py-1 text-[#c4aa7d] hover:bg-[#3a3f43]"
                >
                  Espada
                </button>
                <button
                  onClick={() => testImageUrl('wow2')}
                  className="text-xs bg-[#2a2f33] border border-[#8b6f4c] px-2 py-1 text-[#c4aa7d] hover:bg-[#3a3f43]"
                >
                  Armadura
                </button>
                <button
                  onClick={() => testImageUrl('wow3')}
                  className="text-xs bg-[#2a2f33] border border-[#8b6f4c] px-2 py-1 text-[#c4aa7d] hover:bg-[#3a3f43]"
                >
                  Hechizo
                </button>
              </div>
            </div>

            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageError(false);
              }}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] mb-4"
            />
            
            {imageUrl && !imageError && (
              <div className="relative w-full h-48 mb-4 border-2 border-[#8b6f4c] rounded overflow-hidden bg-[#0a0c0e]">
                <Image
                  src={imageUrl}
                  alt="Vista previa"
                  fill
                  className="object-contain"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            
            {imageError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
                No se pudo cargar la imagen. Verifica que la URL sea correcta y accesible.
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={insertImage}
                disabled={!imageUrl || imageError}
                className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors disabled:opacity-50"
              >
                INSERTAR
              </button>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                  setImageError(false);
                }}
                className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa mejorada - AHORA CON HTML VÁLIDO */}
      {content && (
        <div className="mt-8 p-6 bg-[#1a1f23]/80 border-2 border-[#8b6f4c] rounded">
          <h4 className="text-[#f0d9b5] text-sm mb-4 border-b border-[#8b6f4c] pb-2 font-bold uppercase tracking-wider">
            VISTA PREVIA
          </h4>
          
          {/* Miniaturas de imágenes */}
          {previewImages.length > 0 && (
            <div className="mb-6">
              <p className="text-[#8b6f4c] text-xs mb-2">📸 Imágenes detectadas:</p>
              <div className="flex flex-wrap gap-2">
                {previewImages.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 border border-[#8b6f4c] rounded overflow-hidden bg-[#0a0c0e]">
                    <Image
                      src={url}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contenido renderizado - AHORA CON ESTRUCTURA HTML CORRECTA */}
          <div className="prose prose-invert max-w-none">
            {renderPreview()}
          </div>
        </div>
      )}
    </div>
  );
}