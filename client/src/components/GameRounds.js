import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import Round from './Round';

const GameRounds = () => {

  const { isLoading, roundData } = useContext(GlobalContext);

  return (
    <div id="gameRounds">        
      { !isLoading &&
        roundData.map(r => 
          <Round 
            key={r.roundNo}
            roundNo={r.roundNo} 
            guess={r.guess}
            outcome={r.outcome}
          />
        )          
      }
  </div>
  )
}

export default GameRounds