'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header_secundario from '@/app/components/layout/Header_secundario';
import Barra_navegacion from '@/app/components/layout/Barra_navegacion';
import Footer from '@/app/components/layout/Footer';

interface NoticiaPendiente {
  id: number;
  titulo: string;
  contenido: string;
  autor_nombre: string;
  autor_rango: string;
  fecha_creacion: string;
  categorias: Array<{ nombre: string }>;
}

export default function ModerarNoticiasPage() {
  const router = useRouter();
  const [pendientes, setPendientes] = useState<NoticiaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<number | null>(null);

  useEffect(() => {
    fetchPendientes();
  }, []);

  const fetchPendientes = async () => {
    try {
      const res = await fetch('/api/noticias?estado=pendiente');
      const data = await res.json();
      setPendientes(data.noticias || []);
    } catch (error) {
      console.error('Error al cargar pendientes:', error);
      setError('Error al cargar noticias pendientes');
    } finally {
      setLoading(false);
    }
  };

  const aprobarNoticia = async (id: number) => {
    try {
      const res = await fetch(`/api/noticias/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'publicado' })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al aprobar');
      }

      setExito('Noticia publicada exitosamente');
      setPendientes(pendientes.filter(n => n.id !== id));
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const rechazarNoticia = async (id: number) => {
    if (!motivoRechazo.trim()) {
      setError('Debes proporcionar un motivo de rechazo');
      return;
    }

    try {
      const res = await fetch(`/api/noticias/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estado: 'rechazado',
          motivo_rechazo: motivoRechazo
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al rechazar');
      }

      setExito('Noticia rechazada');
      setPendientes(pendientes.filter(n => n.id !== id));
      setNoticiaSeleccionada(null);
      setMotivoRechazo('');
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/portal-oscuro.png" alt="Portal Oscuro" fill className="object-cover -z-10" priority />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-[#c4aa7d]">Cargando panel de moderación...</p>
        </div>
      </div>
    );
  }

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

        <main className="max-w-6xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent mb-2">
            Moderar Noticias
          </h1>
          <p className="text-[#8b6f4c] mb-6">
            {pendientes.length} noticias pendientes de revisión
          </p>

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

          {pendientes.length === 0 ? (
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-12 text-center">
              <p className="text-[#8b6f4c] text-lg">No hay noticias pendientes de revisión</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendientes.map((noticia) => (
                <div key={noticia.id} className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#f0d9b5]">{noticia.titulo}</h3>
                      <p className="text-xs text-[#8b6f4c] mt-1">
                        Por {noticia.autor_nombre} ({noticia.autor_rango}) - {new Date(noticia.fecha_creacion).toLocaleString()}
                      </p>
                      <p className="text-sm text-[#c4aa7d] mt-2 line-clamp-2">
                        {noticia.contenido.substring(0, 200)}...
                      </p>
                      <div className="flex gap-2 mt-2">
                        {noticia.categorias.map((cat, idx) => (
                          <span key={idx} className="text-[8px] bg-[#2a2f33] px-2 py-1 border border-[#8b6f4c]">
                            {cat.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Link
                        href={`/noticias/${noticia.id}`}
                        className="text-center border border-[#8b6f4c] px-4 py-2 text-xs hover:bg-[#2a2f33]"
                      >
                        VER COMPLETO
                      </Link>
                      
                      {noticiaSeleccionada === noticia.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            placeholder="Motivo del rechazo..."
                            className="w-full bg-[#0a0c0e] border border-[#8b6f4c] p-2 text-xs text-[#f0d9b5]"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => rechazarNoticia(noticia.id)}
                              className="flex-1 bg-red-700 px-3 py-1 text-xs text-white hover:bg-red-600"
                            >
                              CONFIRMAR
                            </button>
                            <button
                              onClick={() => {
                                setNoticiaSeleccionada(null);
                                setMotivoRechazo('');
                              }}
                              className="flex-1 border border-[#8b6f4c] px-3 py-1 text-xs hover:bg-[#2a2f33]"
                            >
                              CANCELAR
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => aprobarNoticia(noticia.id)}
                            className="flex-1 bg-green-700 px-3 py-2 text-xs text-white hover:bg-green-600"
                          >
                            ✅ APROBAR
                          </button>
                          <button
                            onClick={() => setNoticiaSeleccionada(noticia.id)}
                            className="flex-1 bg-red-700 px-3 py-2 text-xs text-white hover:bg-red-600"
                          >
                            ❌ RECHAZAR
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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