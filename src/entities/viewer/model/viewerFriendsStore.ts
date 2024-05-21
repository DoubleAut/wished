import { User } from '@/shared/types/User';
import { create } from 'zustand';

interface FriendsStore {
    followers: User[];
    followings: User[];
    currentPath: 'followers' | 'followings';
    currentList: User[];
    filterList: (query: string) => void;
}

export const friendsStore = create<FriendsStore>((set, get) => ({
    currentPath: 'followers',
    followers: [],
    followings: [],
    currentList: [],
    filterList: (query: string) => {
        const currentPath = get().currentPath;
        const currentList =
            currentPath === 'followers' ? get().followers : get().followings;

        if (query.length > 0) {
            set({
                currentList: currentList.filter(user =>
                    [
                        user.name.toLocaleLowerCase(),
                        user.surname.toLocaleLowerCase(),
                    ]
                        .join(' ')
                        .includes(query),
                ),
            });
        }

        if (query.length === 0) {
            set({ currentList });
        }
    },
}));

export const handleStore = (user: User) => {
    friendsStore.setState({
        followers: user.followers,
        followings: user.followings,
        currentPath: 'followers',
        currentList: user.followers,
    });
};

export const setFollowers = (list: User[]) => {
    friendsStore.setState({ followers: list });
};

export const setFollowings = (list: User[]) => {
    friendsStore.setState({ followings: list });
};

export const updateCurrentList = (name: 'followers' | 'followings') => {
    const state = friendsStore.getState();

    friendsStore.setState({ currentList: state[name], currentPath: name });
};
