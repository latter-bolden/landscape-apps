import * as domain from '../domain';

// const MUSIC_ENDPOINT = 'https://api.ninaprotocol.com/v1';
const MUSIC_ENDPOINT = 'https://services.ninaprotocol.com/v1';

interface MusicSearchResult {
  releases: MusicReleasePreview[];
}

interface MusicReleasePreview {
  title: string;
  publicKey: string;
  image: string;
}

interface ReleaseFile {
  uri: string;
  track: number;
  track_title: string;
  duration: number;
  type: string;
}

export interface ReleaseMetadata {
  name: string;
  creator?: string;
  title?: string;
  thumbnail?: string;
  description: string;
  image: string;
  properties?: {
    files?: ReleaseFile[];
    date: string;
    tags?: string[];
  };
}

interface Release {
  publicKey: string;
  hub?: {
    data?: {
      displayName: string;
      image?: string;
    };
  };
  metadata: ReleaseMetadata;
  datetime: string;
  publisherAccount: {
    displayName: string;
    handle: string;
    publicKey: string;
  };
  price: string;
  archived: boolean;
}

export interface NormalizedTrack {
  id: string; // Format: "release:{releaseKey}:track:{trackNumber}"
  releaseId: string; // Original release public key
  title: string; // Track title
  artist: string; // Artist name from release
  albumTitle: string; // Full release/album title
  trackNumber: number; // Position in album/release
  totalTracks: number; // Total tracks in release
  duration: number; // Duration in seconds
  audioUrl: string; // Direct audio file URL
  coverArt: string; // Album/release cover art
  releaseDate: string; // Original release date
  isAlbumTrack: boolean; // Whether this is part of a multi-track release
}

// Helper for consistent ID generation
const createTrackId = (releaseKey: string, trackNumber: number): string =>
  `release:${releaseKey}:track:${trackNumber}`;

function normalizeReleasePreview(release: MusicReleasePreview): Release {
  return {
    publicKey: release.publicKey,
    metadata: {
      name: release.title,
      image: release.image,
      description: '',
    },
    datetime: Date.now().toString(),
    publisherAccount: {
      displayName: '',
      handle: '',
      publicKey: '',
    },
    price: '0',
    archived: false,
  };
}

function normalizeRelease(release: Release): NormalizedTrack[] {
  console.log('normalizeRelease', release);
  const tracks: NormalizedTrack[] = [];
  console.log(`release meta`, release.metadata);

  const artist =
    release.hub?.data?.displayName ?? release.metadata.name.split('-')[0];
  const albumTitle = release.metadata.name.split('-')[1];

  const files = release.metadata.properties?.files ?? [];
  const totalTracks = files.length;
  files.forEach((file) => {
    tracks.push({
      id: createTrackId(release.publicKey, file.track),
      releaseId: release.publicKey,
      title: file.track_title,
      artist,
      albumTitle,
      trackNumber: file.track,
      totalTracks,
      duration: file.duration,
      audioUrl: file.uri,
      coverArt: release.metadata.image,
      releaseDate: release.metadata.properties?.date ?? Date.now().toString(),
      isAlbumTrack: totalTracks > 1,
    });
  });

  return tracks;
}

const utils = {
  parseTrackId: (id: string) => {
    const [_, releaseKey, __, trackNumber] = id.split(':');
    return {
      releaseKey,
      trackNumber: parseInt(trackNumber),
    };
  },

  isTrackFromRelease: (trackId: string, releaseId: string): boolean => {
    const { releaseKey } = utils.parseTrackId(trackId);
    return releaseKey === releaseId;
  },
};

export async function searchMusic(query: string) {
  console.log(`searchMusic`, query);
  try {
    const results: MusicSearchResult = await musicPost('/search', { query });
    return results.releases ?? [];
  } catch (e) {
    console.log(`Failed to search for music`, e);
    return [];
  }
}

export async function searchMusicInternetArchive(
  query: string,
  pageNum?: number
): Promise<domain.NormalizedRelease[]> {
  console.log(`searchMusicInternetArchive`, query);
  const params = getInternetArchiveSearchParams(query, pageNum);
  const endpoint = `https://archive.org/services/search/beta/page_production/?${params.toString()}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Bad response from Internet Archive: ${response.status}`);
    }

    const results = await response.json();
    const hits = results?.response?.body?.hits?.hits ?? [];
    if (!hits.length) {
      return [];
    }

    const validResults = [];
    for (const hit of hits) {
      const content = hit.fields ?? {};
      const releaseId = `intArc:${content.identifier}`;
      try {
        const release = {
          id: releaseId,
          creator: content.creator,
          title: content.title,
          description: content.description,
          image: `https://archive.org/services/img/${content.identifier}`,
          thumbnail: `https://archive.org/services/img/${content.identifier}`,
          tracks: [],
        };
        if (release.title && release.creator) {
          validResults.push(release);
        }
      } catch (e) {
        // fallthrough
      }
    }

    return validResults;
  } catch (e) {
    // todo
    return [];
  }
}

function getInternetArchiveSearchParams(query: string, pageNum: number = 1) {
  const baseQuery = `${query} AND mediatype:(audio) AND NOT access-restricted-item:(true)`;
  const params = new URLSearchParams({
    user_query: baseQuery,
    hits_per_page: '100',
    page: pageNum.toString(),
  });

  return params;
}

export async function getReleaseTracks(releaseId: string) {
  console.log(`getReleaseTracks`, releaseId);
  try {
    const results = await musicFetch(`/releases/${releaseId}`, {});
    console.log(`${releaseId} release data`, results.release);
    return normalizeRelease(results.release);
  } catch (e) {
    console.log(`Failed to get release tracks`, e);
    return [];
  }
}

export async function getRelease(releaseId: string) {
  console.log(`getRelease`, releaseId);
  const results = await musicFetch(`/releases/${releaseId}`, {});
  console.log(`got release result`, results);
  return results;
}

// Welcome to my client lol
async function musicPost(path: string, body: any) {
  const response = await fetch(`${MUSIC_ENDPOINT}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

async function musicFetch(path: string, query: any) {
  const response = await fetch(`${MUSIC_ENDPOINT}/${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function getReleaseMetadata(
  releaseId: string
): Promise<domain.NormalizedRelease> {
  const [source, vendoredId] = releaseId.split(':');
  switch (source) {
    case 'intArc':
      return getInternetArchiveRelease(vendoredId);
    //
    case 'nina':
    default:
      // unimplemented
      throw new Error('Invalid release source');
  }
}

interface InternetArchiveTrack {
  name: string; // 03 PROUD MARY.mp3
  length: string; // 03:10
  md5Hash: string; // 0cbda7104192fe39b333f7a365a0ba16
}

async function getInternetArchiveRelease(
  vendoredId: string
): Promise<domain.NormalizedRelease> {
  console.log(`getInternetArchiveRelease`, vendoredId);
  try {
    const response = await fetch(`https://archive.org/metadata/${vendoredId}`);
    if (!response.ok) {
      throw new Error(`Bad response from Internet Archive: ${response.status}`);
    }

    const metadata = await response.json();
    console.log(`Internet Archive metadata`, metadata);
    const domain = metadata.d1 ?? null;
    const dir = metadata.dir ?? null;

    if (!domain || !dir) {
      throw new Error('Invalid Internet Archive metadata');
    }

    const assetLocation = `https://${domain}${dir}`;

    const files = metadata.files ?? [];
    const tracks = files.filter((fi: any) =>
      (fi.name || '').endsWith('.mp3')
    ) as InternetArchiveTrack[];

    // const orderedTracks = tracks.sort((a, b) => a.name.localeCompare(b.name));

    const title = metadata.metadata.title ?? 'Untitled Release';
    const creator = metadata.metadata.creator ?? 'Unknown Artist';

    const images = files.filter((fi: any) => fi.name.endsWith('.jpg'));
    const image = images.length > 0 ? `${assetLocation}/${images[0].name}` : '';
    const thumbnail =
      images.find((fi: any) => fi.name.includes('thumb')) ?? image;

    const release: domain.NormalizedRelease = {
      id: `intArc:${vendoredId}`,
      creator,
      title,
      description: metadata.description ?? '',
      image,
      thumbnail,
      tracks: tracks.map((track, i) => ({
        id: `intArc:${vendoredId}:track:${i}`,
        releaseId: `intArc:${vendoredId}`,
        title: track.name.replace('.mp3', ''),
        artist: creator,
        albumTitle: title,
        trackNumber: i + 1,
        totalTracks: tracks.length,
        duration: Math.round(Number(track.length)),
        audioUrl: `${assetLocation}/${track.name.split(' ').join('%20')}`,
        coverArt: image,
        releaseDate: metadata.date ?? '',
        isAlbumTrack: true,
      })),
    };

    // export interface NormalizedTrack {
    //   id: string; // Format: "release:{releaseKey}:track:{trackNumber}"
    //   releaseId: string; // Original release public key
    //   title: string; // Track title
    //   artist: string; // Artist name from release
    //   albumTitle: string; // Full release/album title
    //   trackNumber: number; // Position in album/release
    //   totalTracks: number; // Total tracks in release
    //   duration: number; // Duration in seconds
    //   audioUrl: string; // Direct audio file URL
    //   coverArt: string; // Album/release cover art
    //   releaseDate: string; // Original release date
    //   isAlbumTrack: boolean; // Whether this is part of a multi-track release
    // }

    console.log(`obtained release`, release);
    return release;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch Internet Archive release');
  }
}

function timeToSeconds(timeString: string) {
  console.log(`timeToSeconds`, timeString);
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
}
