import { useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import Modal from 'react-modal';
import Header from './Header'
import Picture from './Picture';
import GameRounds from './GameRounds';
import InfoDialog from './InfoDialog';
import StatsDialog from './StatsDialog';
import { getFormattedToday } from "../utils/dateUtil"
import { RiCloseCircleFill } from "react-icons/ri"

Modal.setAppElement('#root');

const Game = () => {

  const { 
      isLoading,
      pictureDate,
      currentRound,
      isSolved,
      roundData,
      modalIsOpen,
      modalType,
      statistics,
      getPicture,
      clearTodayData,
      closeModal
   } = useContext(GlobalContext);

  //when game component loads
  useEffect(() => {

    // if the picture date stored in the browser is not the current date, clear data
    const today = getFormattedToday();
    if ( today !== pictureDate || localStorage.getItem('expiry') ) {
      clearTodayData(today);
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
  
  return (
    <div id="game" className={(isSolved && !isLoading) ? "solved" : ""}>
        <Header />
        <Picture />      
        <GameRounds />
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
  )
}

export default Game