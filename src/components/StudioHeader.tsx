import { ArrowLeft, Download, Sparkles, Layers, Sun, Moon } from 'lucide-react';
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
  onOpenWhatsApp: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  setActiveTab,
  aspectRatio,
  setAspectRatio,
  onOpenExport,
  onOpenSocialPost,
  onOpenWhatsApp,
  theme = 'light',
  onToggleTheme,
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
                className={`text-[10px] font-mono ${
                  isLight ? 'text-indigo-600' : 'text-indigo-400'
                }`}
              >
                AI Video · Photo · Social Studio
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

        {/* Right: Theme Toggle + WhatsApp + Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Light / Dark Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
              }`}
              title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            >
              {isLight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          )}

          {/* WhatsApp Direct Share Button */}
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border shadow-2xs transition-all cursor-pointer ${
              isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-500/40 hover:text-white'
            }`}
            title="Share video project directly to WhatsApp Status & Contacts"
          >
            <svg
              className={`w-3.5 h-3.5 fill-current ${
                isLight ? 'text-emerald-600' : 'text-emerald-400'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.09 19.14L7.8 18.97L4.69 19.79L5.52 16.76L5.33 16.46C4.6 15.2 4.21 13.57 4.21 11.91C4.21 7.37 7.91 3.67 12.05 3.67ZM8.82 7.39C8.61 7.39 8.25 7.47 7.96 7.79C7.66 8.11 6.84 8.88 6.84 10.45C6.84 12.02 7.99 13.54 8.15 13.75C8.31 13.96 10.37 17.13 13.53 18.5C14.28 18.82 14.87 19.02 15.33 19.16C16.08 19.4 16.77 19.37 17.31 19.29C17.92 19.2 19.18 18.53 19.44 17.8C19.7 17.07 19.7 16.44 19.62 16.32C19.54 16.19 19.34 16.12 19.03 15.96C18.72 15.81 17.2 15.06 16.92 14.95C16.64 14.85 16.43 14.8 16.23 15.11C16.02 15.42 15.42 16.12 15.24 16.32C15.06 16.53 14.88 16.55 14.57 16.4C14.26 16.24 13.27 15.92 12.1 14.87C11.19 14.06 10.57 13.06 10.42 12.75C10.26 12.44 10.4 12.27 10.56 12.12C10.7 11.98 10.88 11.75 11.03 11.57C11.19 11.39 11.24 11.26 11.34 11.05C11.45 10.84 11.39 10.66 11.32 10.51C11.24 10.35 10.63 8.86 10.37 8.24C10.12 7.64 9.87 7.72 9.68 7.71C9.5 7.7 9.29 7.39 8.82 7.39Z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

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
