import React, { useState, useContext, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import '../../../css/Register.css';

export const Login = () => {

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { adminLogin, adminAuthenticated } = useContext(GlobalContext);

    const history = useHistory();
    
    useEffect(() => {
        if (adminAuthenticated) {
            history.push("/admin");
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
        console.log(error);
        
        trackPromise(
            adminLogin({email, password})
            .then((success) => {            
                if (success) {
                    history.push("/admin")
                }
            })
        );
    }
    
    return (
        <form className="register-form" onSubmit={onSubmit}>
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
            <button className="btn largeBtn">Login</button>
        </form>
    )
}
