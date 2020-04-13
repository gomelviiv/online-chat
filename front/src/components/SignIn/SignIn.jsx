import React from 'react';
import  { Redirect } from 'react-router'
import './SignIn.css'

import { Link } from 'react-router-dom';

import {signInFetch} from '../../smartComponents/fetchContainer.jsx'

export default class SignIn  extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            auth: false,
        }
        this.changeInput = (name, value) =>{
            this.setState({[name]: value});
        }
        this.sendMessage = () => {
            const User = {email: this.state.email, password: this.state.password}
            signInFetch(User).then( data => data ? this.setState({auth: data.auth}, () => localStorage.setItem('token', data.token)) : alert('Вы ввели некорректные данные, попробуйте еще раз'))
        }
       
    }
    render(){
        if (this.state.auth) {
            return <Redirect to='/main' />
        }
        return (
            <div className="sign-in">
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp"
                            onChange={(e)=>this.changeInput('email', e.target.value)}    
                        />
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="exampleInputPassword1"
                            onChange={(e)=>this.changeInput('password', e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        onClick={()=>this.sendMessage()} 
                        className="btn btn-primary"
                    >Sign in</button>
                    <Link to='/signup' type="submit" className="btn btn-primary">Sign up</Link>
                </form>
            </div>
        );
    }
}
