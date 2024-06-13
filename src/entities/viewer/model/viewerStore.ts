import { createWishesSlice } from '@/entities/wish/model/wishesStore';
import { GlobalStore } from '@/shared/types/GlobalStore';
import { createStore } from 'zustand';
import { createCategorySlice } from '../../category/model/categorySlice';
import { createFriendsSlice } from '../../user/model/friendsStore';
import { createUserInformationSlice } from '../../user/model/user';

export const useBoundGlobalUserStore = () => {
    return createStore<GlobalStore>()((...a) => ({
        ...createUserInformationSlice(...a),
        ...createWishesSlice(...a),
        ...createFriendsSlice(...a),
        ...createCategorySlice(...a),
    }));
};
