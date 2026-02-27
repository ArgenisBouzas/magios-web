'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contrasena: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Login exitoso - redirigir al inicio
      router.push('/');
      router.refresh(); // Para actualizar el estado del proxy
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Overlay con degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        
        {/* Partículas mágicas */}
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#00ffff] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ff00ff] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      {/* Contenido del login */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Marco estilo WoW - CORREGIDO: ahora tiene la clase completa */}
          <div className="">
            
            {/* Esquinas decorativas - responsive */}
            <div className="absolute top-0 left-0 w-4 md:w-8 h-4 md:h-8 border-t-2 border-l-2 border-[#c4aa7d]"></div>
            <div className="absolute top-0 right-0 w-4 md:w-8 h-4 md:h-8 border-t-2 border-r-2 border-[#c4aa7d]"></div>
            <div className="absolute bottom-0 left-0 w-4 md:w-8 h-4 md:h-8 border-b-2 border-l-2 border-[#c4aa7d]"></div>
            <div className="absolute bottom-0 right-0 w-4 md:w-8 h-4 md:h-8 border-b-2 border-r-2 border-[#c4aa7d]"></div>

            {/* Logo */}
            <div className="text-center mb-6 md:mb-8">
              <div className="flex justify-center mb-3">
                <Image
                  src="/magios.png"
                  alt="Magios Guild"
                  width={400}
                  height={200}
                  className="w-48 md:w-64 lg:w-80 h-auto object-contain mx-auto"
                  priority
                />
              </div>
              <p className="text-[#8b6f4c] text-xs md:text-sm mt-1 tracking-wider">✦ GUILD ✦</p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
                {error}
              </div>
            )}

            {/* Formulario de login - AHORA CON CONEXIÓN A LA API */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Campo de usuario */}
              <div>
                <label className="block text-[#c4aa7d] text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-wider">
                  Nombre de batalla
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c] text-sm md:text-base">⚔️</span>
                  <input
                    type="text"
                    value={formData.nombre_usuario}
                    onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-2 md:py-3 px-8 md:px-10 text-sm md:text-base text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                    placeholder="Ingresa tu nombre"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div>
                <label className="block text-[#c4aa7d] text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c] text-sm md:text-base">🛡️</span>
                  <input
                    type="password"
                    value={formData.contrasena}
                    onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-2 md:py-3 px-8 md:px-10 text-sm md:text-base text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Recordar y olvidé contraseña */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm">
                <label className="flex items-center space-x-2 text-[#8b6f4c]">
                  <input type="checkbox" className="w-3 h-3 md:w-4 md:h-4 accent-[#8b6f4c]" />
                  <span>Recordar</span>
                </label>
                <Link href="#" className="text-[#c4aa7d] hover:text-[#f0d9b5] transition-colors border-b border-transparent hover:border-[#c4aa7d]">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de acceso */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b6f4c] to-[#4a3a28] group-hover:from-[#c4aa7d] group-hover:to-[#8b6f4c] transition-all duration-500"></div>
                <div className="relative bg-[#1a1f23] m-[2px] py-3 md:py-4 group-hover:bg-transparent transition-all duration-500">
                  <span className="text-sm md:text-lg text-[#f0d9b5] font-bold uppercase tracking-wider group-hover:text-[#0a0c0e] transition-colors duration-500">
                    {loading ? "CRUZANDO..." : "CRUZAR EL PORTAL"}
                  </span>
                </div>
              </button>
            </form>

            {/* Separador */}
            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#8b6f4c]"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-4 bg-[#1a1f23] text-[#8b6f4c]">¿Nuevo en Magios?</span>
              </div>
            </div>

            {/* Botón de registro */}
            <Link
              href="/register"
              className="block text-center bg-transparent border-2 border-[#8b6f4c] py-2 md:py-3 text-sm md:text-base text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-all duration-300 uppercase tracking-wider font-bold"
            >
              Crear una cuenta
            </Link>

            {/* Texto del portal */}
            <p className="text-center text-[10px] md:text-xs text-[#4a3a28] mt-4 md:mt-6">
              "Magios se abre... ¿Estás listo para la aventura?"
            </p>
          </div>

          {/* Advertencia estilo WoW */}
          <div className="mt-3 md:mt-4 text-center text-[10px] md:text-xs text-[#8b6f4c]">
            <p>© 2026 Hermandad • Turtle Wow</p>
            <p className="mt-1">⚡ For the Horde! ⚡ For the Alliance! ⚡</p>
            <p>© 2026 - Argenis Bouzas</p>
          </div>
        </div>
      </div>

      {/* Efectos de borde del portal */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}