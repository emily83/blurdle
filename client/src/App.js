import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Header from './components/Header'
import Picture from './components/Picture';
import Round from './components/Round';
import InfoDialog from './components/InfoDialog';
import StatsDialog from './components/StatsDialog';
import { RiCloseCircleFill } from "react-icons/ri"

Modal.setAppElement('#root');

function App() {

  const [isLoading, setIsLoading] = useState(true);
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
      setPicture(res.data.data);
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
    const title = "Blurdle 1";

    const text = `${title} \n 🟡🔴`;
    const shareDetails = { url, title, text };

    if (navigator.share) {
      try {
          await navigator
          .share(shareDetails)
          .then(() =>
              console.log("Hooray! Your content was shared to tha world")
          );
      } catch (error) {
          console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      // fallback code
      alert(
          "Web share is currently not supported on this browser. Please provide a callback"
      );
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
