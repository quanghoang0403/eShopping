import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoRound from "@/assets/images/logos/round.png";
export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
        <div className="items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl flex dark:hidden">
          <Image src={logoRound} width={44} height={44} alt="Cúc Hoạ Mi logo" className="mr-3" sizes="200px" priority/>
          Cúc Hoạ Mi
        </div>
        <div className="items-center tracking-wide no-underline hover:no-underline font-bold text-neutral-200 text-xl hidden dark:flex">
          <Image src={logoRound} width={44} height={44} alt="Cúc Hoạ Mi logo" className="mr-3" sizes="200px" priority/>
          Cúc Hoạ Mi
        </div>
    </Link>
  );
};

export default Logo;
