import React, { useState } from 'react';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Items } from '../../store/items';
import WeightBar from '../utils/WeightBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { SlotWithItem } from '../../typings';
import SlideUp from '../utils/transitions/SlideUp';

const isUniqueItem = (item: SlotWithItem): boolean => {
  if (Items[item.name]?.stack === false) return true;
  const nameLower = (item.name || '').toLowerCase();
  if (nameLower.startsWith('weapon_')) return true;
  if (item.durability !== undefined || item.metadata?.durability !== undefined) return true;
  if (item.metadata?.serial !== undefined || item.metadata?.plate !== undefined) return true;
  if (nameLower.includes('chave') || nameLower.includes('key')) return true;
  if (nameLower.includes('carteira') || nameLower.includes('license') || nameLower.includes('identity')) return true;
  return false;
};

const InventoryHotbar: React.FC = () => {
  const [hotbarVisible, setHotbarVisible] = useState(false);
  const rawItems = useAppSelector(selectLeftInventory).items || [];
  const hotbarSlots = [1, 2, 3, 4, 5].map((slotNum) => {
    const found = rawItems.find((i) => i?.slot === slotNum);
    return found || { slot: slotNum };
  });

  const [handle, setHandle] = useState<NodeJS.Timeout>();
  useNuiEvent('toggleHotbar', () => {
    if (hotbarVisible) {
      setHotbarVisible(false);
    } else {
      if (handle) clearTimeout(handle);
      setHotbarVisible(true);
      setHandle(setTimeout(() => setHotbarVisible(false), 3000));
    }
  });

  return (
    <SlideUp in={hotbarVisible}>
      <div className="hotbar-container">
        {hotbarSlots.map((item) => {
          const itemLabel = isSlotWithItem(item)
            ? item.metadata?.label || Items[item.name]?.label || item.name
            : '';

          const formattedWeight = isSlotWithItem(item) && item.weight > 0
            ? item.weight >= 1000
              ? `${(item.weight / 1000).toLocaleString('en-us', { maximumFractionDigits: 1 })}kg`
              : `${item.weight.toLocaleString('en-us', { maximumFractionDigits: 0 })}g`
            : '';

          const itemDurability = isSlotWithItem(item)
            ? (item.durability !== undefined ? item.durability : item.metadata?.durability)
            : undefined;

          const shouldShowCount = isSlotWithItem(item) && (
            (item.name === 'money') ||
            (!isUniqueItem(item as SlotWithItem) && item.count !== undefined && item.count >= 1) ||
            (isUniqueItem(item as SlotWithItem) && item.count !== undefined && item.count > 1)
          );

          return (
            <div
              className={`inventory-slot group relative ${!isSlotWithItem(item) ? 'inventory-slot--empty' : ''}`}
              style={{ width: '9.6vh', height: '9.6vh' }}
              key={`hotbar-tab-${item.slot}`}
            >
              {/* Empty Slot Keycap */}
              {!isSlotWithItem(item) && (
                <>
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-[3px] bg-white/[0.04] border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-white/35 pointer-events-none z-20">
                    {item.slot}
                  </div>
                  <div className="hotbar-slot-number">{item.slot}</div>
                </>
              )}

              {isSlotWithItem(item) && (
                <div className="w-full h-full flex flex-col justify-between p-1 select-none relative">
                  {/* Top Row: Hotbar Key (Left) & Weight / Count (Right) */}
                  <div className="w-full flex items-center justify-between px-0.5 pointer-events-none z-10">
                    <div className="w-4 h-4 rounded-[3px] bg-[#10141E] border border-[#FFC857]/50 flex items-center justify-center text-[10px] font-mono font-bold text-[#FFC857] shadow-[0_0_8px_rgba(255,200,87,0.25)]">
                      {item.slot}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {formattedWeight && !shouldShowCount && (
                        <span className="text-[9px] font-mono text-[#8E9297] tracking-tight font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">
                          {formattedWeight}
                        </span>
                      )}

                      {shouldShowCount && item.count !== undefined && (
                        <span
                          className={`text-[10px] font-mono font-semibold tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] leading-none ${
                            item.name === 'money' ? 'text-[#FFC857]' : 'text-white/85'
                          }`}
                        >
                          {item.name === 'money'
                            ? `R$ ${item.count.toLocaleString('en-us')}`
                            : `${item.count}x`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center Main Item Icon */}
                  <div className="flex-1 w-full flex items-center justify-center pointer-events-none px-1 relative my-auto min-h-0">
                    <img
                      src={getItemUrl(item as SlotWithItem)}
                      alt={itemLabel}
                      className="max-h-[44px] max-w-[85%] object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] transition-transform duration-140 pointer-events-none"
                    />
                  </div>

                  {/* Bottom Row: Label & Durability */}
                  <div className="w-full flex flex-col pointer-events-none z-10 px-0.5 pb-0.5 overflow-hidden">
                    <span className="inventory-slot-label-text" title={itemLabel}>
                      {itemLabel}
                    </span>

                    {itemDurability !== undefined && (
                      <div className="w-full mt-1">
                        <WeightBar percent={itemDurability} durability />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SlideUp>
  );
};

export default InventoryHotbar;
