import { useState } from 'react';
import { isBrowser } from 'react-device-detect';
import BeatLoader from "react-spinners/BeatLoader";
import { FaGrin, FaSadTear, FaLightbulb } from "react-icons/fa"
import { GoDash } from "react-icons/go"

export const outcomeIcons = {
  '' : '',
  'correct' : <FaGrin />,
  'incorrect' : <FaSadTear />,
  'close' : <FaLightbulb />,
  'pass' : <GoDash />
}

const Round = ({ roundNo, guess, outcome, currentRound, isGuessing, isSubmitting, setIsGuessing, submitGuess }) => {

  const [inputGuessValue, setInputGuessValue] = useState('');

  function onFormSubmit(e) {
    e.preventDefault();
    submitGuess(inputGuessValue);
  }

  function pass(e) {
    e.preventDefault();
    submitGuess('', true);
  }

  const outcomeIcon = outcomeIcons[outcome];

  return (
    <>
      { (currentRound === roundNo || !isGuessing || isBrowser) &&
        <div className={`gameRound ${outcome} ${currentRound === roundNo ? 'current' : ''}`} data-round={roundNo}>
            <div className="roundNo">Round {roundNo}</div>
            <form className="roundContent" onSubmit={onFormSubmit}>
              { guess
                ? (
                    <>
                      { <span className="roundGuess">{ guess }</span> }
                      { currentRound === roundNo && <BeatLoader color="#fff" loading={isSubmitting} size={6} /> }
                      { outcomeIcon }
                    </>
                  )
                : (
                    currentRound === roundNo && (
                      isGuessing
                      ? (
                          <>
                            <input 
                              type="text" 
                              className="inputGuess" 
                              autoFocus 
                              onChange={(e) => setInputGuessValue(e.target.value)} 
                              onBlur={() => setIsGuessing(false)} 
                            /> 
                            <button className="btn btnSubmit" onMouseDown={(e) => e.preventDefault()}>Go</button>
                          </>
                        )
                      : ( 
                          <>
                            <button className="btn btnGuess" onClick={() => setIsGuessing(true)}>Guess</button>
                            <button className="btn btnPass" onClick={(e) => pass(e)}>Pass</button>
                          </>
                        )
                      )
                  )
              }     
            </form>
        </div>
      }
    </>
  )
}

export default Round