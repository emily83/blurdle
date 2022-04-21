import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { trackPromise } from 'react-promise-tracker';
import '../../css/Games.css';
import { Game } from './Game';

export const Games = () => {
    
    const { getGames, adminGames } = useContext(GlobalContext);

    useEffect(() => {
        trackPromise(
            getGames()
        );
    // eslint-disable-next-line
    }, []);

   return (
        <div id="games">
            <h2>Games</h2>

            <ul className="games">
                {adminGames.map((game, i) => (<Game key={game._id} game={game} />))}
            </ul>

        </div>
    )
}
