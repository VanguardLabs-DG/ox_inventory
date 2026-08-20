import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
}

interface ActiveNotification {
  id: number;
  item: ItemNotificationProps;
  isExiting: boolean;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = React.useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotificationCard: React.FC<{ notification: ActiveNotification }> = ({ notification }) => {
  const slotItem = notification.item.item;
  const itemLabel = slotItem.metadata?.label || Items[slotItem.name]?.label || slotItem.name;
  const isNegative = notification.item.text.toLowerCase().includes('remov') || notification.item.text.toLowerCase().includes('usad');

  return (
    <div
      className={`item-notification-toast ${notification.isExiting ? 'item-notification-toast--exiting' : ''} relative flex items-center space-x-3.5 rounded-[6px] pl-3.5 pr-4 py-2.5 shadow-[0_10px_32px_rgba(0,0,0,0.85)] select-none min-w-[220px] max-w-[300px] overflow-hidden`}
      style={{
        background: 'linear-gradient(135deg, rgba(16, 22, 34, 0.68) 0%, rgba(9, 13, 20, 0.72) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: isNegative ? '3px solid #EF4444' : '3px solid #FFC857',
        boxShadow: isNegative
          ? '0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px rgba(239,68,68,0.15)'
          : '0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px rgba(255,200,87,0.15)',
      }}
    >
      {/* Left: Premium Stylized Item Thumbnail Nicho */}
      <div
        className="w-11 h-11 rounded-[5px] border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner relative"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      >
        <img
          src={getItemUrl(slotItem)}
          alt={itemLabel}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
        />
      </div>

      {/* Right: Action Badge and Item Title */}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={`text-[10.5px] font-mono font-bold uppercase tracking-wider leading-none mb-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
            isNegative ? 'text-red-400' : 'text-[#FFC857]'
          }`}
        >
          {notification.item.text}
        </span>
        <span
          className="text-[13px] font-semibold text-white font-['Barlow_Condensed',sans-serif] uppercase tracking-wide truncate leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
          title={itemLabel}
        >
          {itemLabel}
        </span>
      </div>
    </div>
  );
};

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);

  const add = (item: ItemNotificationProps) => {
    const id = Date.now() + Math.random();
    const newNotif: ActiveNotification = { id, item, isExiting: false };

    setNotifications((prev) => [...prev, newNotif]);

    // Start exit animation after 2.4s
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isExiting: true } : n))
      );
    }, 2400);

    // Completely unmount after exit animation finishes (2.7s)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2700);
  };

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: count ? `${Locale[text]} ${count}x` : `${Locale[text]}` });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {notifications.length > 0 &&
        createPortal(
          <div className="item-notification-container">
            {notifications.map((notification) => (
              <ItemNotificationCard key={notification.id} notification={notification} />
            ))}
          </div>,
          document.body
        )}
    </ItemNotificationsContext.Provider>
  );
};

export default ItemNotificationsProvider;
