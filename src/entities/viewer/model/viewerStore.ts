import { User as Viewer } from '@/shared/types/User';
import { Wish } from '@/shared/types/Wish';
import { createStore } from 'zustand';

type ViewerState = {
    user: Viewer | null;
};

export interface ViewerActions {
    setViewer: (user: Viewer) => void;
    setFollowers: (followers: Viewer[]) => void;
    setFollowings: (followings: Viewer[]) => void;
    setWishes: (wishes: Wish[]) => void;
}

export type ViewerStore = ViewerState & ViewerActions;

export const defaultInitState = {
    user: null,
};

export const createViewerStore = (
    initState: ViewerState = defaultInitState,
) => {
    return createStore<ViewerStore>()(set => ({
        ...initState,
        setViewer: (user: Viewer) => set(() => ({ user })),
        setFollowers: followers =>
            set(state => {
                if (state.user) {
                    return { user: { ...state.user, followers } };
                }

                return state;
            }),
        setFollowings: followings =>
            set(state => {
                if (state.user) {
                    return { user: { ...state.user, followings } };
                }

                return state;
            }),
        setWishes: wishes =>
            set(state => {
                if (state.user) {
                    return { user: { ...state.user, wishes } };
                }

                return state;
            }),
    }));
};
