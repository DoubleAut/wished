'use client';

import { FriendsSlice } from '@/entities/user/model/friendsStore';
import { UserInformationSlice } from '@/entities/user/model/user';
import { useBoundGlobalUserStore } from '@/entities/viewer/model/viewerStore';
import { WishesSlice } from '@/entities/wish/model/wishesStore';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';

type Store = StoreApi<UserInformationSlice & WishesSlice & FriendsSlice>;

export const ViewerStoreContext = createContext<Store | null>(null);

export interface Props {
    children: ReactNode;
}

export const ViewerStoreProvider = ({ children }: Props) => {
    const storeRef = useRef<Store>();

    if (!storeRef.current) {
        // eslint-disable-next-line
        storeRef.current = useBoundGlobalUserStore();
    }

    return (
        <ViewerStoreContext.Provider value={storeRef.current}>
            {children}
        </ViewerStoreContext.Provider>
    );
};

export const useViewerStore = <T,>(
    selector: (store: UserInformationSlice & WishesSlice & FriendsSlice) => T,
): T => {
    const viewerStoreContext = useContext(ViewerStoreContext);

    if (!viewerStoreContext) {
        throw new Error(
            `useViewerStore must be use within ViewerStoreProvider`,
        );
    }

    return useStore(viewerStoreContext, selector);
};
