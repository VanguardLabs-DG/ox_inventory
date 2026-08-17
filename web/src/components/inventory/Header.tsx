import React from 'react';
import { fetchNui } from '../../utils/fetchNui';

interface HeaderProps {
  onClose?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose }) => {
  const handleExit = () => {
    if (onClose) {
      onClose();
    } else {
      fetchNui('exit');
    }
  };

  return (
    <div className="w-full h-12 flex items-center justify-between px-4 mb-2 border-b border-[rgba(229,169,60,0.28)] bg-[rgba(10,14,22,0.5)] backdrop-blur-md rounded-t-sm relative z-10">
      {/* Left: Section Title */}
      <div className="flex items-center space-x-3">
        <div className="flex flex-col justify-center">
          <h2 className="text-[#FFC857] text-lg font-bold font-cyber tracking-widest leading-none">
            // INVENTÁRIO
          </h2>
          <span className="text-white text-opacity-45 text-[10px] font-mono tracking-wider">
            DO TEU PERSONAGEM
          </span>
        </div>
      </div>

      {/* Center: City Branding */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[#FFC857] text-base font-bold font-hud tracking-[0.2em] leading-none drop-shadow-[0_0_8px_rgba(229,169,60,0.4)]">
          DISTRITO PAULISTA
        </h1>
        <span className="text-[#E5A93C] text-opacity-70 text-[9px] font-mono tracking-[0.25em] uppercase mt-0.5">
          [ SÃO PAULO • ROLEPLAY ]
        </span>
      </div>

      {/* Right: Exit Action */}
      <div className="flex items-center">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-3 py-1 bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 rounded transition-all duration-150 group cursor-pointer"
        >
          <span className="text-white text-xs font-cyber font-bold tracking-wider group-hover:text-red-200">
            SAIR DO INVENTÁRIO
          </span>
          <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
