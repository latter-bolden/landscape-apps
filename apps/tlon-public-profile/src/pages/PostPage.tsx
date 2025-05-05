import {
  GalleryContentRenderer,
  GroupAvatar,
  GroupListItem,
  NotebookPostDetailView,
  PinnedPostContent,
  PinnedPostsDisplay,
} from '@tloncorp/app/ui';
import { getCanonicalPostId } from '@tloncorp/shared/api';
import * as db from '@tloncorp/shared/db';
import { Icon, Pressable, Text, View } from '@tloncorp/ui';
import { ComponentProps, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ScrollView, XStack, YStack, useMedia } from 'tamagui';

import { GroupPreviewModal } from '@/components/GroupPreviewModal';
import { PageContainer } from '@/components/PageContainer';

import { usePageStore } from '../data/pageStore';

export function PostPage() {
  const params = useParams();
  const media = useMedia();
  const { posts, getPostGroup } = usePageStore();
  const postId = getCanonicalPostId(params.backendPostId!);
  const post = posts.find((p) => p.id === postId);
  const group = useMemo(() => {
    return getPostGroup(postId);
  }, [postId, getPostGroup]);

  if (!post) {
    return <Text>Post not found</Text>;
  }

  if (media.lg) {
    return (
      <PageContainer open={false} onOpenChange={() => {}}>
        <XStack marginTop="$xl" flex={1} justifyContent="center" gap="$xl">
          <YStack>
            <BackAction />
            <PostGroupWidget
              postGroup={group}
              marginTop="$2xl"
              maxWidth={240}
            />
          </YStack>
          <View height="100%" flexShrink={1}>
            <ScrollView flex={1} marginTop="$2xl">
              <DetailPost post={post} />
            </ScrollView>
          </View>
        </XStack>
      </PageContainer>
    );
  }

  return (
    <PageContainer open={false} onOpenChange={() => {}}>
      <YStack flex={1}>
        <BackAction />
        <DetailPost post={post} />
        <PostGroupWidget postGroup={group} />
      </YStack>
    </PageContainer>
  );
}

export function DetailPost({ post }: { post: db.Post }) {
  if (post.type === 'block') {
    return (
      <View maxWidth="100%" width={600} aspectRatio={1}>
        <PinnedPostContent
          postId={post.id}
          post={post}
          removable={false}
          containerProps={{ padding: '$2xl' }}
        />
      </View>
    );
  }

  if (post.type === 'note') {
    return <NotebookPostDetailView post={post} />;
  }

  return (
    <PinnedPostsDisplay
      pinnedPosts={[post]}
      isLoading={false}
      backgroundColor="$secondaryBackground"
    />
  );
}

export function BackAction(props: ComponentProps<typeof XStack>) {
  const navigate = useNavigate();

  return (
    <Pressable onPress={() => navigate('/')}>
      <XStack alignItems="center" {...props}>
        <Icon type="ChevronLeft" size="$xl" />
        <Text>View profile</Text>
      </XStack>
    </Pressable>
  );
}

export function PostGroupWidget({
  postGroup,
  ...rest
}: { postGroup?: db.Group | null } & ComponentProps<typeof YStack>) {
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  if (!postGroup) {
    return null;
  }

  return (
    <>
      <Pressable onPress={() => setGroupModalOpen(true)}>
        <YStack
          backgroundColor="$secondaryBackground"
          padding="$2xl"
          borderRadius="$l"
          gap="$xl"
          {...rest}
        >
          <Text size="$label/xl" color="$tertiaryText">
            Posted in
          </Text>
          <XStack alignItems="center" gap="$m">
            <GroupAvatar model={postGroup} />
            <Text>{postGroup.title}</Text>
          </XStack>
          <Text size="$label/s" color="$secondaryText">
            Not on Tlon Messenger? Download the app to join teh conversation.
          </Text>
        </YStack>
      </Pressable>
      <GroupPreviewModal
        open={groupModalOpen}
        onOpenChange={setGroupModalOpen}
        group={postGroup}
      />
    </>
  );
}
