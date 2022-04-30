//export default (state, action) => {
    export default function variable(state, action) {
    switch(action.type) {

        case 'SET_IS_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }

        case 'SET_IS_GUESSING':
            return {
                ...state,
                isGuessing: action.payload
            }

        case 'SET_IS_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.payload
            }

        case 'SET_PICTURE_NUMBER':
            return {
                ...state,
                pictureNumber: action.payload
            }

        case 'SET_PICTURE_DATE':
            return {
                ...state,
                pictureDate: action.payload
            }

        case 'SET_PICTURE':
            return {
                ...state,
                picture: action.payload
            }

        case 'SET_CURRENT_ROUND':
            return {
                ...state,
                currentRound: action.payload
            }

        case 'SET_IS_SOLVED':
            return {
                ...state,
                isSolved: action.payload
            }

        case 'SET_ANSWER':
            return {
                ...state,
                answer: action.payload
            }

        case 'CLEAR_ROUND_DATA':
            return {
                ...state,
                roundData: [...Array(6).fill(0).map((x, i) => ({ roundNo: i + 1, guess: '', outcome: '' }))]
            }

        case 'SET_CURRENT_ROUND_DATA':
            return {
                ...state,
                roundData: state.roundData.map(r => 
                        r.roundNo === state.currentRound
                        ? { ...r, 
                            guess: action.payload.guess, 
                            outcome: action.payload.outcome != null ? action.payload.outcome : r.outcome 
                        } 
                        : r 
                    )
            
            }

        case 'SET_MODAL_IS_OPEN':
            return {
                ...state,
                modalIsOpen: action.payload
            }

        case 'SET_MODAL_TYPE':
            return {
                ...state,
                modalType: action.payload
            }

        case 'SET_STATISTICS':
            let newStatistics;
            if ( action.payload ) {
                console.log('correct');
                newStatistics = { 
                    gamesPlayed : state.statistics.gamesPlayed + 1, 
                    gamesWon: state.statistics.gamesWon + 1,
                    winPercentage : ((state.statistics.gamesWon + 1) / (state.statistics.gamesPlayed + 1) * 100).toFixed(1),
                    currentStreak: state.statistics.currentStreak + 1,
                    maxStreak: state.statistics.currentStreak + 1 > state.statistics.maxStreak ? state.statistics.currentStreak + 1 : state.statistics.maxStreak,
                    guesses: { ...state.statistics.guesses, [state.currentRound] : state.statistics.guesses[state.currentRound] + 1 }
                }
            } else {
                console.log('incorrect');
                newStatistics = { 
                    ...state.statistics,
                    gamesPlayed : state.statistics.gamesPlayed + 1, 
                    winPercentage : (state.statistics.gamesWon / (state.statistics.gamesPlayed + 1) * 100).toFixed(1),
                    currentStreak: 0,
                    guesses: { ...state.statistics.guesses, fail : state.statistics.guesses['fail'] + 1 }
                }
            }
            console.log(newStatistics);
            return {
                ...state,
                statistics: newStatistics          
            }

        default:
            return state;
    }
}