import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Category } from '../types';

interface ProductFormProps {
    product?: {
        id?: number;
        sku: string;
        name: string;
        category: number;
        quantity: number;
        price: string;
        min_stock_level: number;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        sku: product?.sku || '',
        name: product?.name || '',
        category: product?.category || '',
        quantity: product?.quantity || 0,
        price: product?.price || '',
        min_stock_level: product?.min_stock_level || 5,
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get<Category[]>('/categories/');
            setCategories(response.data);
        } catch (err) {
            console.error('Ошибка загрузки категорий:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                category: parseInt(formData.category as string),
            };

            if (product?.id) {
                await apiClient.put(`/products/${product.id}/`, data);
            } else {
                await apiClient.post('/products/', data);
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
                <label style={styles.label}>Артикул (SKU) *</label>
                <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Название *</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Категория *</label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.select}
                    required
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.row}>
                <div style={styles.field}>
                    <label style={styles.label}>Количество *</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Цена (₽) *</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        style={styles.input}
                        required
                    />
                </div>
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Мин. остаток</label>
                <input
                    type="number"
                    min="0"
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.actions}>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>
                    Отмена
                </button>
                <button type="submit" disabled={isLoading} style={styles.submitButton}>
                    {isLoading ? 'Сохранение...' : product?.id ? 'Сохранить' : 'Создать'}
                </button>
            </div>
        </form>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px',
        flex: 1,
    },
    row: {
        display: 'flex',
        gap: '12px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    input: {
        padding: '10px',
        fontSize: '14px',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        outline: 'none',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
    },
    select: {
        padding: '10px',
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
        marginTop: '8px',
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

export default ProductForm;