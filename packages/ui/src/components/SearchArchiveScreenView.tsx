import * as api from '@tloncorp/shared/api';
import * as domain from '@tloncorp/shared/domain';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Circle, ScrollView, Stack, View, YStack, ZStack } from 'tamagui';

import { useAudioPlayer, useStore } from '../contexts';
import { triggerHaptic } from '../utils';
import { TextInputWithIcon } from './Form';
import { Icon } from './Icon';
import { ListItem } from './ListItem';
import { LoadingSpinner } from './LoadingSpinner';
import Pressable from './Pressable';
import { ScreenHeader } from './ScreenHeader';
import { SearchBar } from './SearchBar';
import { Text } from './TextV2';
import { WidgetPane } from './WidgetPane';

interface AugmentedTrack extends api.NormalizedTrack {
  selected: boolean;
}

export function SearchArchiveScreenView(props: {
  initialTunes?: domain.NormalizedTrack[];
  goBack: () => void;
  onSelectRelease: (releaseId: string) => void;
}) {
  const player = useAudioPlayer();
  const store = useStore();
  const { query, setQuery, releases, isLoading } = store.useArchiveSearch('');
  // const [selectedTracks, setSelectedTracks] = useState<api.NormalizedTrack[]>(
  //   props.initialTunes ?? []
  // );
  // const selectedSet = useMemo(
  //   () => new Set(selectedTracks.map((track) => track.id)),
  //   [selectedTracks]
  // );
  // const augmentedTracks: AugmentedTrack[] = useMemo(() => {
  //   return tracks.map((track) => ({
  //     ...track,
  //     selected: selectedSet.has(track.id),
  //   }));
  // }, [tracks, selectedSet]);

  // const save = useCallback(async () => {
  //   store.updateProfilePinnedTunes(selectedTracks);
  //   props.goBack();
  // }, [props, selectedTracks, store]);

  // const player = useAudioPlayer();

  // const pressSelectTrack = useCallback(
  //   (track: AugmentedTrack) => {
  //     triggerHaptic('baseButtonClick');
  //     if (selectedSet.has(track.id)) {
  //       setSelectedTracks(() =>
  //         selectedTracks.filter(
  //           (selectedTrack) => selectedTrack.id !== track.id
  //         )
  //       );
  //     } else {
  //       setSelectedTracks([...selectedTracks, track]);
  //     }
  //   },
  //   [selectedSet, selectedTracks]
  // );

  return (
    <View flex={1}>
      <ScreenHeader
        title="Pinned Tunes"
        backAction={() => props.goBack()}
        // rightControls={
        //   <ScreenHeader.TextButton onPress={save}>Done</ScreenHeader.TextButton>
        // }
      />
      <YStack flex={1} gap="$l">
        <View marginHorizontal="$l">
          <TextInputWithIcon
            icon="Search"
            placeholder="Search catalog..."
            value={query}
            onChangeText={setQuery}
            spellCheck={false}
            autoCorrect={false}
            autoCapitalize="none"
            autoFocus
          />
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={releases}
          renderItem={({ item }: { item: domain.NormalizedRelease }) => (
            <ReleaseListItem
              key={item.id}
              release={item}
              player={player}
              onPress={props.onSelectRelease}
            />
          )}
          keyExtractor={(item) => item.id}
          // onEndReached={hasMore ? loadMore : undefined}
        />
        {isLoading && <LoadingSpinner />}
      </YStack>
    </View>
  );
}

export function ReleaseListItem(props: {
  release: domain.NormalizedRelease;
  player: ReturnType<typeof useAudioPlayer>;
  onPress?: (releaseId: string) => void;
}) {
  return (
    <Pressable onPress={() => props.onPress?.(props.release.id)}>
      <ListItem>
        <ListItem.ImageIcon imageUrl={props.release.image} />
        <ListItem.MainContent>
          <ListItem.Title>{props.release.title}</ListItem.Title>
          <ListItem.Subtitle>{props.release.creator}</ListItem.Subtitle>
        </ListItem.MainContent>
      </ListItem>
    </Pressable>
  );
}
