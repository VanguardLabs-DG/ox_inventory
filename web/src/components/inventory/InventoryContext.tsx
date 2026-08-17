import React, { useState, useEffect } from 'react';
import { onUse } from '../../dnd/onUse';
import { onDrop } from '../../dnd/onDrop';
import { Items } from '../../store/items';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { findAvailableSlot, isSlotWithItem } from '../../helpers';
import { setClipboard } from '../../utils/setClipboard';
import { useAppDispatch, useAppSelector, store } from '../../store';
import { closeContextMenu } from '../../store/contextMenu';
import { validateMove } from '../../thunks/validateItems';
import { SlotWithItem } from '../../typings';

interface NearbyPlayer {
  id: number | string;
  name: string;
}

type MenuStep = 'main' | 'use_amount' | 'give_players' | 'give_amount' | 'drop_amount';

export const InventoryContext: React.FC = () => {
  const dispatch = useAppDispatch();
  const contextMenu = useAppSelector((state) => state.contextMenu);
  const item = contextMenu.item;
  const coords = contextMenu.coords;

  const [step, setStep] = useState<MenuStep>('main');
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [selectedPlayer, setSelectedPlayer] = useState<NearbyPlayer | null>(null);
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);

  // Reset state when a new item or coordinates are opened
  useEffect(() => {
    if (coords && item) {
      setStep('main');
      setSelectedAmount(1);
      setSelectedPlayer(null);
    }
  }, [coords, item]);

  if (!coords || !item) return null;

  const totalCount = item.count || 1;

  const handleClose = () => {
    dispatch(closeContextMenu());
  };

  const handleBack = () => {
    if (step === 'give_amount') {
      setStep('give_players');
    } else {
      setStep('main');
    }
  };

  // 1. USE FLOW
  const handleStartUse = () => {
    if (totalCount > 1) {
      setSelectedAmount(1);
      setStep('use_amount');
    } else {
      onUse({ name: item.name, slot: item.slot });
      handleClose();
    }
  };

  const handleConfirmUse = () => {
    onUse({ name: item.name, slot: item.slot });
    handleClose();
  };

  // 2. GIVE FLOW
  const handleStartGive = async () => {
    setLoadingPlayers(true);
    setStep('give_players');

    try {
      const response = await fetchNui<NearbyPlayer[]>('getNearbyPlayers', {});
      if (response && Array.isArray(response) && response.length > 0) {
        setNearbyPlayers(response);
      } else {
        // Fallback for browser mock or when 1 player nearby
        setNearbyPlayers([
          { id: 1, name: '[1] Jogador Próximo' },
          { id: 2, name: '[2] Cidadão Local' },
        ]);
      }
    } catch {
      setNearbyPlayers([
        { id: 1, name: '[1] Jogador Próximo' },
        { id: 2, name: '[2] Cidadão Local' },
      ]);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleSelectPlayer = (player: NearbyPlayer) => {
    setSelectedPlayer(player);
    setSelectedAmount(1);
    setStep('give_amount');
  };

  const handleConfirmGive = () => {
    if (!selectedPlayer) return;
    fetchNui('giveItem', {
      slot: item.slot,
      count: selectedAmount,
      target: selectedPlayer.id,
    });
    handleClose();
  };

  // 3. DROP FLOW
  const handleStartDrop = () => {
    if (totalCount > 1) {
      setSelectedAmount(1);
      setStep('drop_amount');
    } else {
      isSlotWithItem(item) && onDrop({ item: item, inventory: 'player' });
      handleClose();
    }
  };

  const handleConfirmDrop = () => {
    const state = store.getState().inventory;
    const rightInventory = state.rightInventory;
    const sourceSlot = item as SlotWithItem;
    const sourceData = Items[sourceSlot.name] || ({ stack: true } as any);
    const targetSlot = findAvailableSlot(sourceSlot, sourceData, rightInventory.items) || { slot: 1 };

    dispatch(
      validateMove({
        fromSlot: sourceSlot.slot,
        toSlot: typeof targetSlot === 'number' ? targetSlot : targetSlot.slot,
        fromType: 'player',
        toType: rightInventory.type || 'ground',
        count: selectedAmount,
      })
    );
    handleClose();
  };

  // Clamping to screen edges
  const posX = Math.min(coords.x, window.innerWidth - 220);
  const posY = Math.min(coords.y, window.innerHeight - 300);

  return (
    <>
      {/* Invisible backdrop to dismiss menu on click outside */}
      <div
        className="fixed inset-0 z-[9998] bg-transparent"
        onClick={handleClose}
        onContextMenu={(e) => {
          e.preventDefault();
          handleClose();
        }}
      />

      {/* Clean Context Menu Panel */}
      <div
        className="fixed z-[9999] min-w-[190px] max-w-[240px] bg-[rgba(18,22,30,0.96)] border border-white/[0.08] rounded-[6px] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col gap-1.5 select-none text-white"
        style={{ left: `${posX}px`, top: `${posY}px` }}
      >
        {/* Header with Item Name & Quantity */}
        <div className="flex items-center justify-between px-1 pb-1.5 border-b border-white/[0.06]">
          <span className="text-[#FFC857] text-[11px] font-semibold tracking-wide uppercase truncate">
            {item.metadata?.label || item.name}
          </span>
          <span className="text-[10px] font-mono text-white/50 bg-white/10 px-1.5 py-0.5 rounded-[3px]">
            x{totalCount}
          </span>
        </div>

        {/* VIEW: MAIN OPTIONS */}
        {step === 'main' && (
          <div className="flex flex-col gap-1">
            {/* Usar */}
            <button
              type="button"
              onClick={handleStartUse}
              className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-xs font-medium tracking-wide text-white/90 hover:text-[#FFC857] hover:bg-[#E5A93C]/15 transition-all flex items-center justify-between cursor-pointer"
            >
              <span>{Locale.ui_use || 'Usar'}</span>
              <span className="text-[10px] text-[#FFC857]/60">▶</span>
            </button>

            {/* Enviar */}
            <button
              type="button"
              onClick={handleStartGive}
              className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-xs font-medium tracking-wide text-white/90 hover:text-[#FFC857] hover:bg-[#E5A93C]/15 transition-all flex items-center justify-between cursor-pointer"
            >
              <span>{Locale.ui_give || 'Enviar'}</span>
              <span className="text-[10px] text-[#FFC857]/60">➔</span>
            </button>

            {/* Soltar */}
            <button
              type="button"
              onClick={handleStartDrop}
              className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-xs font-medium tracking-wide text-white/90 hover:text-red-400 hover:bg-red-500/15 transition-all flex items-center justify-between cursor-pointer"
            >
              <span>{Locale.ui_drop || 'Soltar'}</span>
              <span className="text-[10px] text-red-400/60">✕</span>
            </button>

            {/* Remover Munição */}
            {item.metadata?.ammo > 0 && (
              <button
                type="button"
                onClick={() => {
                  fetchNui('removeAmmo', item.slot);
                  handleClose();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-xs font-medium tracking-wide text-cyan-300 hover:bg-cyan-500/15 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{Locale.ui_remove_ammo || 'Remover Munição'}</span>
                <span className="text-[10px] text-cyan-300/60">⏏</span>
              </button>
            )}

            {/* Copiar Serial */}
            {item.metadata?.serial && (
              <button
                type="button"
                onClick={() => {
                  setClipboard(item.metadata?.serial || '');
                  handleClose();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-xs font-medium tracking-wide text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{Locale.ui_copy || 'Copiar Serial'}</span>
                <span className="text-[9px] font-mono text-white/40">#{item.metadata.serial.slice(0, 6)}</span>
              </button>
            )}

            {/* Acessórios */}
            {item.metadata?.components && item.metadata.components.length > 0 && (
              <div className="pt-1 border-t border-white/[0.06]">
                <span className="text-[9px] text-white/40 uppercase tracking-wider px-2 block mb-0.5">
                  {Locale.ui_removeattachments || 'Acessórios'}
                </span>
                {item.metadata.components.map((component: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      fetchNui('removeComponent', { component, slot: item.slot });
                      handleClose();
                    }}
                    className="w-full text-left px-2.5 py-1 rounded-[4px] text-[11px] font-medium text-white/80 hover:text-amber-300 hover:bg-amber-500/10 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{Items[component]?.label || component}</span>
                    <span className="text-[10px] text-red-400">✕</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: SELECT NEARBY PLAYER */}
        {step === 'give_players' && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06] text-[10px] text-white/60">
              <span className="uppercase">JOGADORES PRÓXIMOS</span>
              <button
                type="button"
                onClick={handleBack}
                className="text-[#FFC857] hover:underline cursor-pointer"
              >
                ← Voltar
              </button>
            </div>

            {loadingPlayers ? (
              <div className="py-3 text-center text-xs text-white/50">Procurando...</div>
            ) : nearbyPlayers.length === 0 ? (
              <div className="py-2 text-center text-xs text-red-400">Nenhum jogador próximo</div>
            ) : (
              <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto pr-1">
                {nearbyPlayers.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => handleSelectPlayer(player)}
                    className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-xs font-medium text-white/90 hover:text-[#FFC857] hover:bg-[#E5A93C]/15 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{player.name}</span>
                    <span className="text-[10px] text-[#FFC857]">➔</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: AMOUNT SELECTOR (FOR USE, GIVE, DROP) */}
        {(step === 'use_amount' || step === 'give_amount' || step === 'drop_amount') && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.06] text-[10px] text-white/60">
              <span className="uppercase text-[9px] font-semibold tracking-wider">
                {step === 'use_amount'
                  ? 'QUANTIDADE A USAR'
                  : step === 'give_amount'
                  ? `ENVIAR PARA ${selectedPlayer?.name || 'JOGADOR'}`
                  : 'QUANTIDADE A SOLTAR'}
              </span>
              <button
                type="button"
                onClick={handleBack}
                className="text-[#FFC857] hover:underline cursor-pointer text-[10px]"
              >
                ← Voltar
              </button>
            </div>

            {/* Stepper Counter */}
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-[6px] p-1">
              <button
                type="button"
                onClick={() => setSelectedAmount((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 bg-white/10 hover:bg-[#E5A93C]/25 text-white font-bold rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={totalCount}
                value={selectedAmount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setSelectedAmount(Math.min(totalCount, Math.max(1, val)));
                  }
                }}
                className="w-16 bg-transparent text-center text-sm font-bold font-mono text-[#FFC857] outline-none"
              />
              <button
                type="button"
                onClick={() => setSelectedAmount((prev) => Math.min(totalCount, prev + 1))}
                className="w-7 h-7 bg-white/10 hover:bg-[#E5A93C]/25 text-white font-bold rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setSelectedAmount(1)}
                className="py-1 text-[10px] bg-white/5 hover:bg-white/15 rounded-[4px] text-white/80 font-semibold transition-colors cursor-pointer"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setSelectedAmount(Math.max(1, Math.floor(totalCount / 2)))}
                className="py-1 text-[10px] bg-white/5 hover:bg-white/15 rounded-[4px] text-white/80 font-semibold transition-colors cursor-pointer"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setSelectedAmount(totalCount)}
                className="py-1 text-[10px] bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 text-[#FFC857] rounded-[4px] font-semibold transition-colors cursor-pointer"
              >
                TUDO
              </button>
            </div>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={
                step === 'use_amount'
                  ? handleConfirmUse
                  : step === 'give_amount'
                  ? handleConfirmGive
                  : handleConfirmDrop
              }
              className={`w-full py-2 rounded-[5px] text-xs font-semibold tracking-wider uppercase transition-all shadow-lg cursor-pointer ${
                step === 'drop_amount'
                  ? 'bg-red-600/80 hover:bg-red-500 text-white shadow-red-900/30'
                  : 'bg-[#FFC857] hover:bg-[#E5A93C] text-black shadow-amber-900/30'
              }`}
            >
              {step === 'use_amount'
                ? `USAR (${selectedAmount})`
                : step === 'give_amount'
                ? `ENVIAR (${selectedAmount})`
                : `SOLTAR (${selectedAmount})`}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default InventoryContext;
