import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import UsefulControls from './UsefulControls';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();
  const [infoVisible, setInfoVisible] = useState(false);

  const [{ isOverUse }, use] = useDrop<DragSource, void, { isOverUse: boolean }>(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({
      isOverUse: monitor.isOver(),
    }),
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [{ isOverGive }, give] = useDrop<DragSource, void, { isOverGive: boolean }>(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({
      isOverGive: monitor.isOver(),
    }),
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />

      <div className="inventory-control flex flex-col items-center justify-start px-2 gap-3 z-10">
        {/* Quantity Input Field */}
        <div className="flex flex-col items-center w-full">
          <label className="text-[#E5A93C] text-[10px] font-mono tracking-wider mb-1 uppercase opacity-80">
            QUANTIDADE
          </label>
          <input
            className="w-24 px-2 py-1.5 bg-[rgba(10,13,18,0.85)] border border-[rgba(229,169,60,0.3)] focus:border-[#FFC857] text-[#FFC857] text-center font-hud text-base font-bold rounded outline-none transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_12px_rgba(229,169,60,0.3)]"
            type="number"
            placeholder="0"
            defaultValue={itemAmount || ''}
            onChange={inputHandler}
          />
        </div>

        {/* Tactical Drop Zones */}
        <div
          ref={use}
          className={`w-28 py-3 flex flex-col items-center justify-center rounded border transition-all duration-150 cursor-pointer ${
            isOverUse
              ? 'bg-[#E5A93C]/30 border-[#FFC857] shadow-[0_0_15px_rgba(229,169,60,0.5)] scale-105'
              : 'bg-[rgba(10,13,18,0.7)] border-[rgba(229,169,60,0.25)] hover:border-[#FFC857]/60'
          }`}
        >
          <span className="text-[#FFC857] text-xs font-cyber font-bold tracking-widest uppercase">
            USAR
          </span>
          <span className="text-white text-opacity-40 text-[9px] font-mono">
            [SOLTE AQUI]
          </span>
        </div>

        <div
          ref={give}
          className={`w-28 py-3 flex flex-col items-center justify-center rounded border transition-all duration-150 cursor-pointer ${
            isOverGive
              ? 'bg-[#E5A93C]/30 border-[#FFC857] shadow-[0_0_15px_rgba(229,169,60,0.5)] scale-105'
              : 'bg-[rgba(10,13,18,0.7)] border-[rgba(229,169,60,0.25)] hover:border-[#FFC857]/60'
          }`}
        >
          <span className="text-[#FFC857] text-xs font-cyber font-bold tracking-widest uppercase">
            ENVIAR
          </span>
          <span className="text-white text-opacity-40 text-[9px] font-mono">
            [JOGADOR PRÓXIMO]
          </span>
        </div>
      </div>

      {/* Info Help Button */}
      <button
        className="useful-controls-button bg-[rgba(10,13,18,0.8)] border border-[rgba(229,169,60,0.3)] hover:border-[#FFC857] text-[#FFC857] transition-all rounded p-2"
        onClick={() => setInfoVisible(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="1.1em" fill="currentColor" viewBox="0 0 524 524">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      </button>
    </>
  );
};

export default InventoryControl;
