import React from 'react'
import { useHistory } from 'react-router-dom';
import { formatDate, formatDuration, formatStatus } from "../../utils/eventUtils";

export const Event = ({ event }) => {

    const history = useHistory();

    function handleClick(e) {
        history.push(`/admin/events/${event.code}`);
    }

    return (

        <li className={`event ${event.status}`} onClick={handleClick}> 
            <div className="name">{event.name}</div>
            <div className="game"><span>Game:</span>{event.game.name}</div> 
            <div className="date"><span>Date of Event:</span>{formatDate(event.date)}</div> 
            <div className="duration"><span>Duration:</span>{formatDuration(event.duration)}</div>  
            <div className="status"><span>Status:</span>{formatStatus(event.status)}</div>                 
        </li>       
    )
}
