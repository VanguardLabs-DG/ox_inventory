import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
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
import CyberpunkStatsFooter from './CyberpunkStatsFooter';

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
        <div className="h-screen w-screen flex flex-col justify-between box-border bg-transparent overflow-hidden select-none relative font-cyber">
          {/* Holographic CRT Scanline & Radial Vignette Background */}
          <div className="inventory-background" />

          {/* Top Bar Header (Cyberpunk 2077 Navigation + Player ID Card) */}
          <CyberpunkHeader
            onClose={() => setInventoryVisible(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main 4-Column Layout: Personagem (22%) > Roupas (16%) > Hotbar/Inventário (30%) > Chão/Secundário (30%) */}
          <div className="flex-1 w-full grid grid-cols-[22%_16%_30%_30%] gap-3.5 px-6 py-2.5 relative overflow-hidden">
            {/* Coluna 1: Personagem (3D Cloned Ped) */}
            <div className="w-full h-full flex flex-col overflow-hidden">
              <PedViewport />
            </div>

            {/* Coluna 2: Roupas (Vestuário 2 colunas) */}
            <div className="w-full h-full flex flex-col overflow-hidden">
              <ClothesColumn />
            </div>

            {/* Coluna 3: Hotbar / Inventário do Jogador (Atalhos 1-5 + Mochila 6+) */}
            <div className="w-full h-full flex flex-col overflow-hidden">
              <LeftInventory />
            </div>

            {/* Coluna 4: Itens do Chão / Secundário / Baú */}
            <div className="w-full h-full flex flex-col overflow-hidden">
              <RightInventory />
            </div>

            {/* Tactical Drop & Quantity Controls */}
            <div className="absolute right-8 bottom-16 z-30 pointer-events-auto">
              <InventoryControl />
            </div>

            {/* Floating Overlays */}
            <Tooltip />
            <InventoryContext />
          </div>

          {/* Bottom Statistics HUD Footer */}
          <CyberpunkStatsFooter />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
