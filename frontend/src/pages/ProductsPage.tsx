import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, deleteProduct, fetchStats } from '../store/slices/productsSlice';
import { logout } from '../store/slices/authSlice';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import { IoAdd, IoCreate, IoTrash, IoHome, IoChevronDown, IoPersonCircle, IoLogOut, IoCube, IoFolder } from 'react-icons/io5';
import { fetchProfile } from '../store/slices/profileSlice';

const ProductsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { products, isLoading } = useAppSelector((state) => state.products);
    const token = useAppSelector((state) => state.auth.token);
    const profile = useAppSelector((state) => state.profile.profile);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
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

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить товар?')) {
            await dispatch(deleteProduct(id));
            dispatch(fetchProducts());
            dispatch(fetchStats());
        }
    };

    const handleSave = async () => {
        setIsModalOpen(false);
        dispatch(fetchProducts());
        dispatch(fetchStats());
    };

    const avatarUrl = profile?.avatar 
        ? `http://127.0.0.1:8000${profile.avatar}` 
        : null;

    if (!token) return null;

    return (
        <div style={styles.container}>
            <header style={styles.header} className="header">
                <div style={styles.headerLeft} className="header-left">
                    <button onClick={() => navigate('/dashboard')} style={styles.homeButton}>
                        <IoHome size={20} />
                    </button>
                    <h1 style={styles.headerTitle} className="header-title">📦 Управление товарами</h1>
                </div>
                
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

            <div style={styles.content}>
                <div style={styles.contentHeader}>
                    <button onClick={handleAdd} style={styles.addButton} className="add-button">
                        <IoAdd size={20} /> Добавить товар
                    </button>
                </div>

                {isLoading ? (
                    <p style={styles.loading}>Загрузка...</p>
                ) : (
                    <div style={styles.tableWrapper} className="table-wrapper">
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Кол-во</th>
                                    <th>Цена</th>
                                    <th>Стоимость</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.sku}</td>
                                        <td>{product.name}</td>
                                        <td>{product.category_name}</td>
                                        <td style={product.is_low_stock ? { color: 'var(--warning-color)', fontWeight: 'bold' } : {}}>
                                            {product.quantity}
                                        </td>
                                        <td>{parseFloat(product.price).toLocaleString()} ₽</td>
                                        <td>{parseFloat(product.total_value).toLocaleString()} ₽</td>
                                        <td>
                                            <div style={styles.actions}>
                                                <button onClick={() => handleEdit(product)} style={styles.iconButton}>
                                                    <IoCreate size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={{ ...styles.iconButton, color: 'var(--danger-color)' }}>
                                                    <IoTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && <p style={styles.empty}>Нет товаров</p>}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}>
                <ProductForm product={editingProduct} onSuccess={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)'
    },
    header: {
        backgroundColor: 'var(--header-bg)',
        padding: '16px 32px',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    homeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        backgroundColor: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
        color: 'var(--text-secondary)'
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
        color: 'var(--text-primary)'
    },
    dropdown: {
        position: 'relative' as const
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
        cursor: 'pointer'
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
        cursor: 'pointer'
    },
    dropdownMenu: {
        position: 'absolute' as const,
        top: '100%',
        right: 0,
        marginTop: '8px',
        backgroundColor: 'var(--dropdown-bg)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '160px', zIndex: 100, overflow: 'hidden'
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px', width: '100%',
        padding: '12px 16px',
        fontSize: '14px',
        color: 'var(--text-primary)',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left' as const
    },
    content: {
        padding: '24px 32px'
    },
    contentHeader: {
        marginBottom: '20px'
    },
    addButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px', 
        fontSize: '14px',
        fontWeight: 600,
        color: 'white',
        backgroundColor: '#1976d2',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    tableWrapper: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
        overflow: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        color: 'var(--text-primary)'
    },
    actions: {
        display: 'flex',
        gap: '8px'
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        borderRadius: '4px'
    },
    loading: {
        textAlign: 'center' as const,
        padding: '40px',
        color: 'var(--text-secondary)'
    },
    empty: {
        textAlign: 'center' as const,
        padding: '40px',
        color: 'var(--text-secondary)'
    },
};

export default ProductsPage;