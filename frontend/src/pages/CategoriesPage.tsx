import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories, deleteCategory } from '../store/slices/categoriesSlice';
import { logout } from '../store/slices/authSlice';
import Modal from '../components/Modal';
import CategoryForm from '../components/CategoryForm';
import { IoAdd, IoCreate, IoTrash, IoHome, IoChevronDown, IoPersonCircle, IoLogOut, IoCube, IoFolder } from 'react-icons/io5';
import { fetchProfile } from '../store/slices/profileSlice';

const CategoriesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { categories, isLoading } = useAppSelector((state) => state.categories);
    const token = useAppSelector((state) => state.auth.token);
    const profile = useAppSelector((state) => state.profile.profile);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        dispatch(fetchProfile());
        dispatch(fetchCategories());
    }, [dispatch, token, navigate]);

    const handleLogout = () => { dispatch(logout()); navigate('/login'); };
    const handleAdd = () => { setEditingCategory(null); setIsModalOpen(true); };
    const handleEdit = (category: any) => { setEditingCategory(category); setIsModalOpen(true); };
    const handleDelete = async (id: number) => { if (window.confirm('Удалить категорию?')) { await dispatch(deleteCategory(id)); } };
    const handleSave = () => { setIsModalOpen(false); dispatch(fetchCategories()); };

    const avatarUrl = profile?.avatar ? `http://127.0.0.1:8000${profile.avatar}` : null;
    if (!token) return null;

    return (
        <div style={styles.container}>
            <header style={styles.header} className="header">
                <div style={styles.headerLeft} className="header-left">
                    <button onClick={() => navigate('/dashboard')} style={styles.homeButton}><IoHome size={20} /></button>
                    <h1 style={styles.headerTitle} className="header-title">📂 Категории</h1>
                </div>
                <div style={styles.headerActions} className="header-actions">
                    <div style={styles.dropdown}>
                        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.dropdownButton} className="dropdown-button">
                            Выбрать <IoChevronDown size={16} />
                        </button>
                        {menuOpen && (
                            <div style={styles.dropdownMenu}>
                                <button onClick={() => { navigate('/products'); setMenuOpen(false); }} style={styles.dropdownItem}><IoCube size={18} /> Товары</button>
                                <button onClick={() => { navigate('/categories'); setMenuOpen(false); }} style={styles.dropdownItem}><IoFolder size={18} /> Категории</button>
                            </div>
                        )}
                    </div>
                    <div style={styles.dropdown}>
                        <button onClick={() => setProfileOpen(!profileOpen)} style={styles.profileButton}>
                            {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="avatar-small" /> : <IoPersonCircle size={28} color="var(--text-primary)" />}
                            <IoChevronDown size={14} color="var(--text-primary)" />
                        </button>
                        {profileOpen && (
                            <div style={styles.dropdownMenu}>
                                <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} style={styles.dropdownItem}><IoPersonCircle size={18} /> Профиль</button>
                                <button onClick={handleLogout} style={styles.dropdownItem}><IoLogOut size={18} /> Выйти</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div style={styles.content}>
                <div style={styles.contentHeader}>
                    <button onClick={handleAdd} style={styles.addButton} className="add-button"><IoAdd size={20} /> Добавить категорию</button>
                </div>
                {isLoading ? <p style={styles.loading}>Загрузка...</p> : (
                    <div className="grid-categories">
                        {categories.map((category) => (
                            <div key={category.id} style={styles.card}>
                                <div style={styles.cardContent}><span style={styles.categoryName}>{category.name}</span></div>
                                <div style={styles.cardActions}>
                                    <button onClick={() => handleEdit(category)} style={styles.iconButton}><IoCreate size={18} /></button>
                                    <button onClick={() => handleDelete(category.id)} style={{ ...styles.iconButton, color: 'var(--danger-color)' }}><IoTrash size={18} /></button>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && <p style={styles.empty}>Нет категорий</p>}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}>
                <CategoryForm category={editingCategory} onSuccess={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)'
    },
    header:{
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
        borderRadius: '8px', cursor: 'pointer'
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
        gap: '12px',
        width: '100%',
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
        cursor: 'pointer' },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardContent: {
        flex: 1
    },
    categoryName: {
        fontSize: '16px',
        fontWeight: 500, 
        color: 'var(--text-primary)'
    },
    cardActions: {
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

export default CategoriesPage;