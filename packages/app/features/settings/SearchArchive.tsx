import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as domain from '@tloncorp/shared/domain';
import {
  AddProfileAudioScreenView,
  SearchArchiveScreenView,
  View,
  useAudioPlayer,
  useContact,
} from '@tloncorp/ui';
import { useCallback, useMemo } from 'react';

import { useCurrentUserId } from '../../hooks/useCurrentUser';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchArchive'>;

export function SearchArchiveScreen(props: Props) {
  const player = useAudioPlayer();
  const goBack = useCallback(() => {
    player.stop();
    props.navigation.goBack();
  }, [player, props.navigation]);

  const currentUserId = useCurrentUserId();
  const contact = useContact(currentUserId);
  const currentlyPinned = useMemo(() => {
    return (contact?.tunes as domain.NormalizedTrack[]) || [];
  }, [contact]);

  const onSelectRelease = useCallback(
    (releaseId: string) => {
      props.navigation.navigate('AudioRelease', {
        releaseId,
      });
    },
    [props.navigation]
  );

  return (
    <View flex={1}>
      <SearchArchiveScreenView
        goBack={goBack}
        initialTunes={currentlyPinned}
        onSelectRelease={onSelectRelease}
      />
    </View>
  );
}
