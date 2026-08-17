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
  const playerName = leftInventory?.label || 'BOB SMITH';

  const handleExit = () => {
    if (onClose) {
      onClose();
    } else {
      fetchNui('exit');
    }
  };

  const tabs = ['INVENTÁRIO', 'CRIAÇÃO'];

  return (
    <div className="w-full h-14 flex items-center justify-between px-6 select-none relative z-20 border-b border-white/[0.06] bg-[rgba(10,14,20,0.55)] backdrop-blur-md">
      {/* Top Left: Player Identity Card */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-[6px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/70">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-semibold tracking-wide leading-none">
              {playerName}
            </span>
            <span className="bg-white/[0.08] text-white/80 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-[4px] border border-white/[0.1] leading-none">
              ID #1
            </span>
          </div>
          <span className="text-white/40 text-[10px] tracking-wider mt-0.5">
            DISTRITO PAULISTA • ROLEPLAY
          </span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <div className="flex items-center space-x-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(tab)}
              className={`text-sm font-semibold tracking-widest transition-all duration-150 relative py-1 cursor-pointer ${
                isActive
                  ? 'text-[#FFC857]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {tab}
              {isActive && (
                <div className="w-full h-[2px] bg-[#FFC857] absolute bottom-0 left-0 rounded-full shadow-[0_0_8px_rgba(255,200,87,0.6)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Top Right: Ghost Exit Button */}
      <div className="flex items-center">
        <button
          onClick={handleExit}
          className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-[6px] text-white/70 hover:text-white transition-all duration-150 cursor-pointer"
        >
          <span className="text-xs font-semibold tracking-wide">SAIR</span>
          <span className="bg-white/[0.08] text-white/90 text-[10px] font-mono px-1.5 py-0.5 rounded-[3px]">
            ESC
          </span>
        </button>
      </div>
    </div>
  );
};

export default CyberpunkHeader;
