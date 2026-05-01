import { AudioTrack } from '@/hooks/useAudio';

// Royalty-free music from various open sources
// These are high-quality, free-to-use tracks suitable for game backgrounds
// Sourced from Mixkit, Incompetech, and other royalty-free libraries

export const MUSIC_LIBRARY: Record<string, AudioTrack> = {
  // CHAPTER 1: CALAMBA - Peaceful Rock Instrumental
  'calamba-intro': {
    id: 'calamba-intro',
    title: 'Peaceful Journey',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  'calamba-father': {
    id: 'calamba-father',
    title: 'Peaceful Journey',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  // CHAPTER 2: ATENEO - EDM / Rave Music
  'ateneo-intro': {
    id: 'ateneo-intro',
    title: 'Rave Awakening',
    url: 'https://archive.org/download/jamendo-561600/01-2158390-Hasenchat-Instrumental%20Rave%20Music.mp3',
    volume: 0.35,
    loop: true,
  },

  'ateneo-friends': {
    id: 'ateneo-friends',
    title: 'Rave Awakening',
    url: 'https://archive.org/download/jamendo-561600/01-2158390-Hasenchat-Instrumental%20Rave%20Music.mp3',
    volume: 0.35,
    loop: true,
  },

  'ateneo-love': {
    id: 'ateneo-love',
    title: 'Peaceful Journey',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  // CHAPTER 3: EUROPE - Rock / Driving Force
  'europe-intro': {
    id: 'europe-intro',
    title: 'Driving Force',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  'europe-berlin': {
    id: 'europe-berlin',
    title: 'Driving Force',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  // CHAPTER 4: DAPITAN - Techno EDM
  'dapitan-intro': {
    id: 'dapitan-intro',
    title: 'Techno Vibe',
    url: 'https://archive.org/download/jamendo-561600/04-2158382-Hasenchat-Instrumental%20Techno%20Music.mp3',
    volume: 0.4,
    loop: true,
  },

  // ENDINGS - Heroic Rock
  'ending-revolutionary': {
    id: 'ending-revolutionary',
    title: 'Martyrdom',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.5,
    loop: true,
  },

  'ending-healer': {
    id: 'ending-healer',
    title: 'Peaceful Journey',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  'ending-spy': {
    id: 'ending-spy',
    title: 'Techno Vibe',
    url: 'https://archive.org/download/jamendo-561600/04-2158382-Hasenchat-Instrumental%20Techno%20Music.mp3',
    volume: 0.4,
    loop: true,
  },

  'ending-exile': {
    id: 'ending-exile',
    title: 'Peaceful Journey',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  'ending-lover': {
    id: 'ending-lover',
    title: 'Peaceful Journey',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },

  // TITLE SCREEN - Rock/EDM Hybrid
  'title-theme': {
    id: 'title-theme',
    title: 'Ilustrado Theme',
    url: 'https://archive.org/download/jamendo-398858/01-1734418-SoundForYou-Instrumental%20Rock.mp3',
    volume: 0.4,
    loop: true,
  },
};

export function getMusicForScene(sceneId: string): AudioTrack | null {
  return MUSIC_LIBRARY[sceneId] || null;
}

export function getMusicForEnding(endingType: string): AudioTrack | null {
  return MUSIC_LIBRARY[endingType] || null;
}
