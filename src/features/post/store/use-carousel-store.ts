import _ from 'lodash';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
  data: any[];
  index: number;
  isOpen?: boolean;
}

interface Actions {
  setIndex: (index: number) => void;
  setData: (data: any[]) => void;
  onOpen: (data: any[], index: number) => void;
  onOpenName: (data: any[], index: string) => void;
  onClose: () => void;
}

const initialState: State = {
  data: [],
  index: 0,
  isOpen: false,
};

export const useCarousel = create<State & { actions: Actions }>()(
  immer((set) => ({
    ...initialState,
    actions: {
      setIndex: (index) =>
        set((state) => {
          state.index = index;
        }),

      setData: (data) => {
        set((state) => {
          state.data = data;
        });
      },
      onOpen: (data, index = 0) => {
        set((state) => {
          state.isOpen = true;
          state.data = data;
          state.index = index;
        });
      },
      onOpenName: (data, name) => {
        const index = _.findIndex(data, (item: any) => item.name === name);
        set((state) => {
          state.isOpen = true;
          state.data = data;
          state.index = index;
        });
      },
      onClose: () => {
        set((state) => {
          state.isOpen = false;
        });
      },
    },
  })),
);

export const useCarouselActions = () => useCarousel((state) => state.actions);
