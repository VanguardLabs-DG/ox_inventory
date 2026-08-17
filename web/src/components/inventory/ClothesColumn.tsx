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
        <path d="M12 2L4 5v4h3v13h10V9h3V5l-8-3zm0 2.5l4 1.5h-8l4-1.5z" />
      </svg>
    ),
  },
  {
    name: 'armor',
    label: 'Colete',
    itemname: 'bproof_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
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
    itemname: 'arms_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13V6c0-1.1-.9-2-2-2s-2 .9-2 2v5h-1V3c0-1.1-.9-2-2-2s-2 .9-2 2v8h-1V1.5c0-1.1-.9-2-2-2s-2 .9-2 2V12h-1V4.5c0-1.1-.9-2-2-2s-2 .9-2 2V16c0 4.42 3.58 8 8 8s8-3.58 8-8v-3h-1z" />
      </svg>
    ),
  },
  {
    name: 'chain',
    label: 'Colar',
    itemname: 'chain_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
      </svg>
    ),
  },
  {
    name: 'watch',
    label: 'Relógio',
    itemname: 'watches_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
      </svg>
    ),
  },
  {
    name: 'pants',
    label: 'Calça',
    itemname: 'pants_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2H6c-.55 0-1 .45-1 1v19h5v-9h4v9h5V3c0-.55-.45-1-1-1z" />
      </svg>
    ),
  },
  {
    name: 'shoes',
    label: 'Sapato',
    itemname: 'shoes_1',
    svg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13h-4V7H9v6H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z" />
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
        isOver ? 'border-[#FFC857] shadow-[0_0_12px_rgba(255,200,87,0.3)]' : ''
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
          <div className="text-white/35 group-hover:text-white/80 transition-colors flex items-center justify-center">
            {slotConfig.svg}
          </div>
        )}

        {/* Active Indicator Dot */}
        {equippedItem && (
          <div className="w-1.5 h-1.5 rounded-full absolute top-0 right-0 bg-[#FFC857] shadow-[0_0_6px_#FFC857]" />
        )}
      </div>

      {/* Label */}
      <span className="inventory-slot-label-text text-[10px] text-center leading-none mt-0.5 text-white/70">
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
    <div className="w-full h-full flex flex-col justify-between bg-[rgba(10,14,22,0.45)] border border-white/[0.06] rounded-[8px] p-3 shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
        <span className="text-white text-xs font-semibold tracking-wider uppercase">
          EQUIPAMENTO
        </span>
      </div>

      {/* 2-Column Grid of 12 slots */}
      <div className="w-full flex-1 grid grid-cols-2 gap-2 content-start overflow-y-auto pr-0.5">
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
