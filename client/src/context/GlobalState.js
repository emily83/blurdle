import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';
import Cookies from 'js-cookie';
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// Initial state
const initialState = {  

    isLoading: true

}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

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

    return (
        <GlobalContext.Provider value={{    
            isLoading: state.isLoading,
            setIsLoading
        }}>
            {children}
        </GlobalContext.Provider>
    );
}