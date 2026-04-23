import React, { useState } from 'react';

interface CategoryFormProps {
    category?: {
        id?: number;
        name: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { createCategory, updateCategory } = await import('../store/slices/categoriesSlice');
            const { store } = await import('../store');
            
            if (category?.id) {
                await store.dispatch(updateCategory({ id: category.id, data: { name } }));
            } else {
                await store.dispatch(createCategory({ name }));
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка сохранения');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
                <label style={styles.label}>Название категории *</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    placeholder="Например: Электроника"
                    required
                />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.actions}>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>
                    Отмена
                </button>
                <button type="submit" disabled={isLoading} style={styles.submitButton}>
                    {isLoading ? 'Сохранение...' : category?.id ? 'Сохранить' : 'Создать'}
                </button>
            </div>
        </form>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    input: {
        padding: '12px',
        fontSize: '14px',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        outline: 'none',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
    },
    error: {
        color: 'var(--danger-color)',
        fontSize: '14px',
        margin: 0,
    },
    actions: {
        display: 'flex',
        gap: '12px',
    },
    cancelButton: {
        flex: 1,
        padding: '10px',
        fontSize: '14px',
        backgroundColor: 'var(--button-bg)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    submitButton: {
        flex: 1,
        padding: '10px',
        fontSize: '14px',
        fontWeight: 600,
        color: 'white',
        backgroundColor: '#1976d2',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};

export default CategoryForm;