import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../store/request";
import './manager-bet-control.css';
import LeagueManager from './LeagueManager';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Add New</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ManagerBetControl = () => {
    // State Management
    const [bets, setBets] = useState([]);
    const [teams, setTeams] = useState([]);
    const [betNames, setBetNames] = useState(['Winner', 'Over/Under', 'Both Score']);
    const [newBet, setNewBet] = useState({
        teamA: '',
        teamB: '',
        betName: '',
        date: '',
        hour: ''
    });
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isBetNameModalOpen, setIsBetNameModalOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', image: null });
    const [newBetName, setNewBetName] = useState('');
    const [lastAddedTeam, setLastAddedTeam] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial Data Fetching
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchTeams(), fetchBets()]);
        } catch (error) {
            setError('Failed to load initial data');
            console.error('Error loading initial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Data Fetching Functions
    const fetchTeams = async () => {
        try {
            const teams = await axiosInstance.get('/teams/v1/getTeams')
            setTeams(Object.keys(teams.data).length === 0 ? [] : teams.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    };

    const fetchBets = async () => {
        try {
            const response = await axiosInstance.get('/bets/v1/getBets')
            setBets(Object.keys(response.data).length === 0 ? [] : response.data);
        } catch (error) {
            console.error('Error fetching bets:', error);
            throw error;
        }
    };

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBet(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBet = async () => {
        if (!validateBetForm()) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const dateTime = `${newBet.date} ${newBet.hour}`;
            const bet = { ...newBet, dateTime };
            await axiosInstance.post('betsManager/v1/setBet', bet);
            await fetchBets();
            resetBetForm();
            setError(null);
        } catch (error) {
            setError('Failed to add bet');
            console.error('Error adding bet:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateBetForm = () => {
        return newBet.teamA && newBet.teamB && newBet.betName && newBet.date && newBet.hour;
    };

    const resetBetForm = () => {
        setNewBet({
            teamA: '',
            teamB: '',
            betName: '',
            date: '',
            hour: ''
        });
    };

    // Bet Management Functions
    const handleRemoveBet = async (id) => {
        try {
            await axiosInstance.post('betsManager/v1/setBetAsExpired', {id: id});
            await fetchBets();
        } catch (error) {
            setError('Failed to remove bet');
            console.error('Error removing bet:', error);
        }
    };

    const handleManualWin = async (id, howWins) => {
        try {
            await axiosInstance.post('betsManager/v1/manualWinUpdate', {id: id, howWins: howWins});
            await fetchBets();
        } catch (error) {
            setError('Failed to update winner');
            console.error('Error updating winner:', error);
        }
    };

    // Team Management Functions
    const handleNewTeamChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setNewTeam(prev => ({ ...prev, image: files[0] }));
        } else {
            setNewTeam(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddTeam = async (e) => {
        e.preventDefault();
        if (!newTeam.name || !newTeam.image) {
            setError('Please provide both team name and image');
            return;
        }

        try {
            const data = { name: newTeam.name, image: URL.createObjectURL(newTeam.image) };
            await axiosInstance.post('teams/v1/setTeam', data);
            await fetchTeams();
            setIsTeamModalOpen(false);
            setNewBet(prev => ({ ...prev, [lastAddedTeam]: data.name }));
            setNewTeam({ name: '', image: null });
            setError(null);
        } catch (error) {
            setError('Failed to add team');
            console.error('Error adding team:', error);
        }
    };

    // Bet Name Management
    const handleAddBetName = (e) => {
        e.preventDefault();
        if (!newBetName) {
            setError('Please provide a bet name');
            return;
        }

        if (!betNames.includes(newBetName)) {
            setBetNames(prev => [...prev, newBetName]);
            setIsBetNameModalOpen(false);
            setNewBet(prev => ({ ...prev, betName: newBetName }));
            setNewBetName('');
            setError(null);
        } else {
            setError('This bet name already exists');
        }
    };

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="manager-container">
                <LeagueManager />
            <h2 className="manager-title">Manager Bet Control</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-grid">
                {/* Team A Selection */}
                <div className="input-wrapper">
                    <select
                        className="form-select"
                        name="teamA"
                        value={newBet.teamA}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Team A</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                    </select>
                    <button
                        className="add-button"
                        onClick={() => {
                            setIsTeamModalOpen(true);
                            setLastAddedTeam('teamA');
                        }}
                    >
                        +
                    </button>
                </div>

                {/* Team B Selection */}
                <div className="input-wrapper">
                    <select
                        className="form-select"
                        name="teamB"
                        value={newBet.teamB}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Team B</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                    </select>
                    <button
                        className="add-button"
                        onClick={() => {
                            setIsTeamModalOpen(true);
                            setLastAddedTeam('teamB');
                        }}
                    >
                        +
                    </button>
                </div>

                {/* Bet Name Selection */}
                <div className="input-wrapper">
                    <select
                        className="form-select"
                        name="betName"
                        value={newBet.betName}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Bet Type</option>
                        {betNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <button
                        className="add-button"
                        onClick={() => setIsBetNameModalOpen(true)}
                    >
                        +
                    </button>
                </div>

                {/* Date and Time Inputs */}
                <input
                    className="form-input"
                    type="date"
                    name="date"
                    value={newBet.date}
                    onChange={handleInputChange}
                />
                <input
                    className="form-input"
                    type="time"
                    name="hour"
                    value={newBet.hour}
                    onChange={handleInputChange}
                />
            </div>

            <button className="submit-button" onClick={handleAddBet}>
                Add Bet
            </button>

            {/* Bets Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead className="table-header">
                    <tr>
                        <th>ID</th>
                        <th>Team A</th>
                        <th>Team B</th>
                        <th>Bet Type</th>
                        <th>How Wins</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bets.map(bet => (
                        <tr key={bet.id} className="table-row">
                            <td className="table-cell">{bet.id}</td>
                            <td className="table-cell">{bet.teamA}</td>
                            <td className="table-cell">{bet.teamB}</td>
                            <td className="table-cell">{bet.betName}</td>
                            <td className="table-cell">{bet.howWins}</td>
                            <td className="table-cell">{bet.dateTime}</td>
                            <td className="table-cell">
                                <button
                                    className="action-button win-button"
                                    onClick={() => handleManualWin(bet.id, 1)}
                                >
                                    Team A Win
                                </button>
                                <button
                                    className="action-button win-button"
                                    onClick={() => handleManualWin(bet.id, 2)}
                                >
                                    Team B Win
                                </button>
                                <button
                                    className="action-button remove-button"
                                    onClick={() => handleRemoveBet(bet.id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add Team Modal */}
            <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)}>
                <form onSubmit={handleAddTeam} className="modal-form">
                    <div>
                        <label htmlFor="teamName">Team Name</label>
                        <input
                            type="text"
                            id="teamName"
                            name="name"
                            value={newTeam.name}
                            onChange={handleNewTeamChange}
                            className="modal-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="teamImage">Team Image</label>
                        <input
                            type="file"
                            id="teamImage"
                            name="image"
                            onChange={handleNewTeamChange}
                            className="file-input"
                            accept="image/*"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Add Team
                    </button>
                </form>
            </Modal>

            {/* Add Bet Name Modal */}
            <Modal isOpen={isBetNameModalOpen} onClose={() => setIsBetNameModalOpen(false)}>
                <form onSubmit={handleAddBetName} className="modal-form">
                    <div>
                        <label htmlFor="betName">New Bet Type</label>
                        <input
                            type="text"
                            id="betName"
                            value={newBetName}
                            onChange={(e) => setNewBetName(e.target.value)}
                            className="modal-input"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Add Bet Type
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManagerBetControl;