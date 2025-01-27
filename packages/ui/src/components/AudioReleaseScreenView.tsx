import * as api from '@tloncorp/shared/api';
import * as domain from '@tloncorp/shared/domain';
import { ComponentProps, useCallback, useMemo } from 'react';
import { ScrollView, View, XStack, YStack } from 'tamagui';

import { useAudioPlayer } from '../contexts';
import { MiniPlayableTrack } from './AddProfileAudioScreenView';
import { Image } from './Image';
import { ListItem } from './ListItem';
import { LoadingSpinner } from './LoadingSpinner';
import Pressable from './Pressable';
import { ScreenHeader } from './ScreenHeader';
import { Text } from './TextV2';

export function AudioReleaseScreenView(props: {
  goBack: () => void;
  release: domain.NormalizedRelease | null;
  isLoading: boolean;
  isError: boolean;
}) {
  const player = useAudioPlayer();
  return (
    <View flex={1}>
      <ScreenHeader backAction={props.goBack} />
      {props.release && (
        <ScrollView flex={1}>
          <ReleaseHeader
            paddingHorizontal="$xl"
            release={props.release}
            marginBottom="$2xl"
          />

          <YStack>
            {props.release.tracks.map((track) => (
              <TrackListItem player={player} key={track.id} track={track} />
            ))}
          </YStack>
        </ScrollView>
      )}
      {props.isLoading && <LoadingSpinner />}
    </View>
  );
}

export function ReleaseHeader({
  release,
  ...rest
}: {
  release: domain.NormalizedRelease;
} & ComponentProps<typeof YStack>) {
  return (
    <YStack {...rest}>
      <XStack justifyContent="center">
        <Image
          source={{ uri: release.image }}
          height={150}
          width={150}
          borderRadius="$l"
        />
      </XStack>
      <YStack marginTop="$2xl">
        <Text size="$title/l" marginBottom="$s">
          {release.title}
        </Text>
        <Text size="$label/l">{release.creator}</Text>
      </YStack>
    </YStack>
  );
}

export function TrackListItem({
  player,
  track,
}: {
  track: domain.NormalizedTrack;
  player: domain.AudioPlayer;
}) {
  const trackOnPlayer = useMemo(
    () => player.currentTrack === track,
    [player, track]
  );

  const pressTrack = useCallback(() => {
    trackOnPlayer
      ? player.isPlaying
        ? player.pause()
        : player.resume()
      : player.playTrack(track);
  }, [player, track, trackOnPlayer]);

  return (
    <Pressable onPress={pressTrack}>
      <ListItem
        backgroundColor={trackOnPlayer ? '$secondaryBackground' : undefined}
      >
        <ListItem.SystemIcon
          icon={trackOnPlayer && player.isPlaying ? 'Stop' : 'Play'}
        />
        <ListItem.MainContent>
          <ListItem.Title>{track.title}</ListItem.Title>
          <ListItem.Subtitle>{track.artist}</ListItem.Subtitle>
        </ListItem.MainContent>
        <ListItem.EndContent>
          <Text>{track.duration}</Text>
        </ListItem.EndContent>
      </ListItem>
    </Pressable>
  );
}
