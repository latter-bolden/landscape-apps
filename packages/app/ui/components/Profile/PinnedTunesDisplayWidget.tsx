import * as domain from '@tloncorp/shared/domain';
import { ComponentProps } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { useAudioPlayer } from '../../contexts';
import { MiniPlayableTrack } from '../Audio/MiniPlayableTrack';
import { WidgetPane } from '../WidgetPane';

export function PinnedTunesDisplayWidget(
  props: {
    tunes: domain.NormalizedTrack[];
    playableTrackSize?: number;
  } & ComponentProps<typeof WidgetPane>
) {
  const windowDimensions = useWindowDimensions();
  const player = useAudioPlayer();
  return (
    <WidgetPane
      width={
        props.tunes.length > 1 ? '100%' : (windowDimensions.width - 36) / 2
      }
      {...props}
    >
      <WidgetPane.Title>Listening to</WidgetPane.Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View flexDirection="row" gap="$l">
          {props.tunes.map((tune) => (
            <MiniPlayableTrack
              key={tune.id}
              track={tune}
              player={player}
              size={props.playableTrackSize}
            />
          ))}
        </View>
      </ScrollView>
    </WidgetPane>
  );
}
