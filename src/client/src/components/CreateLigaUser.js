import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../store/request";  // Assuming this is your API setup
import './create-liga-user.css';

const UserDialog = ({ isOpen, onClose, onSave }) => {
    const [nickname, setNickname] = useState('');
    const [league, setLeague] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchLeagues();
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchLeagues = async () => {
        setIsLoadingLeagues(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/leagues/v1/getAllLeagues');
            setLeagues(response.data);
        } catch (err) {
            setError('שגיאה בטעינת הליגות');
            console.error('Error fetching leagues:', err);
        } finally {
            setIsLoadingLeagues(false);
        }
    };

    const handleSave = async () => {
        if (!nickname || !league) {
            alert("נא למלא את כל השדות");
            return;
        }

        setIsLoading(true);
        try {
            await onSave({ nickname, league });
            onClose();
        } catch (error) {
            alert("אירעה שגיאה בתהליך ההרשמה");
            console.error('Error saving user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`dialog-overlay ${isOpen ? 'open' : ''}`}>
            <div className="dialog-container">
                {/* Header */}
                <div className="dialog-header">
                    <h2 className="dialog-title">הרשמה למשחק</h2>
                </div>

                {/* Form Content */}
                <div>
                    {/* Nickname Input */}
                    <div className="form-group">
                        <label className="form-label">כינוי</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="הכנס כינוי"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    {/* League Select */}
                    <div className="form-group">
                        <label className="form-label">ליגה</label>
                        {isLoadingLeagues ? (
                            <div className="loading-spinner-small"></div>
                        ) : error ? (
                            <div className="error-message">
                                {error}
                                <button
                                    className="retry-button"
                                    onClick={fetchLeagues}
                                >
                                    נסה שוב
                                </button>
                            </div>
                        ) : (
                            <select
                                className="form-select"
                                value={league}
                                onChange={(e) => setLeague(e.target.value)}
                                disabled={isLoadingLeagues}
                            >
                                <option value="">בחר ליגה</option>
                                {leagues.map((league) => (
                                    <option
                                        key={league.id}
                                        value={league.id}
                                    >
                                        {league.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="dialog-footer">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isLoading || !nickname || !league}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                שומר...
                            </>
                        ) : (
                            'שמור'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDialog;