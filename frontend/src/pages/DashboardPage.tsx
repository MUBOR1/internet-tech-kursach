import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, fetchStats } from '../store/slices/productsSlice';
import { logout } from '../store/slices/authSlice';
import { IoChevronDown, IoPersonCircle, IoLogOut, IoCube, IoFolder } from 'react-icons/io5';
import { fetchProfile } from '../store/slices/profileSlice';

const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { products, stats, isLoading } = useAppSelector((state) => state.products);
    const token = useAppSelector((state) => state.auth.token);
    const profile = useAppSelector((state) => state.profile.profile);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        dispatch(fetchProfile());
        dispatch(fetchProducts());
        dispatch(fetchStats());
    }, [dispatch, token, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const avatarUrl = profile?.avatar 
        ? `http://127.0.0.1:8000${profile.avatar}` 
        : null;

    if (!token) return null;

    return (
        <div style={styles.container}>
            <header style={styles.header} className="header">
                <h1 style={styles.headerTitle} className="header-title">📊 Панель управления складом</h1>
                
                <div style={styles.headerActions} className="header-actions">
                    <div style={styles.dropdown}>
                        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.dropdownButton} className="dropdown-button">
                            Выбрать <IoChevronDown size={16} />
                        </button>
                        {menuOpen && (
                            <div style={styles.dropdownMenu}>
                                <button onClick={() => { navigate('/products'); setMenuOpen(false); }} style={styles.dropdownItem}>
                                    <IoCube size={18} /> Товары
                                </button>
                                <button onClick={() => { navigate('/categories'); setMenuOpen(false); }} style={styles.dropdownItem}>
                                    <IoFolder size={18} /> Категории
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={styles.dropdown}>
                        <button onClick={() => setProfileOpen(!profileOpen)} style={styles.profileButton}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="avatar-small" />
                            ) : (
                                <IoPersonCircle size={28} color="var(--text-primary)" />
                            )}
                            <IoChevronDown size={14} color="var(--text-primary)" />
                        </button>
                        {profileOpen && (
                            <div style={styles.dropdownMenu}>
                                <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} style={styles.dropdownItem}>
                                    <IoPersonCircle size={18} /> Профиль
                                </button>
                                <button onClick={handleLogout} style={styles.dropdownItem}>
                                    <IoLogOut size={18} /> Выйти
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="stats-grid">
                <div style={styles.statCard}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Всего товаров</h3>
                    <p style={styles.statValue} className="stat-value">{stats?.total_products || 0}</p>
                </div>
                <div style={styles.statCard}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Общее количество</h3>
                    <p style={styles.statValue} className="stat-value">{stats?.total_quantity || 0} шт.</p>
                </div>
                <div style={styles.statCard}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Общая стоимость</h3>
                    <p style={styles.statValue} className="stat-value">{stats?.total_value?.toLocaleString() || 0} ₽</p>
                </div>
                <div style={{ ...styles.statCard, borderColor: 'var(--warning-color)' }}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Мало осталось</h3>
                    <p style={{ ...styles.statValue, color: 'var(--warning-color)' }} className="stat-value">{stats?.low_stock_count || 0}</p>
                </div>
            </div>

            <div className="content-grid">
                <div style={styles.tableCard}>
                    <h2 style={{ color: 'var(--text-primary)' }}>📦 Товары на складе</h2>
                    {isLoading ? (
                        <p style={{ color: 'var(--text-primary)' }}>Загрузка...</p>
                    ) : (
                        <div className="table-wrapper">
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Артикул</th>
                                        <th>Название</th>
                                        <th>Категория</th>
                                        <th>Кол-во</th>
                                        <th>Цена</th>
                                        <th>Стоимость</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.slice(0, 5).map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.sku}</td>
                                            <td>{product.name}</td>
                                            <td>{product.category_name}</td>
                                            <td style={product.is_low_stock ? { color: 'var(--warning-color)', fontWeight: 'bold' } : {}}>
                                                {product.quantity}
                                            </td>
                                            <td>{parseFloat(product.price).toLocaleString()} ₽</td>
                                            <td>{parseFloat(product.total_value).toLocaleString()} ₽</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div style={styles.alertCard}>
                    <h2 style={{ color: 'var(--text-primary)' }}>⚠️ Товары с низким остатком</h2>
                    {stats?.low_stock_items && stats.low_stock_items.length > 0 ? (
                        <ul style={styles.alertList}>
                            {stats.low_stock_items.map((item) => (
                                <li key={item.id} style={styles.alertItem}>
                                    <span>{item.name}</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--danger-color)' }}>
                                        {item.quantity} шт.
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={styles.noAlerts}>Нет товаров с низким остатком</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
    },
    header: {
        backgroundColor: 'var(--header-bg)',
        padding: '16px 32px',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
        color: 'var(--text-primary)',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    dropdown: {
        position: 'relative' as const,
    },
    dropdownButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: '15px',
        fontWeight: 500,
        color: 'var(--text-primary)',
        backgroundColor: 'var(--button-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    profileButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        fontSize: '14px',
        color: 'var(--text-primary)',
        backgroundColor: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    dropdownMenu: {
        position: 'absolute' as const,
        top: '100%',
        right: 0,
        marginTop: '8px',
        backgroundColor: 'var(--dropdown-bg)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '160px',
        zIndex: 100,
        overflow: 'hidden',
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 16px',
        fontSize: '14px',
        color: 'var(--text-primary)',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left' as const,
    },
    statCard: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
        borderTop: '3px solid var(--stat-card-border)',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '10px 0 0 0',
        color: 'var(--text-primary)',
    },
    tableCard: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        color: 'var(--text-primary)',
    },
    alertCard: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
    },
    alertList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    alertItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)',
    },
    noAlerts: {
        color: 'var(--text-secondary)',
        textAlign: 'center' as const,
        padding: '20px 0',
    },
};

export default DashboardPage;