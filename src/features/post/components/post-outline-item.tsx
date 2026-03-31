import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

const PostOutlineItem = memo(function PostOutlineItem({ item }: any) {
  const router = useRouter();

  const onPress = useCallback(
    () => router.push(`/posts/${item.documentId}`),
    [router, item.documentId],
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <Card size="sm" variant="ghost">
        <HStack className="items-center justify-between">
          <Text>{item.title}</Text>
          <UserAvatar user={item.author}></UserAvatar>
        </HStack>
      </Card>
    </TouchableOpacity>
  );
});

export default PostOutlineItem;
