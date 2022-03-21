const Round = ({ roundNo, current, initiateGuess }) => {

  return (
    <div className="gameRound" data-round={roundNo}>
				<div className="roundNo">Round {roundNo}</div>
        { current &&
          <div className="buttons">
            <button className="btn btnGuess" onClick={initiateGuess}>Guess</button>
            <button className="btn btnPass">Pass</button>
          </div>
        }
        { !current &&
          <div className="guess"></div>
        }
	  </div>
  )
}

export default Round