import React, { useEffect, useState } from 'react';
import { User, Award } from 'lucide-react';
import './user-header.css';

const UserHeader = ({ username, points }) => {
    const [isPointsUpdating, setIsPointsUpdating] = useState(false);
    const [prevPoints, setPrevPoints] = useState(points);

    useEffect(() => {
        if (prevPoints !== points) {
            setIsPointsUpdating(true);
            setPrevPoints(points);

            const timer = setTimeout(() => {
                setIsPointsUpdating(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [points, prevPoints]);

    return (
        <header className="user-header">
            <div className="header-container">
                <div className="header-content">
                    <div className="user-info">
                        <div className="avatar-container">
                            <User className="user-icon" />
                        </div>
                        <div className="main-info">
                            <div className="info-row">
                                <h2 className="username">{username}</h2>
                                <div className="points-badge">
                                    <Award className="award-icon" />
                                    <span className={`points-value ${isPointsUpdating ? 'updating' : ''}`}>
                                        {points}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const UserHeaderSkeleton = () => (
    <header className="user-header">
        <div className="header-container">
            <div className="header-content">
                <div className="user-info">
                    <div className="avatar-container skeleton"></div>
                    <div className="main-info">
                        <div className="info-row">
                            <div className="username skeleton" style={{width: '120px', height: '24px'}}></div>
                            <div className="points-badge skeleton" style={{width: '80px', height: '28px'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
);


export { UserHeader, UserHeaderSkeleton };