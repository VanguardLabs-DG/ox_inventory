import React from 'react';
import { useAppSelector } from '../../store';

export const PedViewport: React.FC = () => {
  const leftInventory = useAppSelector((state) => state.inventory.leftInventory);
  const playerName = leftInventory?.label || 'JOGADOR';

  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative z-10">
      {/* Top Header: Character Info */}
      <div className="w-full h-9 flex items-center justify-between px-3 bg-[rgba(8,10,14,0.45)] border border-[#E5A93C]/25 rounded-[2px] backdrop-blur-md">
        <span className="text-[#FFC857] text-xs font-bold font-cyber tracking-wider uppercase whitespace-nowrap">
          // PERSONAGEM
        </span>
        <span className="text-white/60 text-[10px] font-mono truncate max-w-[50%] text-right">
          {playerName}
        </span>
      </div>

      {/* Center Framing Window (100% Transparent for GTA V Cloned Ped in Mode 1) */}
      <div className="w-full flex-1 relative pointer-events-none" />

      {/* Bottom Visualização Bar */}
      <div className="w-full h-9 flex items-center justify-between px-3 bg-[rgba(8,10,14,0.45)] border border-[#E5A93C]/25 rounded-[2px] backdrop-blur-md">
        <span className="text-white/50 text-[10px] font-cyber tracking-widest uppercase whitespace-nowrap">
          VISUALIZAÇÃO 3D
        </span>
        <span className="text-[#FFC857] text-[10px] font-mono whitespace-nowrap">
          STATUS: ATIVO
        </span>
      </div>
    </div>
  );
};

export default PedViewport;
