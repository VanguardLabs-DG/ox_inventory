import React from 'react';
import { useAppSelector } from '../../store';

export const PedViewport: React.FC = () => {
  const leftInventory = useAppSelector((state) => state.inventory.leftInventory);
  const playerName = leftInventory?.label || 'BOB SMITH';

  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative z-10">
      {/* Top Bar */}
      <div className="w-full h-9 flex items-center justify-between px-3 bg-[rgba(10,14,22,0.45)] border border-white/[0.06] rounded-[6px]">
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          PERSONAGEM
        </span>
        <span className="text-white/40 text-[11px] font-mono">
          {playerName}
        </span>
      </div>

      {/* Center 100% Transparent Framing Window */}
      <div className="w-full flex-1 relative pointer-events-none bg-transparent" />

      {/* Bottom Bar */}
      <div className="w-full h-9 flex items-center justify-between px-3 bg-[rgba(10,14,22,0.45)] border border-white/[0.06] rounded-[6px]">
        <span className="text-white/40 text-[10px] tracking-wider uppercase">
          VISUALIZAÇÃO 3D
        </span>
        <span className="text-[#FFC857] text-[10px] font-medium font-mono">
          STATUS: ATIVO
        </span>
      </div>
    </div>
  );
};

export default PedViewport;
