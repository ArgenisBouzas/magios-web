// app/admin/tokens/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header_secundario from "../../components/layout/Header_secundario";
import Barra_navegacion from "../../components/layout/Barra_navegacion";
import Footer from "../../components/layout/Footer";

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
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [rangoUsuarioActual, setRangoUsuarioActual] = useState<string>("");
  const [usuarioIdActual, setUsuarioIdActual] = useState<number | null>(null);

  // Estados para filtros de tokens
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroCreador, setFiltroCreador] = useState<string>("");
  const [busquedaToken, setBusquedaToken] = useState<string>("");

  // Estados para filtros de usuarios
  const [busquedaUsuario, setBusquedaUsuario] = useState<string>("");
  const [filtroRangoUsuario, setFiltroRangoUsuario] = useState<string>("");

  // Estados para paginación de usuarios
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const usuariosPorPagina = 10;

  // Estados para paginación de tokens
  const [paginaTokens, setPaginaTokens] = useState(1);
  const tokensPorPagina = 10;

  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<UsuarioConPersonajes | null>(null);
  const [nuevoRango, setNuevoRango] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      // 1. Primero obtener el usuario actual
      const usuarioRes = await fetch("/api/auth/me");

      if (!usuarioRes.ok) {
        if (usuarioRes.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Error al obtener usuario");
      }

      const usuarioData = await usuarioRes.json();
      const rango = usuarioData.usuario.rango;
      const usuarioId = usuarioData.usuario.id;

      setRangoUsuarioActual(rango);
      setUsuarioIdActual(usuarioId);

      // 2. Cargar tokens (siempre)
      await cargarTokens();

      // 3. Si es General, cargar usuarios
      if (rango === "General") {
        await cargarUsuarios();
      }
    } catch (error: any) {
      console.error("Error en carga inicial:", error);
      setError(error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const cargarTokens = async () => {
    try {
      const tokensRes = await fetch("/api/admin/tokens");

      if (!tokensRes.ok) {
        if (tokensRes.status === 401) {
          router.push("/login");
          return;
        }
        if (tokensRes.status === 403) {
          router.push("/");
          return;
        }
        const errorData = await tokensRes.json();
        throw new Error(errorData.error || "Error al cargar tokens");
      }

      const tokensData = await tokensRes.json();
      setTokens(Array.isArray(tokensData) ? tokensData : []);
    } catch (error: any) {
      console.error("Error cargando tokens:", error);
      setError(error.message);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const usuariosRes = await fetch("/api/admin/usuarios");

      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json();
        setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
      } else {
        console.error("Error al cargar usuarios:", await usuariosRes.text());
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const generarTokens = async (cantidad: number) => {
    try {
      setError("");
      const res = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al generar tokens");
      }

      const nuevosTokens = await res.json();
      setTokens((prev) => [...nuevosTokens, ...prev]);
      setExito(`${cantidad} token(s) generado(s) correctamente`);
      setTimeout(() => setExito(""), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const cambiarRango = async () => {
    if (!usuarioSeleccionado || !nuevoRango) return;

    try {
      setError("");
      const res = await fetch("/api/admin/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuarioSeleccionado.id,
          nuevoRango,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al cambiar rango");
      }

      setExito(
        `Rango de ${usuarioSeleccionado.nombre_usuario} cambiado a ${nuevoRango}`,
      );
      setModalAbierto(false);

      await cargarUsuarios();

      setTimeout(() => setExito(""), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const eliminarUsuario = async (usuarioId: number, nombreUsuario: string) => {
    if (!confirm(`¿Estás SEGURO de que quieres eliminar a ${nombreUsuario}?`)) {
      return;
    }

    try {
      setError("");
      const res = await fetch(`/api/admin/usuarios?id=${usuarioId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar usuario");
      }

      setExito(`Usuario ${nombreUsuario} eliminado correctamente`);

      await cargarUsuarios();

      setTimeout(() => setExito(""), 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Filtrar tokens
  const tokensFiltrados = tokens.filter((token) => {
    if (filtroEstado && filtroEstado !== "todos") {
      if (filtroEstado === "disponibles" && token.usado) return false;
      if (filtroEstado === "usados" && !token.usado) return false;
    }
    if (filtroCreador && filtroCreador !== "todos") {
      if (token.creador_nombre !== filtroCreador) return false;
    }
    if (busquedaToken) {
      if (!token.token.toLowerCase().includes(busquedaToken.toLowerCase()))
        return false;
    }
    return true;
  });

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter((usuario) => {
    // Filtro por búsqueda de nombre
    if (
      busquedaUsuario &&
      !usuario.nombre_usuario
        .toLowerCase()
        .includes(busquedaUsuario.toLowerCase())
    ) {
      return false;
    }
    // Filtro por rango
    if (filtroRangoUsuario && usuario.rango !== filtroRangoUsuario) {
      return false;
    }
    return true;
  });

  // Paginación de usuarios
  const totalPaginasUsuarios = Math.ceil(
    usuariosFiltrados.length / usuariosPorPagina,
  );
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaUsuarios - 1) * usuariosPorPagina,
    paginaUsuarios * usuariosPorPagina,
  );

  // Paginación de tokens
  const totalPaginasTokens = Math.ceil(
    tokensFiltrados.length / tokensPorPagina,
  );
  const tokensPaginados = tokensFiltrados.slice(
    (paginaTokens - 1) * tokensPorPagina,
    paginaTokens * tokensPorPagina,
  );

  const creadoresUnicos = [
    ...new Set(tokens.map((t) => t.creador_nombre).filter(Boolean)),
  ];
  const rangosUnicos = [...new Set(usuarios.map((u) => u.rango))].sort();

  // Componente de paginación reutilizable
  const Paginacion = ({
    paginaActual,
    totalPaginas,
    setPagina,
  }: {
    paginaActual: number;
    totalPaginas: number;
    setPagina: (page: number) => void;
  }) => {
    if (totalPaginas <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-4">
        <button
          onClick={() => setPagina(Math.max(1, paginaActual - 1))}
          disabled={paginaActual === 1}
          className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>

        {[...Array(totalPaginas)].map((_, i) => {
          const pagina = i + 1;
          if (
            pagina === 1 ||
            pagina === totalPaginas ||
            (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)
          ) {
            return (
              <button
                key={pagina}
                onClick={() => setPagina(pagina)}
                className={`w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#8b6f4c] transition-colors text-xs sm:text-sm ${
                  paginaActual === pagina
                    ? "bg-[#8b6f4c] text-[#0a0c0e] font-bold"
                    : "text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] backdrop-blur-sm"
                }`}
              >
                {pagina}
              </button>
            );
          } else if (
            pagina === paginaActual - 2 ||
            pagina === paginaActual + 2
          ) {
            return (
              <span key={pagina} className="text-[#8b6f4c] text-xs sm:text-sm">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          onClick={() => setPagina(Math.min(totalPaginas, paginaActual + 1))}
          disabled={paginaActual === totalPaginas}
          className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#8b6f4c] text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-colors text-xs sm:text-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/portal-oscuro.png"
            alt="Portal Oscuro"
            fill
            className="object-cover -z-10"
            priority
          />
          <Image
            src="/magios.gif"
            alt="Portal Oscuro"
            fill
            className="object-cover -z-11"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-[#c4aa7d] text-xl">
            Cargando panel de administración...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo del Portal Oscuro */}
      <div className="absolute inset-0">
        <Image
          src="/portal-oscuro.png"
          alt="Portal Oscuro"
          fill
          className="object-cover -z-10"
          priority
        />
        <Image
          src="/magios.gif"
          alt="Portal Oscuro"
          fill
          className="object-cover -z-11"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#00ffff] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ff00ff] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen text-[#c4aa7d]">
        <Header_secundario />
        <Barra_navegacion />

        <main className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-12">
          {/* Header con título y rango */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f0d9b5] font-permanent">
                Panel de Administración
              </h1>
              <p className="text-[#8b6f4c] text-xs sm:text-sm md:text-base mt-1">
                Gestiona tokens y usuarios de la hermandad
              </p>
            </div>
            <span
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold w-fit ${
                rangoUsuarioActual === "General"
                  ? "bg-purple-900 text-purple-200 border border-purple-700"
                  : "bg-blue-900 text-blue-200 border border-blue-700"
              }`}
            >
              {rangoUsuarioActual}
            </span>
          </div>
          {/* Mensajes de error/éxito */}
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-900/50 border border-red-700 text-red-200 text-sm sm:text-base rounded">
              {error}
            </div>
          )}
          {exito && (
            <div className="mb-6 p-3 sm:p-4 bg-green-900/50 border border-green-700 text-green-200 text-sm sm:text-base rounded">
              {exito}
            </div>
          )}
          {/* Sección de Usuarios (solo para Generales) */}
          {rangoUsuarioActual === "General" && (
            <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 sm:p-5 md:p-6 mb-8 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-[#f0d9b5] mb-4 font-permanent border-b-2 border-[#8b6f4c] pb-2">
                👥 Gestión de Usuarios ({usuariosFiltrados.length} usuarios)
              </h2>

              {/* Filtros de usuarios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[#c4aa7d] text-xs mb-1">
                    Buscar por nombre
                  </label>
                  <input
                    type="text"
                    value={busquedaUsuario}
                    onChange={(e) => {
                      setBusquedaUsuario(e.target.value);
                      setPaginaUsuarios(1);
                    }}
                    placeholder="Ej: admin..."
                    className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#c4aa7d] text-xs mb-1">
                    Filtrar por rango
                  </label>
                  <select
                    value={filtroRangoUsuario}
                    onChange={(e) => {
                      setFiltroRangoUsuario(e.target.value);
                      setPaginaUsuarios(1);
                    }}
                    className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-3 py-2 text-sm"
                  >
                    <option value="">Todos los rangos</option>
                    {rangosUnicos.map((rango) => (
                      <option key={rango} value={rango}>
                        {rango}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {usuariosFiltrados.length === 0 ? (
                <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-6 sm:p-8 text-center">
                  <p className="text-[#8b6f4c]">
                    No se encontraron usuarios con esos filtros.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-[#2a2f33] border-b-2 border-[#8b6f4c]">
                        <tr>
                          <th className="p-2 sm:p-3 text-left uppercase tracking-wider">
                            Usuario
                          </th>
                          <th className="p-2 sm:p-3 text-left uppercase tracking-wider hidden md:table-cell">
                            Email
                          </th>
                          <th className="p-2 sm:p-3 text-left uppercase tracking-wider">
                            Rango
                          </th>
                          <th className="p-2 sm:p-3 text-center uppercase tracking-wider hidden sm:table-cell">
                            Pjs
                          </th>
                          <th className="p-2 sm:p-3 text-left uppercase tracking-wider hidden lg:table-cell">
                            Registro
                          </th>
                          <th className="p-2 sm:p-3 text-center uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuariosPaginados.map((usuario) => (
                          <tr
                            key={usuario.id}
                            className="border-b border-[#8b6f4c] hover:bg-[#2a2f33] transition-colors"
                          >
                            <td className="p-2 sm:p-3 font-bold text-[#f0d9b5]">
                              {usuario.nombre_usuario}
                            </td>
                            <td className="p-2 sm:p-3 text-xs hidden md:table-cell">
                              {usuario.email}
                            </td>
                            <td className="p-2 sm:p-3">
                              <span
                                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs whitespace-nowrap ${
                                  usuario.rango === "General"
                                    ? "bg-purple-900 text-purple-200 border border-purple-700"
                                    : usuario.rango === "Oficial"
                                      ? "bg-blue-900 text-blue-200 border border-blue-700"
                                      : "bg-green-900 text-green-200 border border-green-700"
                                }`}
                              >
                                {usuario.rango}
                              </span>
                            </td>
                            <td className="p-2 sm:p-3 text-center hidden sm:table-cell">
                              {usuario.total_personajes}
                            </td>
                            <td className="p-2 sm:p-3 text-[10px] hidden lg:table-cell">
                              {new Date(
                                usuario.fecha_registro,
                              ).toLocaleDateString()}
                            </td>
                            <td className="p-2 sm:p-3">
                              <div className="flex gap-1 sm:gap-2 justify-center">
                                {usuario.id !== usuarioIdActual && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setUsuarioSeleccionado(usuario);
                                        setNuevoRango(usuario.rango);
                                        setModalAbierto(true);
                                      }}
                                      className="bg-blue-600/80 hover:bg-blue-700 px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs text-white rounded transition-colors"
                                      title="Cambiar rango"
                                    >
                                      ⚡
                                    </button>
                                    <button
                                      onClick={() =>
                                        eliminarUsuario(
                                          usuario.id,
                                          usuario.nombre_usuario,
                                        )
                                      }
                                      className="bg-red-600/80 hover:bg-red-700 px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs text-white rounded transition-colors"
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

                  {/* Paginación de usuarios */}
                  <Paginacion
                    paginaActual={paginaUsuarios}
                    totalPaginas={totalPaginasUsuarios}
                    setPagina={setPaginaUsuarios}
                  />

                  <p className="text-[#8b6f4c] text-xs mt-2 text-center">
                    Mostrando {usuariosPaginados.length} de{" "}
                    {usuariosFiltrados.length} usuarios
                  </p>
                </>
              )}
            </div>
          )}
          {/* Sección de Tokens (visible para todos los admins) */}
         
          {/* Sección de Tokens (visible para todos los admins) */}
          <div className="bg-[#1a1f23]/80 border-2 border-[#8b6f4c] p-4 sm:p-5 md:p-6 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0d9b5] mb-4 font-permanent border-b-2 border-[#8b6f4c] pb-2">
              🔑 Tokens de Invitación ({tokensFiltrados.length} tokens)
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
              <button
                onClick={() => generarTokens(1)}
                className="bg-[#8b6f4c] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5]"
              >
                +1 Token
              </button>
              <button
                onClick={() => generarTokens(5)}
                className="bg-[#8b6f4c] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5]"
              >
                +5 Tokens
              </button>
            </div>

            {/* Filtros de tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div>
                <label className="block text-[#c4aa7d] text-xs mb-1">
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => {
                    setFiltroEstado(e.target.value);
                    setPaginaTokens(1);
                  }}
                  className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 py-1.5 text-xs"
                >
                  <option value="todos">Todos</option>
                  <option value="disponibles">Disponibles</option>
                  <option value="usados">Usados</option>
                </select>
              </div>
              <div>
                <label className="block text-[#c4aa7d] text-xs mb-1">
                  Creador
                </label>
                <select
                  value={filtroCreador}
                  onChange={(e) => {
                    setFiltroCreador(e.target.value);
                    setPaginaTokens(1);
                  }}
                  className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 py-1.5 text-xs"
                >
                  <option value="todos">Todos</option>
                  {creadoresUnicos.map((creador) => (
                    <option key={creador} value={creador}>
                      {creador}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#c4aa7d] text-xs mb-1">
                  Buscar token
                </label>
                <input
                  type="text"
                  value={busquedaToken}
                  onChange={(e) => {
                    setBusquedaToken(e.target.value);
                    setPaginaTokens(1);
                  }}
                  placeholder="Ej: MAGIOS-..."
                  className="w-full bg-[#0a0c0e] border border-[#8b6f4c] text-[#c4aa7d] px-2 py-1.5 text-xs placeholder-[#4a3a28]"
                />
              </div>
            </div>

            {tokensFiltrados.length === 0 ? (
              <div className="bg-[#0a0c0e] border border-[#8b6f4c] p-6 text-center">
                <p className="text-[#8b6f4c] text-sm">
                  No hay tokens con esos filtros.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-[#2a2f33] border-b-2 border-[#8b6f4c]">
                      <tr>
                        <th className="p-2 text-left">Token</th>
                        <th className="p-2 text-left">Estado</th>
                        <th className="p-2 text-left hidden sm:table-cell">
                          Creador
                        </th>
                        <th className="p-2 text-left hidden md:table-cell">
                          Creado
                        </th>
                        <th className="p-2 text-left hidden lg:table-cell">
                          Expira
                        </th>
                        <th className="p-2 text-left hidden xl:table-cell">
                          Usado por
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokensPaginados.map((token) => (
                        <tr
                          key={token.id}
                          className="border-b border-[#8b6f4c] hover:bg-[#2a2f33] transition-colors"
                        >
                          <td className="p-2 font-mono text-xs sm:text-sm break-all max-w-[200px] sm:max-w-[300px]">
                            {token.token}
                          </td>
                          <td className="p-2">
                            <span
                              className={`px-1.5 py-0.5 text-[8px] sm:text-xs whitespace-nowrap ${
                                token.usado
                                  ? "bg-red-900/80 text-red-200 border border-red-700"
                                  : "bg-green-900/80 text-green-200 border border-green-700"
                              }`}
                            >
                              {token.usado ? "Usado" : "Disponible"}
                            </span>
                          </td>
                          <td className="p-2 text-xs hidden sm:table-cell">
                            {token.creador_nombre || "Sistema"}
                          </td>
                          <td className="p-2 text-xs hidden md:table-cell whitespace-nowrap">
                            {new Date(
                              token.fecha_creacion,
                            ).toLocaleDateString()}
                          </td>
                          <td className="p-2 text-xs hidden lg:table-cell whitespace-nowrap">
                            {token.fecha_expiracion
                              ? new Date(
                                  token.fecha_expiracion,
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="p-2 text-xs hidden xl:table-cell">
                            {token.nombre_usuario || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación de tokens */}
                <Paginacion
                  paginaActual={paginaTokens}
                  totalPaginas={totalPaginasTokens}
                  setPagina={setPaginaTokens}
                />

                <p className="text-[#8b6f4c] text-xs mt-2 text-center">
                  Mostrando {tokensPaginados.length} de {tokensFiltrados.length}{" "}
                  tokens
                </p>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Modal para cambiar rango */}
      {modalAbierto && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f23] border-4 border-[#8b6f4c] p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold text-[#f0d9b5] mb-4">
              Cambiar rango de {usuarioSeleccionado.nombre_usuario}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#c4aa7d] text-xs sm:text-sm mb-2">
                  Nuevo rango
                </label>
                <select
                  value={nuevoRango}
                  onChange={(e) => setNuevoRango(e.target.value)}
                  className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] p-2 sm:p-3 text-sm sm:text-base text-[#f0d9b5]"
                >
                  <option value="General">General</option>
                  <option value="Oficial">Oficial</option>
                  <option value="Miembro">Miembro</option>
                  <option value="Aspirante">Aspirante</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={cambiarRango}
                  className="flex-1 bg-[#8b6f4c] py-2 sm:py-3 text-xs sm:text-sm text-[#0a0c0e] font-bold hover:bg-[#c4aa7d]"
                >
                  GUARDAR
                </button>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 border-2 border-[#8b6f4c] py-2 sm:py-3 text-xs sm:text-sm text-[#c4aa7d] hover:bg-[#2a2f33]"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Efectos de borde del portal */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}
