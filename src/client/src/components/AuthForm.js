import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import https from "https";
const httpsAuth = new https.Agent({
    rejectUnauthorized: false
});
const AuthForm = ({ loginCheck }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    loginCheck();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlert('');

        try {
            const response = await axios.post('auth/v1/signIn', { username, password }, {httpsAgent: httpsAuth});
            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                loginCheck();
            } else {
                setAlert(response.data);
            }
        } catch (error) {
            setAlert('התרחשה שגיאה. אנא נסה שוב.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2 className="auth-title">התחברות</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="אימייל"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`auth-submit ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'מתחבר...' : 'התחבר'}
                    </button>

                    {alert && (
                        <div className="auth-alert">
                            {alert}
                        </div>
                    )}
                </form>

                <div className="auth-footer">
                    <p>
                        אין לך חשבון עדיין?{' '}
                        <a href="/signup" className="auth-link">הירשם עכשיו</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;