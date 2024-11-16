import React from 'react';
import './bottom-menu.css';

const nevigate = (to) => {
    window.location.href = to;
};

const BottomMenu = () => {
    // Get current path to determine active button
    const currentPath = window.location.pathname;

    return (
        <nav className="bottom-menu">
            <button
                onClick={() => nevigate('/')}
                className={currentPath === '/' ? 'active' : ''}
            >
                <span className="menu-icon">🎲</span>
                הניחושים
            </button>
            <button
                onClick={() => nevigate('/rules')}
                className={currentPath === '/rules' ? 'active' : ''}
            >
                <span className="menu-icon">📜</span>
                החוקים
            </button>
            <button
                onClick={() => nevigate('/league')}
                className={currentPath === '/league' ? 'active' : ''}
            >
                <span className="menu-icon">🏆</span>
                הליגה
            </button>
            <button
                onClick={() => nevigate('/profile')}
                className={currentPath === '/profile' ? 'active' : ''}
            >
                <span className="menu-icon">👤</span>
                הפרופיל
            </button>
        </nav>
    );
};

export default BottomMenu;