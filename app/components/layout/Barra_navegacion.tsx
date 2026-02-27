// components/BarraNavegacion.tsx
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rango: string;
}

export default function BarraNavegacion() {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Obtener información del usuario al cargar
  useEffect(() => {
    fetchUsuario();
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsuario = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  };

  const cerrarSesion = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUsuario(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Elementos de navegación base
  const navItems = [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Miembros', ruta: '/miembros' },
    { nombre: 'Progreso', ruta: '/progreso' },
    { nombre: 'Noticias', ruta: '/noticias' },
  ];

  // Si el usuario está logueado, mostrar solo navItems + área de usuario
  // Si NO está logueado, mostrar navItems + "Unirte" + "Login"
  const itemsNavegacion = usuario 
    ? navItems 
    : [...navItems, { nombre: 'Unirte', ruta: '/register' }, { nombre: 'Login', ruta: '/login' }];

  return (
    <nav className="bg-[#1a1f23]/80 border-y-2 border-[#8b6f4c] py-1 sm:py-2 backdrop-blur-sm relative z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Menú de navegación principal - scroll horizontal controlado */}
          <div className="flex-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            <ul className="flex justify-start sm:justify-center space-x-2 sm:space-x-4 md:space-x-8 text-[#c4aa7d] min-w-max sm:min-w-0">
              {itemsNavegacion.map((item) => (
                <li key={item.nombre}>
                  <Link 
                    href={item.ruta}
                    className={`px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 hover:text-[#f0d9b5] hover:bg-[#2a2f33] transition-all duration-300 border-b-2 border-transparent hover:border-[#8b6f4c] uppercase tracking-wider text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap ${
                      pathname === item.ruta ? 'text-[#f0d9b5] border-b-2 border-[#8b6f4c]' : ''
                    }`}
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Área de usuario (solo si está logueado) */}
          {usuario && (
            <div className="relative flex items-center justify-end gap-2 border-t sm:border-t-0 border-[#8b6f4c] pt-2 sm:pt-0 mt-2 sm:mt-0" ref={menuRef}>
              {/* Dashboard button - siempre visible */}
              <Link
                href="/dashboard"
                className="bg-[#8b6f4c] px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] whitespace-nowrap"
              >
                DASHBOARD
              </Link>

              {/* Info del usuario - click para abrir menú */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-1 sm:gap-2 bg-[#2a2f33] px-2 sm:px-3 py-1 border border-[#8b6f4c] hover:border-[#f0d9b5] transition-colors"
              >
                <span className="text-[#c4aa7d] text-[10px] sm:text-xs">
                  {usuario.nombre_usuario}
                </span>
                <span className={`text-[#8b6f4c] text-[8px] sm:text-xs transition-transform ${menuAbierto ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Menú desplegable */}
              {menuAbierto && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1f23] border-2 border-[#8b6f4c] shadow-2xl z-50 backdrop-blur-sm">
                  {/* Info detallada del usuario */}
                  <div className="p-3 border-b border-[#8b6f4c]">
                    <p className="text-[#f0d9b5] font-bold text-xs truncate">
                      {usuario.nombre_usuario}
                    </p>
                    <p className="text-[#8b6f4c] text-[10px] truncate">
                      {usuario.email}
                    </p>
                    <p className="text-[#c4aa7d] text-[10px] mt-1">
                      Rango: <span className="font-bold">{usuario.rango}</span>
                    </p>
                  </div>

                  {/* Opciones del menú */}
                  <div className="py-1">
                    <Link
                      href="/perfil"
                      className="block px-3 py-2 text-xs text-[#c4aa7d] hover:bg-[#2a2f33] hover:text-[#f0d9b5] transition-colors"
                      onClick={() => setMenuAbierto(false)}
                    >
                      👤 Mi Perfil
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-xs text-[#c4aa7d] hover:bg-[#2a2f33] hover:text-[#f0d9b5] transition-colors"
                      onClick={() => setMenuAbierto(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/personajes"
                      className="block px-3 py-2 text-xs text-[#c4aa7d] hover:bg-[#2a2f33] hover:text-[#f0d9b5] transition-colors"
                      onClick={() => setMenuAbierto(false)}
                    >
                      ⚔️ Mis Personajes
                    </Link>
                    
                    {/* Separador */}
                    <div className="border-t border-[#8b6f4c] my-1"></div>
                    
                    {/* Panel de Admin (solo visible para admins) */}
                    {(usuario.rango === 'General' || usuario.rango === 'Oficial') && (
                      <Link
                        href="/admin/tokens"
                        className="block px-3 py-2 text-xs text-[#f0d9b5] hover:bg-[#2a2f33] transition-colors"
                        onClick={() => setMenuAbierto(false)}
                      >
                        🔑 Admin: Tokens
                      </Link>
                    )}

                    {/* Botón de cerrar sesión */}
                    <button
                      onClick={() => {
                        setMenuAbierto(false);
                        cerrarSesion();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}