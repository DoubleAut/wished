import { CategorySlice } from '@/entities/category/model/categorySlice';
import { FriendsSlice } from '@/entities/user/model/friendsStore';
import { UserInformationSlice } from '@/entities/user/model/user';
import { WishesSlice } from '@/entities/wish/model/wishesStore';

export type GlobalStore = UserInformationSlice &
    WishesSlice &
    FriendsSlice &
    CategorySlice;
