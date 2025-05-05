import * as api from '@tloncorp/shared/api';
import * as domain from '@tloncorp/shared/domain';
import { Icon, Pressable } from '@tloncorp/ui';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { useAudioPlayer } from '../../contexts';

export function MiniPlayableTrack(props: {
  track: domain.NormalizedTrack;
  player: ReturnType<typeof useAudioPlayer>;
  size?: number;
  removable?: boolean;
  onRemove?: (track: domain.NormalizedTrack) => void;
  onPress?: (track: domain.NormalizedTrack) => void;
}) {
  const { track, player } = props;

  const size = props.size ?? 100;
  const rotation = useSharedValue(0);
  const borderRadius = useSharedValue(8);

  useEffect(() => {
    if (player.isPlaying && player.currentTrack?.id === track.id) {
      // collapse to circle
      borderRadius.value = withSpring(size / 2, {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      });

      // slowly spin
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 8000,
          easing: Easing.linear,
        }),
        -1, // Infinite repetitions
        false // Don't reverse
      );
    } else {
      // Stop at current rotation
      cancelAnimation(rotation);
      // Optional: Spring back to 0 when stopped
      rotation.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      });
      borderRadius.value = withDelay(
        200,
        withSpring(8, {
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        })
      );
    }
  }, [
    player.isPlaying,
    player.currentTrack?.id,
    track.id,
    rotation,
    borderRadius,
    size,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  const pressTrack = useCallback(() => {
    player.currentTrack === track
      ? player.isPlaying
        ? player.pause()
        : player.resume()
      : player.playTrack(track);
  }, [player, track]);

  return (
    <Pressable onPress={pressTrack}>
      <ZStack height={size} width={size}>
        <YStack>
          <Animated.View style={[animatedStyle, { borderRadius: 8 }]}>
            <Animated.Image
              source={{ uri: track.coverArt }}
              style={{
                height: size,
                width: size,
                borderRadius,
              }}
            />
          </Animated.View>
        </YStack>
        {props.removable && (
          <Pressable
            onPress={() => props.onRemove?.(track)}
            position="relative"
            left={size - 12}
          >
            <Circle size="$xl" backgroundColor="$gray300">
              <Icon type="Close" size="$s" />
            </Circle>
          </Pressable>
        )}
      </ZStack>
    </Pressable>
  );
}
