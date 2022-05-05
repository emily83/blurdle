import React, { useState, useContext, useRef, useEffect } from 'react'
import { GlobalContext } from '../../../context/GlobalState';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { adminLogin, adminAuthenticated, error, setError } = useContext(GlobalContext);

    let navigate = useNavigate();
    
    useEffect(() => {
        if (adminAuthenticated) {
            navigate("/admin");
        }
    });
    
    const onSubmit = async e => {
        e.preventDefault();
        submitForm();  
    }

    const onKeyDown = async e => {
        if (e.which===13) {
            e.target.blur();
            submitForm();  
        }
    }
    
    function submitForm() {
        if (email === '') {
            setError('Please enter your email address');
            if (emailInputRef.current) {
                emailInputRef.current.focus();
            }           
            return false;
        }
        if (password === '') {
            setError('Please enter password');
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
            }  
            return false;
        }
    
        setError(null);     
        
        adminLogin({email, password});

    }
    
    return (
        <form className="loginForm" onSubmit={onSubmit}>
            <div className="error">{ error }</div>
            <div className="form-control">
                <label htmlFor="email">Enter your email address</label>
                <input 
                    type="text"
                    ref={emailInputRef}
                    autoFocus = {email === ''}
                    className="emailInput"
                    value={email}                 
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-control">
                <label htmlFor="password">Enter password</label>
                <input 
                    type="password" 
                    ref={passwordInputRef}
                    autoFocus = {email !== '' && password === ''}
                    className="passwordInput"
                    value={password} 
                    onKeyDown={onKeyDown}  
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="btn">Login</button>
        </form>
    )
}

export default Login