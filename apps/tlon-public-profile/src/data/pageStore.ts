import {
  toClientGroups,
  toPostData,
  v1PeerToClientProfile,
} from '@tloncorp/shared/api';
import * as db from '@tloncorp/shared/db';
import * as ub from '@tloncorp/shared/urbit';
import { useCallback, useMemo } from 'react';

import { STUBS } from '../mocks/page';

export function usePageStore() {
  const pageData = STUBS;
  const personalInviteLink =
    'https://join.tlon.io/0v1.50lav.f62df.mrt6d.16032.finst';

  const groups = useMemo(() => {
    return toClientGroups(pageData.groups as Record<string, any>, true, {
      ignoreCurrentUser: true,
    });
  }, [pageData.groups]);

  const { posts, postGroupMap } = useMemo(() => {
    const parsedPosts: db.Post[] = [];
    const postGroupMap: Record<string, string> = {};

    pageData.posts.forEach((p) => {
      const clientPost = toPostData(p.channel, p.post);
      parsedPosts.push(clientPost);
      postGroupMap[clientPost.id] = p.group;
    });

    return { posts: parsedPosts, postGroupMap };
  }, [pageData.posts]);

  const contact: db.Contact = useMemo(() => {
    const clientContact = v1PeerToClientProfile(
      '~dozped-mogtec',
      pageData.userContact as ub.ContactBookProfile,
      { ignoreCurrentUser: true }
    );
    clientContact.pinnedGroups = clientContact.pinnedGroups?.map(
      (groupPin) => ({
        ...groupPin,
        group: groups.find((g) => g.id === groupPin.groupId),
      })
    );

    const contactPinnedPosts = posts.map((post) => ({
      contactId: clientContact.id,
      postId: post.id,
      post,
    }));
    clientContact.pinnedPosts = contactPinnedPosts;

    return clientContact;
  }, [groups, pageData.userContact, posts]);

  const getPostGroup = useCallback(
    (postId: string) => {
      const groupId = postGroupMap[postId];
      if (!groupId) {
        return null;
      }
      return groups.find((g) => g.id === groupId) ?? null;
    },
    [groups, postGroupMap]
  );

  return {
    contact,
    posts,
    groups,
    getPostGroup,
    personalInviteLink,
  };
}
