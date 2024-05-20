'use client';

import {
    ViewerStore,
    createViewerStore,
} from '@/entities/user/model/viewerStore';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';

export const ViewerStoreContext = createContext<StoreApi<ViewerStore> | null>(
    null,
);

export interface Props {
    children: ReactNode;
}

export const ViewerStoreProvider = ({ children }: Props) => {
    const storeRef = useRef<StoreApi<ViewerStore>>();

    if (!storeRef.current) {
        storeRef.current = createViewerStore();
    }

    return (
        <ViewerStoreContext.Provider value={storeRef.current}>
            {children}
        </ViewerStoreContext.Provider>
    );
};

export const useViewerStore = <T,>(selector: (store: ViewerStore) => T): T => {
    const viewerStoreContext = useContext(ViewerStoreContext);

    if (!viewerStoreContext) {
        throw new Error(
            `useViewerStore must be use within ViewerStoreProvider`,
        );
    }

    return useStore(viewerStoreContext, selector);
};
