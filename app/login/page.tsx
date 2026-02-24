import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo del Portal Oscuro */}
      <div className="absolute inset-0">
        <Image
          src="/portal-oscuro.png" // Asegúrate de poner tu imagen en /public con este nombre
          alt="Portal Oscuro"
          fill
          className="object-cover -z-10"
          priority
        />
        <Image
          src="/magios.gif" // Asegúrate de poner tu imagen en /public con este nombre
          alt="Portal Oscuro"
          fill
          className="object-cover -z-11 "
          priority
          unoptimized
        />
        {/* Overlay con degradado para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0e]/90 via-[#0a0c0e]/70 to-[#0a0c0e]/90"></div>
        
        {/* Partículas mágicas (efecto del portal) */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ffff] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff00ff] rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
      </div>

      {/* Contenido del login */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Marco estilo WoW */}
          <div className= ""
        //   "relative bg-[#1a1f23]/95 border-2 border-[#8b6f4c] p-8 shadow-2xl backdrop-blur-sm"
          >
            
            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c4aa7d]"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c4aa7d]"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c4aa7d]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c4aa7d]"></div>

            {/* Logo o título */}
          <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image
              src="/logo-magios.png"
              alt="Portal Oscuro"
              width={400}
              height={200}
              className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto object-contain"
              priority
            />
          </div>
          <p className="text-[#8b6f4c] text-sm mt-2 tracking-wider">✦ GUILD ✦</p>
        </div>

            {/* Formulario de login */}
            <form className="space-y-6">
              {/* Campo de usuario */}
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2 uppercase tracking-wider">
                  Nombre de batalla
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c]">⚔️</span>
                  <input
                    type="text"
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-3 px-10 text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div>
                <label className="block text-[#c4aa7d] text-sm mb-2 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6f4c]">🛡️</span>
                  <input
                    type="password"
                    className="w-full bg-[#0a0c0e] border-2 border-[#8b6f4c] py-3 px-10 text-[#f0d9b5] placeholder-[#4a3a28] focus:outline-none focus:border-[#c4aa7d] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Recordar y olvidé contraseña */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-[#8b6f4c]">
                  <input type="checkbox" className="w-4 h-4 accent-[#8b6f4c]" />
                  <span>Recordar</span>
                </label>
                <Link href="#" className="text-[#c4aa7d] hover:text-[#f0d9b5] transition-colors border-b border-transparent hover:border-[#c4aa7d]">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de acceso */}
              <button
                type="submit"
                className="w-full relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b6f4c] to-[#4a3a28] group-hover:from-[#c4aa7d] group-hover:to-[#8b6f4c] transition-all duration-500"></div>
                <div className="relative bg-[#1a1f23] m-[2px] py-4 group-hover:bg-transparent transition-all duration-500">
                  <span className="text-[#f0d9b5] font-bold uppercase tracking-wider text-lg group-hover:text-[#0a0c0e] transition-colors duration-500">
                    Cruzar el Portal
                  </span>
                </div>
              </button>
            </form>

            {/* Separador */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#8b6f4c]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1f23] text-[#8b6f4c]">¿Nuevo en Magios?</span>
              </div>
            </div>

            {/* Botón de registro */}
            <Link
              href="#"
              className="block text-center bg-transparent border-2 border-[#8b6f4c] py-3 text-[#c4aa7d] hover:bg-[#8b6f4c] hover:text-[#0a0c0e] transition-all duration-300 uppercase tracking-wider font-bold"
            >
              Crear una cuenta
            </Link>

            {/* Texto del portal */}
            <p className="text-center text-xs text-[#4a3a28] mt-6">
              "Magios se abre... ¿Estás listo para la aventura?"
            </p>
          </div>

          {/* Advertencia estilo WoW */}
          <div className="mt-4 text-center text-[#8b6f4c] text-xs">
            <p>© 2026 Hermandad • Turtle Wow</p>
            <p className="mt-1">⚡ For the Horde! ⚡ For the Alliance! ⚡</p>
          </div>
        </div>
      </div>

      {/* Efectos de borde del portal */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0c0e] to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0c0e] to-transparent z-10"></div>
    </div>
  );
} 