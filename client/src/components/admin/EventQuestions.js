import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { EventQuestionDetail } from './EventQuestionDetail';

export const EventQuestions = ({ questions, players }) => {

    const { markQuestion } = useContext(GlobalContext);

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [mousePos, setMousePos] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);

    function handleHeaderClick(e, q) {
        let th;
        if (e.target.classList.contains('answer')) {
            th = e.target.parentElement
        } else {
            th = e.target;
        }

        if (showTooltip === false || currentQuestion !== q.question) {
            setCurrentQuestion(q.question);             
            let left;
            if (th.offsetLeft + 500 < document.getElementById('eventDetail').offsetWidth) {
                left = th.offsetLeft;
            } else {
                left = th.offsetLeft + th.offsetWidth - 522;              
            }
            setMousePos({ left, top: th.offsetTop + th.offsetHeight + 1 });
            setShowTooltip(true);
            
        } else {
            setShowTooltip(false);
        }      
    }

    function handleChange(evt) {
        const playerId = evt.target.getAttribute('data-player-id');
        const questionId = evt.target.getAttribute('data-question-id');
        const points = evt.target.value !== '' ? parseFloat(evt.target.value) : '';
        markQuestion(playerId, questionId, points);
    }

    return (
        <>   
            <table id="eventQuestions">
                <thead>
                    <tr>
                        <th className="name">Player Name</th>
                        { questions.map(q => {
                            const textElement = q.question.find(e => e.elementType==='T');
                            let colClass;
                            if (textElement.maxLength === 1) {
                                colClass = 'short';
                            } else if (textElement.maxLength <=5) {
                                colClass = 'medium';
                            } else {
                                colClass = 'long';
                            }
                            return (
                                <th key={q._id} className={`question ${colClass} ${showTooltip && currentQuestion===q.question ? 'tooltipOpen' : ''}`} onClick={e => handleHeaderClick(e, q)}>
                                    Q{q.number}
                                    <div className="answer">{q.answer}</div>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ?
                        players.map(player => (
                            <tr key={player._id} className={player.active ? '' : 'inactive'}>
                                <td className="name">{player.name}</td>
                                { questions.map(q => {
                                    const playerQuestion = player.playerQuestions.find(pq => pq.questionId===q._id);
                                    let answer = '';
                                    let points = '';
                                    let markingRequired = false;
                                    if (playerQuestion) {
                                        answer = playerQuestion.answer;
                                        points = playerQuestion.marked ? playerQuestion.points : '';
                                        markingRequired = playerQuestion.marked ? false : true;
                                    }
                                    return (
                                        <td key={q._id} className={`question ${markingRequired ? 'markingRequired' : ''}`}>
                                            <div className="answer">{answer}</div>
                                            <input 
                                                type="number" 
                                                className="points"
                                                defaultValue={points} 
                                                onBlur={handleChange} 
                                                data-player-id={player._id}
                                                data-question-id={q._id}
                                                disabled={ !answer ? true : false }
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        )) : 
                        <tr><td colSpan={questions.length + 1}>No players found</td></tr>
                    }
                </tbody>
            </table>   
            { showTooltip &&
                <EventQuestionDetail question={currentQuestion} mousePos={mousePos} />
            }
            
        </> 
    )
}