export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    category: number;
    category_name: string;
    quantity: number;
    price: string;
    min_stock_level: number;
    total_value: string;
    is_low_stock: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductListResponse {
    id: number;
    sku: string;
    name: string;
    category: number;
    category_name: string;
    quantity: number;
    price: string;
    min_stock_level: number;
    total_value: string;
    is_low_stock: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

export interface StatsResponse {
    total_products: number;
    total_quantity: number;
    total_value: number;
    low_stock_count: number;
    low_stock_items: ProductListResponse[];
    categories_stats: {
        category_id: number;
        category_name: string;
        products_count: number;
        total_quantity: number;
        total_value: number;
    }[];
}