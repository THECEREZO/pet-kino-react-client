import {
    SerializedError,
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import { VideoCardType } from '../../components/video-card';
import axios from 'axios';
import { RootState } from '../store';
//import { VideoCardType } from "../../components/video-card";

type StatusType = 'initial' | 'pending' | 'fulfilled' | 'rejected' | 'empty_content';

interface InitialType {
    status: StatusType;
    films: Array<VideoCardType>;
    error: SerializedError | null;
}
const initialState: InitialType = {
    status: 'initial',
    films: [],
    error: null,
};

export const fetchFilmsByAll = createAsyncThunk(
    'films/fetchFilmsByAll',
    async () =>
        await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/films',
            responseType: 'json',
        }).then((response) => response.data)
);

export const fetchFilmsById = createAsyncThunk(
    'films/fetchFilmsById',
    async (id: string) => {
        return await axios({
            method: 'GET',
            url: `http://localhost:3000/api/films/${id}`,
            responseType: 'json',
        }).then(async (res) => await res.data);
    }
);

const filmSlice = createSlice({
    name: 'films',
    initialState,
    reducers: {
		addFilm: (state, { payload }: { payload: VideoCardType }) => {
			state.films.push(payload);
		}
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFilmsByAll.pending, (state) => {
            state.status = 'pending';
            state.error = null;
        });
        builder.addCase(
            fetchFilmsByAll.fulfilled,
            (state, { payload }: { payload: Array<VideoCardType> }) => {
                state.films = payload;

                state.status = payload.length > 0 ? 'fulfilled' : 'empty_content';
                state.error = null;
            }
        );
        builder.addCase(fetchFilmsByAll.rejected, (state, { error }) => {
            state.status = 'rejected';
            state.error = error;
        });


		builder.addCase(fetchFilmsById.fulfilled, (state, { payload }: { payload: VideoCardType }) => {
			if(state.films.length) {
				state.films.splice(0, state.films.length);
			}
			state.films.push(payload);

			state.status = 'fulfilled';
			state.error = null;
		})
		builder.addCase(fetchFilmsById.pending, (state) => {
			state.status = 'pending';
			state.error = null;
		})
		builder.addCase(fetchFilmsById.rejected, (state, { error }) => {
			state.status = 'rejected';
			state.error = error;
		})
    },
});
export const selectAllFilms = (state: RootState) => state.films.films;
export const selectFilmById = (state: RootState, id: string | undefined) => id && state.films.films.find((film) => film._id === id)

export const { addFilm } = filmSlice.actions;

export default filmSlice;
//export
