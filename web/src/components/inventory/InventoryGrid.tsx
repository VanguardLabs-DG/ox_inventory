import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import InventorySlot from './InventorySlot';
import { Inventory } from '../../typings';

interface InventoryGridProps {
  inventory: Inventory;
  isRight?: boolean;
  customTitle?: string;
}

const FILTER_TABS = [
  { id: 'all', label: 'TODOS' },
  { id: 'weapons', label: 'ARMAS' },
  { id: 'clothes', label: 'ROUPAS' },
  { id: 'use', label: 'USÁVEIS' },
];

export const InventoryGrid: React.FC<InventoryGridProps> = ({ inventory, customTitle }) => {
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

  const inventoryTitle = customTitle || (inventory.type === 'player'
    ? 'BOLSOS'
    : (inventory.label || 'CHÃO').toUpperCase());

  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[rgba(13,17,26,0.65)] border border-white/[0.06] rounded-[8px] p-3 shadow-xl relative z-10 select-none"
      style={{ pointerEvents: isBusy ? 'none' : 'auto' }}
    >
      {/* Top Header: Title & Weight */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          {inventoryTitle}
        </span>

        {/* Weight info - Neutral Bar */}
        <div className="flex items-center space-x-2">
          <span className="text-white/40 text-[10px] font-mono">
            {(currentWeight / 1000).toFixed(1)} / {(maxWeight / 1000).toFixed(0)} KG
          </span>
          <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-300 ${
                weightPercent >= 90
                  ? 'bg-red-500 shadow-[0_0_6px_#EF4444]'
                  : weightPercent >= 80
                  ? 'bg-[#FFC857] shadow-[0_0_6px_#FFC857]'
                  : 'bg-white/60'
              }`}
              style={{ width: `${Math.min(weightPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-header: Ergonomic Quick Filters & Search */}
      <div className="flex items-center justify-between pb-2 mb-2 gap-2">
        {/* Filter Pills */}
        <div className="flex items-center space-x-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-[4px] text-[11px] font-semibold tracking-wider uppercase transition-all duration-140 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[#FFC857]'
                  : 'text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-32 bg-black/35 border border-white/[0.08] px-2.5 py-1 text-white text-[11px] placeholder:text-white/30 focus:border-[#E5A93C]/40 focus:bg-black/55 outline-none rounded-[4px] transition-all"
        />
      </div>

      {/* Slots Grid */}
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
