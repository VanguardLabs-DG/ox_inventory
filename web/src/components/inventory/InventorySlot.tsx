import React, { useRef, useState } from 'react';
import { DragSource, Inventory, InventoryType, Slot, SlotWithItem } from '../../typings';
import { useDrag, useDragDropManager, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../store';
import WeightBar from '../utils/WeightBar';
import { onDrop } from '../../dnd/onDrop';
import { onBuy } from '../../dnd/onBuy';
import { Items } from '../../store/items';
import { canCraftItem, canPurchaseItem, getItemUrl, isSlotWithItem } from '../../helpers';
import { onUse } from '../../dnd/onUse';
import { Locale } from '../../store/locale';
import { onCraft } from '../../dnd/onCraft';
import useNuiEvent from '../../hooks/useNuiEvent';
import { ItemsPayload } from '../../reducers/refreshSlots';
import { closeTooltip, openTooltip } from '../../store/tooltip';
import { openContextMenu } from '../../store/contextMenu';
import { useMergeRefs } from '@floating-ui/react';

interface SlotProps {
  inventoryId?: Inventory['id'];
  inventoryType: Inventory['type'];
  inventoryGroups?: Inventory['groups'];
  item: Slot;
  hotbarNumber?: number;
}

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

const InventorySlot: React.ForwardRefRenderFunction<HTMLDivElement, SlotProps> = (
  { item, inventoryId, inventoryType, inventoryGroups, hotbarNumber },
  ref
) => {
  const manager = useDragDropManager();
  const dispatch = useAppDispatch();
  const timerRef = useRef<number | null>(null);
  const [imgError, setImgError] = useState(false);

  const canDrag = React.useCallback(() => {
    return canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) && canCraftItem(item, inventoryType);
  }, [item, inventoryType, inventoryGroups]);

  const [{ isDragging }, drag] = useDrag<DragSource, void, { isDragging: boolean }>(
    () => ({
      type: 'SLOT',
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () =>
        isSlotWithItem(item, inventoryType !== InventoryType.SHOP)
          ? {
              inventory: inventoryType,
              item: {
                name: item.name,
                slot: item.slot,
              },
              image: item?.name && `url(${getItemUrl(item) || 'none'}`,
            }
          : null,
      canDrag,
    }),
    [inventoryType, item]
  );

  const [{ isOver }, drop] = useDrop<DragSource, void, { isOver: boolean }>(
    () => ({
      accept: 'SLOT',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      drop: (source) => {
        dispatch(closeTooltip());
        switch (source.inventory) {
          case InventoryType.SHOP:
            onBuy(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
          case InventoryType.CRAFTING:
            onCraft(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
          default:
            onDrop(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
        }
      },
      canDrop: (source) =>
        (source.item.slot !== item.slot || source.inventory !== inventoryType) &&
        inventoryType !== InventoryType.SHOP &&
        inventoryType !== InventoryType.CRAFTING,
    }),
    [inventoryType, item]
  );

  useNuiEvent('refreshSlots', (data: { items?: ItemsPayload | ItemsPayload[] }) => {
    if (!isDragging && !data.items) return;
    if (!Array.isArray(data.items)) return;

    const itemSlot = data.items.find(
      (dataItem) => dataItem.item.slot === item.slot && dataItem.inventory === inventoryId
    );

    if (!itemSlot) return;

    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  const connectRef = (element: HTMLDivElement) => drag(drop(element));

  const handleContext = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inventoryType !== 'player' || !isSlotWithItem(item)) return;

    dispatch(openContextMenu({ item, coords: { x: event.clientX, y: event.clientY } }));
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    dispatch(closeTooltip());
    if (timerRef.current) clearTimeout(timerRef.current as unknown as number);
    if (event.ctrlKey && isSlotWithItem(item) && inventoryType !== 'shop' && inventoryType !== 'crafting') {
      onDrop({ item: item, inventory: inventoryType });
    } else if (event.altKey && isSlotWithItem(item) && inventoryType === 'player') {
      onUse(item);
    }
  };

  const refs = useMergeRefs([connectRef, ref]);

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

  const isHotbarSlot = (hotbarNumber !== undefined) || (item.slot <= 5 && inventoryType === 'player');
  const slotKeyNumber = hotbarNumber || (item.slot <= 5 && inventoryType === 'player' ? item.slot : undefined);

  // Accurate Stackable vs Unique count display:
  const shouldShowCount = isSlotWithItem(item) && (
    (item.name === 'money') ||
    (!isUniqueItem(item as SlotWithItem) && item.count !== undefined && item.count >= 1) ||
    (isUniqueItem(item as SlotWithItem) && item.count !== undefined && item.count > 1)
  );

  return (
    <div
      ref={refs}
      onContextMenu={handleContext}
      onClick={handleClick}
      className={`inventory-slot group relative ${!isSlotWithItem(item) ? 'inventory-slot--empty' : ''}`}
      style={{
        filter:
          !canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) || !canCraftItem(item, inventoryType)
            ? 'brightness(80%) grayscale(100%)'
            : undefined,
        opacity: isDragging ? 0.3 : 1.0,
        border: isOver ? '1px solid #FFC857' : undefined,
      }}
    >
      {/* Empty Hotbar Slot Keycap */}
      {!isSlotWithItem(item) && isHotbarSlot && slotKeyNumber && (
        <>
          <div className="absolute top-1 left-1 w-4 h-4 rounded-[3px] bg-white/[0.04] border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-white/35 pointer-events-none z-20">
            {slotKeyNumber}
          </div>
          <div className="hotbar-slot-number">{slotKeyNumber}</div>
        </>
      )}

      {isSlotWithItem(item) && (
        <div
          className="w-full h-full flex flex-col justify-between p-1 select-none relative"
          onMouseEnter={() => {
            timerRef.current = window.setTimeout(() => {
              dispatch(openTooltip({ item, inventoryType }));
            }, 250) as unknown as number;
          }}
          onMouseLeave={() => {
            dispatch(closeTooltip());
            if (timerRef.current) {
              clearTimeout(timerRef.current as unknown as number);
              timerRef.current = null;
            }
          }}
        >
          {/* Top Row: Left Side (Hotbar Key OR Weight) & Right Side (Weight OR Quantity/Price) */}
          <div className="w-full flex items-center justify-between px-0.5 pointer-events-none z-10">
            {/* Left Corner */}
            <div>
              {isHotbarSlot && slotKeyNumber ? (
                <div className="w-4 h-4 rounded-[3px] bg-[#10141E] border border-[#FFC857]/50 flex items-center justify-center text-[10px] font-mono font-bold text-[#FFC857] shadow-[0_0_8px_rgba(255,200,87,0.25)]">
                  {slotKeyNumber}
                </div>
              ) : formattedWeight ? (
                <span className="text-[9px] font-mono text-[#8E9297] tracking-tight font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">
                  {formattedWeight}
                </span>
              ) : null}
            </div>

            {/* Right Corner */}
            <div className="flex items-center space-x-1.5">
              {/* If hotbar slot, render weight anchored on top right */}
              {isHotbarSlot && slotKeyNumber && formattedWeight && !shouldShowCount && (
                <span className="text-[9px] font-mono text-[#8E9297] tracking-tight font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">
                  {formattedWeight}
                </span>
              )}

              {inventoryType === 'shop' && item?.price !== undefined && (
                <span className="text-[10px] font-mono font-semibold text-[#FFC857] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">
                  {Locale.$ || 'R$'} {item.price.toLocaleString('en-us')}
                </span>
              )}

              {/* Quantity: Rendered for stackable items and money */}
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

          {/* Center Main Item Icon with Volumetric Drop-Shadow & Image Error Fallback */}
          <div className="flex-1 w-full flex items-center justify-center pointer-events-none px-1 relative my-auto min-h-0">
            {!imgError ? (
              <img
                src={getItemUrl(item as SlotWithItem)}
                alt={itemLabel}
                onError={() => setImgError(true)}
                className="max-h-[44px] max-w-[85%] object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] transition-transform duration-140 group-hover:scale-105 pointer-events-none"
              />
            ) : (
              /* Neutral Clean Fallback Silhouette */
              <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>

          {/* Bottom Row: Clean Compact Label & 2px Integrated Durability Bar */}
          <div className="w-full flex flex-col pointer-events-none z-10 px-0.5 pb-0.5 overflow-hidden">
            <span
              className="inventory-slot-label-text"
              title={itemLabel}
            >
              {itemLabel}
            </span>

            {inventoryType !== 'shop' && itemDurability !== undefined && (
              <div className="w-full mt-1">
                <WeightBar percent={itemDurability} durability />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(React.forwardRef(InventorySlot));
