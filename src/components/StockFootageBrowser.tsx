import React, { useState } from 'react';
import {
  Search,
  Plus,
  Play,
  Film,
  Sparkles,
  ExternalLink,
  Youtube,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { StockFootageItem, ReferenceAsset } from '../types/studio';
import { VideoClip } from '../utils/studioEngine';
import { STOCK_FOOTAGE_LIBRARY } from '../data/mockStudioData';

interface StockFootageBrowserProps {
  onInsertClip: (clip: VideoClip) => void;
  onAddAsReference: (ref: ReferenceAsset) => void;
}

export const StockFootageBrowser: React.FC<StockFootageBrowserProps> = ({
  onInsertClip,
  onAddAsReference,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrientation, setSelectedOrientation] = useState<'all' | 'vertical' | 'horizontal'>('all');
  const [addedClipId, setAddedClipId] = useState<string | null>(null);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [isImportingYoutube, setIsImportingYoutube] = useState(false);

  const categories = ['All', 'Cyberpunk', 'Nature', 'Urban', 'Fashion', 'Tech'];

  const filteredItems = STOCK_FOOTAGE_LIBRARY.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesOrientation = selectedOrientation === 'all' || item.orientation === selectedOrientation;
    return matchesSearch && matchesCategory && matchesOrientation;
  });

  const handleInsert = (item: StockFootageItem) => {
    const newClip: VideoClip = {
      id: `stock-${Date.now()}`,
      title: item.title,
      duration: item.duration,
      sourceType: 'stock',
      mediaUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl,
      tags: item.tags,
      visualTone:
        item.category === 'Cyberpunk'
          ? 'cyberpunk'
          : item.category === 'Nature'
          ? 'lush-nature'
          : item.category === 'Urban'
          ? 'warm-golden'
          : 'cinematic',
      motionIntensity: item.orientation === 'vertical' ? 'high' : 'medium',
      suggestedTransition: item.category === 'Cyberpunk' ? 'glitch-dissolve' : 'morph-cut',
    };
    onInsertClip(newClip);
    setAddedClipId(item.id);
    setTimeout(() => setAddedClipId(null), 2000);
  };

  const handleImportYouTubeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrlInput.trim()) return;

    setIsImportingYoutube(true);
    setTimeout(() => {
      const customStock: StockFootageItem = {
        id: `yt-import-${Date.now()}`,
        title: `YouTube CC: ${youtubeUrlInput.replace(/^https?:\/\//, '').slice(0, 24)}...`,
        platform: 'YouTube',
        duration: 5.0,
        orientation: 'vertical',
        category: 'Urban',
        videoUrl: '/assets/images/ref_cyber_cinematic_1793384810139.jpg',
        thumbnailUrl: '/assets/images/ref_cyber_cinematic_1793384810139.jpg',
        author: 'Creator CC Attribution',
        license: 'Creative Commons CC-BY 3.0',
        tags: ['youtube', 'cc', 'imported'],
      };
      handleInsert(customStock);
      setIsImportingYoutube(false);
      setYoutubeUrlInput('');
    }, 800);
  };

  const [refAddedId, setRefAddedId] = useState<string | null>(null);

  const handleAddRefWithFeedback = (item: StockFootageItem) => {
    onAddAsReference({
      id: `ref-stock-${item.id}`,
      name: item.title,
      type: 'style',
      url: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl,
      description: `Stock visual reference from ${item.author} (${item.platform})`,
      weight: 0.85,
    });
    setRefAddedId(item.id);
    setTimeout(() => setRefAddedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Editorial Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
            <span>Global Stock & Creative Commons Hub</span>
            <span aria-hidden="true">·</span>
            <span>Seamless Multi-Track Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Stock Footage & B-Roll Catalog
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Directly pull 4K cinematic clips from YouTube Creative Commons, Pexels, and Pixabay to remix alongside raw footage.
          </p>
        </div>
      </div>

      {/* YouTube Direct Video Importer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <form onSubmit={handleImportYouTubeUrl} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white shrink-0">
            <Youtube className="w-4 h-4 text-red-500" />
            <span>Pull YouTube CC Footage:</span>
          </div>
          <input
            type="text"
            value={youtubeUrlInput}
            onChange={(e) => setYoutubeUrlInput(e.target.value)}
            placeholder="Paste YouTube Creative Commons URL or video ID (e.g. https://youtu.be/TEjHDF9QXTY)"
            className="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isImportingYoutube}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-xs transition-all shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isImportingYoutube ? 'Fetching Video...' : 'Fetch & Insert to Timeline'}
          </button>
        </form>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clips by scenery, vibe, or keywords (e.g., waterfall, drone, neon, usa)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Orientation Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setSelectedOrientation('all')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedOrientation === 'all' ? 'bg-indigo-600 text-white font-medium shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedOrientation('vertical')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedOrientation === 'vertical' ? 'bg-indigo-600 text-white font-medium shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            9:16 Vertical
          </button>
          <button
            type="button"
            onClick={() => setSelectedOrientation('horizontal')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              selectedOrientation === 'horizontal' ? 'bg-indigo-600 text-white font-medium shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            16:9 Wide
          </button>
        </div>
      </div>

      {/* Stock Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isJustAdded = addedClipId === item.id;
          const isRefAdded = refAddedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-slate-700 rounded-2xl overflow-hidden group transition-all flex flex-col shadow-xs"
            >
              {/* Thumbnail Frame */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Duration & Platform Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/10">
                  <span>{item.platform}</span>
                  <span>·</span>
                  <span>{item.orientation === 'vertical' ? '9:16' : '16:9'}</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white">
                  {item.duration}s
                </div>
              </div>

              {/* Information Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{item.author}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.license}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => handleInsert(item)}
                    className="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    {isJustAdded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isJustAdded ? 'Added!' : 'Insert Clip'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddRefWithFeedback(item)}
                    className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{isRefAdded ? 'Saved Ref!' : 'Use as Ref'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
