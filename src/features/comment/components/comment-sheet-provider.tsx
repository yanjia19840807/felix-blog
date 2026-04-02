import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

interface CommentSheetContextType {
  open: () => void;
  close: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  openSub: () => void;
  closeSub: () => void;
  commentSheetRef: React.RefObject<BottomSheetModal>;
  commentMenuSheetRef: React.RefObject<BottomSheet>;
  commentSubSheetRef: React.RefObject<BottomSheet>;
}

const CommentSheetContext = createContext<CommentSheetContextType | undefined>(undefined);

export const useCommentSheetContext = () => {
  const context = useContext(CommentSheetContext);
  if (!context) {
    throw new Error('useCommentSheetContext must be used within a CommentSheetProvider');
  }
  return context;
};

export const CommentSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const commentSheetRef = useRef<BottomSheetModal>(null);
  const commentMenuSheetRef = useRef<BottomSheet>(null);
  const commentSubSheetRef = useRef<BottomSheet>(null);

  const open = useCallback(() => commentSheetRef.current?.present(), []);
  const close = useCallback(() => commentSheetRef.current?.close(), []);
  const openMenu = useCallback(() => commentMenuSheetRef.current?.expand(), []);
  const closeMenu = useCallback(() => commentMenuSheetRef.current?.close(), []);
  const openSub = useCallback(() => commentSubSheetRef.current?.expand(), []);
  const closeSub = useCallback(() => commentSubSheetRef.current?.close(), []);

  const value = useMemo(
    () => ({
      open,
      close,
      openMenu,
      closeMenu,
      openSub,
      closeSub,
      commentSheetRef,
      commentMenuSheetRef,
      commentSubSheetRef,
    }),
    [open, close, openMenu, closeMenu, openSub, closeSub],
  );

  return <CommentSheetContext.Provider value={value}>{children}</CommentSheetContext.Provider>;
};
