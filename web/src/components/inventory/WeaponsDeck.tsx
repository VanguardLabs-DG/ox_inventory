import React from 'react';
import { useAppSelector } from '../../store';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { fetchNui } from '../../utils/fetchNui';

export const WeaponsDeck: React.FC = () => {
  const leftInventory = useAppSelector((state) => state.inventory.leftInventory);
  const items = leftInventory?.items || [];

  // Find equipped weapons in hotbar slots 1, 2, 3
  const weaponSlots = [1, 2, 3].map((slotNum) => {
    const item = items.find((i) => i?.slot === slotNum) as SlotWithItem | undefined;
    return {
      slot: slotNum,
      item: item || null,
    };
  });

  const handleUseWeapon = (item: SlotWithItem | null) => {
    if (item) {
      fetchNui('useItem', item);
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 mb-2.5">
      {weaponSlots.map(({ slot, item }) => (
        <div
          key={slot}
          onClick={() => handleUseWeapon(item)}
          className={`flex-1 h-[9.5vh] rounded-[2px] border transition-all duration-150 p-2 relative cursor-pointer flex flex-col justify-between ${
            item
              ? 'bg-[rgba(14,18,28,0.65)] border-[#FFC857]/70 shadow-[0_0_12px_rgba(229,169,60,0.2)] hover:border-[#FFC857] hover:bg-[rgba(22,28,42,0.85)]'
              : 'bg-[rgba(10,14,22,0.35)] border-white/10 hover:border-[#FFC857]/40'
          }`}
        >
          {/* Header of Weapon Slot: Slot Number & DPS / Type */}
          <div className="w-full flex items-center justify-between">
            <span className="text-[#FFC857] text-[10px] font-cyber font-bold tracking-wider">
              ARMA {slot}
            </span>
            {item && (
              <span className="text-white/60 text-[9px] font-mono tracking-wide">
                {(item.weight / 1000).toFixed(1)}kg
              </span>
            )}
          </div>

          {/* Center Image or Empty Slot Line */}
          <div className="w-full flex-1 flex items-center justify-center relative">
            {item ? (
              <img
                className="max-h-[5.5vh] max-w-[85%] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                src={getItemUrl(item)}
                alt={item.metadata?.label || item.name}
              />
            ) : (
              <span className="text-white/20 text-xs font-cyber tracking-widest uppercase">
                [ VAZIO ]
              </span>
            )}
          </div>

          {/* Footer Label / Rarity Underline */}
          <div className="w-full flex items-center justify-between pt-1 border-t border-white/10">
            <span className="text-white text-[10px] font-cyber font-bold truncate max-w-[80%] leading-none">
              {item ? item.metadata?.label || item.name : 'SEM ARMA'}
            </span>
            <div className={`w-2 h-2 rounded-full ${item ? 'bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]' : 'bg-white/10'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeaponsDeck;
