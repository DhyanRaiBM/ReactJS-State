import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./users/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer // Renaming the reducer key to "user"
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
