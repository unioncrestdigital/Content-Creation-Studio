import test from 'node:test';
import assert from 'node:assert/strict';
// VideoClip is an interface, so it has to come in as a type import. Node
// strips types rather than compiling them, so a type sitting in the value
// list is a named export that does not exist at runtime: this file threw
// SyntaxError before a single assertion ran.
import type { VideoClip } from './studioEngine.ts';
import {
  analyzeSceneTransition,
  calculateTimelineDuration,
  formatTimecode,
  getAspectRatioDimensions,
  computeColorFilterStyle,
  getPeakEngagementTimes,
  formatMetricCount,
  DEFAULT_COLOR_GRADE,
  parseCreationIntent,
} from './studioEngine.ts';

test('analyzeSceneTransition accurately chooses transitions based on visual tone and motion', () => {
  const clipHighMotion1: VideoClip = {
    id: '1',
    title: 'Drift Car',
    duration: 3,
    sourceType: 'stock',
    mediaUrl: '',
    thumbnailUrl: '',
    motionIntensity: 'high',
    visualTone: 'cinematic',
  };

  const clipHighMotion2: VideoClip = {
    id: '2',
    title: 'Skater Jump',
    duration: 4,
    sourceType: 'user-upload',
    mediaUrl: '',
    thumbnailUrl: '',
    motionIntensity: 'high',
    visualTone: 'cinematic',
  };

  assert.equal(analyzeSceneTransition(clipHighMotion1, clipHighMotion2), 'whip-pan');

  const clipCyber: VideoClip = {
    id: '3',
    title: 'Neon Tokyo',
    duration: 5,
    sourceType: 'ai-generated',
    mediaUrl: '',
    thumbnailUrl: '',
    motionIntensity: 'medium',
    visualTone: 'cyberpunk',
  };

  assert.equal(analyzeSceneTransition(clipCyber, clipHighMotion1), 'glitch-dissolve');

  const clipGolden1: VideoClip = {
    id: '4',
    title: 'Sunset Beach',
    duration: 4,
    sourceType: 'stock',
    mediaUrl: '',
    thumbnailUrl: '',
    motionIntensity: 'low',
    visualTone: 'warm-golden',
  };

  const clipGolden2: VideoClip = {
    id: '5',
    title: 'Golden Horizon',
    duration: 3,
    sourceType: 'ai-generated',
    mediaUrl: '',
    thumbnailUrl: '',
    motionIntensity: 'low',
    visualTone: 'warm-golden',
  };

  assert.equal(analyzeSceneTransition(clipGolden1, clipGolden2), 'lens-flare');
});

test('calculateTimelineDuration computes total duration with seamless transition overlap', () => {
  const clips: VideoClip[] = [
    { id: '1', title: 'Intro', duration: 4, sourceType: 'user-upload', mediaUrl: '', thumbnailUrl: '' },
    { id: '2', title: 'B-roll', duration: 6, sourceType: 'stock', mediaUrl: '', thumbnailUrl: '' },
    { id: '3', title: 'Outro', duration: 5, sourceType: 'ai-generated', mediaUrl: '', thumbnailUrl: '' },
  ];

  // 4 + 6 + 5 = 15s. 2 transitions of 0.5s overlap -> 15 - 1.0 = 14s.
  const total = calculateTimelineDuration(clips, 0.5);
  assert.equal(total, 14);

  assert.equal(calculateTimelineDuration([]), 0);
  assert.equal(calculateTimelineDuration([clips[0]]), 4);
});

test('formatTimecode generates standard and millisecond-accurate timecodes', () => {
  assert.equal(formatTimecode(0), '00:00.00');
  assert.equal(formatTimecode(65.4), '01:05.40');
  assert.equal(formatTimecode(3665, true), '01:01:05');
});

test('getAspectRatioDimensions returns correct proportions for social standards', () => {
  const shorts916 = getAspectRatioDimensions('9:16', 1080);
  assert.equal(shorts916.height, 1080);
  assert.equal(shorts916.width, Math.round(1080 * 9 / 16));

  const yt169 = getAspectRatioDimensions('16:9', 1920);
  assert.equal(yt169.width, 1920);
  assert.equal(yt169.height, 1080);

  const square = getAspectRatioDimensions('1:1', 1080);
  assert.equal(square.width, 1080);
  assert.equal(square.height, 1080);
});

test('computeColorFilterStyle compiles clean CSS filter string from grade settings', () => {
  const defaultFilter = computeColorFilterStyle(DEFAULT_COLOR_GRADE);
  assert.ok(defaultFilter.includes('brightness(1.00)'));
  assert.ok(defaultFilter.includes('contrast(1.00)'));

  const tealOrange = computeColorFilterStyle({
    ...DEFAULT_COLOR_GRADE,
    contrast: 20,
    lut: 'teal-orange',
  });
  assert.ok(tealOrange.includes('contrast(1.10)'));
  assert.ok(tealOrange.includes('saturate(1.2)'));
});

test('getPeakEngagementTimes returns platform-tailored peak posting opportunities', () => {
  const tiktokTimes = getPeakEngagementTimes('tiktok');
  assert.ok(tiktokTimes.length > 0);
  assert.ok(tiktokTimes[0].engagementScore >= 90);

  const ytTimes = getPeakEngagementTimes('youtube');
  assert.ok(ytTimes.some(t => t.time.includes('16:00')));
});

test('formatMetricCount formats large social numbers cleanly', () => {
  assert.equal(formatMetricCount(450), '450');
  assert.equal(formatMetricCount(14500), '14.5K');
  assert.equal(formatMetricCount(2300000), '2.3M');
});

test('parseCreationIntent intelligently derives social platforms, aspect ratio, and transitions', () => {
  const plan = parseCreationIntent('Create a cyberpunk neon TikTok reel with fast action and dark mood');
  assert.ok(plan.platforms.includes('tiktok'));
  assert.equal(plan.targetRatio, '9:16');
  assert.equal(plan.suggestedTransition, 'glitch-dissolve');
  assert.equal(plan.colorLut, 'cyber-noir');

  const widePlan = parseCreationIntent('Produce a 16:9 landscape YouTube video about sunset coastline');
  assert.equal(widePlan.targetRatio, '16:9');
  assert.ok(widePlan.platforms.includes('youtube'));
  assert.equal(widePlan.suggestedTransition, 'lens-flare');
  assert.equal(widePlan.colorLut, 'cine-gold');
});

