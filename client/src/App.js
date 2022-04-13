import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import toast from 'react-simple-toasts';

import Header from './components/Header'
import Picture from './components/Picture';
import Round from './components/Round';
import InfoDialog from './components/InfoDialog';
import StatsDialog from './components/StatsDialog';
import { RiCloseCircleFill } from "react-icons/ri"

Modal.setAppElement('#root');

export const outcomeUnicode = {
  '' : '⚪',
  'correct' : '🟢',
  'incorrect' : '🔴',
  'close' : '🟡',
  'pass' : '⚫'
}

const state =  {
  "boardState":["","","","","",""],
  "evaluations":[null,null,null,null,null,null],
  "rowIndex":0,
  "solution":"foray",
  "gameStatus":"IN_PROGRESS",
  "lastPlayedTs":1649274412046,
  "lastCompletedTs":1649274412046,
  "restoringFromLocalStorage":null,
  "hardMode":false
}

const statistics = {
  "currentStreak":1,
  "maxStreak":1,
  "guesses":{"1":1,"2":0,"3":0,"4":0,"5":0,"6":0,"fail":0},
  "winPercentage":100,
  "gamesPlayed":1,
  "gamesWon":1,
  "averageGuesses":1
}

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [pictureNumber, setPictureNumber] = useState();
  const [picture, setPicture] = useState();
  const [currentRound, setCurrentRound] = useState(() => {
    if ( localStorage.getItem('currentRound') ) {
      return +localStorage.getItem('currentRound');
    } else {
      return 1;
    }
  });
  const [isGuessing, setIsGuessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSolved, setIsSolved] = useState(() => {
    if ( localStorage.getItem('isSolved')) {
      return JSON.parse(localStorage.getItem('isSolved'));
    } else {
      return false;
    }
  });
  const [answer, setAnswer] = useState();
  const [roundData, setRoundData] = useState(() => {
    if ( localStorage.getItem('roundData') ) {
      return JSON.parse(localStorage.getItem('roundData'));
    } else {
      return [...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, guess: '', outcome: '' }))]
    }
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  async function getPicture(currentRound) {
    try {
      const res = await axios.get(`/api/v1/pictures/today/${currentRound}`);
      setPicture(res.data.data.image);
      setPictureNumber(res.data.data.pictureNumber);
      setIsLoading(false);  
      if (res.data.data.answer) {
        setAnswer(res.data.data.answer);
      }
      localStorage.setItem('expiry', res.data.data.expiry);

    } catch (error) {
        console.log(error)
    }
  }

  //when app loads
  useEffect(() => {

    // if the picture number stored in the browser is not the current picture number, clear data
    let expired = false;
    if ( localStorage.getItem('expiry') ) {
      const expiry = localStorage.getItem('expiry');
      const now = new Date().getTime();
      if ( now > expiry ) {
        localStorage.removeItem('currentRound');
        localStorage.removeItem('roundData');
        localStorage.removeItem('isSolved');
        setCurrentRound(1);
        setIsSolved(false);
        setRoundData([...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, guess: '', outcome: '' }))]);
        getPicture(1);
        expired = true;
      }
    }   
    if (!expired) {
      getPicture(currentRound);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //whenever roundData changes save in local storage
  useEffect(() => {
    localStorage.setItem('roundData', JSON.stringify(roundData));
  }, [roundData]);

  //whenever currentRound changes save in local storage
  useEffect(() => {
    localStorage.setItem('currentRound', currentRound);
  }, [currentRound]);

  //whenever isSolved changes save in local storage
  useEffect(() => {
    localStorage.setItem('isSolved', JSON.stringify(isSolved));
  }, [isSolved]);

  async function submitGuess( guess, pass=false ) {

      try {

        setIsGuessing(false);
        setIsSubmitting(true);

        setRoundData(
            roundData.map(r => 
                r.roundNo === currentRound 
                ? { ...r, guess: pass ? 'PASS' : guess } 
                : r 
        ));

        const res = await axios.post('/api/v1/pictures/today/guess', {
          guess,
          pass,
          currentRound
        });
        setIsSubmitting(false);
  
        setRoundData(
            roundData.map(r => 
                r.roundNo === currentRound 
                ? { ...r, guess: pass ? 'PASS' : guess, outcome : res.data.data.outcome } 
                : r 
        ));

        if (res.data.data.outcome === 'correct') {
          setIsSolved(true);
          setAnswer(res.data.data.answer);
          setCurrentRound(7);
        } else {        
          if (currentRound === 6)  {
            setAnswer(res.data.data.answer);
          }
          setCurrentRound(currentRound + 1);
        }
        setPicture(res.data.data.image);
        

      } catch (error) {
          console.log(error)
      }

  }

  function viewDialog(type) {
    setModalType(type);
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  async function shareScore() {
   
    const canonical = document.querySelector("link[rel=canonical]");
    let url = canonical ? canonical.href : document.location.href;
    const title = `Blurdle #${pictureNumber}`;
    const result = roundData.map(r => outcomeUnicode[r.outcome]);
    const text = `${title} \n\n ${result.join('')} \n\n`;
    const shareData = { url, title, text };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => toast('Copied results to clipboard'))
          .catch((error) => console.log('Error copying text to clipboard', error));
      }
    }

  }

  return (
    <div id="game" className={(isSolved && !isLoading) ? "solved" : ""}>
        <Header isLoading={isLoading} viewDialog={viewDialog} />
        <Picture picture={picture} isGuessing={isGuessing} answer={answer} roundData={roundData} shareScore={shareScore} />      
        <div id="gameRounds">        
          { !isLoading &&
            roundData.map(r => 
              <Round 
                key={r.roundNo}
                roundNo={r.roundNo} 
                guess={r.guess}
                outcome={r.outcome}
                currentRound={currentRound} 
                isGuessing={isGuessing} 
                isSubmitting={isSubmitting}
                isSolved={isSolved}
                setIsGuessing={setIsGuessing} 
                submitGuess={submitGuess} 
              />
            )          
          }
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          id="modal"
        >
          <RiCloseCircleFill className="modalClose" onClick={closeModal} />
          { modalType === 'info' && <InfoDialog /> }
          { modalType === 'stats' && <StatsDialog /> }
        </Modal>

    </div>
  );
}

export default App;
