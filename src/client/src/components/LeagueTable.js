import React, {useEffect, useState} from 'react';
import './league-table.css';
import BottomMenu from "./BottomMenu";
import {axiosInstance} from "../store/request";

const LeagueTable = () => {
    const [sortedPlayers, setSortedPlayers] = useState([]);
    const [leagueName, setLeagueName] = useState("");

    useEffect(() => {
        fetchLeague();
    }, []);

    async function fetchLeague(){
        const league = await axiosInstance.get('leagues/v1/getUserLeague')
        setLeagueName(league.data.name);
        setSortedPlayers([...league.data.players].sort((a, b) => b.points - a.points))
    }

    return (
        <div className="league-table-container">
            <div className="league-header">
                <h2 className="league-title">{leagueName}</h2>
            </div>

            <div className="table-container">
                <table className="rankings-table">
                    <thead>
                    <tr>
                        <th>מיקום</th>
                        <th>כינוי</th>
                        <th>נקודות</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedPlayers.map((player, index) => (
                        <tr key={player.nickname}>
                            <td className="position-cell">#{index + 1}</td>
                            <td className="nickname-cell">{player.nickname}</td>
                            <td className="points-cell">{player.points}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <BottomMenu/>
        </div>
    );
};

export default LeagueTable;