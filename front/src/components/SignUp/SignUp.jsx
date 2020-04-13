import React from 'react';
import './SignUp.css'
import  { Redirect } from 'react-router'

import { signUpFetch } from '../../smartComponents/fetchContainer.jsx'

export default class SignUp  extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            password: "",
            status: false,
        }
        this.changeInput = (name, value) =>{
            this.setState({[name]: value});
        }
        this.sendMessage = () => {
            const User = {email: this.state.email, password: this.state.password}
            signUpFetch(User).then(data => this.setState({status: data ? true : false}, ()=> this.state.status ? alert('Всё четко') : alert('Пользователь с таким Email уже зарегестрирован в сети')))
        }
    }
  
    render(){
        if (this.state.status) {
            return <Redirect to='/signin' />
        }
        return (
            <div className="sign-up">
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            onChange={(e)=>this.changeInput('email', e.target.value)} 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp"
                        />
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input 
                            class="form-control" 
                            onChange={(e)=>this.changeInput('password', e.target.value)} 
                            id="exampleInputPassword1"
                        />
                    </div>
                    <button type="submit" onClick={()=>this.sendMessage()} class="btn btn-primary">Registration</button>
                </form>
            </div>
        );
    }
}
