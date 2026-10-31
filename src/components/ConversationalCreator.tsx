import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Sparkles,
  ArrowRight,
  Film,
  Sliders,
  Share2,
  Calendar,
  Check,
  Video,
  X,
  Play,
} from 'lucide-react';
import { VideoClip, AspectRatioType, parseCreationIntent, AssistantDirectorPlan } from '../utils/studioEngine';
import { ReferenceAsset } from '../types/studio';
import { GENERATED_ASSETS } from '../data/mockStudioData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  attachedMedia?: {
    type: 'image' | 'video';
    url: string;
    name: string;
  };
  directorPlan?: AssistantDirectorPlan;
  generatedClip?: VideoClip;
  timestamp: string;
}

interface ConversationalCreatorProps {
  initialPrompt?: string;
  initialAttachment?: { type: 'image' | 'video'; url: string; name: string } | null;
  referenceAssets: ReferenceAsset[];
  onOpenTimeline: (clip?: VideoClip) => void;
  onOpenColorLab: () => void;
  onOpenScheduler: () => void;
  onBackToHome: () => void;
  onAddClipToTimeline: (clip: VideoClip) => void;
}

export const ConversationalCreator: React.FC<ConversationalCreatorProps> = ({
  initialPrompt = '',
  initialAttachment = null,
  referenceAssets,
  onOpenTimeline,
  onOpenColorLab,
  onOpenScheduler,
  onBackToHome,
  onAddClipToTimeline,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Welcome to Content Creation Studio! Tell me what kind of content you want to create (e.g. "Create a 9:16 viral TikTok reel with my raw streetwear clip, pull a rainy stock shot for b-roll, and apply a teal/orange grade"), or attach raw media below.',
        timestamp: 'Just now',
      },
    ];

    if (initialPrompt || initialAttachment) {
      const plan = parseCreationIntent(initialPrompt || 'Create engaging social video');
      const sampleClip: VideoClip = {
        id: `conv-clip-${Date.now()}`,
        title: plan.title,
        duration: 5.0,
        sourceType: 'ai-generated',
        mediaUrl: initialAttachment?.url || GENERATED_ASSETS.cyberCinematic,
        thumbnailUrl: initialAttachment?.url || GENERATED_ASSETS.cyberCinematic,
        visualTone: plan.colorLut === 'cyber-noir' ? 'cyberpunk' : plan.colorLut === 'cine-gold' ? 'warm-golden' : 'cinematic',
        motionIntensity: plan.suggestedTransition === 'whip-pan' ? 'high' : 'medium',
        suggestedTransition: plan.suggestedTransition,
      };

      initialMsgs.push({
        id: 'msg-user-init',
        sender: 'user',
        text: initialPrompt || 'Attached media for new post.',
        attachedMedia: initialAttachment || undefined,
        timestamp: 'Just now',
      });

      initialMsgs.push({
        id: 'msg-asst-init',
        sender: 'assistant',
        text: `I synthesized your concept into a ${plan.targetRatio} video with intelligent ${plan.suggestedTransition} transitions and ${plan.colorLut} color grading. Check the preview below:`,
        directorPlan: plan,
        generatedClip: sampleClip,
        timestamp: 'Just now',
      });
    }

    return initialMsgs;
  });

  const [inputVal, setInputVal] = useState('');
  const [activeAttachment, setActiveAttachment] = useState<{
    type: 'image' | 'video';
    url: string;
    name: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  const handleSend = (textToSend = inputVal) => {
    if (!textToSend.trim() && !activeAttachment) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      attachedMedia: activeAttachment || undefined,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    const sentAttachment = activeAttachment;
    setActiveAttachment(null);
    setIsProcessing(true);

    setTimeout(() => {
      const plan = parseCreationIntent(textToSend);

      // Select matching asset
      const media =
        sentAttachment?.url ||
        (plan.colorLut === 'cine-gold'
          ? GENERATED_ASSETS.droneCityscape
          : plan.suggestedTransition === 'glitch-dissolve'
          ? GENERATED_ASSETS.cyberCinematic
          : plan.targetRatio === '9:16'
          ? GENERATED_ASSETS.natureWaterfall
          : GENERATED_ASSETS.fashionPortrait);

      const generatedClip: VideoClip = {
        id: `ai-conv-${Date.now()}`,
        title: plan.title,
        duration: 5.0,
        sourceType: sentAttachment ? 'user-upload' : 'ai-generated',
        mediaUrl: media,
        thumbnailUrl: media,
        visualTone: plan.colorLut === 'cyber-noir' ? 'cyberpunk' : plan.colorLut === 'cine-gold' ? 'warm-golden' : 'cinematic',
        motionIntensity: plan.suggestedTransition === 'whip-pan' ? 'high' : 'medium',
        suggestedTransition: plan.suggestedTransition,
      };

      onAddClipToTimeline(generatedClip);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `Here is your custom video composition! I formatted it in ${plan.targetRatio} for ${plan.platforms.join(' & ')}, applied smart ${plan.suggestedTransition} transitions, and color graded the sequence with ${plan.colorLut}.`,
        directorPlan: plan,
        generatedClip,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Breadcrumb & Assistant Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
          >
            ← Back to Home
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Content Studio AI Director
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Describe what you need, attach media, or refine in real-time</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenTimeline()}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          <span>Open Full Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-xs'
              }`}
            >
              {/* Message text */}
              <p>{msg.text}</p>

              {/* User Attachment Display */}
              {msg.attachedMedia && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/20 max-w-xs mt-2 bg-black">
                  <img
                    src={msg.attachedMedia.url}
                    alt={msg.attachedMedia.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-1.5 bg-black/60 text-[10px] truncate text-slate-300">
                    📎 {msg.attachedMedia.name}
                  </div>
                </div>
              )}

              {/* Assistant Director Plan Card & Interactive Video Preview */}
              {msg.directorPlan && msg.generatedClip && (
                <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  {/* Video preview thumbnail */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center max-h-48">
                    <img
                      src={msg.generatedClip.mediaUrl}
                      alt={msg.generatedClip.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5 text-left">
                      <div className="text-xs font-bold text-white line-clamp-1">{msg.generatedClip.title}</div>
                      <div className="text-[10px] text-indigo-300 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{msg.directorPlan.targetRatio}</span>
                        <span>·</span>
                        <span className="capitalize">{msg.directorPlan.suggestedTransition}</span>
                        <span>·</span>
                        <span className="capitalize">{msg.directorPlan.colorLut}</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Breakdown Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300 pt-1">
                    <div className="p-1.5 px-2.5 bg-white dark:bg-slate-900/90 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Target Channels:</span>
                      <span className="font-semibold uppercase text-slate-900 dark:text-slate-100">{msg.directorPlan.platforms.join(', ')}</span>
                    </div>
                    <div className="p-1.5 px-2.5 bg-white dark:bg-slate-900/90 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Optimal Post Window:</span>
                      <span className="text-amber-600 dark:text-amber-300 font-mono text-[10px] truncate block font-medium">
                        {msg.directorPlan.recommendedTime}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => onOpenTimeline(msg.generatedClip)}
                      className="py-2 px-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Timeline</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenColorLab}
                      className="py-2 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Color Lab</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenScheduler}
                      className="py-2 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 w-max shadow-2xs">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Content Creation Studio Director is composing your video...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 text-xs">
        <span className="text-slate-500 text-[11px] whitespace-nowrap">Try:</span>
        {[
          'Make a 9:16 TikTok with cyberpunk neon b-roll and fast whip-pan transitions',
          'Create a golden hour Riviera sunset reel with cinematic LUT',
          'Turn my raw video into a high quality vertical short with rainforest stock',
        ].map((quick) => (
          <button
            key={quick}
            type="button"
            onClick={() => handleSend(quick)}
            className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg whitespace-nowrap text-[11px] transition-colors shadow-2xs cursor-pointer"
          >
            {quick}
          </button>
        ))}
      </div>

      {/* Active Attachment Preview if present */}
      {activeAttachment && (
        <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shrink-0 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <img src={activeAttachment.url} alt="attached" className="w-8 h-8 rounded object-cover" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">{activeAttachment.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveAttachment(null)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Asset Picker Tray (Reference Library Drawer) */}
      {showAssetPicker && (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shrink-0 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">Select Raw / Reference Media:</span>
            <button
              type="button"
              onClick={() => setShowAssetPicker(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {referenceAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  setActiveAttachment({
                    type: 'image',
                    url: asset.thumbnailUrl,
                    name: asset.name,
                  });
                  setShowAssetPicker(false);
                }}
                className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-lg text-left group transition-all"
              >
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.name}
                  className="w-full h-14 object-cover rounded group-hover:scale-102 transition-transform"
                />
                <div className="text-[10px] text-slate-700 dark:text-slate-300 truncate mt-1">{asset.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shrink-0 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <button
          type="button"
          onClick={() => setShowAssetPicker(!showAssetPicker)}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          title="Attach raw video, picture, or reference style"
        >
          <Paperclip className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Describe your video, add instructions, or ask for changes..."
          className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputVal.trim() && !activeAttachment}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white disabled:opacity-40 transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
