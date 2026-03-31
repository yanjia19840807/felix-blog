import { ListEmptyView } from '@/components/list-empty-view';
import _ from 'lodash';
import React, { useCallback, useMemo, useRef } from 'react';
import { RefreshControl } from 'react-native';
import Animated from 'react-native-reanimated';
import PostSimpleItem from './post-simple-item';

const PostListView: React.FC<any> = ({ userDocumentId, query, headerHeight, scrollHandler }) => {
  const rowRefs = useRef(new Map());

  const posts: any = useMemo(
    () => _.flatMap(query.data?.pages, (page) => page.data),
    [query.data?.pages],
  );

  const closeSwipeables = useCallback(() => {
    [...rowRefs.current.entries()].forEach(([key, ref]) => {
      if (ref) ref.close();
    });
  }, []);

  const onEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <PostSimpleItem
        item={item}
        index={index}
        userDocumentId={userDocumentId}
        rowRefs={rowRefs}
        closeSwipeables={closeSwipeables}
      />
    ),
    [userDocumentId, closeSwipeables],
  );

  const renderEmptyComponent = useCallback(() => <ListEmptyView />, []);

  return (
    <Animated.FlatList
      contentContainerStyle={{ paddingTop: headerHeight }}
      data={posts}
      contentContainerClassName="flex-s"
      renderItem={renderItem}
      keyExtractor={(item: any) => item.documentId}
      ListEmptyComponent={renderEmptyComponent}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      refreshControl={
        <RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} />
      }
    />
  );
};

export default PostListView;
