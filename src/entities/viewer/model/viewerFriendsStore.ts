import { User } from '@/shared/types/User';
import { create } from 'zustand';

interface FriendsStore {
    user: User | null;
    currentPath: 'followers' | 'followings';
    currentList: User[];
    filterList: (query: string) => void;
}

export const friendsStore = create<FriendsStore>((set, get) => ({
    user: null,
    currentPath: 'followers',
    currentList: [],
    filterList: (query: string) => {
        const state = get();
        const user = state.user;

        if (user) {
            const currentPath = state.currentPath;
            const currentList =
                currentPath === 'followers' ? user.followers : user.followings;

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
        }
    },
}));

export const handleFriendsStore = (user: User) => {
    friendsStore.setState({
        currentPath: 'followers',
        currentList: user.followers,
        user,
    });
};

export const updateCurrentList = (name: 'followers' | 'followings') => {
    const state = friendsStore.getState();

    if (state.user) {
        friendsStore.setState({
            currentList: state.user[name],
            currentPath: name,
        });
    }
};
