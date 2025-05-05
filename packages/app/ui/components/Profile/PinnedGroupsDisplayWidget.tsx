import * as db from '@tloncorp/shared/db';
import { Pressable } from '@tloncorp/ui';
import { ComponentProps } from 'react';
import { YStack } from 'tamagui';

import { ListItem } from '../ListItem';
import { WidgetPane } from '../WidgetPane';

export function PinnedGroupsDisplayWidget({
  groups,
  onPressGroup,
  ...rest
}: {
  groups: db.Group[];
  onPressGroup?: (group: db.Group) => void;
} & ComponentProps<typeof WidgetPane>) {
  return (
    <WidgetPane {...rest}>
      <WidgetPane.Title>Favorite Groups</WidgetPane.Title>
      <YStack>
        {groups.map((group) => (
          <Pressable key={group.id} onPress={() => onPressGroup?.(group)}>
            <ListItem gap="$xl">
              <ListItem.GroupIcon size="$5xl" model={group} />
              <ListItem.MainContent
                justifyContent="center"
                height="unset"
                flexGrow={1}
              >
                <ListItem.Title size="$label/xl">{group.title}</ListItem.Title>
              </ListItem.MainContent>
            </ListItem>
          </Pressable>
        ))}
      </YStack>
    </WidgetPane>
  );
}
