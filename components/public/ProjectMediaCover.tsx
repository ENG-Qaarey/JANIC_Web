"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

interface ProjectMediaCoverProps {
  videoUrl?: string | null;
  imageUrl?: string | null;
  alt: string;
  fallbackImage?: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  showControls?: boolean;
}

export function ProjectMediaCover({
  videoUrl,
  imageUrl,
  alt,
  fallbackImage = "/images/jazeera.jpeg",
  className = "object-cover object-center",
  aspectClassName = "absolute inset-0",
  priority = false,
  showControls = false,
}: ProjectMediaCoverProps) {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cleanVideo = videoUrl?.trim() || "";
  const cleanImage = imageUrl?.trim() || fallbackImage;

  // Determine if video is YouTube or Vimeo
  const getEmbedUrl = (url: string, controls: boolean): string | null => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      const id = ytMatch[1];
      if (controls) {
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1`;
      }
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&disablekb=1&fs=0`;
    }
    // Vimeo
    const vimeoMatch = url.match(
      /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i
    );
    if (vimeoMatch && vimeoMatch[3]) {
      const id = vimeoMatch[3];
      if (controls) {
        return `https://player.vimeo.com/video/${id}?autoplay=1&muted=0`;
      }
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&autopause=0`;
    }
    return null;
  };

  const embedUrl = cleanVideo ? getEmbedUrl(cleanVideo, showControls) : null;
  const isDirectVideo = cleanVideo && !embedUrl && !videoError;

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // If video is provided, it takes main priority over hero image
  if (cleanVideo && !videoError) {
    if (embedUrl) {
      return (
        <div
          className={`${aspectClassName} overflow-hidden bg-black ${
            showControls ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <iframe
            src={embedUrl}
            title={alt}
            allow="autoplay; encrypted-media; picture-in-picture; accelerometer; gyroscope"
            allowFullScreen
            className={`w-full h-full object-cover border-0 ${
              showControls ? "" : "scale-[1.35] pointer-events-none"
            }`}
            loading="lazy"
          />
        </div>
      );
    }

    if (isDirectVideo) {
      return (
        <div className={`${aspectClassName} overflow-hidden bg-black group/video`}>
          <video
            ref={videoRef}
            src={cleanVideo}
            controls={showControls}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            controlsList="nodownload"
            onError={() => setVideoError(true)}
            className={`w-full h-full ${className}`}
          >
            <source src={cleanVideo} />
            Your browser does not support the video tag.
          </video>

          {/* Quick Unmute / Mute overlay button when interactive controls are active */}
          {showControls && (
            <button
              type="button"
              onClick={toggleSound}
              className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all border border-white/20 hover:scale-105"
              title={isMuted ? "Unmute video voice" : "Mute video"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Unmute Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sound On</span>
                </>
              )}
            </button>
          )}
        </div>
      );
    }
  }

  // Fallback to static hero image
  return (
    <div className={aspectClassName}>
      <Image
        src={cleanImage}
        alt={alt}
        fill
        priority={priority}
        className={className}
      />
    </div>
  );
}
