import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client.ts';
import type { ProductListResponse, StatsResponse } from '../../types';

interface ProductsState {
    products: ProductListResponse[];
    stats: StatsResponse | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    stats: null,
    isLoading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async () => {
        const response = await apiClient.get<ProductListResponse[]>('/products/');
        return response.data;
    }
);

export const fetchStats = createAsyncThunk(
    'products/fetchStats',
    async () => {
        const response = await apiClient.get<StatsResponse>('/products/stats/');
        return response.data;
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (data: any) => {
        const response = await apiClient.post('/products/', data);
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, data }: { id: number; data: any }) => {
        const response = await apiClient.put(`/products/${id}/`, data);
        return response.data;
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: number) => {
        await apiClient.delete(`/products/${id}/`);
        return id;
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Ошибка загрузки товаров';
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(createProduct.fulfilled, (state) => {
                // После создания обновим список
            })
            .addCase(updateProduct.fulfilled, (state) => {
                // После обновления обновим список
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                // После удаления обновим список
            });
    },
});

export default productsSlice.reducer;