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

const Round = ({ roundNo, outcome, currentRound, isGuessing, isSubmitting, setIsGuessing, submitGuess }) => {

  const [inputGuessValue, setInputGuessValue] = useState('');
  const [roundGuess, setRoundGuess] = useState();

  function onFormSubmit(e) {
    e.preventDefault();
    setRoundGuess(inputGuessValue)
    submitGuess(inputGuessValue);
  }

  function pass(e) {
    e.preventDefault();
    setRoundGuess('PASS')
    submitGuess('', true);
  }

  const outcomeIcon = outcomeIcons[outcome];

  return (
    <>
      { (currentRound === roundNo || !isGuessing || isBrowser) &&
        <div className={`gameRound ${outcome} ${currentRound === roundNo ? 'current' : ''}`} data-round={roundNo}>
            <div className="roundNo">Round {roundNo}</div>
            <form className="roundContent" onSubmit={onFormSubmit}>
              { roundGuess
                ? (
                    <>
                      { <span className="roundGuess">{ roundGuess }</span> }
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

              {/* { currentRound === roundNo && !isSolved && !isGuessing && !isSubmitting &&
                <>
                  <button className="btn btnGuess" onClick={() => setIsGuessing(true)}>Guess</button>
                  <button className="btn btnPass">Pass</button>
                </>
              }
              { currentRound === roundNo && !isSolved && isGuessing &&
                <>
                  <input 
                    type="text" 
                    className="inputGuess" 
                    autoFocus 
                    onChange={(e) => setInputGuessValue(e.target.value)} 
                    onBlur={() => setIsGuessing(false)} 
                  /> 
                  <button className="btn btnSubmit" onMouseDown={(e) => e.preventDefault()}>Submit</button>
                </>
              }
              { currentRound === roundNo && isSolved &&
                <>
                  {inputGuessValue} <FaCheck className='correct' />
                </> 
              }
              { currentRound === roundNo && isSubmitting &&
                <>
                  {inputGuessValue} <ClipLoader color="#fff" loading={isSubmitting} />
                </> 
              }
              { currentRound > roundNo &&
                <>
                  {inputGuessValue} - <FaTimes className='incorrect' />
                </> 
              } */}
            </form>
        </div>
      }
    </>
  )
}

export default Round