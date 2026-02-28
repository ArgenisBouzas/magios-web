// app/admin/tokens/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TokenInvitacion {
  id: number;
  token: string;
  email_destino: string | null;
  usado: boolean;
  usado_por: number | null;
  fecha_creacion: string;
  fecha_expiracion: string | null;
  nombre_usuario?: string;
  creado_por: number;
  creador_nombre?: string;
}

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rango: string;
  fecha_registro: string;
  ultimo_acceso: string | null;
  activo: boolean;
}

interface UsuarioConPersonajes extends Usuario {
  total_personajes: number;
}

export default function AdminTokensPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenInvitacion[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioConPersonajes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [rangoUsuarioActual, setRangoUsuarioActual] = useState<string>('');
  const [usuarioIdActual, setUsuarioIdActual] = useState<number | null>(null);

  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroCreador, setFiltroCreador] = useState<string>('');
  const [busquedaToken, setBusquedaToken] = useState<string>('');

  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioConPersonajes | null>(null);
  const [nuevoRango, setNuevoRango] = useState('');

  // Cargar datos
  useEffect(() => {
    fetchDatos();
    fetchUsuarioActual();
  }, []);

  const fetchUsuarioActual = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setRangoUsuarioActual(data.usuario.rango);
        setUsuarioIdActual(data.usuario.id);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    }
  };

  const fetchDatos = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Obtener tokens con creadores
      const tokensRes = await fetch('/api/admin/tokens');
      
      if (!tokensRes.ok) {
        if (tokensRes.status === 401) {
          router.push('/login');
          return;
        }
        if (tokensRes.status === 403) {
          router.push('/');
          return;
        }
        const errorData = await tokensRes.json();
        throw new Error(errorData.error || 'Error al cargar tokens');
      }
      
      const tokensData = await tokensRes.json();
      
      // Asegurarse de que tokensData es un array
      if (Array.isArray(tokensData)) {
        setTokens(tokensData);
      } else {
        console.error('La API de tokens no devolvió un array:', tokensData);
        setTokens([]);
        setError('Error en el formato de datos recibido');
      }

      // Obtener todos los usuarios (solo para Generales)
      if (rangoUsuarioActual === 'General') {
        const usuariosRes = await fetch('/api/admin/usuarios');
        if (usuariosRes.ok) {
          const usuariosData = await usuariosRes.json();
          if (Array.isArray(usuariosData)) {
            setUsuarios(usuariosData);
          } else {
            setUsuarios([]);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Error al cargar los datos');
      setTokens([]);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const generarTokens = async (cantidad: number) => {
    try {
      setError('');
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad })
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const error = await res.json();
        throw new Error(error.error || 'Error al generar tokens');
      }

      const nuevosTokens = await res.json();
      
      if (Array.isArray(nuevosTokens)) {
        setTokens([...nuevosTokens, ...tokens]);
        setExito(`${cantidad} token(s) generado(s) correctamente`);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
      
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const cambiarRango = async () => {
    if (!usuarioSeleccionado || !nuevoRango) return;

    try {
      setError('');
      const res = await fetch('/api/admin/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuarioSeleccionado.id,
          nuevoRango
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al cambiar rango');
      }

      setExito(`Rango de ${usuarioSeleccionado.nombre_usuario} cambiado a ${nuevoRango}`);
      setModalAbierto(false);
      fetchDatos(); // Recargar datos
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const eliminarUsuario = async (usuarioId: number, nombreUsuario: string) => {
    if (!confirm(`¿Estás SEGURO de que quieres eliminar a ${nombreUsuario}?`)) {
      return;
    }

    try {
      setError('');
      const res = await fetch(`/api/admin/usuarios?id=${usuarioId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al eliminar usuario');
      }

      setExito(`Usuario ${nombreUsuario} eliminado correctamente`);
      fetchDatos(); // Recargar datos
      setTimeout(() => setExito(''), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filtrar tokens (solo si tokens es un array)
  const tokensFiltrados = Array.isArray(tokens) 
    ? tokens.filter(token => {
        // Filtro por estado
        if (filtroEstado && filtroEstado !== 'todos') {
          if (filtroEstado === 'disponibles' && token.usado) return false;
          if (filtroEstado === 'usados' && !token.usado) return false;
        }

        // Filtro por creador
        if (filtroCreador && filtroCreador !== 'todos') {
          if (token.creador_nombre !== filtroCreador) return false;
        }

        // Búsqueda por token
        if (busquedaToken) {
          if (!token.token.toLowerCase().includes(busquedaToken.toLowerCase())) return false;
        }

        return true;
      })
    : [];

  // Obtener lista única de creadores para el filtro
  const creadoresUnicos = Array.isArray(tokens)
    ? [...new Set(tokens.map(t => t.creador_nombre).filter(Boolean))]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c0e] text-[#c4aa7d] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#f0d9b5] font-permanent">
            Panel de Administración
          </h1>
          <span className={`px-4 py-2 text-sm font-bold ${
            rangoUsuarioActual === 'General' 
              ? 'bg-purple-900 text-purple-200 border border-purple-700' 
              : 'bg-blue-900 text-blue-200 border border-blue-700'
          }`}>
            {rangoUsuarioActual}
          </span>
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

        {/* Sección de Tokens (visible para todos los admins) */}
        <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-[#f0d9b5] mb-4 font-permanent">
            Tokens de Invitación
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => generarTokens(1)}
              className="bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
            >
              Generar 1 Token
            </button>
            <button
              onClick={() => generarTokens(5)}
              className="bg-[#8b6f4c] px-4 py-2 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors"
            >
              Generar 5 Tokens
            </button>
          </div>

          {/* Filtros para tokens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[#c4aa7d] text-xs mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="disponibles">Disponibles</option>
                <option value="usados">Usados</option>
              </select>
            </div>

            <div>
              <label className="block text-[#c4aa7d] text-xs mb-1">Creador</label>
              <select
                value={filtroCreador}
                onChange={(e) => setFiltroCreador(e.target.value)}
                className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
              >
                <option value="todos">Todos los creadores</option>
                {creadoresUnicos.map(creador => (
                  <option key={creador} value={creador}>{creador}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#c4aa7d] text-xs mb-1">Buscar token</label>
              <input
                type="text"
                value={busquedaToken}
                onChange={(e) => setBusquedaToken(e.target.value)}
                placeholder="Ej: MAGIOS-..."
                className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
              />
            </div>
          </div>

          {!Array.isArray(tokens) || tokens.length === 0 ? (
            <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-8 text-center">
              <p className="text-[#8b6f4c]">No hay tokens generados aún.</p>
            </div>
          ) : (
            <>
              <p className="text-[#8b6f4c] text-sm mb-2">
                Mostrando {tokensFiltrados.length} de {tokens.length} tokens
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2a2f33] border-b-2 border-[#8b6f4c]">
                    <tr>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Token</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Estado</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Creado por</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Creado</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Expira</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Usado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokensFiltrados.map((token) => (
                      <tr key={token.id} className="border-b border-[#8b6f4c] hover:bg-[#2a2f33] transition-colors">
                        <td className="p-3 font-mono text-sm">{token.token}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs ${
                            token.usado 
                              ? 'bg-red-900/80 text-red-200 border border-red-700' 
                              : 'bg-green-900/80 text-green-200 border border-green-700'
                          }`}>
                            {token.usado ? 'Usado' : 'Disponible'}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{token.creador_nombre || 'Sistema'}</td>
                        <td className="p-3 text-sm">
                          {new Date(token.fecha_creacion).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm">
                          {token.fecha_expiracion 
                            ? new Date(token.fecha_expiracion).toLocaleDateString()
                            : 'Sin expiración'}
                        </td>
                        <td className="p-3 text-sm">
                          {token.nombre_usuario || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Sección de Usuarios (SOLO para Generales) */}
        {rangoUsuarioActual === 'General' && (
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-[#f0d9b5] mb-4 font-permanent">
              Gestión de Usuarios
            </h2>

            {!Array.isArray(usuarios) || usuarios.length === 0 ? (
              <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-8 text-center">
                <p className="text-[#8b6f4c]">No hay usuarios registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2a2f33] border-b-2 border-[#8b6f4c]">
                    <tr>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Usuario</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Email</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Rango</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Personajes</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Registro</th>
                      <th className="p-3 text-left text-xs uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="border-b border-[#8b6f4c] hover:bg-[#2a2f33] transition-colors">
                        <td className="p-3 font-bold text-[#f0d9b5]">{usuario.nombre_usuario}</td>
                        <td className="p-3 text-sm">{usuario.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs ${
                            usuario.rango === 'General' 
                              ? 'bg-purple-900 text-purple-200 border border-purple-700'
                              : usuario.rango === 'Oficial'
                                ? 'bg-blue-900 text-blue-200 border border-blue-700'
                                : 'bg-green-900 text-green-200 border border-green-700'
                          }`}>
                            {usuario.rango}
                          </span>
                        </td>
                        <td className="p-3 text-center">{usuario.total_personajes}</td>
                        <td className="p-3 text-sm">
                          {new Date(usuario.fecha_registro).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {/* Botón cambiar rango (solo si no es el mismo usuario) */}
                            {usuario.id !== usuarioIdActual && (
                              <>
                                <button
                                  onClick={() => {
                                    setUsuarioSeleccionado(usuario);
                                    setNuevoRango(usuario.rango);
                                    setModalAbierto(true);
                                  }}
                                  className="bg-blue-600 px-2 py-1 text-xs text-white rounded hover:bg-blue-700"
                                  title="Cambiar rango"
                                >
                                  ⚡
                                </button>
                                
                                {/* Botón eliminar (solo Generales) */}
                                <button
                                  onClick={() => eliminarUsuario(usuario.id, usuario.nombre_usuario)}
                                  className="bg-red-600 px-2 py-1 text-xs text-white rounded hover:bg-red-700"
                                  title="Eliminar usuario"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal para cambiar rango */}
        {modalAbierto && usuarioSeleccionado && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-[#f0d9b5] mb-4">
                Cambiar rango de {usuarioSeleccionado.nombre_usuario}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#c4aa7d] text-sm mb-2">Nuevo rango</label>
                  <select
                    value={nuevoRango}
                    onChange={(e) => setNuevoRango(e.target.value)}
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-3 text-[#f0d9b5]"
                  >
                    <option value="General">General</option>
                    <option value="Oficial">Oficial</option>
                    <option value="Miembro">Miembro</option>
                    <option value="Aspirante">Aspirante</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={cambiarRango}
                    className="flex-1 bg-[#8b6f4c] py-3 text-[#0a0c0e] font-bold hover:bg-[#c4aa7d]"
                  >
                    GUARDAR
                  </button>
                  <button
                    onClick={() => setModalAbierto(false)}
                    className="flex-1 border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#2a2f33]"
                  >
                    CANCELAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}