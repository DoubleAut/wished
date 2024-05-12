'use client';

import { UserStore, createUserStore } from '@/entities/user/model/userStore';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';

export const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

export interface Props {
    children: ReactNode;
}

export const UserStoreProvider = ({ children }: Props) => {
    const storeRef = useRef<StoreApi<UserStore>>();

    if (!storeRef.current) {
        storeRef.current = createUserStore();
    }

    return (
        <UserStoreContext.Provider value={storeRef.current}>
            {children}
        </UserStoreContext.Provider>
    );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
    const userStoreContext = useContext(UserStoreContext);

    if (!userStoreContext) {
        throw new Error(`useUserStore must be use within UserStoreProvider`);
    }

    return useStore(userStoreContext, selector);
};
