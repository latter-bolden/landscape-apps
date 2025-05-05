import {
  BioDisplay,
  Button,
  GenericLink,
  LocationDisplayWidget,
  PinnedGroupsDisplayWidget,
  PinnedPostsDisplay,
  PinnedTunesDisplayWidget,
  SocialLink,
  StatusDisplay,
  TwitterAttestDisplay,
  TwitterAttestationLink,
  UserInfoRow,
} from '@tloncorp/app/ui';
import * as db from '@tloncorp/shared/db';
import * as domain from '@tloncorp/shared/domain';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScrollView, View, XStack, YStack, useMedia } from 'tamagui';

import { GroupPreviewModal } from '@/components/GroupPreviewModal';

import { PageContainer } from '../components/PageContainer';
import { usePageStore } from '../data/pageStore';

export function ProfilePage() {
  const { contact: user } = usePageStore();
  const media = useMedia();
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<db.Group | null>(null);

  useEffect(() => {
    console.log(`bl: user contact data`, user);
  }, [user]);

  const tunes = useMemo(() => {
    return user.tunes ? (user.tunes as domain.NormalizedTrack[]) : [];
  }, [user.tunes]);

  const location = useMemo(() => {
    return (user?.location ?? null) as domain.ProfileLocation | null;
  }, [user?.location]);

  const posts = useMemo(() => {
    return (user?.pinnedPosts?.map((pp) => pp.post).filter(Boolean) ??
      []) as db.Post[];
  }, [user?.pinnedPosts]);

  const groups = useMemo(() => {
    const contactGroups =
      user.pinnedGroups?.map((pinGroup) => pinGroup.group).filter(Boolean) ??
      [];
    return contactGroups as db.Group[];
  }, [user.pinnedGroups]);

  const twitterAttestation = useMemo(() => {
    const validAttestation = user.attestations?.find(
      (userAttest) =>
        userAttest.attestation?.type === 'twitter' &&
        userAttest.attestation?.status === 'verified'
    );
    return validAttestation?.attestation ?? null;
  }, [user.attestations]);

  const unverifiedSocialLinks = useMemo(() => {
    if (!user.links) {
      return [];
    }
    const links = user.links as domain.ProfileLink[];
    return links.filter(
      (link) =>
        link.socialPlatformId &&
        link.socialUserId &&
        link.socialPlatformId !== 'twitter'
    );
  }, [user.links]);

  const otherLinks = useMemo(() => {
    if (!user.links) {
      return [];
    }
    const links = user.links as domain.ProfileLink[];
    return links.filter((link) => !link.socialPlatformId && !link.socialUserId);
  }, [user.links]);

  if (media.lg) {
    return (
      <PageContainer
        open={inviteModalOpen}
        onOpenChange={() => setInviteModalOpen(false)}
      >
        <XStack
          flex={1}
          minHeight="100%"
          backgroundColor="$background"
          padding="$2xl"
          justifyContent="center"
          gap={40}
        >
          <YStack height="100%" gap="$xl" maxWidth={400}>
            <UserInfoRow userId={user.id} hasNickname={!!user.nickname} />
            {user.bio && (
              <BioDisplay
                bio={user.bio}
                backgroundColor="$secondaryBackground"
              />
            )}
            <Button
              hero
              paddingVertical="$3xl"
              onPress={() => setInviteModalOpen(true)}
            >
              <Button.Text>Message</Button.Text>
            </Button>
            {location && (
              <LocationDisplayWidget
                location={location}
                backgroundColor="$secondaryBackground"
              />
            )}

            {twitterAttestation && (
              <TwitterAttestationLink attestation={twitterAttestation} />
            )}
            {unverifiedSocialLinks.length > 0 && (
              <>
                {unverifiedSocialLinks.map((link) => (
                  <SocialLink key={link.url} link={link} />
                ))}
              </>
            )}
          </YStack>
          <ScrollView flex={1} flexShrink={1} maxWidth={600}>
            <YStack gap="$xl">
              {/* {otherLinks.length > 0 && (
                <>
                  {otherLinks.map((link) => (
                    <GenericLink key={link.url} link={link} />
                  ))}
                </>
              )} */}
              {user.status && (
                <StatusDisplay
                  status={user.status}
                  backgroundColor="$secondaryBackground"
                />
              )}
              {groups.length > 0 && (
                <PinnedGroupsDisplayWidget
                  groups={groups}
                  backgroundColor="$secondaryBackground"
                  onPressGroup={(group) => {
                    setSelectedGroup(group);
                  }}
                />
              )}
              {posts.length > 0 && (
                <PinnedPostsDisplay
                  pinnedPosts={posts}
                  isLoading={false}
                  backgroundColor="$secondaryBackground"
                  onPressPost={(postId) => {
                    navigate(`/posts/${postId}`);
                  }}
                  postContainerProps={{ backgroundColor: '$background' }}
                />
              )}
              {tunes.length > 0 && (
                <PinnedTunesDisplayWidget
                  tunes={tunes}
                  backgroundColor="$secondaryBackground"
                />
              )}
            </YStack>
          </ScrollView>
        </XStack>
        <GroupPreviewModal
          group={selectedGroup}
          open={!!selectedGroup}
          onOpenChange={() => setSelectedGroup(null)}
        />
      </PageContainer>
    );
  }

  return (
    <View
      flex={1}
      minHeight="100%"
      backgroundColor="$background"
      padding="$2xl"
      alignItems="center"
    >
      <YStack width="100%" maxWidth={500} flex={1} gap="$xl">
        <UserInfoRow userId={user.id} hasNickname={!!user.nickname} />
        {user.bio && (
          <BioDisplay bio={user.bio} backgroundColor="$secondaryBackground" />
        )}

        {location && (
          <LocationDisplayWidget
            location={location}
            backgroundColor="$secondaryBackground"
          />
        )}

        {twitterAttestation && (
          <TwitterAttestationLink attestation={twitterAttestation} />
        )}
        {unverifiedSocialLinks.length > 0 && (
          <>
            {unverifiedSocialLinks.map((link) => (
              <SocialLink key={link.url} link={link} />
            ))}
          </>
        )}
        {groups.length > 0 && (
          <PinnedGroupsDisplayWidget
            groups={groups}
            backgroundColor="$secondaryBackground"
          />
        )}

        {posts.length > 0 && (
          <PinnedPostsDisplay
            pinnedPosts={posts}
            isLoading={false}
            backgroundColor="$secondaryBackground"
            postContainerProps={{ backgroundColor: '$background' }}
            onPressPost={(postId) => {
              navigate(`/posts/${postId}`);
            }}
          />
        )}
        {tunes.length > 0 && (
          <PinnedTunesDisplayWidget
            tunes={tunes}
            backgroundColor="$secondaryBackground"
          />
        )}
      </YStack>
    </View>
  );
}
