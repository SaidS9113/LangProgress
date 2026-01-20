'use client';

import { useState } from 'react';
import { Play, AlertCircle } from 'lucide-react';

interface CloudflareVideoPlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

interface StreamResponse {
  hlsUrl: string;
  dashUrl: string;
}

export default function CloudflareVideoPlayer({
  videoId,
  title,
  thumbnailUrl,
  className = '',
}: CloudflareVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayVideo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/videos/stream/${videoId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du lien');
      }

      const data: StreamResponse = await response.json();

      const streamUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/watch`;
      
      window.location.href = streamUrl;

    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full bg-black rounded-lg overflow-hidden group ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${thumbnailUrl || `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`})`,
        }}
      />

      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300" />

      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handlePlayVideo}
          disabled={isLoading}
          className="
            inline-flex items-center justify-center
            w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
            bg-white/20 hover:bg-white/35 
            disabled:bg-white/10 disabled:cursor-not-allowed
            text-white rounded-full 
            transition-all duration-300 
            shadow-2xl 
            hover:scale-110 disabled:hover:scale-100 
            transform 
            backdrop-blur-sm 
            border border-white/30 hover:border-white/50
            focus:outline-none focus:ring-2 focus:ring-white/50
          "
          aria-label={`Regarder ${title}`}
        >
          <Play 
            size={isLoading ? 28 : 32} 
            fill="white" 
            className={`transition-all duration-300 ${isLoading ? 'opacity-60' : 'opacity-100'}`}
          />
        </button>

        {isLoading && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm animate-pulse whitespace-nowrap">
            ⏳ Chargement...
          </div>
        )}
      </div>
    </div>
  );
}