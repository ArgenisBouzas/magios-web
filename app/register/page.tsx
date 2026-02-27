// app/register/page.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'token' | 'registro'>('token');
  const [token, setToken] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    contrasena: '',
    confirmar_contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Paso 1: Validar token
  const validarToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/validar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Token inválido');
      }

      setTokenId(data.token_id);
      setTokenValido(true);
      setStep('registro');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Registrar usuario
  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmar_contrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          token_id: tokenId,
          nombre_usuario: formData.nombre_usuario,
          email: formData.email,
          contrasena: formData.contrasena
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Registro exitoso - redirigir a login
      router.push('/login?registro=exitoso');
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        
        {/* Partículas mágicas */}
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#00ffff] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ff00ff] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      {/* Contenido del registro */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Marco estilo WoW */}
          <div className="">
            
            {/* Esquinas decorativas */}
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
                  width={300}
                  height={150}
                  className="w-40 md:w-48 lg:w-56 h-auto object-contain mx-auto"
                  priority
                />
              </div>
              <p className="text-[#8b6f4c] text-xs md:text-sm mt-1 tracking-wider">
                {step === 'token' ? '✦ VERIFICAR INVITACIÓN ✦' : '✦ CREAR CUENTA ✦'}
              </p>
            </div>

            {/* Indicador de paso */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${step === 'token' ? 'bg-[#f0d9b5]' : 'bg-[#8b6f4c]'}`}></div>
                <div className="w-8 h-0.5 bg-[#8b6f4c]"></div>
                <div className={`w-3 h-3 rounded-full ${step === 'registro' ? 'bg-[#f0d9b5]' : 'bg-[#8b6f4c]'}`}></div>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
                {error}
              </div>
            )}

            {/* Paso 1: Validar Token */}
            {step === 'token' && (
              <form onSubmit={validarToken} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-[#c4aa7d] text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-wider">
                    Token de Invitación
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c] text-sm md:text-base">🔑</span>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value.toUpperCase())}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-2 md:py-3 px-8 md:px-10 text-sm md:text-base text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                      placeholder="Ej: MAGIOS-ABC123"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[#8b6f4c] text-[10px] md:text-xs mt-2">
                    Ingresa el token que te proporcionó un oficial de la hermandad
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b6f4c] to-[#4a3a28] group-hover:from-[#c4aa7d] group-hover:to-[#8b6f4c] transition-all duration-500"></div>
                  <div className="relative bg-[#1a1f23] m-[2px] py-3 md:py-4 group-hover:bg-transparent transition-all duration-500">
                    <span className="text-sm md:text-lg text-[#f0d9b5] font-bold uppercase tracking-wider group-hover:text-[#0a0c0e] transition-colors duration-500">
                      {loading ? "VERIFICANDO..." : "VERIFICAR TOKEN"}
                    </span>
                  </div>
                </button>
              </form>
            )}

            {/* Paso 2: Registro de Usuario */}
            {step === 'registro' && (
              <form onSubmit={registrarUsuario} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-[#c4aa7d] text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-wider">
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c] text-sm md:text-base">⚔️</span>
                    <input
                      type="text"
                      value={formData.nombre_usuario}
                      onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-2 md:py-3 px-8 md:px-10 text-sm md:text-base text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                      placeholder="Elige tu nombre de batalla"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#c4aa7d] text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c] text-sm md:text-base">✉️</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-2 md:py-3 px-8 md:px-10 text-sm md:text-base text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                      placeholder="tu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

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
                      placeholder="Mínimo 6 caracteres"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#c4aa7d] text-xs md:text-sm mb-1 md:mb-2 uppercase tracking-wider">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c] text-sm md:text-base">🛡️</span>
                    <input
                      type="password"
                      value={formData.confirmar_contrasena}
                      onChange={(e) => setFormData({...formData, confirmar_contrasena: e.target.value})}
                      className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-2 md:py-3 px-8 md:px-10 text-sm md:text-base text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                      placeholder="Repite tu contraseña"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b6f4c] to-[#4a3a28] group-hover:from-[#c4aa7d] group-hover:to-[#8b6f4c] transition-all duration-500"></div>
                  <div className="relative bg-[#1a1f23] m-[2px] py-3 md:py-4 group-hover:bg-transparent transition-all duration-500">
                    <span className="text-sm md:text-lg text-[#f0d9b5] font-bold uppercase tracking-wider group-hover:text-[#0a0c0e] transition-colors duration-500">
                      {loading ? "REGISTRANDO..." : "CREAR CUENTA"}
                    </span>
                  </div>
                </button>
              </form>
            )}

            {/* Separador */}
            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#8b6f4c]"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-4 bg-[#1a1f23] text-[#8b6f4c]">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Enlace a login */}
            <Link
              href="/login"
              className="block text-center bg-transparent border-2 border-[#8b6f4c] py-2 md:py-3 text-sm md:text-base text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-all duration-300 uppercase tracking-wider font-bold"
            >
              INICIAR SESIÓN
            </Link>

            {/* Texto del portal */}
            <p className="text-center text-[10px] md:text-xs text-[#4a3a28] mt-4 md:mt-6">
              "Un nuevo aventurero se une a la hermandad"
            </p>
          </div>

          {/* Footer */}
          <div className="mt-3 md:mt-4 text-center text-[10px] md:text-xs text-[#8b6f4c]">
            <p>© 2026 Hermandad Magios • Turtle Wow</p>
            <p className="mt-1">⚡ For the Horde! ⚔️ For the Alliance! ⚡</p>
          </div>
        </div>
      </div>

      {/* Efectos de borde */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
}