import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { formatDate, formatDuration, formatStatus } from "../../utils/eventUtils";
import { Leaderboard } from './Leaderboard';
import { EventQuestions } from './EventQuestions';
import { EventItems } from './EventItems';
import 'react-tabs/style/react-tabs.css';
import '../../css/Events.css';
import edit from '../../images/edit.png'; 
import refresh from '../../images/refresh.png'; 

export const EventDetail = () => {

    const { getEventDetail, getEventPlayers, adminEvent, adminGame, adminPlayers } = useContext(GlobalContext);
    const location = useLocation();
    const history = useHistory();

    let eventCode = location.pathname.split('/').pop();
    if (eventCode.length !== 4) {
        history.push("/admin");
    }
    eventCode = eventCode.toUpperCase();

    useEffect(() => {
        trackPromise(
            getEventDetail(eventCode)
                .then((success) => {            
                    if (!success) {
                        history.push("/admin/events")
                    }
                })
        );

    // eslint-disable-next-line
    }, []);

    function handleEditClick() {
        console.log('edit');
    }

    function handleRefreshClick() {
        console.log('refresh');
        trackPromise(
            getEventPlayers(eventCode)
        );
    }

    return (      
        adminEvent.name ? (
            <>
                <div id="eventDetail">
                    <h2 className={`event ${adminEvent.status}`}>
                        <div className="name">
                            {adminEvent.name}
                            <p className="eventLink">{window.location.origin}/join/{ adminEvent.code }</p>
                        </div>
                        <div className="game"><span>Game:</span>{adminGame.name}</div> 
                        <div className="date"><span>Date of Event:</span>{formatDate(adminEvent.date)}</div> 
                        <div className="duration"><span>Duration:</span>{formatDuration(adminEvent.duration)}</div>  
                        <div className="status"><span>Status:</span>{formatStatus(adminEvent.status)}</div>  
                        <img src={edit} className="edit" alt="Edit" title="Edit" onClick={handleEditClick} />
                    </h2>

                    <img src={refresh} id="refresh" alt="Refresh" title="Refresh" onClick={handleRefreshClick} />

                    <Tabs>
                        <TabList>
                            <Tab>Leaderboard</Tab>
                            <Tab>Questions</Tab>
                            <Tab>Items</Tab>
                            <Tab>Challenges</Tab>
                        </TabList>

                        <TabPanel>
                            <Leaderboard players={adminPlayers} /> 
                        </TabPanel>
                        <TabPanel>
                            <EventQuestions questions={adminGame.questions} players={adminPlayers} /> 
                        </TabPanel>
                        <TabPanel>
                            <EventItems 
                                items={adminGame.items} 
                                players={adminPlayers} 

                            /> 
                        </TabPanel>
                        <TabPanel>
                            <h2>challenges</h2>
                        </TabPanel>
                    </Tabs>
                </div>
            </>
        ) : (
            <p>Loading</p>
        )   

    )
}
