import React, { useState } from 'react'
import './sign.css'

import { signFetch } from '../../smartComponents/fetchContainer.jsx'
import  { Redirect } from 'react-router'

export default function Sign(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const [auth, setAuth] = useState(''); 
    const [check, setCheck] = useState(true);

    const sendMessage = () => {
        if(check){
            signFetch({email, password}, 'signIn').then(data => {
                if(data){
                    setAuth(data.auth)
                    localStorage.setItem('token', data.token)
                }else{
                    alert('Вы ввели некорректные данные, попробуйте еще раз')
                }
            })
        } else {
            if(password == againPassword){ 
                signFetch({email, password}, 'signUp').then(data => {
                    if(data){
                        alert('Всё четко')
                        setCheck(true)
                    } else {
                        alert('Пользователь с таким Email уже зарегестрирован в сети')
                    }
                })
            } else {
                alert('Пароли не совпадают')
            }
        }
    }

    if (auth) {
        return <Redirect to='/allchats'/>
    }
    alert(123)
    return (
        <div className="sign">
            <form>
                <div className="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        onChange={(e)=>setEmail(e.target.value)} 
                        id="exampleInputEmail1" 
                        aria-describedby="emailHelp"
                    />
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input 
                        className="form-control" 
                        onChange={(e)=>setPassword(e.target.value)} 
                        id="exampleInputPassword1"
                    />
                </div>
                {   !check ? <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input 
                            className="form-control" 
                            onChange={(e)=>setAgainPassword(e.target.value)} 
                            id="exampleInputPassword2"
                        />
                    </div> : ''} 
                <button type="submit" onClick={()=>sendMessage(setCheck(true))} className="btn btn-primary">Sign in</button>
                <button type="submit" onClick={()=>sendMessage(setCheck(false))} className="btn btn-primary">Sign up</button>
            </form>
        </div>
    )
}
