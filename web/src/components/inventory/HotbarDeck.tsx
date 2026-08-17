import React from 'react';
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
    <div className="w-full flex flex-col mb-3 select-none">
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          ATALHOS RÁPIDOS
        </span>
      </div>

      {/* 5 Quick Slots Grid */}
      <div className="w-full grid grid-cols-5 gap-2 bg-[rgba(10,14,22,0.45)] border border-white/[0.06] rounded-[8px] p-2.5 shadow-2xl">
        {hotbarSlots.map((itemSlot) => (
          <div key={`hotbar-deck-slot-${itemSlot.slot}`} className="relative">
            <InventorySlot
              item={itemSlot}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              hotbarNumber={itemSlot.slot}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotbarDeck;
