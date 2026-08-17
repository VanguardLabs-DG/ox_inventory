import React from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { useAppSelector } from '../../store';

interface HeaderProps {
  onClose?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const CyberpunkHeader: React.FC<HeaderProps> = ({
  onClose,
  activeTab = 'INVENTÁRIO',
  onTabChange,
}) => {
  const leftInventory = useAppSelector((state) => state.inventory.leftInventory);
  const playerName = leftInventory?.label || 'MURAIA DEVA';

  const handleExit = () => {
    if (onClose) {
      onClose();
    } else {
      fetchNui('exit');
    }
  };

  const tabs = ['INVENTÁRIO', 'CRIAÇÃO'];

  return (
    <div className="w-full h-14 flex items-center justify-between px-6 select-none relative z-20 border-b border-[#E5A93C]/30 bg-[rgba(6,8,12,0.65)] backdrop-blur-md">
      {/* Top Left: Player Identity Card */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-[2px] bg-[#E5A93C]/20 border border-[#E5A93C]/50 flex items-center justify-center text-[#FFC857]">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-bold font-cyber tracking-wider leading-none">
              {playerName}
            </span>
            <span className="bg-[#E5A93C]/20 text-[#FFC857] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] border border-[#E5A93C]/40 leading-none">
              ID #1
            </span>
          </div>
          <span className="text-[#8985BF] text-[10px] font-mono tracking-wider mt-0.5">
            DISTRITO PAULISTA • ROLEPLAY
          </span>
        </div>
      </div>

      {/* Center: Cyberpunk Navigation Tabs */}
      <div className="flex items-center space-x-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(tab)}
              className={`text-sm font-bold font-cyber tracking-[0.2em] transition-all duration-150 relative py-1 cursor-pointer ${
                isActive
                  ? 'text-[#FFC857] drop-shadow-[0_0_8px_rgba(255,200,87,0.8)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {tab}
              {isActive && (
                <div className="w-full h-[2px] bg-[#FFC857] absolute bottom-0 left-0 shadow-[0_0_8px_#FFC857]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Top Right: Exit Action */}
      <div className="flex items-center">
        <button
          onClick={handleExit}
          className="flex items-center space-x-2 px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-[2px] transition-all duration-150 cursor-pointer group"
        >
          <span className="text-white text-xs font-bold font-cyber tracking-widest">FECHAR</span>
          <span className="bg-red-600 text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-[2px]">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
};

export default CyberpunkHeader;
