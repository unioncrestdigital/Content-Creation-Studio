import React, { useState } from 'react';
import { X, Send, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { VideoClip, AspectRatioType } from '../utils/studioEngine';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClip?: VideoClip;
  aspectRatio: AspectRatioType;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  activeClip,
  aspectRatio,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageText, setMessageText] = useState(
    'Check out this new video created with Content Creation Studio! 🚀 Ready for WhatsApp Status & Story.'
  );
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'status' | 'direct'>('status');

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const encodedMessage = encodeURIComponent(
      `${messageText}\n\n🎬 Project: ${activeClip?.title || 'Content Creation Studio Video'}\n📐 Aspect Ratio: ${aspectRatio}\n🔗 ${window.location.origin}`
    );
    let url = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    if (shareType === 'direct' && phoneNumber.trim()) {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}?clip=${activeClip?.id || 'post-1'}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with WhatsApp branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-emerald-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.09 19.14L7.8 18.97L4.69 19.79L5.52 16.76L5.33 16.46C4.6 15.2 4.21 13.57 4.21 11.91C4.21 7.37 7.91 3.67 12.05 3.67ZM8.82 7.39C8.61 7.39 8.25 7.47 7.96 7.79C7.66 8.11 6.84 8.88 6.84 10.45C6.84 12.02 7.99 13.54 8.15 13.75C8.31 13.96 10.37 17.13 13.53 18.5C14.28 18.82 14.87 19.02 15.33 19.16C16.08 19.4 16.77 19.37 17.31 19.29C17.92 19.2 19.18 18.53 19.44 17.8C19.7 17.07 19.7 16.44 19.62 16.32C19.54 16.19 19.34 16.12 19.03 15.96C18.72 15.81 17.2 15.06 16.92 14.95C16.64 14.85 16.43 14.8 16.23 15.11C16.02 15.42 15.42 16.12 15.24 16.32C15.06 16.53 14.88 16.55 14.57 16.4C14.26 16.24 13.27 15.92 12.1 14.87C11.19 14.06 10.57 13.06 10.42 12.75C10.26 12.44 10.4 12.27 10.56 12.12C10.7 11.98 10.88 11.75 11.03 11.57C11.19 11.39 11.24 11.26 11.34 11.05C11.45 10.84 11.39 10.66 11.32 10.51C11.24 10.35 10.63 8.86 10.37 8.24C10.12 7.64 9.87 7.72 9.68 7.71C9.5 7.7 9.29 7.39 8.82 7.39Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>WhatsApp Direct Share</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                Status & Chats
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Instantly share videos, reels, and stories directly to WhatsApp
            </p>
          </div>
        </div>

        {/* Share Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setShareType('status')}
            className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
              shareType === 'status'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WhatsApp Status (9:16)
          </button>
          <button
            type="button"
            onClick={() => setShareType('direct')}
            className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
              shareType === 'direct'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct Contact / Group
          </button>
        </div>

        {/* Phone number input if direct */}
        {shareType === 'direct' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Recipient Phone Number (with Country Code):
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-emerald-500">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Leave blank to select contact inside WhatsApp.
            </p>
          </div>
        )}

        {/* Caption / Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Caption & Message:
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Project Context Box */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-200">
              {activeClip?.title || 'Current Video Project'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Format: {aspectRatio} · Ready for WhatsApp
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
