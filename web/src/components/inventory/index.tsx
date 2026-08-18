import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import CyberpunkHeader from './CyberpunkHeader';
import PedViewport from './PedViewport';
import ClothesColumn from './ClothesColumn';
import PlayerStatsCard from './PlayerStatsCard';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('INVENTÁRIO');
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="h-screen w-screen flex flex-col justify-between box-border bg-transparent overflow-hidden select-none relative font-cyber pb-3">
          {/* 100% Transparent Scanline Background */}
          <div className="inventory-background" />

          {/* Top Bar Header */}
          <CyberpunkHeader
            onClose={() => setInventoryVisible(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main 4-Column Responsive Layout (Zero overflow across all resolutions) */}
          <div className="flex-1 w-full grid grid-cols-[minmax(0,1.35fr)_minmax(0,2.1fr)_minmax(0,3.15fr)_minmax(0,3.15fr)] gap-3.5 px-6 py-2 relative overflow-hidden box-border">
            {/* Coluna 1: Equipamento (Topo) + Status (Base) */}
            <div className="w-full h-full min-w-0 flex flex-col justify-between overflow-hidden gap-3">
              <div className="flex-1 w-full overflow-hidden">
                <ClothesColumn />
              </div>
              <PlayerStatsCard />
            </div>

            {/* Coluna 2: Personagem 3D (Encaixe milimétrico do Slot 0 em x=26%) */}
            <div className="w-full h-full min-w-0 flex flex-col overflow-hidden">
              <PedViewport />
            </div>

            {/* Coluna 3: Hotbar (1-5) + Bolsos (6+) */}
            <div className="w-full h-full min-w-0 flex flex-col overflow-hidden">
              <LeftInventory />
            </div>

            {/* Coluna 4: Toggles [CHÃO] [MOCHILA] + Grade */}
            <div className="w-full h-full min-w-0 flex flex-col overflow-hidden">
              <RightInventory />
            </div>

            {/* Overlays */}
            <Tooltip />
            <InventoryContext />
          </div>
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
