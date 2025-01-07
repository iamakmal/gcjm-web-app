import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-[#1E5866] mb-2 flex-wrap">
      <div className="flex h-16">
        <Link href="/">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={48}
            height={48}
            className="h-12 mt-2 ml-2 rounded-full border border-yellow-500"
          />
        </Link>
      </div>
      <div className="space-x-8 mx-auto items-center text-lg">
        <Link href="/">
          <p className="text-white text-xl">
            Ghaneemathul Cassimiya Jumma Mosque Dematagoda Place
          </p>
        </Link>
      </div>
    </div>
  );
}
