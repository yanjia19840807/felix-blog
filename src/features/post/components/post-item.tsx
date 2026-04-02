import { ImageryItem } from '@/components/imagery-item';
import { ImageryList } from '@/components/imagery-list';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CommentIcon } from '@/features/comment/components/comment-icon';
import { LastCommentItem } from '@/features/comment/components/last-comment-item';
import { useCommentActions } from '@/features/comment/store';
import { PostContextMenu } from '@/features/post/components/post-context-menu';
import useCoverDimensions from '@/features/post/hooks/use-cover-dimensions';
import { TagList } from '@/features/tag/components/tag-list';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { UserAvatars } from '@/features/user/components/user-avatars';
import { formatDistance } from '@/utils/date';
import { toAttachmetItem } from '@/utils/file';
import { useRouter } from 'expo-router';
import _ from 'lodash';
import { MapPin } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { Pressable } from 'react-native';
import { useCarouselActions } from '../store/use-carousel-store';
import { LikeButton } from './like-button';

export const PostItem: React.FC<any> = memo(function PostItem({ item }) {
  console.log('@@ Render PostItem');
  const router = useRouter();
  const { coverWidth, coverHeight } = useCoverDimensions(14, 10.5);
  const { onOpen } = useCarouselActions();

  const { setCommentPostDocumentId } = useCommentActions();

  const images = _.map(item.attachments || [], (attachment) =>
    toAttachmetItem(attachment, item.attachmentExtras),
  );

  const cover = item.cover ? toAttachmetItem(item.cover, item.attachmentExtras) : undefined;

  const carouselData = _.concat(cover ? cover : [], images || []);

  const onCoverPress = useCallback(() => {
    onOpen(carouselData, 0);
  }, [onOpen, carouselData]);

  const onImagePress = useCallback(
    (index: number) => {
      onOpen(carouselData, index + (cover ? 1 : 0));
    },
    [onOpen, carouselData, cover],
  );

  const onItemPress = useCallback(() => {
    setCommentPostDocumentId(item.documentId);
    router.push(`/posts/${item.documentId}`);
  }, [setCommentPostDocumentId, item.documentId, router]);

  return (
    <Pressable onPress={onItemPress}>
      <Card size="sm" className="mt-6 rounded-lg">
        <VStack space="lg">
          <VStack space="sm">
            <HStack className="items-center justify-between">
              <UserAvatar user={item.author} />
              <PostContextMenu documentId={item.documentId} />
            </HStack>
            <Text size="lg" numberOfLines={1} ellipsizeMode="tail" className="font-bold">
              {item.title}
            </Text>
            <HStack className="items-center justify-between">
              <Text size="xs">{formatDistance(item.publishDate)}</Text>
              <HStack space="xs" className="w-1/2 items-center justify-end">
                {item.poi?.address && (
                  <HStack className="items-center">
                    <Icon as={MapPin} size="xs" />
                    <Text size="xs" numberOfLines={1}>
                      {item.poi.address}
                    </Text>
                  </HStack>
                )}
              </HStack>
            </HStack>
            <TagList tags={item.tags || []}></TagList>
          </VStack>
          {cover && (
            <ImageryItem
              uri={cover.thumbnail}
              cacheKey={cover.name}
              mime={cover.mime}
              alt={cover.alternativeText || cover.name}
              style={{
                width: coverWidth,
                height: coverHeight,
                borderRadius: 6,
              }}
              onPress={onCoverPress}
            />
          )}
          <Text numberOfLines={5}>{item.content}</Text>
          <ImageryList value={images} onPress={onImagePress} />
          <HStack className="h-6 items-center justify-between">
            <LikeButton post={item} />
            <UserAvatars users={item.likedByUsers} />
          </HStack>
          <VStack space="sm">
            <HStack className="items-center justify-end">
              <CommentIcon postDocumentId={item.documentId} commentCount={item.comments.count} />
            </HStack>
            {item.lastComment && <LastCommentItem item={item.lastComment} />}
          </VStack>
        </VStack>
      </Card>
    </Pressable>
  );
});
