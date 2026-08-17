import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { fetchNui } from '../../utils/fetchNui';
import useNuiEvent from '../../hooks/useNuiEvent';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';

interface ClothesSlotConfig {
  name: string;
  label: string;
  itemname: string;
  svg: JSX.Element;
}

const CLOTHES_SLOTS: ClothesSlotConfig[] = [
  {
    name: 'hat',
    label: 'Chapéu',
    itemname: 'helmet_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L3 19h18l-1.97-1.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7 0 1.28-.35 2.48-.95 3.52L12 11l-6.05 4.52C5.35 14.48 5 13.28 5 12c0-3.87 3.13-7 7-7z" />
      </svg>
    ),
  },
  {
    name: 'mask',
    label: 'Máscara',
    itemname: 'mask_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
      </svg>
    ),
  },
  {
    name: 'glasses',
    label: 'Óculos',
    itemname: 'glasses_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 7h-2.18c-.41-1.16-1.52-2-2.82-2-1.3 0-2.41.84-2.82 2h-2.36c-.41-1.16-1.52-2-2.82-2-1.3 0-2.41.84-2.82 2H3c-.55 0-1 .45-1 1v4c0 2.21 1.79 4 4 4 2.05 0 3.73-1.54 3.96-3.55.77-.38 1.63-.58 2.04-.45.41-.13 1.27.07 2.04.45C16.27 14.46 17.95 16 20 16c2.21 0 4-1.79 4-4V8c0-.55-.45-1-1-1zm-15 7c-1.1 0-2-.9-2-2v-3h4v3c0 1.1-.9 2-2 2zm14 0c-1.1 0-2-.9-2-2v-3h4v3c0 1.1-.9 2-2 2z" />
      </svg>
    ),
  },
  {
    name: 'jacket',
    label: 'Casaco',
    itemname: 'torso_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l-6 4v16h4v-7h4v7h4V6l-6-4zm-1 7H8V7l3-2v4zm5 0h-3V5l3 2v2z" />
      </svg>
    ),
  },
  {
    name: 'tshirt',
    label: 'Camisa',
    itemname: 'tshirt_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15 2l-3 2-3-2-5 3v5h3v12h12V10h3V5l-5-3zm-1 8h-4V6h4v4z" />
      </svg>
    ),
  },
  {
    name: 'armor',
    label: 'Colete',
    itemname: 'bproof_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
      </svg>
    ),
  },
  {
    name: 'bag',
    label: 'Mochila',
    itemname: 'bags_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
      </svg>
    ),
  },
  {
    name: 'gloves',
    label: 'Luvas',
    itemname: 'arms',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 5h-2V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2h-2V2a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v3H5a1 1 0 0 0-1 1v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V6a1 1 0 0 0-1-1z" />
      </svg>
    ),
  },
  {
    name: 'chain',
    label: 'Colar',
    itemname: 'chain_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V21l4-2 4 2v-6.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z" />
      </svg>
    ),
  },
  {
    name: 'watch',
    label: 'Relógio',
    itemname: 'watches_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
  {
    name: 'pant',
    label: 'Calça',
    itemname: 'pants_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2h12v5l-2 15h-3l-1-10-1 10H8L6 7V2z" />
      </svg>
    ),
  },
  {
    name: 'shoes',
    label: 'Sapato',
    itemname: 'shoes_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2 18h20v3H2v-3zm19.5-6.5L19 9h-5l-2 3H7c-1.66 0-3 1.34-3 3v1h18v-2.5c0-.75-.34-1.46-.86-1.92l.36-.08z" />
      </svg>
    ),
  },
];

interface ClothesSlotProps {
  slotConfig: ClothesSlotConfig;
  equippedItem?: SlotWithItem | null;
  onTakeOff: (item: SlotWithItem) => void;
  onEquip: (sourceItem: SlotWithItem, targetSlot: string) => void;
}

const ClothesSlot: React.FC<ClothesSlotProps> = ({ slotConfig, equippedItem, onTakeOff, onEquip }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (source: { item: SlotWithItem }) => {
      if (source?.item) {
        onEquip(source.item, slotConfig.itemname);
      }
    },
  }), [slotConfig]);

  const handleDoubleClick = () => {
    if (equippedItem) {
      onTakeOff(equippedItem);
    }
  };

  return (
    <div
      ref={drop}
      onDoubleClick={handleDoubleClick}
      className={`inventory-slot w-full aspect-square flex flex-col items-center justify-between p-1.5 ${
        isOver ? 'border-[#FFC857] shadow-[0_0_12px_rgba(229,169,60,0.4)]' : ''
      }`}
      title={equippedItem ? `${equippedItem.metadata?.label || equippedItem.name} (Duplo clique para desequipar)` : slotConfig.label}
    >
      {/* Center Image or SVG Icon */}
      <div className="w-full flex-1 flex items-center justify-center relative">
        {equippedItem ? (
          <img
            className="max-h-[70%] max-w-[85%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            src={getItemUrl(equippedItem)}
            alt={equippedItem.metadata?.label || slotConfig.label}
          />
        ) : (
          <div className="text-white/40 group-hover:text-white/80 transition-colors flex items-center justify-center">
            {slotConfig.svg}
          </div>
        )}

        {/* Active Glow Dot */}
        {equippedItem && (
          <div className="w-1.5 h-1.5 rounded-full absolute top-0 right-0 bg-[#FFC857] shadow-[0_0_6px_#FFC857]" />
        )}
      </div>

      {/* Label matching item slots */}
      <span className="inventory-slot-label-text text-[9px] font-cyber text-center leading-none mt-0.5">
        {equippedItem ? equippedItem.metadata?.label || equippedItem.name : slotConfig.label}
      </span>
    </div>
  );
};

export const ClothesColumn: React.FC = () => {
  const [clothingInventory, setClothingInventory] = useState<Record<string, SlotWithItem | null>>({});

  useNuiEvent<Record<string, SlotWithItem>>('updateClothingInventory', (data) => {
    if (data) {
      setClothingInventory(data);
    }
  });

  const handleTakeOff = (item: SlotWithItem) => {
    fetchNui('TakeOffClothes', item);
  };

  const handleEquip = (sourceItem: SlotWithItem, targetSlot: string) => {
    fetchNui('EquipClothes', { item: sourceItem, slot: targetSlot });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[rgba(8,10,14,0.45)] border border-[#E5A93C]/25 rounded-[2px] p-2.5 backdrop-blur-md shadow-2xl relative z-10 select-none">
      {/* Header Bar matching standard inventory panel */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5A93C]/20">
        <span className="text-[#FFC857] text-xs font-bold font-cyber tracking-wider uppercase">
          // ROUPAS
        </span>
        <span className="text-white/40 text-[9px] font-mono">
          VESTUÁRIO
        </span>
      </div>

      {/* 2-Column Grid with all 12 clothing slots filling the panel completely */}
      <div className="w-full flex-1 grid grid-cols-2 gap-2 content-start overflow-y-auto pr-1">
        {CLOTHES_SLOTS.map((slotConfig) => (
          <ClothesSlot
            key={slotConfig.name}
            slotConfig={slotConfig}
            equippedItem={clothingInventory[slotConfig.itemname] || null}
            onTakeOff={handleTakeOff}
            onEquip={handleEquip}
          />
        ))}
      </div>
    </div>
  );
};

export default ClothesColumn;
