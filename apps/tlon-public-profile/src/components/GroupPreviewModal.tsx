import {
  ActionSheet,
  ContactAvatar,
  ContactName,
  GroupAvatar,
  Stack,
  XStack,
  YStack,
} from '@tloncorp/app/ui';
import * as db from '@tloncorp/shared/db';
import { Button, Text } from '@tloncorp/ui';
import QRCode from 'react-qr-code';

import { usePageStore } from '@/data/pageStore';

export function GroupPreviewModal(props: {
  group: db.Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { personalInviteLink } = usePageStore();

  if (!props.group) {
    return null;
  }

  return (
    <ActionSheet
      mode="dialog"
      open={props.open}
      onOpenChange={props.onOpenChange}
      dialogContentProps={{ height: 420, width: 500, maxWidth: '100%' }}
    >
      <ActionSheet.MainContent>
        <YStack flex={1} padding="$2xl" alignItems="center" gap="$4xl">
          <YStack justifyContent="center" alignItems="center" gap="$xl">
            <Text size="$label/2xl">Get Started on Tlon</Text>
            <Text size="$label/m" color="$secondaryText">
              Use this invite to download the app and sign up.
            </Text>
          </YStack>
          <XStack height={150} gap="$2xl">
            <YStack
              borderWidth={1}
              borderColor="$border"
              height={160}
              width={160}
              borderRadius="$xl"
              justifyContent="center"
              alignItems="center"
              gap="$xl"
              padding="$m"
            >
              <GroupAvatar
                model={{
                  id: props.group.id,
                  iconImage: props.group.iconImage ?? '',
                  title: props.group.title ?? '',
                }}
                size="$5xl"
              />
              <Text size="$label/l" textAlign="center">
                Invite to {props.group.title}
              </Text>
            </YStack>
            <Stack
              borderWidth={1}
              borderColor="$border"
              height={160}
              width={160}
              borderRadius="$xl"
              justifyContent="center"
              alignItems="center"
            >
              <QRCode value={personalInviteLink} size={120} />
            </Stack>
          </XStack>
          <YStack marginHorizontal="$4xl" gap="$xl">
            <Text size="$label/m" color="$tertiaryText" textAlign="center">
              Tlon is a peer to peer app you own etc. value proposition. To get
              started, scan this QR code.
            </Text>
            <Button secondary>
              <Button.Text>Or text me an invite link</Button.Text>
            </Button>
          </YStack>
        </YStack>
      </ActionSheet.MainContent>
    </ActionSheet>
  );
}
