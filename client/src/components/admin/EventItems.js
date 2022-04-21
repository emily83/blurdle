import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import photo from '../../images/photo.png'; 

export const EventItems = ({ items, players }) => {

    const { markItem, setLightboxIsOpen, setLightboxMedia } = useContext(GlobalContext);

    function handleChange(evt) {
        const playerId = evt.target.getAttribute('data-player-id');
        const itemId = evt.target.getAttribute('data-item-id');
        const points = evt.target.value !== '' ? parseFloat(evt.target.value) : '';
        markItem(playerId, itemId, points);
    }

    function handlePhotoClick(e) {
        
        let div = e.target;
        if (!div.classList.contains('media')) {
            div = div.parentElement;
        }
        const playerId = div.getAttribute('data-player-id');
        const itemId = div.getAttribute('data-item-id');
        const item = items.find(i => i._id === itemId);
        const player = players.find(p => p._id === playerId);
        const playerItem = player.playerItems.find(pi => pi.itemId === itemId);     
        playerItem.media.map(p => {
            p.caption = `${item.name} (${player.name})`;
            return p;
        })

        setLightboxMedia(playerItem.media);
        setLightboxIsOpen(true);      
    }

    return (
        <>   
            <table id="eventItems">
                <thead>
                    <tr>
                        <th className="name">Player Name</th>
                        { items.map(i => {
                            return (
                                <th key={i._id} className="item" title={i.name}>{i.short}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ?
                        players.map(player => (
                            <tr key={player._id} className={player.active ? '' : 'inactive'}>
                                <td className="name">{player.name}</td>
                                { items.map(i => {
                                    const playerItem = player.playerItems.find(pi => pi.itemId===i._id);
                                    let numMedia = '';
                                    let points = '';
                                    let markingRequired = false;
                                    if (playerItem) {
                                        numMedia = playerItem.media.length;
                                        points = playerItem.marked ? playerItem.points : '';
                                        markingRequired = playerItem.marked ? false : true;
                                    }
                                    return (
                                        <td key={i._id} className={`item ${markingRequired ? 'markingRequired' : ''}`}>
                                            { numMedia > 0 && (
                                                <div 
                                                    className="media" 
                                                    onClick={handlePhotoClick}
                                                    data-player-id={player._id}
                                                    data-item-id={i._id}
                                                >
                                                    <img src={photo} alt="Media" title="Media" />
                                                    <span>{numMedia}</span>
                                                </div>)
                                            }
                                           
                                            <input 
                                                type="number" 
                                                className="points"
                                                defaultValue={points} 
                                                onBlur={handleChange} 
                                                data-player-id={player._id}
                                                data-item-id={i._id}
                                                disabled={ numMedia===0 ? true : false }
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        )) : 
                        <tr><td colSpan={items.length + 1}>No players found</td></tr>
                    }
                </tbody>
            </table>   
        </> 
    )
}