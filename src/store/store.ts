import { combineSlices, configureStore } from '@reduxjs/toolkit';
import filmSlice from './slice/filmSlice';

const rootReducer = combineSlices(filmSlice);

export const store = configureStore({
	reducer: rootReducer
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof rootReducer>
