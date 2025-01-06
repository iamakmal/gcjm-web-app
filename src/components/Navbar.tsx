import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="navbar bg-[#1E5866] mb-2">
      <div className="flex h-16">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={48}
          height={48}
          className="h-12 mt-2 ml-2 rounded-full border border-yellow-500"
        />
      </div>
      <div className="space-x-8 mx-auto items-center text-lg">
        <a href="" className="text-white">
          Ghaneemathul Cassimiya Jumma Mosque Dematagoda Place
        </a>
      </div>
    </div>
  );
}
