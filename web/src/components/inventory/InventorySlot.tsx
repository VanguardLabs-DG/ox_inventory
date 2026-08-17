import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../store';
import { Items } from '../../store/items';
import { openTooltip, closeTooltip } from '../../store/tooltip';
import { Slot, SlotWithItem } from '../../typings';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import { openContextMenu } from '../../store/contextMenu';
import { canCraftItem, canPurchaseItem } from '../../helpers';
import WeightBar from '../utils/WeightBar';
import { useMergeRefs } from '@floating-ui/react';
import { onDrop } from '../../dnd/onDrop';
import { onUse } from '../../dnd/onUse';
import { onBuy } from '../../dnd/onBuy';
import { onCraft } from '../../dnd/onCraft';
import { Locale } from '../../store/locale';

interface SlotProps {
  item: Slot;
  inventoryType: string;
  inventoryGroups?: Record<string, number>;
}

const InventorySlot: React.ForwardRefRenderFunction<HTMLDivElement, SlotProps> = (
  { item, inventoryType, inventoryGroups },
  ref
) => {
  const dispatch = useAppDispatch();
  const timerRef = useRef<number | null>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'SLOT',
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => {
        if (!isSlotWithItem(item)) return;
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
      className={`inventory-slot ${!isSlotWithItem(item) && 'inventory-slot--empty'}`}
      style={{
        filter:
          !canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) || !canCraftItem(item, inventoryType)
            ? 'brightness(80%) grayscale(100%)'
            : undefined,
        opacity: isDragging ? 0.4 : 1.0,
        backgroundImage: `url(${item?.name ? getItemUrl(item as SlotWithItem) : 'none'}`,
        borderColor: isOver ? '#FFC857' : undefined,
      }}
    >
      {/* Hotbar Slot Number indicator (1 - 5) */}
      {item.slot <= 5 && inventoryType === 'player' && (
        <div className="absolute top-0 left-0 px-1.5 py-0.5 bg-[#E5A93C] text-[#080A0E] text-[10px] font-bold font-hud rounded-br leading-none z-10 shadow">
          {item.slot}
        </div>
      )}

      {isSlotWithItem(item) && (
        <div
          className="item-slot-wrapper"
          onMouseEnter={() => {
            timerRef.current = window.setTimeout(() => {
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
          <div className="px-1 pt-1 flex items-start justify-between flex-wrap gap-1">
            {item.weight > 0 ? (
              <span className="inventory-weight font-mono">
                {item.weight >= 1000
                  ? `${(item.weight / 1000).toLocaleString('en-us', {
                      maximumFractionDigits: 1,
                    })} kg `
                  : `${item.weight.toLocaleString('en-us', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })} g `}
              </span>
            ) : (
              <div />
            )}

            <div className="flex flex-col items-end gap-1">
              {inventoryType === 'shop' && item?.price !== undefined && (
                <>
                  {item?.currency !== 'money' && item.currency !== 'black_money' && item.price > 0 && item.currency ? (
                    <div className="item-slot-currency-wrapper">
                      <img
                        src={item.currency ? getItemUrl(item.currency) : 'none'}
                        alt="item-image"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          height: 'auto',
                          width: '2vh',
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)',
                        }}
                      />
                      <p className="font-hud">{item.price.toLocaleString('en-us')}</p>
                    </div>
                  ) : (
                    <>
                      {item.price > 0 && (
                        <div
                          className={`item-slot-price-wrapper ${
                            item.currency === 'money' || !item.currency ? 'text-[#FFC857]' : 'text-red-400'
                          }`}
                        >
                          <p className="font-hud">
                            {Locale.$ || 'R$'}
                            {item.price.toLocaleString('en-us')}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {item.count && (
                <span className="inventory-slot-count-badge font-hud font-bold">
                  {item.name === 'money' ? `R$ ${item.count.toLocaleString('en-us')}` : `x${item.count.toLocaleString('en-us')}`}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="px-1 pb-1 flex items-center justify-between flex-wrap gap-1">
              <div className="inventory-slot-label-text font-cyber font-semibold">
                {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
              </div>
            </div>

            {inventoryType !== 'shop' && item?.durability !== undefined && (
              <WeightBar percent={item.durability} durability />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(React.forwardRef(InventorySlot));
