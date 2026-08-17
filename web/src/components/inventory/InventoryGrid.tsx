import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import InventorySlot from './InventorySlot';
import { Inventory } from '../../typings';

interface InventoryGridProps {
  inventory: Inventory;
  isRight?: boolean;
}

const FILTER_TABS = [
  { id: 'all', label: '◈ TODOS' },
  { id: 'weapons', label: '◈ ARMAS' },
  { id: 'clothes', label: '◈ ROUPAS' },
  { id: 'use', label: '◈ USÁVEIS' },
];

export const InventoryGrid: React.FC<InventoryGridProps> = ({ inventory }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const maxWeight = inventory.maxWeight || 85000;
  const currentWeight = (inventory.items || []).reduce((sum, item) => sum + (item ? (item.weight || 0) * (item.count || 1) : 0), 0);
  const weightPercent = Math.min(100, Math.round((currentWeight / maxWeight) * 100));

  const totalSlots = inventory.slots || 35;
  const rawItems = inventory.items || [];

  // If player inventory, slots 1-5 are displayed in HotbarDeck above, so grid starts from slot 6
  const startSlot = inventory.type === 'player' ? 6 : 1;

  const slots = React.useMemo(() => {
    const slotList = [];
    for (let slotIndex = startSlot; slotIndex <= totalSlots; slotIndex++) {
      const foundItem = rawItems.find((i) => i?.slot === slotIndex);

      if (foundItem && searchQuery.trim()) {
        const name = (foundItem.metadata?.label || foundItem.name || '').toLowerCase();
        if (!name.includes(searchQuery.toLowerCase())) {
          slotList.push({ slot: slotIndex });
          continue;
        }
      }

      slotList.push(foundItem || { slot: slotIndex });
    }
    return slotList;
  }, [rawItems, totalSlots, startSlot, searchQuery]);

  const inventoryTitle = inventory.label || (inventory.type === 'player' ? 'MOCHILA' : 'CHÃO / SECUNDÁRIO');

  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[rgba(8,10,14,0.45)] border border-[#E5A93C]/25 rounded-[2px] p-2.5 backdrop-blur-md shadow-2xl relative z-10 select-none"
      style={{ pointerEvents: isBusy ? 'none' : 'auto' }}
    >
      {/* Top Bar: Title, Filters, Search & Weight */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5A93C]/20">
        {/* Title / Filters */}
        <div className="flex items-center space-x-2">
          <span className="text-[#FFC857] text-xs font-bold font-cyber tracking-wider uppercase mr-2">
            // {inventoryTitle}
          </span>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-cyber font-bold tracking-wider transition-all duration-150 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#FFC857]/20 border border-[#FFC857] text-[#FFC857] shadow-[0_0_8px_rgba(255,200,87,0.3)]'
                  : 'text-white/40 hover:text-white/80 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Weight */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="BUSCAR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-24 bg-black/40 border border-white/10 px-2 py-0.5 text-white text-[10px] font-cyber focus:border-[#FFC857] outline-none rounded-[2px]"
          />

          <div className="flex items-center space-x-1.5">
            <span className="text-white/50 text-[9px] font-mono">
              {(currentWeight / 1000).toFixed(1)}/{(maxWeight / 1000).toFixed(0)}KG
            </span>
            <div className="w-14 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-200 ${
                  weightPercent >= 90 ? 'bg-red-500' : 'bg-[#FFC857]'
                }`}
                style={{ width: `${weightPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk Matrix Slots Grid */}
      <div className="inventory-grid-container flex-1 overflow-y-auto pr-1">
        {slots.map((itemSlot) => (
          <InventorySlot
            key={`slot-${inventory.id}-${itemSlot.slot}`}
            item={itemSlot}
            inventoryType={inventory.type}
            inventoryGroups={inventory.groups}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;
