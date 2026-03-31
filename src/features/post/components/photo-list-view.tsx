import { useCarousel } from '@/components/carousel-provider';
import { ImageryItem } from '@/components/imagery-item';
import { ListEmptyView } from '@/components/list-empty-view';
import { fileFullUrl, imageFormat } from '@/utils/file';
import { MasonryFlashList } from '@shopify/flash-list';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { RefreshControl, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedMasonryFlashList = Animated.createAnimatedComponent(MasonryFlashList);

const PhotoListView: React.FC<any> = ({ query, userDocumentId, headerHeight, scrollHandler }) => {
  const { onOpen } = useCarousel();
  const numColumns = 3;
  const { width: windowWidth } = useWindowDimensions();

  const images: any = useMemo(
    () =>
      _.reduce(
        query.data?.pages,
        (result: any, page: any) => {
          return [
            ...result,
            ..._.filter(
              page.data || [],
              (item: any) => _.startsWith(item.mime, 'image') || _.startsWith(item.mime, 'video'),
            ).map((item: any) => {
              return _.startsWith(item.mime, 'image')
                ? {
                    ...item,
                    thumbnail: imageFormat(item, 's', 't')?.fullUrl,
                    preview: imageFormat(item, 'l')?.fullUrl,
                  }
                : {
                    ...item,
                    thumbnail: imageFormat(item.attachmentExtras?.thumbnail, 's', 't')?.fullUrl,
                    preview: fileFullUrl(item),
                  };
            }),
          ];
        },
        [],
      ),
    [query.data?.pages],
  );

  const onImagePress = useCallback((index: number) => onOpen(images, index), [onOpen, images]);

  const renderItem = useCallback(
    ({ item, index }: any) => {
      return (
        <ImageryItem
          uri={item.thumbnail}
          cacheKey={item.name || item.thumbnail}
          mime={item.mime}
          alt={item.alternativeText || item.name}
          resizeMode="cover"
          className="ml-[1] aspect-[1] w-full"
          onPress={() => onImagePress(index)}
        />
      );
    },
    [onImagePress],
  );

  const renderItemSeparator = useCallback(() => <View style={{ marginBottom: 1 }} />, []);

  const renderEmptyComponent = useCallback(() => <ListEmptyView />, []);

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return (
    <AnimatedMasonryFlashList
      data={images}
      contentContainerStyle={{ paddingTop: headerHeight }}
      getItemType={() => 'image'}
      renderItem={renderItem}
      numColumns={numColumns}
      ItemSeparatorComponent={renderItemSeparator}
      ListEmptyComponent={renderEmptyComponent}
      estimatedItemSize={windowWidth / numColumns}
      onEndReached={onEndReached}
      onScroll={scrollHandler}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} />
      }
    />
  );
};

export default PhotoListView;
