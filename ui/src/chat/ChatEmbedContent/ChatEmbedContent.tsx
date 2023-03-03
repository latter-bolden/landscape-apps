import React, { useEffect, useState } from 'react';
import { AUDIO_REGEX, isValidUrl, validOembedCheck } from '@/logic/utils';
import { useCalm } from '@/state/settings';
import useEmbedState from '@/state/embed';
import YouTubeEmbed from './YouTubeEmbed';
import TwitterEmbed from './TwitterEmbed';
import SpotifyEmbed from './SpotifyEmbed';
import AudioPlayer from './AudioPlayer';

function ChatEmbedContent({ url }: { url: string }) {
  const [embed, setEmbed] = useState<any>();
  const calm = useCalm();
  const isAudio = AUDIO_REGEX.test(url);

  useEffect(() => {
    const getOembed = async () => {
      if (isValidUrl(url)) {
        const oembed = await useEmbedState.getState().getEmbed(url);
        setEmbed(oembed);
      }
    };
    getOembed();
  }, [url]);

  if (isAudio) {
    return <AudioPlayer url={url} embed />;
  }

  const isOembed = validOembedCheck(embed, url);

  if (isOembed && !calm?.disableRemoteContent) {
    const {
      title,
      thumbnail_url: thumbnail,
      provider_name: provider,
      url: embedUrl,
      author_name: author,
      author_url: authorUrl,
      html: embedHtml,
    } = embed;

    if (provider === 'YouTube') {
      return (
        <div className="flex flex-col @container">
          <YouTubeEmbed
            url={embedUrl}
            title={title}
            thumbnail={thumbnail}
            author={author}
            authorUrl={authorUrl}
          />
        </div>
      );
    }

    if (provider === 'Twitter') {
      return (
        <div className="flex flex-col @container">
          <TwitterEmbed
            authorUrl={authorUrl}
            author={author}
            embedHtml={embedHtml}
          />
        </div>
      );
    }

    if (provider === 'Spotify') {
      return (
        <div className="flex flex-col @container">
          <SpotifyEmbed url={url} title={title} thumbnailUrl={thumbnail} />
        </div>
      );
    }

    return (
      <a target="_blank" rel="noreferrer" href={url}>
        {url}
      </a>
    );
  }

  return (
    <a target="_blank" rel="noreferrer" href={url}>
      {url}
    </a>
  );
}

export default React.memo(ChatEmbedContent);