import React from 'react'
export const Game = ({ game }) => {

    function handleClick(e) {
        console.log(game._id);    
    }

    return (

        <li onClick={handleClick}> 
            <div className="name">{game.name}</div>               
        </li>       
    )
}
