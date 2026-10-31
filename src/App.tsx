/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudioHeader, StudioTab } from './components/StudioHeader';
import { HomeScreen } from './components/HomeScreen';
import { ConversationalCreator } from './components/ConversationalCreator';
import { AIVideoGenerator } from './components/AIVideoGenerator';
import { TimelineEditor } from './components/TimelineEditor';
import { PhotoColorLab } from './components/PhotoColorLab';
import { StockFootageBrowser } from './components/StockFootageBrowser';
import { SocialScheduler } from './components/SocialScheduler';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ExportModal } from './components/ExportModal';

import {
  INITIAL_CLIPS,
  INITIAL_REFERENCE_ASSETS,
} from './data/mockStudioData';
import { VideoClip, AspectRatioType, ColorGradeSettings } from './utils/studioEngine';
import { ReferenceAsset } from './types/studio';

export default function App() {
  // Theme is read from storage but no longer switchable from the UI:
  // the toggle was removed. Kept as state so every isLight branch in the
  // tree still has a value, and so a stored preference is honoured.
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<StudioTab>('home');
  const [clips, setClips] = useState<VideoClip[]>(INITIAL_CLIPS);
  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>(INITIAL_REFERENCE_ASSETS);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Quick prompt & attachment state passed into Conversational Creator
  const [creatorPrompt, setCreatorPrompt] = useState<string>('');
  const [creatorAttachment, setCreatorAttachment] = useState<{
    type: 'image' | 'video';
    url: string;
    name: string;
  } | null>(null);

  // Sync theme with document element, body, and local storage
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#090a0f';
      document.body.style.color = '#f1f5f9';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f6f8fa';
      document.body.style.color = '#1f2328';
    }
  }, [theme]);


  // Add clip from AI generator, conversational creator, or stock hub
  const handleAddClipToTimeline = (newClip: VideoClip) => {
    setClips((prev) => [newClip, ...prev]);
  };

  // Add stock item as style reference
  const handleAddAsReference = (ref: ReferenceAsset) => {
    setReferenceAssets((prev) => [ref, ...prev]);
  };

  // Apply color grade settings to all clips
  const handleApplyGradeToAll = (grade: ColorGradeSettings) => {
    setClips((prev) =>
      prev.map((c) => ({
        ...c,
        visualTone: grade.lut === 'cyber-noir' ? 'cyberpunk' : grade.lut === 'cine-gold' ? 'warm-golden' : c.visualTone,
      }))
    );
  };

  // Start conversational creator with quick prompt or attachment
  const handleStartWithPrompt = (
    prompt: string,
    attachment?: { type: 'image' | 'video'; url: string; name: string }
  ) => {
    setCreatorPrompt(prompt);
    setCreatorAttachment(attachment || null);
    setActiveTab('new-post');
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-blue-500 selection:text-white ${
        isLight ? 'bg-[#f6f8fa] text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* 3-Zone Studio Header */}
      <StudioHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSocialPost={() => setActiveTab('social-schedule')}
        theme={theme}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 pb-16">
        {/* Home Screen Launcher */}
        {activeTab === 'home' && (
          <HomeScreen
            onSelectTool={(tool) => setActiveTab(tool)}
            onStartWithPrompt={handleStartWithPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            recentClips={clips}
            referenceAssets={referenceAssets}
          />
        )}

        {/* Conversational "New Post" Assistant */}
        {activeTab === 'new-post' && (
          <ConversationalCreator
            initialPrompt={creatorPrompt}
            initialAttachment={creatorAttachment}
            referenceAssets={referenceAssets}
            onOpenTimeline={(clip) => {
              if (clip) handleAddClipToTimeline(clip);
              setActiveTab('timeline');
            }}
            onOpenColorLab={() => setActiveTab('color-lab')}
            onOpenScheduler={() => setActiveTab('social-schedule')}
            onBackToHome={() => setActiveTab('home')}
            onAddClipToTimeline={handleAddClipToTimeline}
          />
        )}

        {/* AI Video Generator */}
        {activeTab === 'generator' && (
          <AIVideoGenerator
            referenceAssets={referenceAssets}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onAddClipToTimeline={(clip) => {
              handleAddClipToTimeline(clip);
              setActiveTab('timeline');
            }}
          />
        )}

        {/* Timeline & Sequencer */}
        {activeTab === 'timeline' && (
          <TimelineEditor
            clips={clips}
            setClips={setClips}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onOpenStockBrowser={() => setActiveTab('stock')}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenSocialPost={() => setActiveTab('social-schedule')}
          />
        )}

        {/* Photo Lab & Color Grading */}
        {activeTab === 'color-lab' && (
          <PhotoColorLab clips={clips} onApplyGradeToAll={handleApplyGradeToAll} />
        )}

        {/* Stock Footage Hub */}
        {activeTab === 'stock' && (
          <StockFootageBrowser
            onInsertClip={(clip) => {
              handleAddClipToTimeline(clip);
              setActiveTab('timeline');
            }}
            onAddAsReference={handleAddAsReference}
          />
        )}

        {/* Social Scheduler & Post */}
        {activeTab === 'social-schedule' && (
          <SocialScheduler currentClips={clips} aspectRatio={aspectRatio} />
        )}

        {/* Cross-Platform Analytics */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        clips={clips}
        aspectRatio={aspectRatio}
      />


      {/* Footer conforming to anti-slop guidelines */}
      <footer
        className={`border-t py-6 text-xs transition-colors ${
          isLight
            ? 'border-slate-200 bg-white/90 text-slate-500'
            : 'border-slate-900 bg-slate-950/90 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
              Content Creation Studio
            </span>
            <span aria-hidden="true">·</span>
            <span>AI Video, Color Grading & Authentic 4K Stock</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`font-medium transition-colors ${
                isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-white'
              }`}
            >
              Home Studio
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('new-post')}
              className={`hover:transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-slate-300'
              }`}
            >
              Co-Pilot
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('generator')}
              className={`hover:transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-slate-300'
              }`}
            >
              AI Generator
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('color-lab')}
              className={`hover:transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-slate-300'
              }`}
            >
              Color Lab
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`hover:transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-slate-300'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
