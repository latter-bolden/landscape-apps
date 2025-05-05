import { PropsWithChildren } from 'react';
import { View } from 'tamagui';

import { usePageStore } from '../data/pageStore';
import { JoinTMModal } from './JoinTMModal';

export function PageContainer(
  props: PropsWithChildren<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>
) {
  const { personalInviteLink, contact } = usePageStore();
  return (
    <View flex={1} style={{ height: '100vh' }} backgroundColor="$background">
      {props.children}
      <JoinTMModal
        inviteLink={personalInviteLink}
        contact={contact}
        open={props.open}
        onOpenChange={props.onOpenChange}
      />
    </View>
  );
}
