import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { trackPromise } from 'react-promise-tracker';
import '../../css/Events.css';
import { Event } from './Event';

export const Events = () => {
    
    const { getEvents, adminEvents } = useContext(GlobalContext);

    useEffect(() => {
        trackPromise(
            getEvents()
        );
    // eslint-disable-next-line
    }, []);

   return (
        <div id="events">
            <h2>Events</h2>

            <ul className="events">
                {adminEvents.map((event, i) => (<Event key={event._id} event={event} />))}
            </ul>

        </div>
    )
}
