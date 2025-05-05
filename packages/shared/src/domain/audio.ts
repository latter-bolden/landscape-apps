export interface NormalizedTrack {
  id: string;
  releaseId: string;
  title: string;
  artist: string;
  albumTitle: string;
  trackNumber: number;
  totalTracks: number;
  duration: number;
  audioUrl: string;
  coverArt: string;
  releaseDate: string;
  isAlbumTrack: boolean;
}

export interface NormalizedRelease {
  id: string;
  title: string;
  creator?: string;
  image: string;
  thumbnail?: string;
  description?: string;
  tracks: NormalizedTrack[];
}

export interface AudioPlayer {
  playTrack: (track: NormalizedTrack) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  isPlaying: boolean;
  currentTrack: NormalizedTrack | null;
}
