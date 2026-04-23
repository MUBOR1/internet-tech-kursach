import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ username, password }));
        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>📦 Управление складом</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Логин</label>
                        <input
                            type="text"
                            placeholder="Введите логин"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            style={styles.input}
                            required
                        />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" disabled={isLoading} style={styles.button}>
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </button>
                </form>
                <p style={styles.linkText}>
                    Нет аккаунта?{' '}
                    <Link to="/register" style={styles.link}>
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 30px 0',
        textAlign: 'center',
        color: '#1a1a1a',
        fontSize: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#333',
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        fontWeight: 600,
        color: 'white',
        backgroundColor: '#1976d2',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    error: {
        color: '#d32f2f',
        fontSize: '14px',
        textAlign: 'center',
        margin: 0,
    },
    hint: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
    },
    linkText: {
        marginTop: '16px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
    },
    link: {
        color: '#1976d2',
        textDecoration: 'none',
        fontWeight: 500,
    },
};

export default LoginPage;