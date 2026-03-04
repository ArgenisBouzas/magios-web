// components/noticias/EditorNoticia.tsx
'use client';

import { useState, useRef, useEffect, JSX } from 'react';
import Image from 'next/image';

interface Props {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type FormatType = 'bold' | 'h1' | 'h2' | 'h3' | 'link' | 'color';

// Paleta de colores estilo WoW
const colorPalette = [
  { name: 'Dorado', value: '#f0d9b5', class: 'text-[#f0d9b5]' },
  { name: 'Bronce', value: '#8b6f4c', class: 'text-[#8b6f4c]' },
  { name: 'Púrpura', value: '#c4aa7d', class: 'text-[#c4aa7d]' },
  { name: 'Rojo', value: '#ef4444', class: 'text-red-500' },
  { name: 'Azul', value: '#3b82f6', class: 'text-blue-500' },
  { name: 'Verde', value: '#10b981', class: 'text-green-500' },
  { name: 'Amarillo', value: '#f59e0b', class: 'text-yellow-500' },
  { name: 'Blanco', value: '#ffffff', class: 'text-white' },
];

// Emojis comunes
const emojis = [
  { emoji: '😀', name: 'Sonrisa' },
  { emoji: '😂', name: 'Risa' },
  { emoji: '😎', name: 'Guay' },
  { emoji: '😢', name: 'Triste' },
  { emoji: '🎉', name: 'Fiesta' },
  { emoji: '⚔️', name: 'Espadas' },
  { emoji: '🛡️', name: 'Escudo' },
  { emoji: '🏆', name: 'Trofeo' },
  { emoji: '🐉', name: 'Dragón' },
  { emoji: '👑', name: 'Corona' },
  { emoji: '💀', name: 'Muerte' },
  { emoji: '✨', name: 'Magia' },
  { emoji: '🔥', name: 'Fuego' },
  { emoji: '❄️', name: 'Hielo' },
  { emoji: '⚡', name: 'Rayo' },
  { emoji: '💪', name: 'Fuerza' },
];

export default function EditorNoticia({ initialContent = '', onChange, placeholder }: Props) {
  const [content, setContent] = useState(initialContent);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#f0d9b5');
  const [imageError, setImageError] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extraer URLs de imágenes del contenido para vista previa
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?|(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+))/gi;
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
      case 'link':
        setShowLinkModal(true);
        setLinkText(selectedText);
        return;
      case 'color':
        setShowColorModal(true);
        return;
    }

    setContent(newContent);
    onChange(newContent);
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Formato: [texto del enlace](url)
    const linkMarkdown = `[${linkText}](${linkUrl})`;
    
    const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
    
    setContent(newContent);
    onChange(newContent);
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertColor = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (!selectedText) return;

    // Formato: <color=#f0d9b5>texto</color>
    const colorMarkdown = `<color=${selectedColor}>${selectedText}</color>`;
    
    const newContent = content.substring(0, start) + colorMarkdown + content.substring(end);
    
    setContent(newContent);
    onChange(newContent);
    setShowColorModal(false);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + emoji + content.substring(end);
    
    setContent(newContent);
    onChange(newContent);
    setShowEmojiPicker(false);
  };

  const insertImage = () => {
    if (!imageUrl) return;
    
    const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?|(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+))/gi;
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

  // Función para detectar videos de YouTube
  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : null;
  };

  // Función para convertir markdown a HTML (NUEVA)
  const markdownToHtml = (texto: string): string => {
    if (!texto) return texto;

    let html = texto;

    // 1. Procesar colores: <color=#hex>texto</color>
    html = html.replace(/<color=([^>]+)>(.*?)<\/color>/g, (match, color, content) => {
      return `<span style="color: ${color};">${content}</span>`;
    });

    // 2. Procesar negritas (**texto**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f0d9b5] font-bold">$1</strong>');

    // 3. Procesar enlaces: [texto](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#f0d9b5] hover:underline font-bold">$1</a>');

    return html;
  };

  // Vista previa en tiempo real (CORREGIDA)
  const renderPreview = () => {
    if (!content) return null;

    const lines = content.split('\n');
    const elementos: JSX.Element[] = [];

    lines.forEach((line, lineIndex) => {
      if (!line?.trim()) {
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

      // Detectar URLs de imágenes y videos
      const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?|(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+))/gi;
      
      // Si la línea es solo una URL
      if (line.match(urlRegex) && !line.replace(urlRegex, '').trim()) {
        const videoId = getYoutubeVideoId(line);
        
        if (videoId) {
          // Es un video de YouTube
          elementos.push(
            <div key={`video-${lineIndex}`} className="my-6">
              <div className="relative w-full aspect-video bg-[#0a0c0e] border-2 border-[#8b6f4c] rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Video de YouTube"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          );
        } else {
          // Es una imagen
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
        }
        return;
      }

      // Procesar líneas que mezclan texto y URLs
      const partes = line.split(urlRegex);
      const elementosLinea: JSX.Element[] = [];
      let textoAcumulado = '';

      partes.forEach((parte, idx) => {
        if (!parte || typeof parte !== 'string') return;
        
        if (parte.match(urlRegex)) {
          // Es una URL - si hay texto acumulado, lo procesamos primero
          if (textoAcumulado) {
            const htmlProcesado = markdownToHtml(textoAcumulado);
            elementosLinea.push(
              <p key={`p-${lineIndex}-${idx}`} className="mb-4 text-[#c4aa7d]">
                <span dangerouslySetInnerHTML={{ __html: htmlProcesado }} />
              </p>
            );
            textoAcumulado = '';
          }

          const videoId = getYoutubeVideoId(parte);
          if (videoId) {
            // Es un video de YouTube
            elementosLinea.push(
              <div key={`video-${lineIndex}-${idx}`} className="my-4">
                <div className="relative w-full aspect-video bg-[#0a0c0e] border border-[#8b6f4c] rounded overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Video de YouTube"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            );
          } else {
            // Es una imagen
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
          }
        } else {
          // Es texto - acumular
          textoAcumulado += parte;
        }
      });

      // Si quedó texto acumulado al final
      if (textoAcumulado) {
        const htmlProcesado = markdownToHtml(textoAcumulado);
        elementosLinea.push(
          <p key={`p-final-${lineIndex}`} className="mb-4 text-[#c4aa7d]">
            <span dangerouslySetInnerHTML={{ __html: htmlProcesado }} />
          </p>
        );
      }

      elementos.push(...elementosLinea);
    });

    return elementos;
  };

  return (
    <div className="space-y-4">
      {/* Barra de herramientas mejorada */}
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
          onClick={() => insertFormat('link')}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Insertar enlace"
        >
          🔗
        </button>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Insertar emoji"
        >
          😊
        </button>
        <button
          onClick={() => insertFormat('color')}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Color de texto"
        >
          🎨
        </button>
        <button
          onClick={() => setShowImageModal(true)}
          className="bg-[#2a2f33] border border-[#8b6f4c] px-3 py-1 text-xs text-[#c4aa7d] hover:border-[#f0d9b5] hover:text-[#f0d9b5] transition-colors"
          title="Insertar imagen"
        >
          🖼️
        </button>
        <span className="text-[#8b6f4c] text-xs ml-auto hidden sm:block">
          Usa # para títulos, **negrita**, [texto](url) para enlaces
        </span>
      </div>

      {/* Selector de emojis */}
      {showEmojiPicker && (
        <div className="mb-4 p-4 bg-[#1a1f23] border-2 border-[#8b6f4c] rounded max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => insertEmoji(emoji.emoji)}
                className="text-2xl hover:bg-[#2a2f33] p-2 rounded transition-colors"
                title={emoji.name}
              >
                {emoji.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

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
[texto del enlace](https://ejemplo.com)
<color=#ef4444>texto coloreado</color>

Ejemplos de imágenes y videos:
https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg
https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
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

      {/* Modal para insertar enlace */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#f0d9b5] mb-4">
              Insertar enlace
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2">Texto del enlace</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Ej: Haz clic aquí"
                  className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5]"
                />
              </div>
              
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2">URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={insertLink}
                  disabled={!linkUrl || !linkText}
                  className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors disabled:opacity-50"
                >
                  INSERTAR
                </button>
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkUrl('');
                    setLinkText('');
                  }}
                  className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar color */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#f0d9b5] mb-4">
              Seleccionar color
            </h3>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {colorPalette.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color.value)}
                  className={`p-3 rounded border-2 transition-all ${
                    selectedColor === color.value 
                      ? 'border-[#f0d9b5] scale-105' 
                      : 'border-[#8b6f4c]'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={insertColor}
                className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
              >
                APLICAR COLOR
              </button>
              <button
                onClick={() => setShowColorModal(false)}
                className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa mejorada */}
      {content && (
        <div className="mt-8 p-6 bg-[#1a1f23]/80 border-2 border-[#8b6f4c] rounded">
          <h4 className="text-[#f0d9b5] text-sm mb-4 border-b border-[#8b6f4c] pb-2 font-bold uppercase tracking-wider">
            VISTA PREVIA
          </h4>
          
          {/* Miniaturas de imágenes y videos */}
          {previewImages.length > 0 && (
            <div className="mb-6">
              <p className="text-[#8b6f4c] text-xs mb-2">📸 URLs detectadas:</p>
              <div className="flex flex-wrap gap-2">
                {previewImages.map((url, idx) => {
                  const videoId = getYoutubeVideoId(url);
                  return (
                    <div key={idx} className="relative w-20 h-20 border border-[#8b6f4c] rounded overflow-hidden bg-[#0a0c0e]">
                      {videoId ? (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-[#1a1f23]">
                          ▶️
                        </div>
                      ) : (
                        <Image
                          src={url}
                          alt={`Miniatura ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contenido renderizado */}
          <div className="prose prose-invert max-w-none">
            {renderPreview()}
          </div>
        </div>
      )}
    </div>
  );
}