import { useEffect, useRef, useState } from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  volume?: number;
  loop?: boolean;
}

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeAnimationRef = useRef<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [userInteracted, setUserInteracted] = useState(false);

  // Initialize audio element and track user interaction
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    // Track first user interaction to unlock audio
    const handleUserInteraction = () => {
      setUserInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Auto-play when interaction occurs if a track was queued
  useEffect(() => {
    if (userInteracted && currentTrack && !isPlaying) {
      play(currentTrack);
    }
  }, [userInteracted, currentTrack, isPlaying]);

  const play = (track: AudioTrack) => {
    if (!audioRef.current) return;

    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }

    // If same URL is playing, just update track info and ensure playing
    if (currentTrack?.url === track.url) {
      setCurrentTrack(track);
      if (!isPlaying && userInteracted) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.error('Audio playback error:', error);
              }
            });
        } else {
          setIsPlaying(true);
        }
      }
      return;
    }

    try {
      // Stop current track
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Set new track
      audioRef.current.src = track.url;
      // Explicitly set loop state - default to true for background music
      audioRef.current.loop = track.loop !== false ? true : false;
      audioRef.current.volume = track.volume ?? volume;

      // Only attempt to play if user has interacted with the document
      if (!userInteracted) {
        setCurrentTrack(track);
        return;
      }

      // Play with proper promise handling
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setCurrentTrack(track);
            setIsPlaying(true);
          })
          .catch((error) => {
            // Ignore AbortError from interrupted playback and NotAllowedError from autoplay policy
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error('Audio playback error:', error);
            }
          });
      } else {
        // Fallback for older browsers that don't return a promise
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const pause = () => {
    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.loop = false; // Disable loop on pause
      } catch (error) {
        console.error('Pause error:', error);
      }
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && currentTrack) {
      // Only attempt to play if user has interacted with the document
      if (!userInteracted) {
        return;
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error('Audio playback error:', error);
            }
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const stop = () => {
    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.loop = false; // Disable loop on stop
      } catch (error) {
        console.error('Stop error:', error);
      }
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const setMusicVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const fadeOut = (duration: number = 1000) => {
    if (!audioRef.current) return;

    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
    }

    const startVolume = audioRef.current.volume;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      if (audioRef.current) {
        audioRef.current.volume = startVolume * (1 - progress);
      }

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fade);
      } else {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.loop = false; // Disable loop after fade out
          }
        } catch (error) {
          console.error('Fade out error:', error);
        }
        fadeAnimationRef.current = null;
      }
    };

    fade();
  };

  const fadeIn = (duration: number = 1000) => {
    if (!audioRef.current) return;

    if (fadeAnimationRef.current !== null) {
      cancelAnimationFrame(fadeAnimationRef.current);
    }

    audioRef.current.volume = 0;
    const targetVolume = volume;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      if (audioRef.current) {
        audioRef.current.volume = targetVolume * progress;
      }

      if (progress < 1) {
        fadeAnimationRef.current = requestAnimationFrame(fade);
      } else {
        fadeAnimationRef.current = null;
      }
    };

    fade();
  };

  return {
    play,
    pause,
    resume,
    stop,
    setVolume: setMusicVolume,
    fadeOut,
    fadeIn,
    currentTrack,
    isPlaying,
    volume,
    userInteracted,
  };
}
