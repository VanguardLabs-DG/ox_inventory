import React from 'react';
import { useAppSelector } from '../../store';
import InventorySlot from './InventorySlot';
import { Inventory } from '../../typings';

interface HotbarDeckProps {
  inventory: Inventory;
}

export const HotbarDeck: React.FC<HotbarDeckProps> = ({ inventory }) => {
  const rawItems = inventory.items || [];

  const hotbarSlots = [1, 2, 3, 4, 5].map((slotNum) => {
    const item = rawItems.find((i) => i?.slot === slotNum);
    return item || { slot: slotNum };
  });

  return (
    <div className="w-full flex flex-col mb-2 select-none">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[#FFC857] text-[11px] font-cyber font-bold tracking-widest uppercase">
          // ATALHOS RÁPIDOS [ 1 - 5 ]
        </span>
      </div>

      {/* 5 Quick Slots Grid */}
      <div className="w-full grid grid-cols-5 gap-2 bg-[rgba(8,10,14,0.45)] border border-[#E5A93C]/25 rounded-[2px] p-1.5 backdrop-blur-md">
        {hotbarSlots.map((itemSlot) => (
          <div key={`hotbar-deck-slot-${itemSlot.slot}`} className="relative">
            <InventorySlot
              item={itemSlot}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotbarDeck;
