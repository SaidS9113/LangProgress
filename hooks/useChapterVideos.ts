'use client';

import { useState } from 'react';

interface ChapterVideo {
  id: string;
  chapterNumber: number;
  title: string;
  cloudflareVideoId: string;
  thumbnailUrl?: string;
  duration?: number;
}

export function useChapterVideos() {
  return {
    videos: [] as ChapterVideo[],
    isLoading: false,
    error: null,
    getVideoByChapter: (chapterNumber: number) => undefined,
  };
}
