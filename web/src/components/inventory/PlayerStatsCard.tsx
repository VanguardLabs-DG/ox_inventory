import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';

interface PlayerStats {
  health: number;
  armor: number;
  hunger: number;
  thirst: number;
}

export const PlayerStatsCard: React.FC = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 100,
    armor: 100,
    hunger: 100,
    thirst: 100,
  });

  useNuiEvent<{ health?: number; armor?: number; hunger?: number; thirst?: number }>('updatePlayerStats', (data) => {
    if (data) {
      setPlayerStats((prev) => ({ ...prev, ...data }));
    }
  });

  return (
    <div className="w-full bg-[rgba(10,14,22,0.45)] border border-white/[0.06] rounded-[8px] p-3 backdrop-blur-md shadow-2xl flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.06]">
        <span className="text-white text-[11px] font-semibold tracking-wider uppercase">
          STATUS
        </span>
      </div>

      {/* 2x2 Clean Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Vida */}
        <div className="flex items-center space-x-2.5 bg-[rgba(16,20,30,0.42)] border border-red-500/15 rounded-[6px] p-2">
          <div className="w-6 h-6 rounded-[4px] bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold leading-none font-mono">{playerStats.health}%</span>
            <span className="text-red-400/80 text-[9px] tracking-wider leading-none mt-1">VIDA</span>
          </div>
        </div>

        {/* Colete */}
        <div className="flex items-center space-x-2.5 bg-[rgba(16,20,30,0.42)] border border-cyan-500/15 rounded-[6px] p-2">
          <div className="w-6 h-6 rounded-[4px] bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold leading-none font-mono">{playerStats.armor}%</span>
            <span className="text-cyan-400/80 text-[9px] tracking-wider leading-none mt-1">COLETE</span>
          </div>
        </div>

        {/* Fome */}
        <div className="flex items-center space-x-2.5 bg-[rgba(16,20,30,0.42)] border border-amber-500/15 rounded-[6px] p-2">
          <div className="w-6 h-6 rounded-[4px] bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.48L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v1c0 .55-.45.99-1.01.99H2.01c-.56 0-1.01-.44-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold leading-none font-mono">{playerStats.hunger}%</span>
            <span className="text-amber-400/80 text-[9px] tracking-wider leading-none mt-1">FOME</span>
          </div>
        </div>

        {/* Sede */}
        <div className="flex items-center space-x-2.5 bg-[rgba(16,20,30,0.42)] border border-blue-500/15 rounded-[6px] p-2">
          <div className="w-6 h-6 rounded-[4px] bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold leading-none font-mono">{playerStats.thirst}%</span>
            <span className="text-blue-400/80 text-[9px] tracking-wider leading-none mt-1">SEDE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsCard;
