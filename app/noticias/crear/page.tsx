'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header_secundario from '@/app/components/layout/Header_secundario';
import Barra_navegacion from '@/app/components/layout/Barra_navegacion';
import Footer from '@/app/components/layout/Footer';
import EditorNoticia from '@/app/components/noticias/EditorNoticia';
import SelectorCategorias from '@/app/components/noticias/SelectorCategorias';

interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  color: string;
}

export default function CrearNoticiaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch('/api/noticias/categorias');
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleSubmit = async (publicar: boolean) => {
    if (!titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!contenido.trim()) {
      setError('El contenido es requerido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          contenido,
          categorias: categoriasSeleccionadas
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear noticia');
      }

      setExito(
        data.estado === 'publicado' 
          ? '¡Noticia publicada exitosamente!' 
          : 'Noticia enviada para revisión. Será publicada tras aprobación.'
      );

      setTimeout(() => {
        router.push('/noticias');
      }, 2000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

        <main className="max-w-4xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent">
              Crear Noticia
            </h1>
            <p className="text-[#8b6f4c] text-sm mt-1">
              Comparte noticias con la hermandad
            </p>
          </div>

          {/* Mensajes */}
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

          {/* Formulario */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 sm:p-6 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2">Título</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: ¡Derrotamos a Ragnaros!"
                  className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:border-[#f0d9b5] outline-none"
                  disabled={loading}
                />
              </div>

              {/* Contenido con editor */}
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2">Contenido</label>
                <EditorNoticia
                  initialContent={contenido}
                  onChange={setContenido}
                  placeholder="Escribe tu noticia... Puedes insertar URLs de imágenes directamente"
                />
              </div>

              {/* Categorías */}
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2">Categorías (máx 3)</label>
                <SelectorCategorias
                  categorias={categorias}
                  seleccionadas={categoriasSeleccionadas}
                  onChange={setCategoriasSeleccionadas}
                  maxSeleccion={3}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex-1 bg-[#2a2f33] border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] font-bold hover:bg-[#3a3f43] transition-colors disabled:opacity-50"
                >
                  GUARDAR BORRADOR
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] disabled:opacity-50"
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR A REVISIÓN'}
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Efectos de borde */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}