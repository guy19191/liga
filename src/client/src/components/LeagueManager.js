import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../store/request";
import './LeagueManager.css';
const LeagueManager = () => {
    const [leagues, setLeagues] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLeague, setNewLeague] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchLeagues();
    }, []);

    const fetchLeagues = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/leagues/v1/getAllLeagues');
            setLeagues(Object.keys(response.data).length === 0 ? [] : response.data);
        } catch (error) {
            console.error('Error fetching leagues:', error);
            setError('Failed to load leagues');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLeague = async (e) => {
        e.preventDefault();
        if (!newLeague.trim()) {
            setError('Please enter a league name');
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post('leagues/v1/insertLeague', { leagueName: newLeague });
            await fetchLeagues();
            setNewLeague('');
            setIsModalOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error adding league:', error);
            setError('Failed to add league');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveLeague = async (id) => {
        try {
            await axiosInstance.post('leagues/v1/removeLeague', { id });
            await fetchLeagues();
        } catch (error) {
            console.error('Error removing league:', error);
            setError('Failed to remove league');
        }
    };

    return (
        <div className="league-manager">
            <div className="league-header">
                <h3 className="section-title">Leagues</h3>
                <button
                    className="add-league-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add League
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="data-table">
                    <thead className="table-header">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leagues.map(league => (
                        <tr key={league.id} className="table-row">
                            <td className="table-cell">{league.id}</td>
                            <td className="table-cell">{league.name}</td>
                            <td className="table-cell">
                                <div className="action-buttons">
                                    <button
                                        className="action-button remove-button"
                                        onClick={() => handleRemoveLeague(league.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


            {/* Add League Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add New League</h3>
                            <button
                                className="modal-close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddLeague} className="modal-form">
                                <div>
                                    <label htmlFor="leagueName">League Name</label>
                                    <input
                                        type="text"
                                        id="leagueName"
                                        value={newLeague}
                                        onChange={(e) => setNewLeague(e.target.value)}
                                        className="modal-input"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Add League'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeagueManager;