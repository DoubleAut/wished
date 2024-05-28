import {
    WishesSlice,
    createWishesSlice,
} from '@/entities/wish/model/wishesStore';
import { createStore } from 'zustand';
import {
    FriendsSlice,
    createFriendsSlice,
} from '../../user/model/friendsStore';
import {
    UserInformationSlice,
    createUserInformationSlice,
} from '../../user/model/user';

export const useBoundGlobalUserStore = () => {
    return createStore<UserInformationSlice & WishesSlice & FriendsSlice>()(
        (...a) => ({
            ...createUserInformationSlice(...a),
            ...createWishesSlice(...a),
            ...createFriendsSlice(...a),
        }),
    );
};
