import React, { useEffect, useState } from 'react';
import BottomMenu from './BottomMenu';
import EventCard from "./EventCard";
import { axiosInstance } from "../store/request";
import {UserHeader, UserHeaderSkeleton} from "./UserHeader";
import { userLigaApi } from "../store/apis";
import './event-listing.css';
import CreateLigaUser from "./CreateLigaUser";

const EventListing = () => {
    const [events, setEvents] = useState([]);
    const [username, setUsername] = useState("");
    const [points, setPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegistration, setShowRegistration] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch events and user data in parallel
            const [betsResponse, userBetResponse, userResponse] = await Promise.all([
                axiosInstance.get('bets/v1/getBets'),
                axiosInstance.get('bets/v1/getUserBets'),
                userLigaApi()
            ]);

            if (!userResponse.nickname) {
                setShowRegistration(true);
                return;
            }

            createUserEvents(betsResponse.data, userBetResponse.data);
            setUsername(userResponse.nickname);
            setPoints(userResponse.points);
        } catch (err) {
            setError('אירעה שגיאה בטעינת הנתונים');
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterUser = async (userData) => {
        try {
            // Replace with your actual registration endpoint
            await axiosInstance.post('ligaUser/v1/createUser', userData);
            await fetchData(); // Refresh data after registration
        } catch (error) {
            console.error('Error registering user:', error);
            setError('אירעה שגיאה ברישום המשתמש');
        }
    };

    const handleRefresh = () => {
        fetchData();
    };

    const handleWatch = async (data) => {
        await axiosInstance.post('/bets/v1/setBet', data);
        await fetchData();
    }

    function createUserEvents(betsData, userData){
        for (const bet in betsData){
            userData.forEach(user =>{
                if (user.betid === betsData[bet].id){
                    betsData[bet].points = user.points
                    betsData[bet].team =  user.howwins;
                    betsData[bet].win = user.win
                }
            });
        }
        setEvents(betsData);
    }

    return (

        <div className="events-page">
            <CreateLigaUser
                isOpen={showRegistration}
                onClose={() => setShowRegistration(false)}
                onSave={handleRegisterUser}
            />
            <div className="top-menu">
                {(username) ?  <UserHeader username={username} points={points} /> : <UserHeaderSkeleton/>}
            </div>

            <div className="container">

                {isLoading ? (
                    // Loading skeletons
                    [...Array(3)].map((_, index) => (
                        <div key={index} className="loading-skeleton" />
                    ))
                ) : error ? (
                    // Error state
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={handleRefresh}>נסה שוב</button>
                    </div>
                ) : events.length === 0 ? (
                    // Empty state
                    <div className="empty-state">
                        <div className="empty-state-icon">🎲</div>
                        <p className="empty-state-text">אין הימורים זמינים כרגע</p>
                        <p className="empty-state-subtext">בדוק שוב מאוחר יותר</p>
                    </div>
                ) : (
                    // Events list
                    <div className="events-list">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                team1={event.teamA}
                                team2={event.teamB}
                                startTime={event.dateTime}
                                disabled={event.disable}
                                win={Number(event.win)}
                                betType={event.betName}
                                points={event.points}
                                teamSelected={event.team}
                                onPlaceBet={handleWatch}
                                howWins={event.howWins}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Refresh Button */}
            <button
                className="refresh-button"
                onClick={handleRefresh}
                aria-label="רענן רשימה"
            >
                🔄
            </button>

            <BottomMenu />
        </div>
    );
};

export default EventListing;