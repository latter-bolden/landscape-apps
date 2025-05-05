import * as db from '@tloncorp/shared/db';
import * as domain from '@tloncorp/shared/domain';
import { Icon, IconType, Pressable } from '@tloncorp/ui';
import { useMemo } from 'react';
import { styled } from 'tamagui';

import { ListItem } from '../ListItem';

const LinkTitle = styled(ListItem.Title, {
  fontSize: '$xl',
});

export function SocialLink(props: { link: domain.ProfileLink }) {
  if (!props.link.socialPlatformId && props.link.socialUserId) {
    return null;
  }

  return (
    <Pressable>
      <ListItem backgroundColor="$secondaryBackground" paddingHorizontal="$l">
        <ListItem.MainContent>
          <ListItem.Title paddingLeft="$xl">
            {props.link.socialUserId}
          </ListItem.Title>
        </ListItem.MainContent>
        <ListItem.EndContent>
          <ListItem.SystemIcon
            icon={getSocialIcon(props.link.socialPlatformId)}
            color="$tertiaryText"
          />
        </ListItem.EndContent>
      </ListItem>
    </Pressable>
  );
}

export function GenericLink(props: { link: domain.ProfileLink }) {
  const domain = new URL(props.link.url).hostname.replace('www.', '');
  return (
    <Pressable>
      <ListItem backgroundColor="$secondaryBackground" paddingHorizontal="$l">
        <ListItem.MainContent>
          <ListItem.Title paddingLeft="$xl">
            {props.link.title || domain}
          </ListItem.Title>
        </ListItem.MainContent>
        <ListItem.EndContent>
          <ListItem.SystemIcon icon="Link" color="$tertiaryText" />
        </ListItem.EndContent>
      </ListItem>
    </Pressable>
  );
}

export function TwitterAttestationLink(props: { attestation: db.Attestation }) {
  const formattedHandle = useMemo(() => {
    if (props.attestation.value?.charAt(0) === '@') {
      return props.attestation.value;
    }
    return `@${props.attestation.value}`;
  }, [props.attestation.value]);

  if (
    !props.attestation.value ||
    props.attestation.type !== 'twitter' ||
    props.attestation.status !== 'verified'
  ) {
    return null;
  }

  return (
    <Pressable>
      <ListItem backgroundColor="$secondaryBackground" paddingHorizontal="$2xl">
        <ListItem.MainContent
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <LinkTitle>{formattedHandle}</LinkTitle>
          <Icon type="VerifiedBadge" />
        </ListItem.MainContent>
        <ListItem.EndContent>
          <ListItem.SystemIcon
            icon="LogoTwitter"
            size="$xl"
            color="$tertiaryText"
          />
        </ListItem.EndContent>
      </ListItem>
    </Pressable>
  );
}

export function getSocialIcon(
  profileId: domain.SocialPlatormId | undefined
): IconType {
  if (profileId === domain.SocialPlatormId.Instagram) {
    return 'LogoInstagram';
  }

  // if (profileId === domain.SocialPlatormId.SoundCloud) {
  //   return 'LogoSoundcloud';
  // }

  // if (profileId === domain.SocialPlatormId.TikTok) {
  //   return 'LogoTiktok';
  // }

  if (profileId === domain.SocialPlatormId.Twitter) {
    return 'LogoTwitter';
  }

  if (profileId === domain.SocialPlatormId.YouTube) {
    return 'LogoYoutube';
  }

  return 'Link';
}
