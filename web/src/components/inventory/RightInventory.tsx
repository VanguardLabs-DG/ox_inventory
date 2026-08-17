import React, { useState } from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectRightInventory, selectLeftInventory } from '../../store/inventory';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Inventory, SlotWithItem } from '../../typings';

export const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);
  const leftInventory = useAppSelector(selectLeftInventory);
  const [selectedTab, setSelectedTab] = useState<'ground' | 'backpack'>('ground');
  const [backpackInventory, setBackpackInventory] = useState<Inventory | null>(null);
  const [hasEquippedBackpack, setHasEquippedBackpack] = useState<boolean>(false);

  // Listen to backpack container updates
  useNuiEvent<Inventory>('setBackpackInventory', (data) => {
    if (data) {
      setBackpackInventory(data);
      setHasEquippedBackpack(true);
    }
  });

  useNuiEvent<Record<string, SlotWithItem>>('updateClothingInventory', (data) => {
    if (data) {
      setHasEquippedBackpack(!!data['bags_1']);
    }
  });

  // Check if player has a backpack equipped
  const equippedBag = hasEquippedBackpack || leftInventory?.items?.some((i) => i?.name?.includes('bag') || i?.name?.includes('backpack'));

  const activeBackpack: Inventory = backpackInventory || {
    id: 'player-backpack',
    type: 'container',
    slots: 20,
    maxWeight: 25000,
    label: 'MOCHILA',
    items: [],
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Title Row with 2 Toggles - Aligned horizontally with 'ATALHOS RÁPIDOS' */}
      <div className="flex items-center space-x-2 mb-1.5 px-0.5">
        <button
          type="button"
          onClick={() => setSelectedTab('ground')}
          className={`px-2.5 py-0.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all duration-140 cursor-pointer ${
            selectedTab === 'ground'
              ? 'bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[#FFC857]'
              : 'text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
          }`}
        >
          CHÃO
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab('backpack')}
          className={`px-2.5 py-0.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all duration-140 cursor-pointer ${
            selectedTab === 'backpack'
              ? 'bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[#FFC857]'
              : 'text-white/40 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
          }`}
        >
          MOCHILA
        </button>
      </div>

      {/* Card Grid starting at the exact top edge of the HotbarDeck */}
      <div className="flex-1 w-full overflow-hidden">
        {selectedTab === 'ground' ? (
          <InventoryGrid inventory={rightInventory} isRight />
        ) : equippedBag ? (
          <InventoryGrid inventory={activeBackpack} customTitle="MOCHILA" isRight />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(10,14,22,0.45)] border border-white/[0.06] rounded-[8px] p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 mb-3">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </div>
            <span className="text-white text-sm font-semibold tracking-wider uppercase mb-1">
              NENHUMA MOCHILA EQUIPADA
            </span>
            <span className="text-white/40 text-xs max-w-[220px] leading-relaxed">
              Equipe uma mochila no painel de vestuário para expandir seu armazenamento.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightInventory;
