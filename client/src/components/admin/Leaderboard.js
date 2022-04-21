import React, { useMemo, useState } from 'react';

export const Leaderboard = ({ players }) => {
  
    players.forEach(player => {
        player.questionsTotal = player.playerQuestions 
            .map(q => q.points ? q.points : 0)
            .reduce((prev, curr) => prev + curr, 0);
        player.itemsTotal = player.playerItems
            .map(i => i.points)
            .reduce((prev, curr) => prev + curr, 0);
        player.challengesTotal = player.playerChallenges
            .map(c => c.points)
            .reduce((prev, curr) => prev + curr, 0);
        player.total = player.questionsTotal + player.itemsTotal + player.challengesTotal;
    });

    const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'descending' });
  
    const sortedPlayers = useMemo(() => {
        let sortedPlayers = [...players];
        if (sortConfig !== null) {
            sortedPlayers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedPlayers;
    }, [players, sortConfig]);

    function requestSort(key) {
        let direction = 'descending';
        if (key === 'name') {
            direction = 'ascending';
        }
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                direction = 'descending';
            } else {
                direction = 'ascending';
            }
        } 
        setSortConfig({ key, direction });
    }

    return (      
        <table id="leaderboard">
            <thead>
                <tr>
                    <th onClick={() => requestSort('name')} className={`name ${sortConfig.key==='name' ? sortConfig.direction : ''}`}>Player Name</th>
                    <th onClick={() => requestSort('questionsTotal')} className={`total ${sortConfig.key==='questionsTotal' ? sortConfig.direction : ''}`}>Questions</th>
                    <th onClick={() => requestSort('itemsTotal')} className={`total ${sortConfig.key==='itemsTotal' ? sortConfig.direction : ''}`}>Items</th>
                    <th onClick={() => requestSort('challengesTotal')} className={`total ${sortConfig.key==='challengesTotal' ? sortConfig.direction : ''}`}>Challenges</th>
                    <th onClick={() => requestSort('total')} className={`total ${sortConfig.key==='total' ? sortConfig.direction : ''}`}>Totals</th>
                </tr>
            </thead>
            <tbody>
                {sortedPlayers.length > 0 ?
                    sortedPlayers.map(player => (
                        <tr key={player._id} className={player.active ? '' : 'inactive'}>
                            <td className="name">{player.name}</td>
                            <td className="total">{player.questionsTotal}</td>
                            <td className="total">{player.itemsTotal}</td>
                            <td className="total">{player.challengesTotal}</td>
                            <td className="total">{player.total}</td>
                        </tr>
                    )) : 
                    <tr><td colSpan="5">No players found</td></tr>
                }
            </tbody>
        </table>    
    )
}