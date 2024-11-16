import React, {useEffect, useState} from 'react';
import './profile.css';
import BottomMenu from "./BottomMenu";
import {axiosInstance} from "../store/request";
import {userLigaApi} from "../store/apis";

const UserProfile = () => {
    const [userData, setUserData] = useState({});
    const [betHistory, setBetHistory] = useState([]);
    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser(){
        const [userResponse] = await Promise.all([
            userLigaApi()
        ]);
        setUserData(userResponse)
    }


    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-main-info">
                        <div>
                            <div className="profile-name-section">
                                    <>
                                        <h2 className="profile-nickname">{userData.nickname}</h2>
                                    </>
                            </div>
                            <div className="league-selection">
                                <span>נקודות: {userData.points}</span>
                            </div>
                        </div>
                        <div className="stats-section">
                            <div className="stat-item">אחוז הצלחה: {userData?.winRate}%</div>
                            <div className="stat-item">הימורים: {userData?.totalBets}</div>
                        </div>
                    </div>
                </div>

                {/*<div className="personal-info">*/}
                {/*    <h3 className="section-title">פרטים אישיים</h3>*/}
                {/*    <div className="info-grid">*/}
                {/*        <div className="info-item">*/}
                {/*            <span className="info-label">אימייל</span>*/}
                {/*            <span className="info-value">{userData.email}</span>*/}
                {/*        </div>*/}
                {/*        <div className="info-item">*/}
                {/*            <span className="info-label">תאריך הצטרפות</span>*/}
                {/*            <span className="info-value">{userData.joinDate}</span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="bet-history">
                    <h3 className="section-title">היסטוריית הימורים</h3>
                    <table className="history-table">
                        <thead>
                        <tr>
                            <th>תאריך</th>
                            <th>משחק</th>
                            <th>הימור</th>
                            <th>תוצאה</th>
                            <th>נקודות</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userData?.betHistory && userData.betHistory.map((bet, index) => (
                            <tr key={index}>
                                <td className='plain-text'>{bet.date}</td>
                                <td className='plain-text'>{bet.game}</td>
                                <td className='plain-text'>{bet.bet}</td>
                                <td className={bet.result === bet.bet ? 'result-win' : 'result-loss'}>
                                    {bet.result}
                                </td>
                                <td className={bet.points.startsWith('+') ? 'points-positive' : 'points-negative'}>
                                    {bet.points}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <BottomMenu/>
        </div>
    );
};

export default UserProfile;