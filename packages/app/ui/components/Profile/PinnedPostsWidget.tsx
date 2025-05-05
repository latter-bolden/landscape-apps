import { utils } from '@tloncorp/shared';
import * as db from '@tloncorp/shared/db';
import { Icon, Pressable, Text } from '@tloncorp/ui';
import { ComponentProps, useMemo, useState } from 'react';
import { Circle, ScrollView, XStack, YStack, YStackProps } from 'tamagui';

import {
  BlockReferenceContent,
  ChatReferenceContent,
  NoteReferenceContent,
  ReferenceProps,
} from '../ContentReference';
import { WidgetPane } from '../WidgetPane';

export function PinnedPostsDisplay(
  props: {
    pinnedPosts: db.Post[];
    isLoading: boolean;
    removable?: boolean;
    defaultVertical?: boolean;
    onRemove?: (postId: string) => void;
    onPressPost?: (postId: string) => void;
    postContainerProps?: YStackProps;
  } & ComponentProps<typeof WidgetPane>
) {
  const [isVertical, setIsVertical] = useState(props.defaultVertical ?? false);
  if (isVertical) {
    return (
      <YStack flex={1} gap="$l">
        <Pressable onLongPress={() => setIsVertical(false)}>
          <Text
            marginTop="$2xl"
            marginBottom="$l"
            size="$label/l"
            fontWeight="500"
            textAlign="center"
          >
            Pinned Posts
          </Text>
        </Pressable>
        {props.pinnedPosts.map((pinnedPost) => {
          return (
            <PinnedPostContent
              key={pinnedPost.id}
              postId={pinnedPost.id}
              post={pinnedPost}
              removable={props.removable ?? false}
              onRemove={props.onRemove}
              onPress={props.onPressPost}
              containerProps={props.postContainerProps}
              _isVertical={isVertical}
            />
          );
        })}
      </YStack>
    );
  }

  return (
    <WidgetPane width="100%" {...props}>
      <Pressable onLongPress={() => setIsVertical(true)}>
        <WidgetPane.Title>Pinned Posts</WidgetPane.Title>
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$l">
          {props.pinnedPosts.map((pinnedPost) => {
            return (
              <PinnedPostContent
                key={pinnedPost.id}
                postId={pinnedPost.id}
                post={pinnedPost}
                removable={props.removable ?? false}
                onRemove={props.onRemove}
                onPress={props.onPressPost}
                containerProps={props.postContainerProps}
              />
            );
          })}
        </XStack>
      </ScrollView>
    </WidgetPane>
  );
}

export function PinnedPostContent(props: {
  postId: string;
  post?: db.Post | null;
  removable: boolean;
  onRemove?: (postId: string) => void;
  onPress?: (postId: string) => void;
  _isVertical?: boolean;
  containerProps?: YStackProps;
}) {
  const customProps: { containerProps: YStackProps; refProps: ReferenceProps } =
    props._isVertical
      ? {
          containerProps: {
            borderRadius: '$xl',
            padding: '$xl',
            width: '100%',
            minHeight: 120,
            backgroundColor: '$secondaryBackground',
          },
          refProps: {
            flex: 1,
            maxHeight: 400,
          },
        }
      : {
          containerProps: {
            borderRadius: '$xl',
            padding: '$xl',
            height: 300,
            aspectRatio: 1,
            backgroundColor: '$secondaryBackground',
          },
          refProps: {
            flex: 1,
            maxHeight: 400,
          },
        };

  const timeDisplay = useMemo(() => {
    const date = new Date(props.post?.sentAt ?? Date.now());
    return utils.makePrettyDay(date);
  }, [props.post?.sentAt]);

  return (
    <YStack
      flex={1}
      height="auto"
      {...customProps.containerProps}
      {...props.containerProps}
      justifyContent="space-between"
    >
      {props.removable && (
        <XStack width="100%" justifyContent="flex-end">
          <Circle
            backgroundColor="$gray100"
            padding="$s"
            onPress={() => props.onRemove?.(props.postId)}
          >
            <Icon type="Close" size="$s" color="$primaryText" />
          </Circle>
        </XStack>
      )}
      {props.post ? (
        <Pressable flex={1} onPress={() => props.onPress?.(props.postId)}>
          {props.post?.type === 'block' ? (
            <BlockReferenceContent
              post={props.post}
              onPress={() => props.onPress?.(props.postId)}
              {...customProps.refProps}
            />
          ) : props.post?.type === 'note' ? (
            <NoteReferenceContent
              post={props.post}
              onPress={() => props.onPress?.(props.postId)}
              hideAuthor
              {...customProps.refProps}
            />
          ) : props.post ? (
            <ChatReferenceContent
              post={props.post}
              onPress={() => props.onPress?.(props.postId)}
              hideAuthor
              {...customProps.refProps}
            />
          ) : null}
        </Pressable>
      ) : (
        <Text>Post Not Found</Text>
      )}
      <XStack paddingTop="$xl">
        <Text color="$tertiaryText" size="$label/m">
          {timeDisplay}
        </Text>
      </XStack>
    </YStack>
  );
}
