import { User } from '@/shared/types/User';
import { createSlice } from '@reduxjs/toolkit';

type UserState = Omit<User, 'password'>;

const initialState = null;

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState as User | null,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
