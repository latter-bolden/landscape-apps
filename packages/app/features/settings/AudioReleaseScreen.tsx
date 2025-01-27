import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as domain from '@tloncorp/shared/domain';
import {
  AddProfileAudioScreenView,
  AudioReleaseScreenView,
  View,
  useAudioPlayer,
  useContact,
  useStore,
} from '@tloncorp/ui';
import { useCallback, useMemo } from 'react';

import { useCurrentUserId } from '../../hooks/useCurrentUser';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AudioRelease'>;

export function AudioReleaseScreen(props: Props) {
  const store = useStore();
  const player = useAudioPlayer();
  const goBack = useCallback(() => {
    player.stop();
    props.navigation.goBack();
  }, [player, props.navigation]);

  const currentUserId = useCurrentUserId();
  const contact = useContact(currentUserId);

  const releaseQuery = store.useReleaseMetadata(props.route.params.releaseId);
  console.log(releaseQuery.data);

  return (
    <View flex={1}>
      <AudioReleaseScreenView
        goBack={goBack}
        release={releaseQuery.data ?? null}
        isLoading={releaseQuery.isLoading}
        isError={releaseQuery.isError}
      />
    </View>
  );
}
