import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';
import toast from 'react-simple-toasts';
//import Cookies from 'js-cookie';
//import setAuthToken from "../utils/setAuthToken";
//import jwt_decode from "jwt-decode";
import { getFormattedToday } from "../utils/dateUtil"
import { outcomeUnicode } from "../utils/outcomeUtil"

// Initial state
const initialState = {  
    isLoading: true,
    isGuessing: false,
    isSubmitting: false,
    pictureNumber: null,
    pictureDate: localStorage.getItem('pictureDate') || getFormattedToday(),
    picture: null,
    currentRound: +localStorage.getItem('currentRound') || 1,
    isSolved: JSON.parse(localStorage.getItem('isSolved')) || false,
    answer: null,
    roundData: JSON.parse(localStorage.getItem('roundData')) ?
                JSON.parse(localStorage.getItem('roundData')).map(r => 
                    (r.guess !== '' && r.outcome === '')
                    ? { ...r, guess: '' } 
                    : r 
                ) : 
                [...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, guess: '', outcome: '' }))],
    modalIsOpen: false,
    modalType: '',
    statistics: JSON.parse(localStorage.getItem('statistics')) || {
        "gamesPlayed" : 0,
        "gamesWon" : 0,
        "winPercentage" : 0,
        "currentStreak" : 0,
        "maxStreak" : 0,
        "guesses" : {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"fail":0}
      }

}

// const config = {
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }

// Create context
export const GlobalContext = createContext();

// Provider component
export const GlobalProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AppReducer, initialState);

    function setIsLoading(isLoading) {
        dispatch({
            type: 'SET_IS_LOADING',
            payload: isLoading
        });
    }

    function setIsGuessing(isGuessing) {
        dispatch({
            type: 'SET_IS_GUESSING',
            payload: isGuessing
        });
    }

    function setIsSubmitting(isSubmitting) {
        dispatch({
            type: 'SET_IS_SUBMITTING',
            payload: isSubmitting
        });
    }

    function setPictureNumber(pictureNumber) {
        dispatch({
            type: 'SET_PICTURE_NUMBER',
            payload: pictureNumber
        });
    }

    function setPictureDate(pictureDate) {
        dispatch({
            type: 'SET_PICTURE_DATE',
            payload: pictureDate
        });
    }

    function setPicture(picture) {
        dispatch({
            type: 'SET_PICTURE',
            payload: picture
        });
    }

    function setCurrentRound(currentRound) {
        dispatch({
            type: 'SET_CURRENT_ROUND',
            payload: currentRound
        });
    }

    function setIsSolved(isSolved) {
        dispatch({
            type: 'SET_IS_SOLVED',
            payload: isSolved
        });
    }

    function setAnswer(answer) {
        dispatch({
            type: 'SET_ANSWER',
            payload: answer
        });
    }

    function clearRoundData() {
        dispatch({
            type: 'CLEAR_ROUND_DATA',
            payload: null
        });
    }

    function setCurrentRoundData(guess, outcome = null) {
        dispatch({
            type: 'SET_CURRENT_ROUND_DATA',
            payload: {
                guess, outcome
            }
        });
    }

    function setModalIsOpen(modalIsOpen) {
        dispatch({
            type: 'SET_MODAL_IS_OPEN',
            payload: modalIsOpen
        });
    }

    function setModalType(modalType) {
        dispatch({
            type: 'SET_MODAL_TYPE',
            payload: modalType
        });
    }

    function setStatistics(correct) {
        dispatch({
            type: 'SET_STATISTICS',
            payload: correct
        });
    }

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

    function clearTodayData(today) {
        localStorage.removeItem('currentRound');
        localStorage.removeItem('roundData');
        localStorage.removeItem('isSolved');
        localStorage.removeItem('pictureDate');
        localStorage.removeItem('expiry');
        setCurrentRound(1);
        setIsSolved(false);
        clearRoundData();
        setPictureDate(today);
    }

    async function submitGuess( guess, pass=false ) {

        try {
  
          setIsGuessing(false);
          setIsSubmitting(true);
  
          setCurrentRoundData(pass ? 'PASS' : guess);
  
          const res = await axios.post(`/api/v1/pictures/${state.pictureDate}/guess`, {
            guess,
            pass,
            currentRound: state.currentRound
          });
          setIsSubmitting(false);
    
          setCurrentRoundData(pass ? 'PASS' : guess, res.data.data.outcome);
  
          if (res.data.data.outcome === 'correct') {
            setIsSolved(true);
            setAnswer(res.data.data.answer);
            setStatistics(true);
  
            //toast('Woo!');
  
            setCurrentRound(7);
  
          } else {        
            if (state.currentRound === 6)  {
              setAnswer(res.data.data.answer);
              setStatistics(false);
            }
            setCurrentRound(state.currentRound + 1);
  
            if (res.data.data.outcome === 'close') {
              //toast('Close!');
            }
          }
          setPicture(res.data.data.image);
          
  
        } catch (error) {
            setCurrentRoundData('');
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
        const title = `Blurdle #${state.pictureNumber}`;
        const result = state.roundData.map(r => outcomeUnicode[r.outcome]);
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
        <GlobalContext.Provider value={{    
            isLoading: state.isLoading,
            isGuessing: state.isGuessing,
            isSubmitting: state.isSubmitting,
            pictureNumber: state.pictureNumber,
            pictureDate: state.pictureDate,
            picture: state.picture,
            currentRound: state.currentRound,
            isSolved: state.isSolved,
            answer: state.answer,
            roundData: state.roundData,
            modalIsOpen: state.modalIsOpen,
            modalType: state.modalType,
            statistics: state.statistics,
            setIsLoading,
            setIsGuessing,
            setIsSubmitting,
            setPictureNumber,
            setPictureDate,
            setPicture,
            setCurrentRound,
            setIsSolved,
            setAnswer,
            setCurrentRoundData,
            clearRoundData,
            setModalIsOpen,
            setModalType,
            setStatistics,
            getPicture,
            clearTodayData,
            submitGuess,
            viewDialog,
            closeModal,
            shareScore
        }}>
            {children}
        </GlobalContext.Provider>
    );
}