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

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [pictureNumber, setPictureNumber] = useState();
  const [pictureDate, setPictureDate] = useState(() => {
    if ( localStorage.getItem('pictureDate') ) {
      return localStorage.getItem('pictureDate');
    } else {
      return new Date().toISOString().split('T')[0];
    }
  });
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
      return JSON.parse(localStorage.getItem('roundData')).map(r => 
        (r.guess !== '' && r.outcome === '')
        ? { ...r, guess: '' } 
        : r 
      );

    } else {
      return [...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, guess: '', outcome: '' }))]
    }
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [statistics, setStatistics] = useState(() => {
    if ( localStorage.getItem('statistics') ) {
      return JSON.parse(localStorage.getItem('statistics'));
    } else {
      return {
        "gamesPlayed" : 0,
        "gamesWon" : 0,
        "winPercentage" : 0,
        "currentStreak" : 0,
        "maxStreak" : 0,
        "guesses" : {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"fail":0}
      }
    }
  });

  async function getPicture(date, round) {
    try {

      const res = await axios.get(`/api/v1/pictures/${date}/${round}`);

      setPicture(res.data.data.image);
      setPictureNumber(res.data.data.pictureNumber);
      if (res.data.data.answer) {
        setAnswer(res.data.data.answer);
      }
      setIsLoading(false);  

    } catch (error) {
      toast('Unable to get picture. Please make sure you have an internet connection')
    }
  }

  //when app loads
  useEffect(() => {

    // if the picture date stored in the browser is not the current date, clear data
    const today = new Date().toISOString().split('T')[0];
    if ( today !== pictureDate || localStorage.getItem('expiry') ) {
      localStorage.removeItem('currentRound');
      localStorage.removeItem('roundData');
      localStorage.removeItem('isSolved');
      localStorage.removeItem('pictureDate');
      localStorage.removeItem('expiry');
      setCurrentRound(1);
      setIsSolved(false);
      setRoundData([...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, guess: '', outcome: '' }))]);
      setPictureDate(today);

      getPicture(today, 1);

    } else {
      getPicture(pictureDate, currentRound);
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

  //whenever statistics changes save in local storage
  useEffect(() => {
    localStorage.setItem('statistics', JSON.stringify(statistics));
  }, [statistics]);
  
  //whenever picture date changes save in local storage
  useEffect(() => {
    localStorage.setItem('pictureDate', pictureDate);
  }, [pictureDate]);
  
  //whenever isSolved changes save in local storage
  useEffect(() => {
    localStorage.setItem('isSolved', isSolved);
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

        const res = await axios.post(`/api/v1/pictures/${pictureDate}/guess`, {
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
          setStatistics(
            { gamesPlayed : statistics.gamesPlayed + 1, 
              gamesWon: statistics.gamesWon + 1,
              winPercentage : ((statistics.gamesWon + 1) / (statistics.gamesPlayed + 1) * 100).toFixed(1),
              currentStreak: statistics.currentStreak + 1,
              maxStreak: statistics.currentStreak + 1 > statistics.maxStreak ? statistics.currentStreak + 1 : statistics.maxStreak,
              guesses: { ...statistics.guesses, [currentRound] : statistics.guesses[currentRound] + 1 }
            }
          );

          //toast('Woo!');

          setCurrentRound(7);

        } else {        
          if (currentRound === 6)  {
            setAnswer(res.data.data.answer);

            setStatistics(
              { ...statistics,
                gamesPlayed : statistics.gamesPlayed + 1, 
                winPercentage : (statistics.gamesWon / (statistics.gamesPlayed + 1) * 100).toFixed(1),
                currentStreak: 0,
                guesses: { ...statistics.guesses, fail : statistics.guesses['fail'] + 1 }
              }
            );
          }
          setCurrentRound(currentRound + 1);

          if (res.data.data.outcome === 'close') {
            //toast('Close!');
          }
        }
        setPicture(res.data.data.image);
        

      } catch (error) {
        setRoundData(
            roundData.map(r => 
                r.roundNo === currentRound 
                ? { ...r, guess: '' } 
                : r 
        ));
        toast('Unable to submit guess. Please make sure you have an internet connection')
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
          { modalType === 'stats' && <StatsDialog statistics={statistics} /> }
        </Modal>

    </div>
  );
}

export default App;
