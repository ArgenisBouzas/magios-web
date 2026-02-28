// app/noticias/editar/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header_secundario from '../../../components/layout/Header_secundario';
import Barra_navegacion from '../../../components/layout/Barra_navegacion';
import Footer from '../../../components/layout/Footer';
import EditorNoticia from '../../../components/noticias/EditorNoticia';
import SelectorCategorias from '../../../components/noticias/SelectorCategorias';

interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  color: string;
}

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  categorias: Categoria[];
  estado: string;
  autor_id: number;
}

export default function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [usuario, setUsuario] = useState<any>(null);
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [puedeEditar, setPuedeEditar] = useState(false);

  useEffect(() => {
    fetchUsuario();
    fetchCategorias();
    fetchNoticia();
  }, [id]);

  const fetchUsuario = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
      } else {
        router.push('/login');
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
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchNoticia = async () => {
    try {
      const res = await fetch(`/api/noticias/${id}`);
      if (!res.ok) {
        throw new Error('Error al cargar la noticia');
      }
      const data = await res.json();
      setNoticia(data);
      setTitulo(data.titulo);
      setContenido(data.contenido);
      setCategoriasSeleccionadas(data.categorias.map((c: Categoria) => c.id));

      // Verificar permisos después de tener los datos
      if (usuario) {
        const esAutor = usuario.id === data.autor_id;
        const esAdmin = usuario.rango === 'General' || usuario.rango === 'Oficial';
        const puedeEditarEstado = data.estado !== 'publicado' || esAdmin;
        setPuedeEditar((esAutor || esAdmin) && puedeEditarEstado);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar la noticia');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar permisos cuando tengamos usuario y noticia
  useEffect(() => {
    if (usuario && noticia) {
      const esAutor = usuario.id === noticia.autor_id;
      const esAdmin = usuario.rango === 'General' || usuario.rango === 'Oficial';
      const puedeEditarEstado = noticia.estado !== 'publicado' || esAdmin;
      setPuedeEditar((esAutor || esAdmin) && puedeEditarEstado);
    }
  }, [usuario, noticia]);

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!contenido.trim()) {
      setError('El contenido es requerido');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          contenido,
          categorias: categoriasSeleccionadas
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar noticia');
      }

      setExito('Noticia actualizada correctamente');
      
      setTimeout(() => {
        router.push(`/noticias/${id}`);
      }, 2000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-[#c4aa7d]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!puedeEditar) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-4">🚫</p>
            <p className="text-red-400">No tienes permiso para editar esta noticia</p>
            <Link 
              href={`/noticias/${id}`}
              className="inline-block mt-4 bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d]"
            >
              Volver a la noticia
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo */}
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
            <Link 
              href={`/noticias/${id}`}
              className="text-[#8b6f4c] hover:text-[#f0d9b5] transition-colors inline-flex items-center gap-2 mb-4"
            >
              ← Volver a la noticia
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent">
              Editar Noticia
            </h1>
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
                  className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:border-[#f0d9b5] outline-none"
                  disabled={saving}
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2">Contenido</label>
                <EditorNoticia
                  initialContent={contenido}
                  onChange={setContenido}
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
                  onClick={() => router.push(`/noticias/${id}`)}
                  className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
                  disabled={saving}
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] disabled:opacity-50"
                >
                  {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
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