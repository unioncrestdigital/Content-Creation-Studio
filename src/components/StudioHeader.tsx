import { ArrowLeft, Download, Sparkles, Layers } from 'lucide-react';
import { AspectRatioType } from '../utils/studioEngine';
import { StudioCapabilitiesIcon } from './StudioCapabilitiesIcon';

export type StudioTab =
  | 'home'
  | 'new-post'
  | 'generator'
  | 'timeline'
  | 'color-lab'
  | 'stock'
  | 'social-schedule'
  | 'analytics';

interface StudioHeaderProps {
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  aspectRatio: AspectRatioType;
  setAspectRatio: (ratio: AspectRatioType) => void;
  onOpenExport: () => void;
  onOpenSocialPost: () => void;
  theme?: 'light' | 'dark';
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  setActiveTab,
  aspectRatio,
  setAspectRatio,
  onOpenExport,
  onOpenSocialPost,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  const toolLabels: Record<StudioTab, string> = {
    home: 'Home Studio',
    'new-post': 'New Post Co-Pilot',
    generator: 'AI Video Generator',
    timeline: 'Timeline Editor',
    'color-lab': 'Color & Photo Lab',
    stock: 'Stock Footage Hub',
    'social-schedule': 'Schedule & Publish',
    analytics: 'Performance Analytics',
  };

  const isHome = activeTab === 'home';

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-colors backdrop-blur-md ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
          : 'bg-slate-950/90 border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand with Capabilities Icon and navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <StudioCapabilitiesIcon className="w-8 h-8 shrink-0" />
            <div className="hidden sm:flex flex-col">
              <span
                className={`text-base font-bold tracking-tight whitespace-nowrap ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Content Creation Studio
              </span>
              <span
                className={`text-[11px] ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Video, photo and social
              </span>
            </div>
          </button>

          {!isHome && (
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          )}
        </div>

        {/* Center: Top Navigation Switcher */}
        <div
          className={`hidden md:flex items-center gap-1 p-1 rounded-xl text-xs font-medium border ${
            isLight
              ? 'bg-slate-100/90 border-slate-200'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'home'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Home
          </button>
          {(
            [
              { id: 'new-post', label: 'Chat Co-Pilot' },
              { id: 'generator', label: 'AI Generator' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'color-lab', label: 'Color Lab' },
              { id: 'stock', label: 'Stock' },
              { id: 'social-schedule', label: 'Schedule' },
              { id: 'analytics', label: 'Analytics' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isHome ? (
            <button
              onClick={() => setActiveTab('new-post')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Post</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSocialPost}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                Post
              </button>
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
