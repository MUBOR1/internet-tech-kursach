import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client.ts';
import type { Category } from '../../types';

interface CategoriesState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async () => {
        const response = await apiClient.get<Category[]>('/categories/');
        return response.data;
    }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (data: { name: string }) => {
        const response = await apiClient.post('/categories/', data);
        return response.data;
    }
);

export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, data }: { id: number; data: { name: string } }) => {
        const response = await apiClient.put(`/categories/${id}/`, data);
        return response.data;
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id: number) => {
        await apiClient.delete(`/categories/${id}/`);
        return id;
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Ошибка загрузки категорий';
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            });
    },
});

export default categoriesSlice.reducer;