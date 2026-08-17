import React from 'react';

interface StatsProps {
  health?: number;
  armor?: number;
  hunger?: number;
  thirst?: number;
  stamina?: number;
}

export const CyberpunkStatsFooter: React.FC<StatsProps> = ({
  health = 100,
  armor = 100,
  hunger = 100,
  thirst = 100,
  stamina = 100,
}) => {
  return (
    <div className="w-full h-11 flex items-center justify-between px-6 bg-[rgba(10,14,20,0.75)] border-t border-[rgba(255,255,255,0.08)] backdrop-blur-md select-none relative z-20">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <span className="text-[#FBBF24] text-xs font-bold font-cyber tracking-widest uppercase">
          // STATUS DO PERSONAGEM
        </span>
      </div>

      {/* Badges Row */}
      <div className="flex items-center space-x-6">
        {/* Health */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-[5px] bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold font-hud leading-none">{health}</span>
            <span className="text-red-400 text-[8px] font-cyber tracking-wider leading-none mt-0.5">VIDA</span>
          </div>
        </div>

        {/* Armor */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-[5px] bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-hud font-bold leading-none">{armor}</span>
            <span className="text-cyan-400 text-[8px] font-cyber tracking-wider leading-none mt-0.5">COLETE</span>
          </div>
        </div>

        {/* Hunger */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-[5px] bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#FBBF24]">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.48L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v1c0 .55-.45.99-1.01.99H2.01c-.56 0-1.01-.44-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-hud font-bold leading-none">{hunger}%</span>
            <span className="text-[#FBBF24] text-[8px] font-cyber tracking-wider leading-none mt-0.5">FOME</span>
          </div>
        </div>

        {/* Thirst */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-[5px] bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-hud font-bold leading-none">{thirst}%</span>
            <span className="text-blue-400 text-[8px] font-cyber tracking-wider leading-none mt-0.5">SEDE</span>
          </div>
        </div>

        {/* Stamina */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-[5px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-hud font-bold leading-none">{stamina}%</span>
            <span className="text-emerald-300 text-[8px] font-cyber tracking-wider leading-none mt-0.5">ENERGIA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkStatsFooter;
