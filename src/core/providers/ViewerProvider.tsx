'use client';

import { useBoundGlobalUserStore } from '@/entities/viewer/model/viewerStore';
import { GlobalStore } from '@/shared/types/GlobalStore';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';

type Store = StoreApi<GlobalStore>;

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

export const useViewerStore = <T,>(selector: (store: GlobalStore) => T): T => {
    const viewerStoreContext = useContext(ViewerStoreContext);

    if (!viewerStoreContext) {
        throw new Error(
            `useViewerStore must be use within ViewerStoreProvider`,
        );
    }

    return useStore(viewerStoreContext, selector);
};
