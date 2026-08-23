"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import {
  useMyNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationsRealtime,
} from '@/hooks/use-notifications';
import type { AppNotification } from '@/queries/notifications';

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const NotificationBell = () => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [open, setOpen] = useState(false);

  useNotificationsRealtime(userId);
  const { data: notifications = [] } = useMyNotifications(userId);
  const { data: unreadCount = 0 } = useUnreadNotificationCount(userId);
  const markRead = useMarkNotificationRead(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);

  const handleClick = (n: AppNotification) => {
    if (!n.isRead) markRead.mutate(n.id);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative cursor-pointer p-1.5 rounded-full hover:bg-slate-50 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl border border-slate-100 shadow-xl z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllRead.mutate()}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 ${!n.isRead ? 'bg-indigo-50/40' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {notifications.length === 0 && (
                  <div className="px-4 py-8 text-center text-xs text-slate-500">No notifications yet.</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
