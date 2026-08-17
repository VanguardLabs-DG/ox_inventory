import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { canCraftItem, canPurchaseItem, getItemUrl, isSlotWithItem } from '../../helpers';
import { useAppDispatch } from '../../store';
import { onBuy } from '../../dnd/onBuy';
import { onDrop } from '../../dnd/onDrop';
import { onUse } from '../../dnd/onUse';
import { onCraft } from '../../dnd/onCraft';
import { closeTooltip, openTooltip } from '../../store/tooltip';
import { openContextMenu } from '../../store/contextMenu';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';
import { useMergeRefs } from '@floating-ui/react';
import { Inventory, Slot, SlotWithItem } from '../../typings';

interface InventorySlotProps {
  item: Slot;
  inventoryType: Inventory['type'];
  inventoryGroups?: Inventory['groups'];
  hotbarNumber?: number;
}

export const InventorySlot = React.forwardRef<HTMLDivElement, InventorySlotProps>(
  ({ item, inventoryType, inventoryGroups, hotbarNumber }, ref) => {
    const dispatch = useAppDispatch();
    const timerRef = useRef<number | null>(null);

    const [, drag] = useDrag(
      () => ({
        type: 'SLOT',
        canDrag: () => isSlotWithItem(item),
        item: () => {
          dispatch(closeTooltip());
          return {
            inventory: inventoryType,
            item: item,
          };
        },
      }),
      [item, inventoryType]
    );

    const [{ isOver }, drop] = useDrop(
      () => ({
        accept: 'SLOT',
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
        drop: (source: { inventory: string; item: SlotWithItem }) => {
          if (source.item.slot === item.slot && source.inventory === inventoryType) return;
          if (source.inventory === 'shop') {
            onBuy(source, { inventory: inventoryType, item: item });
          } else if (source.inventory === 'crafting') {
            onCraft(source, { inventory: inventoryType, item: item });
          } else {
            onDrop(source, { inventory: inventoryType, item: item });
          }
        },
      }),
      [item, inventoryType]
    );

    const connectRef = (element: HTMLDivElement) => {
      drag(element);
      drop(element);
    };

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

    return (
      <div
        ref={refs}
        onContextMenu={handleContext}
        onClick={handleClick}
        className={`inventory-slot ${!isSlotWithItem(item) && 'inventory-slot--empty'} ${
          isOver ? 'border-[#FFC857] shadow-[0_0_12px_rgba(255,200,87,0.3)]' : ''
        }`}
        style={{
          filter:
            !canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) || !canCraftItem(item, inventoryType)
              ? 'brightness(60%) grayscale(40%)'
              : undefined,
          backgroundImage: isSlotWithItem(item) ? `url(${getItemUrl(item)})` : 'none',
        }}
      >
        {/* Discrete Hotbar Number (1-5) */}
        {hotbarNumber && (
          <span className="absolute top-1 left-1.5 text-white/40 font-mono text-[10px] font-semibold pointer-events-none z-10">
            {hotbarNumber}
          </span>
        )}

        {isSlotWithItem(item) && (
          <div
            className="item-slot-wrapper"
            onMouseEnter={() => {
              timerRef.current = setTimeout(() => {
                dispatch(openTooltip({ item, inventoryType }));
              }, 300) as unknown as number;
            }}
            onMouseLeave={() => {
              dispatch(closeTooltip());
              if (timerRef.current) {
                clearTimeout(timerRef.current as unknown as number);
                timerRef.current = null;
              }
            }}
          >
            {/* Top row: Weight on left, Count Badge pinned on top-right */}
            <div className="flex items-center justify-between w-full px-1 pt-1">
              {item.weight > 0 ? (
                <span className={`inventory-weight font-mono ${hotbarNumber ? 'ml-3.5' : ''}`}>
                  {item.weight >= 1000
                    ? `${(item.weight / 1000).toLocaleString('en-us', {
                        maximumFractionDigits: 1,
                      })} kg`
                    : `${item.weight.toLocaleString('en-us', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1,
                      })} g`}
                </span>
              ) : (
                <div className={hotbarNumber ? 'ml-3.5' : ''} />
              )}

              {item.count && (
                <span className="inventory-slot-count-badge">
                  {item.name === 'money' ? `R$ ${item.count.toLocaleString('en-us')}` : `x${item.count.toLocaleString('en-us')}`}
                </span>
              )}
            </div>

            {/* Bottom: Item label & Durability */}
            <div>
              <div className="px-1.5 pb-1 flex items-center justify-between flex-wrap gap-1">
                <div className="inventory-slot-label-text">
                  {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
                </div>
              </div>
              {item.durability !== undefined && (
                <div className="px-1 pb-1">
                  <div className="durability-bar">
                    <div
                      className="durability-fill"
                      style={{
                        width: `${item.durability}%`,
                        backgroundColor:
                          item.durability > 50 ? '#10B981' : item.durability > 20 ? '#F59E0B' : '#EF4444',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default InventorySlot;
