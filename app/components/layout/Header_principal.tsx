import Image from "next/image";
import Link from "next/link";

export default function Header_principal() {
  return (
    <header className="relative h-48 sm:h-64 w-full border-b-4 border-[#8b6f4c] bg-gradient-to-b from-[#1a1f23]/80 to-[#0a0c0e]/80 backdrop-blur-sm">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4aa7d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* Contenedor flex column para apilar elementos verticalmente */}
      <div
        className="relative h-full flex flex-col items-center justify-center px-4"
        style={{
          backgroundImage: 'url("/banner-magios.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Imagen con tamaño controlado */}
        <div className="w-1/2 sm:w-1/3 max-w-[450px]">
          <Image
            src="/magios.png"
            alt="Portal Oscuro"
            width={400}
            height={200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Texto decorativo */}
        <p className="text-sm sm:text-base text-[#8b6f4c] mt-2 text-center px-2 tracking-wider">
          • Turtle WoW Guild •
        </p>
      </div>
    </header>
  );
}
