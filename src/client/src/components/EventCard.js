import React, { useState } from "react";
import { Clock, Coins, Lock, Trophy } from "lucide-react";
import './event-card.css';
import WinningIcon from "./WinningIcon";

const BettingCard = ({
                         id,
                         team1,
                         team2,
                         startTime,
                         betType,
                         onPlaceBet,
                         disabled,
                         points,
                         teamSelected,
                         win = 0,
                         howWins
                     }) => {
    const [selectedPoints, setSelectedPoints] = useState(Number(points) || 100);
    const [selectedTeam, setSelectedTeam] = useState(teamSelected || null);

    const handlePointsChange = (amount) => {
        if (!disabled) {
            const newPoints = Math.max(100, selectedPoints + amount);
            setSelectedPoints(newPoints);
        }
    };

    const handleTeamSelect = (team) => {
        if (!disabled) {
            setSelectedTeam(team === selectedTeam ? null : team);
        }
    };

    const handleSubmitBet = () => {
        if (selectedTeam && !disabled) {
            onPlaceBet({
                id,
                team: selectedTeam,
                points: selectedPoints
            });
        }
    };

    const calculateWinAmount = () => {
        if (disabled && win !== 0) {
            return win * Number(points);
        }
        return 0;
    };

    const winStatus = () => howWins == teamSelected ? "winning" : howWins == 0 ? "pending" : "losing";

    const winAmount = calculateWinAmount();
    const winningStatus = winStatus();
    // Helper function to determine if a team is selected
    const isTeamSelected = (teamNumber) => {
        return disabled ? teamSelected === teamNumber : selectedTeam === teamNumber;
    };

    return (
        <div className={`betting-card ${disabled ? 'disabled-card' : ''}`} dir="rtl">
            <div className="card-header">
                <div className="header-left">
                    <h2 className="bet-type">{betType}</h2>
                    {disabled && (
                        <>
                            <div className="disabled-badge">
                                <Lock className="lock-icon" size={16} />
                                <span>הימור סגור</span>
                            </div>
                            {winningStatus && (
                                <WinningIcon status={winningStatus} />
                            )}
                        </>
                    )}
                </div>
                <div className="date-display">
                    <Clock className="date-icon" />
                    <span>{startTime}</span>
                </div>
            </div>

            <div className="card-content">
                <div className="teams-section">
                    <div
                        className={`team-option ${isTeamSelected(1) ? 'selected' : ''} ${
                            disabled ? 'disabled' : 'clickable'
                        }`}
                        onClick={() => handleTeamSelect(1)}
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                    >
                        <div className="team-status">
                            <div
                                className="team-logo"
                                style={{
                                    backgroundImage: `url(https://via.placeholder.com/40?text=${team1[0]})`
                                }}
                            />
                            {disabled && teamSelected === 1 && (
                                <div className="win-indicator">
                                    <Trophy className="trophy-icon" size={16} />
                                    <span className="win-amount">+{winAmount}</span>
                                </div>
                            )}
                            {disabled && teamSelected === 2 && (
                                <div className="loss-indicator">
                                    <span className="loss-amount">-{points}</span>
                                </div>
                            )}
                        </div>
                        <span className="team-name">{team1}</span>
                        {isTeamSelected(1) && (
                            <div className="selected-indicator">
                                <span>נבחר</span>
                            </div>
                        )}
                    </div>

                    <span className="vs">VS</span>

                    <div
                        className={`team-option ${isTeamSelected(2) ? 'selected' : ''} ${
                            disabled ? 'disabled' : 'clickable'
                        }`}
                        onClick={() => handleTeamSelect(2)}
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                    >
                        <div className="team-status">
                            <div
                                className="team-logo"
                                style={{
                                    backgroundImage: `url(https://via.placeholder.com/40?text=${team2[0]})`
                                }}
                            />
                            {disabled && teamSelected === 2 && (
                                <div className="win-indicator">
                                    <Trophy className="trophy-icon" size={16} />
                                    <span className="win-amount">+{winAmount}</span>
                                </div>
                            )}
                            {disabled && teamSelected === 1 && (
                                <div className="loss-indicator">
                                    <span className="loss-amount">-{points}</span>
                                </div>
                            )}
                        </div>
                        <span className="team-name">{team2}</span>
                        {isTeamSelected(2) && (
                            <div className="selected-indicator">
                                <span>נבחר</span>
                            </div>
                        )}
                    </div>
                </div>

                {!disabled && (
                    <>
                        <div className="points-section">
                            <div className="points-label">
                                <Coins className="points-icon" />
                                <span>נקודות להימור</span>
                            </div>
                            <div className="points-controls">
                                <button
                                    className="points-btn"
                                    onClick={() => handlePointsChange(-100)}
                                >
                                    -100
                                </button>
                                <span className="points-display">{selectedPoints}</span>
                                <button
                                    className="points-btn"
                                    onClick={() => handlePointsChange(100)}
                                >
                                    +100
                                </button>
                            </div>
                        </div>

                        <div className="submit-section">
                            <button
                                className={`submit-bet ${selectedTeam ? 'active' : 'disabled'}`}
                                onClick={handleSubmitBet}
                                disabled={!selectedTeam}
                            >
                                שלח ניחוש
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BettingCard;