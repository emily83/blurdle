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
  const [picture, setPicture] = useState();
  const [round, setRound] = useState(1);
  const [isGuessing, setIsGuessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [answer, setAnswer] = useState();
  const [rounds, setRounds] = useState([...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, outcome: '' }))]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  async function getPicture(round) {
    try {
      const res = await axios.get(`/api/v1/pictures/today/${round}`);
      setPicture(res.data.data.blurryPicture);
      setPictureNumber(res.data.data.pictureNumber);
      setIsLoading(false);
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {

    getPicture(round);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitGuess( guess, pass=false ) {

      try {

        setIsGuessing(false);
        setIsSubmitting(true);

        const res = await axios.post('/api/v1/pictures/today/guess', {
          guess,
          pass,
          round
        });
        setIsSubmitting(false);
  
        setRounds(
            rounds.map(r => 
                r.roundNo === round 
                ? { ...r, outcome : res.data.data.outcome } 
                : r 
        ));

        if (res.data.data.outcome === 'correct') {
          setIsSolved(true);
          setAnswer(res.data.data.answer);
        } else {        
          if (round === 6)  {
            setAnswer(res.data.data.answer);
          }
          setRound(round + 1);
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
    const result = rounds.map(r => outcomeUnicode[r.outcome]);
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
    <div id="game" className={isSolved ? "solved" : ""}>
        <Header isLoading={isLoading} viewDialog={viewDialog} />
        <Picture picture={picture} isGuessing={isGuessing} answer={answer} rounds={rounds} shareScore={shareScore} />      
        <div id="gameRounds">        
          { !isLoading &&
            rounds.map(r => 
              <Round 
                key={r.roundNo}
                roundNo={r.roundNo} 
                outcome={r.outcome}
                currentRound={round} 
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
