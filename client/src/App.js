import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './components/Header'
import Picture from './components/Picture';
import Round from './components/Round';

function App() {

  const [picture, setPicture] = useState();
  const [isGuessing, setIsGuessing] = useState(false);

  useEffect(() => {

    async function getPicture() {
      try {
        const round = 5;
        const res = await axios.get(`/api/v1/pictures/today/${round}`);
        setPicture(res.data.data);
      } catch (error) {
          console.log(error)
      }
    }

    getPicture();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initiateGuess() {
    //$('#inputGuess').show().focus();
  }

  return (
    <>
      <div id="game">
        <Header />
        <Picture picture={picture} /> 

        <div id="gameRounds">
            <Round roundNo={1} current={true} initiateGuess={initiateGuess} />
            <Round roundNo={2} current={false} initiateGuess={initiateGuess} />
            <Round roundNo={3} current={false} initiateGuess={initiateGuess} />
            <Round roundNo={4} current={false} initiateGuess={initiateGuess} />
            <Round roundNo={5} current={false} initiateGuess={initiateGuess} />
        </div>      
      </div>
    	<input type="text" id="inputGuess" class={isGuessing ? "" : "hide"} />
    </>
  );
}

export default App;
