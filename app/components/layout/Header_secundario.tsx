import Image from "next/image";
import Link from "next/link";

export default function Header_secundario(){
    return(
         <header className="relative h-24 sm:h-32 md:h-48 w-full border-b-4 border-[#8b6f4c] bg-gradient-to-b from-[#1a1f23]/80 to-[#0a0c0e]/80 backdrop-blur-sm">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              backgroundRepeat: "repeat",
            }}
          ></div>

          <div
            className="relative h-full flex items-center justify-between px-2 sm:px-4 md:px-8"
            style={{
              backgroundImage: 'url("/banner-magios.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Overlay oscuro opcional para mejorar legibilidad */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Logo a la izquierda */}
            <Link href="/" className="flex items-center group relative z-10">
              <div className="w-16 sm:w-24 md:w-36 h-auto">
                <Image
                  src="/magios.png"
                  alt="Portal Oscuro"
                  width={400}
                  height={200}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </Link>

            {/* Elementos a la derecha */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 relative z-10">
              <span className="bg-[#1a1f23]/80 px-1 sm:px-2 md:px-4 py-0.5 sm:py-1 md:py-2 border border-[#8b6f4c] text-[8px] sm:text-xs md:text-sm whitespace-nowrap backdrop-blur-sm rounded">
                
              </span>
              <Link
                href="/login"
                className="bg-[#8b6f4c] px-2 sm:px-3 md:px-6 py-0.5 sm:py-1 md:py-2 text-[8px] sm:text-xs md:text-base text-[#0a0c0e] font-bold hover:bg-[#c4aa7d] transition-colors border-2 border-[#f0d9b5] whitespace-nowrap rounded"
              >
                UNIRTE
              </Link>
            </div>
          </div>
        </header>

    )
}