'use client';

import React, { useState } from 'react';
import { NotificationRecord } from '@/types/logistics';
import { 
  MessageSquare, 
  Mail, 
  Bell, 
  Send, 
  CheckCheck, 
  Clock, 
  X, 
  Smartphone,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { dispatchAfricaTalkingSMS, formatGhanaPhoneNumber } from '@/lib/africasTalking';

interface NotificationCenterProps {
  notifications: NotificationRecord[];
  isOpen: boolean;
  onClose: () => void;
  onAddNotification: (notif: Omit<NotificationRecord, 'id' | 'timestamp' | 'status'>) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onAddNotification,
}) => {
  const [testPhone, setTestPhone] = useState('+233 55 445 3553');
  const [testMessage, setTestMessage] = useState('LogiFlow Alert: Your shipment has been picked up from Tema Depot.');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendTestSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;

    setIsSending(true);
    setSendResult(null);

    try {
      const response = await dispatchAfricaTalkingSMS({
        to: testPhone,
        message: testMessage,
      });

      onAddNotification({
        type: 'sms',
        title: "Africa's Talking Manual SMS",
        recipient: formatGhanaPhoneNumber(testPhone),
        content: testMessage,
        gateway: "Africa's Talking",
      });

      setSendResult(`SMS Dispatched! Message ID: ${response.messageId} (Est. cost: GH₵${response.costEstimateGHS})`);
      setTimeout(() => setSendResult(null), 4000);
    } catch {
      setSendResult('Error dispatching SMS.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in">
      <div className="w-full max-w-lg h-full bg-white border-l border-borderBrand shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-borderBrand flex items-center justify-between bg-paper">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <p className="eyebrow">COMMUNICATION GATEWAYS</p>
            </div>
            <h3 className="text-lg font-extrabold text-ink">
              Multi-Channel Notifications
            </h3>
            <p className="text-xs text-mutedBrand">
              Africa&apos;s Talking SMS API, Google Email, and System push alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-borderBrand hover:bg-white text-ink transition"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-mutedBrand font-mono">
            <span>ACTIVITY STREAM ({notifications.length})</span>
            <span>GATEWAY LOG</span>
          </div>

          {notifications.map((notif) => {
            const isSMS = notif.type === 'sms';
            const isSystem = notif.type === 'system';

            return (
              <div
                key={notif.id}
                className="service-tile rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isSMS
                          ? 'bg-primary/20 text-primary-dark'
                          : isSystem
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-secondaryBrand text-ink'
                      }`}
                    >
                      {isSMS ? (
                        <Smartphone className="w-3.5 h-3.5" />
                      ) : isSystem ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-ink">{notif.title}</h4>
                      <p className="text-[10px] text-mutedBrand font-mono">
                        To: {notif.recipient}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-mutedBrand font-mono whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-ink/80 bg-paper/80 p-2 rounded-lg border border-borderBrand/50 leading-relaxed font-mono text-[11px] mb-2">
                  &ldquo;{notif.content}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-mutedBrand">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-primary-dark" />
                    Gateway: {notif.gateway}
                  </span>
                  <span className="flex items-center gap-0.5 text-green-700 font-semibold">
                    <CheckCheck className="w-3 h-3" />
                    Delivered
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Panel: Africa's Talking Interactive SMS Dispatcher */}
        <div className="p-5 border-t border-borderBrand bg-paper">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-primary-dark" />
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
              Test Africa&apos;s Talking SMS Gateway
            </h4>
          </div>

          <form onSubmit={handleSendTestSMS} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-mono text-mutedBrand uppercase mb-1">
                Recipient Ghana Phone Number
              </label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+233 55 445 3553"
                className="w-full bg-white text-xs px-3 py-1.5 rounded-lg border border-borderBrand focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-mutedBrand uppercase mb-1">
                SMS Content
              </label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={2}
                className="w-full bg-white text-xs p-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-1 focus:ring-primary resize-none font-sans"
                required
              />
            </div>

            {sendResult && (
              <div className="p-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg font-mono">
                {sendResult}
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2 bg-ink text-white rounded-xl text-xs font-bold hover:bg-ink/90 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-primary" />
              <span>{isSending ? 'Transmitting via Gateway...' : 'Send Africa’s Talking SMS'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
