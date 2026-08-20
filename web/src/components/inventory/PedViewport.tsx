import React from 'react';
import { useAppSelector } from '../../store';

export const PedViewport: React.FC = () => {
  const leftInventory = useAppSelector((state) => state.inventory.leftInventory);
  const playerName = leftInventory?.label || 'BOB SMITH';

  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative z-10">
      {/* Top Bar Header */}
      <div className="w-full h-9 flex items-center justify-between px-3 bg-[rgba(13,17,26,0.65)] border border-white/[0.06] rounded-[6px] shadow-lg">
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          PERSONAGEM
        </span>
        <span className="text-white/40 text-[11px] font-mono">
          {playerName}
        </span>
      </div>

      {/* Center 100% Transparent Framing Window with Ground Contact Shadow */}
      <div className="w-full flex-1 relative pointer-events-none">
        {/* Dark Elliptical Contact Shadow positioned right under the Ped's footwear */}
        <div
          className="w-32 h-6 rounded-[50%] pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: '16.5%',
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 45%, transparent 75%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Bottom Bar Footer */}
      <div className="w-full h-9 flex items-center justify-between px-3 bg-[rgba(13,17,26,0.65)] border border-white/[0.06] rounded-[6px] shadow-lg">
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
