import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { useRouter } from 'expo-router';
import { Ellipsis, MessageSquareWarning, Share } from 'lucide-react-native';
import React, { useCallback } from 'react';

export const PostContextMenu: React.FC<any> = ({ documentId }) => {
  const router = useRouter();

  const onShare = useCallback(() => {}, []);

  const onReport = useCallback(() => {
    router.push({
      pathname: '/reports',
      params: {
        contentRelation: 'post',
        contentDocumentId: documentId,
      },
    });
  }, [router, documentId]);

  const renderTrigger = useCallback((triggerProps: any) => {
    return (
      <Button {...triggerProps} variant="link">
        <Icon as={Ellipsis} />
      </Button>
    );
  }, []);

  return (
    <Menu placement="bottom" disabledKeys={['Settings']} trigger={renderTrigger}>
      <MenuItem key="Share" textValue="Share" onPress={onShare}>
        <HStack className="items-center" space="xs">
          <Icon as={Share} size="xs" />
          <MenuItemLabel size="xs">分享</MenuItemLabel>
        </HStack>
      </MenuItem>
      <MenuItem key="Report" textValue="Report" onPress={onReport}>
        <HStack className="items-center" space="xs">
          <Icon as={MessageSquareWarning} size="xs" />
          <MenuItemLabel size="xs">举报</MenuItemLabel>
        </HStack>
      </MenuItem>
    </Menu>
  );
};
