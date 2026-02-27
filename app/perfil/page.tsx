// app/perfil/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header_secundario from '../components/layout/Header_secundario';
import Barra_navegacion from '../components/layout/Barra_navegacion';
import Footer from '../components/layout/Footer';

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rango: string;
  fecha_registro: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Estado para el formulario de edición
  const [formData, setFormData] = useState({
    email: '',
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: ''
  });

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar perfil');
      }
      const data = await res.json();
      setUsuario(data.usuario);
      setFormData(prev => ({ ...prev, email: data.usuario.email }));
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones
    if (formData.nueva_contrasena) {
      if (formData.nueva_contrasena.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (formData.nueva_contrasena !== formData.confirmar_contrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (!formData.contrasena_actual) {
        setError('Debes ingresar tu contraseña actual para cambiarla');
        return;
      }
    }

    try {
      const res = await fetch('/api/auth/actualizar-perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          contrasena_actual: formData.contrasena_actual || undefined,
          nueva_contrasena: formData.nueva_contrasena || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      setExito('¡Perfil actualizado correctamente!');
      setEditando(false);
      setFormData({
        email: data.usuario.email,
        contrasena_actual: '',
        nueva_contrasena: '',
        confirmar_contrasena: ''
      });
      
      // Actualizar datos del usuario
      setUsuario(data.usuario);

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
    }
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
          <p className="text-[#c4aa7d] text-xl">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null; // Redirigido por el fetch
  }

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
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent mb-2">
              MI PERFIL
            </h1>
            <p className="text-[#8b6f4c] text-sm md:text-base">
              Gestiona tu información personal
            </p>
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

          {/* Tarjeta de perfil */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 md:p-8 backdrop-blur-sm">
            {!editando ? (
              // MODO VISUALIZACIÓN
              <div>
                {/* Avatar/Icono */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#8b6f4c] to-[#4a3a28] rounded-full border-4 border-[#c4aa7d] flex items-center justify-center">
                    <span className="text-4xl md:text-5xl drop-shadow-lg">⚔️</span>
                  </div>
                </div>

                {/* Información del usuario */}
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-4">
                    <p className="text-[#8b6f4c] text-xs uppercase tracking-wider mb-1">
                      Nombre de usuario
                    </p>
                    <p className="text-[#f0d9b5] text-lg font-bold font-permanent">
                      {usuario.nombre_usuario}
                    </p>
                  </div>

                  <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-4">
                    <p className="text-[#8b6f4c] text-xs uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-[#f0d9b5] text-base break-all">
                      {usuario.email}
                    </p>
                  </div>

                  <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-4">
                    <p className="text-[#8b6f4c] text-xs uppercase tracking-wider mb-1">
                      Rango en la hermandad
                    </p>
                    <span className={`inline-block px-3 py-1 text-sm font-bold ${
                      usuario.rango === 'General' ? 'bg-purple-900 text-purple-200 border border-purple-700' :
                      usuario.rango === 'Oficial' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                      'bg-green-900 text-green-200 border border-green-700'
                    }`}>
                      {usuario.rango}
                    </span>
                  </div>

                  <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-4">
                    <p className="text-[#8b6f4c] text-xs uppercase tracking-wider mb-1">
                      Miembro desde
                    </p>
                    <p className="text-[#f0d9b5] text-sm">
                      {new Date(usuario.fecha_registro).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={() => setEditando(true)}
                    className="bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5]"
                  >
                    EDITAR PERFIL
                  </button>
                  <Link
                    href="/dashboard"
                    className="border-2 border-[#8b6f4c] px-6 py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
                  >
                    VOLVER
                  </Link>
                </div>
              </div>
            ) : (
              // MODO EDICIÓN
              <div>
                <h2 className="text-2xl font-bold text-[#f0d9b5] mb-6 text-center font-permanent">
                  EDITAR PERFIL
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                  {/* Email (editable) */}
                  <div>
                    <label className="block text-[#c4aa7d] text-sm mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                      required
                    />
                  </div>

                  {/* Separador para cambio de contraseña */}
                  <div className="border-t border-[#8b6f4c] pt-4">
                    <h3 className="text-lg font-bold text-[#f0d9b5] mb-4">
                      CAMBIAR CONTRASEÑA
                    </h3>
                    <p className="text-[#8b6f4c] text-xs mb-4">
                      Deja estos campos en blanco si no quieres cambiar tu contraseña
                    </p>
                  </div>

                  {/* Contraseña actual (solo para verificar) */}
                  <div>
                    <label className="block text-[#c4aa7d] text-sm mb-2 uppercase tracking-wider">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={formData.contrasena_actual}
                      onChange={(e) => setFormData({...formData, contrasena_actual: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-[#c4aa7d] text-sm mb-2 uppercase tracking-wider">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.nueva_contrasena}
                      onChange={(e) => setFormData({...formData, nueva_contrasena: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  {/* Confirmar nueva contraseña */}
                  <div>
                    <label className="block text-[#c4aa7d] text-sm mb-2 uppercase tracking-wider">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.confirmar_contrasena}
                      onChange={(e) => setFormData({...formData, confirmar_contrasena: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5] focus:outline-none focus:border-[#f0d9b5]"
                      placeholder="Repite la contraseña"
                    />
                  </div>

                  {/* Información no editable (solo lectura) */}
                  <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-4 mt-6">
                    <p className="text-[#8b6f4c] text-xs mb-2">Información no editable</p>
                    <p className="text-[#c4aa7d] text-sm">
                      <span className="font-bold">Usuario:</span> {usuario.nombre_usuario}
                    </p>
                    <p className="text-[#c4aa7d] text-sm mt-1">
                      <span className="font-bold">Rango:</span> {usuario.rango}
                    </p>
                  </div>

                  {/* Botones del formulario */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#8b6f4c] px-6 py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
                    >
                      GUARDAR CAMBIOS
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(false);
                        setFormData({
                          email: usuario.email,
                          contrasena_actual: '',
                          nueva_contrasena: '',
                          confirmar_contrasena: ''
                        });
                        setError('');
                      }}
                      className="flex-1 border-2 border-[#8b6f4c] px-6 py-3 text-[#c4aa7d] hover:bg-[#2a2f33] transition-colors"
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              </div>
            )}
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