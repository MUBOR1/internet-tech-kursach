import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client.ts';

interface ProfileState {
    profile: any | null;
    theme: 'light' | 'dark';
    isLoading: boolean;
    error: string | null;
}

// Загружаем тему из localStorage при инициализации
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';

const initialState: ProfileState = {
    profile: null,
    theme: savedTheme || 'light',
    isLoading: false,
    error: null,
};

export const fetchProfile = createAsyncThunk(
    'profile/fetch',
    async () => {
        const response = await apiClient.get('/profile/me/');
        return response.data;
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async (data: any) => {
        const response = await apiClient.patch('/profile/me/', data);
        return response.data;
    }
);

export const uploadAvatar = createAsyncThunk(
    'profile/uploadAvatar',
    async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await apiClient.post('/profile/upload_avatar/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
);

export const deleteAvatar = createAsyncThunk(
    'profile/deleteAvatar',
    async () => {
        await apiClient.delete('/profile/delete_avatar/');
        return null;
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
            // Применяем тему к body
            applyThemeToBody(state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
            applyThemeToBody(state.theme);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profile = { ...state.profile, ...action.payload };
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                if (state.profile) {
                    state.profile.avatar = action.payload.avatar;
                }
            })
            .addCase(deleteAvatar.fulfilled, (state) => {
                if (state.profile) {
                    state.profile.avatar = null;
                }
            });
    },
});

// Вспомогательная функция для применения темы
const applyThemeToBody = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
};

// Применяем тему при загрузке
if (savedTheme) {
    applyThemeToBody(savedTheme);
}

export const { toggleTheme, setTheme } = profileSlice.actions;
export default profileSlice.reducer;