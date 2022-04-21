import React from 'react';

export const EventQuestionDetail = ({ question, mousePos }) => {
    return (        
        <div id="questionTooltip" style={mousePos}>
            {question && question.map((element, i) => {
                switch(element.elementType) {
                    case 'P':
                        return <p key={"p_" + element._id} className={element.classes ? element.classes : ''}>{element.content}</p>;
                    case 'I':
                        return <React.Fragment key={element._id}>
                                    <img 
                                        src={element.src} 
                                        className={element.classes ? element.classes : ''} 
                                        alt="my pic" 
                                    />
                                    <br/>
                                </React.Fragment>
                    case 'T':
                        return <React.Fragment key={element._id}>
                                    <div className={`input ${element.classes ? element.classes : ''}`}></div>
                                    <br />
                                </React.Fragment>;
                    default:
                        return false;
                }
            })}
        </div> 
    )
}