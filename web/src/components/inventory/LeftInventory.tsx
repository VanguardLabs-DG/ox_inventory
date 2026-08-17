import React from 'react';
import InventoryGrid from './InventoryGrid';
import HotbarDeck from './HotbarDeck';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

export const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Top: 5-Slot Hotbar Deck */}
      <HotbarDeck inventory={leftInventory} />

      {/* Main Grid: Slots 6+ (Bolsos) */}
      <div className="flex-1 w-full overflow-hidden">
        <InventoryGrid inventory={leftInventory} />
      </div>
    </div>
  );
};

export default LeftInventory;
