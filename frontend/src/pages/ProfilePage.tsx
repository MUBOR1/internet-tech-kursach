import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProfile, updateProfile, uploadAvatar, deleteAvatar, toggleTheme } from '../store/slices/profileSlice';
import { logout } from '../store/slices/authSlice';
import { IoHome, IoPersonCircle, IoLogOut, IoCamera, IoTrash, IoSave, IoMoon, IoSunny, IoSwapHorizontal } from 'react-icons/io5';

const ProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile, theme } = useAppSelector((state) => state.profile);
    const token = useAppSelector((state) => state.auth.token);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', bio: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        dispatch(fetchProfile());
    }, [dispatch, token, navigate]);

    useEffect(() => {
        if (profile) setFormData({ first_name: profile.first_name || '', last_name: profile.last_name || '', bio: profile.bio || '' });
    }, [profile]);

    useEffect(() => {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme === 'light');
    }, [theme]);

    const handleLogout = () => { dispatch(logout()); navigate('/login'); };
    const handleSave = async () => {
        await dispatch(updateProfile({ first_name: formData.first_name, last_name: formData.last_name, bio: formData.bio }));
        setIsEditing(false);
        dispatch(fetchProfile());
    };
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) dispatch(uploadAvatar(e.target.files[0])); };
    const handleDeleteAvatar = () => { if (window.confirm('Удалить аватар?')) dispatch(deleteAvatar()); };
    const handleSwitchAccount = () => { dispatch(logout()); navigate('/login'); };

    const avatarUrl = profile?.avatar ? `http://127.0.0.1:8000${profile.avatar}` : null;
    if (!token) return null;

    return (
        <div style={styles.container}>
            <header style={styles.header} className="header">
                <div style={styles.headerLeft} className="header-left">
                    <button onClick={() => navigate('/dashboard')} style={styles.homeButton}><IoHome size={20} /></button>
                    <h1 style={styles.headerTitle} className="header-title">👤 Профиль</h1>
                </div>
                <div style={styles.headerActions} className="header-actions">
                    <div style={styles.dropdown}>
                        <button onClick={() => setProfileOpen(!profileOpen)} style={styles.profileButton}>
                            {avatarUrl ? (
                                <div style={styles.avatarSmallWrapper}>
                                    <img src={avatarUrl} alt="Avatar" style={styles.avatarSmall} />
                                </div>
                            ) : (
                                <IoPersonCircle size={28} color="var(--text-primary)" />
                            )}
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
                <div style={styles.profileCard} className="profile-card">
                    <div style={styles.avatarSection}>
                        <div style={styles.avatarWrapper}>
                            {avatarUrl ? (
                                <div style={styles.avatarLargeWrapper}>
                                    <img src={avatarUrl} alt="Avatar" style={styles.avatarLarge} />
                                </div>
                            ) : (
                                <IoPersonCircle size={120} color="var(--text-secondary)" />
                            )}
                            <div style={styles.avatarActions}>
                                <button onClick={() => fileInputRef.current?.click()} style={styles.avatarButton}><IoCamera size={20} /></button>
                                {avatarUrl && <button onClick={handleDeleteAvatar} style={styles.avatarButton}><IoTrash size={20} /></button>}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                        </div>
                    </div>

                    <div style={styles.infoSection}>
                        <h2 style={{ color: 'var(--text-primary)' }}>{profile?.username}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{profile?.email}</p>
                        <p style={{ color: 'var(--text-secondary)' }}>Роль: {profile?.role === 'manager' ? 'Менеджер склада' : 'Кладовщик'}</p>
                        <p style={{ color: 'var(--text-secondary)' }}>Дата регистрации: {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('ru-RU') : ''}</p>
                        {isEditing ? (
                            <div style={styles.editForm}>
                                <input type="text" placeholder="Имя" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} style={styles.input} />
                                <input type="text" placeholder="Фамилия" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} style={styles.input} />
                                <textarea placeholder="О себе" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} style={styles.input} />
                                <div style={styles.formActions}>
                                    <button onClick={handleSave} style={styles.saveButton}><IoSave size={18} /> Сохранить</button>
                                    <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Отмена</button>
                                </div>
                            </div>
                        ) : (
                            <div style={styles.bioSection}>
                                <p><strong>Имя:</strong> {profile?.first_name || '—'}</p>
                                <p><strong>Фамилия:</strong> {profile?.last_name || '—'}</p>
                                <p><strong>О себе:</strong> {profile?.bio || '—'}</p>
                                <button onClick={() => setIsEditing(true)} style={styles.editButton}>Редактировать профиль</button>
                            </div>
                        )}
                    </div>

                    <div style={styles.settingsSection}>
                        <h3>Настройки</h3>
                        <div style={styles.settingItem}>
                            <span>{theme === 'dark' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}</span>
                            <button onClick={() => dispatch(toggleTheme())} style={styles.themeButton}>{theme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}</button>
                        </div>
                        <div style={styles.settingItem}>
                            <span>Сменить аккаунт</span>
                            <button onClick={handleSwitchAccount} style={styles.switchButton}><IoSwapHorizontal size={20} /> Выйти и сменить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { minHeight: '100vh', backgroundColor: 'var(--bg-primary)' },
    header: { backgroundColor: 'var(--header-bg)', padding: '16px 32px', boxShadow: 'var(--card-shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '16px' },
    homeButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' },
    headerTitle: { margin: 0, fontSize: '24px', color: 'var(--text-primary)' },
    dropdown: { position: 'relative' as const },
    profileButton: { display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '14px', color: 'var(--text-primary)', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' },
    avatarSmallWrapper: { width: 28, height: 28, borderRadius: '50%', overflow: 'hidden' },
    avatarSmall: { width: '100%', height: '100%', objectFit: 'cover' as const },
    dropdownMenu: { position: 'absolute' as const, top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--dropdown-bg)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: '160px', zIndex: 100, overflow: 'hidden' },
    dropdownItem: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', fontSize: '14px', color: 'var(--text-primary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' as const },
    content: { padding: '32px', maxWidth: '800px', margin: '0 auto' },
    profileCard: { backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--card-shadow)' },
    avatarSection: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
    avatarWrapper: { position: 'relative' as const },
    avatarLargeWrapper: { width: 120, height: 120, borderRadius: '50%', overflow: 'hidden' },
    avatarLarge: { width: '100%', height: '100%', objectFit: 'cover' as const },
    avatarActions: { position: 'absolute' as const, bottom: 0, right: 0, display: 'flex', gap: '4px' },
    avatarButton: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1976d2', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    infoSection: { textAlign: 'center' as const, marginBottom: '32px' },
    bioSection: { marginTop: '16px', textAlign: 'left' as const, color: 'var(--text-primary)' },
    editButton: { marginTop: '16px', padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    editForm: { display: 'flex', flexDirection: 'column' as const, gap: '12px', marginTop: '16px' },
    input: { padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' },
    formActions: { display: 'flex', gap: '12px', marginTop: '8px' },
    saveButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    cancelButton: { padding: '10px 20px', backgroundColor: 'var(--button-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' },
    settingsSection: { borderTop: '1px solid var(--border-color)', paddingTop: '24px', color: 'var(--text-primary)' },
    settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' },
    themeButton: { padding: '8px 16px', backgroundColor: 'var(--button-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    switchButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ProfilePage;