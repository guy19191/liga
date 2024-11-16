import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import https from "https";

const SignupForm = ({ loginCheck }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [alert, setAlert] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
            setAlert('אנא מלא את כל השדות');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setAlert('הסיסמאות אינן תואמות');
            return false;
        }
        if (formData.password.length < 6) {
            setAlert('הסיסמה חייבת להכיל לפחות 6 תווים');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setAlert('');

        try {
            const response = await axios.post('auth/v1/signup', {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            },{httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })});

            if (response.status === 201) {
                // Auto-login after successful signup
                const loginResponse = await axios.post('auth/v1/signIn', {
                    username: formData.email,
                    password: formData.password
                }, {httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    })});

                localStorage.setItem('accessToken', loginResponse.data.accessToken);
                localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
                loginCheck();
            } else {
                setAlert(response.data);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                setAlert('כתובת האימייל כבר קיימת במערכת');
            } else {
                setAlert('התרחשה שגיאה בהרשמה. אנא נסה שוב.');
                console.error('Signup error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2 className="auth-title">הרשמה</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="שם פרטי"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="שם משפחה"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="אימייל"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="סיסמה"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="אימות סיסמה"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`auth-submit ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'מבצע הרשמה...' : 'הירשם'}
                    </button>

                    {alert && (
                        <div className="auth-alert">
                            {alert}
                        </div>
                    )}
                </form>

                <div className="auth-footer">
                    <p>
                        כבר יש לך חשבון?{' '}
                        <a href="/login" className="auth-link">התחבר כאן</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;