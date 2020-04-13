import React from 'react';
import './Main.css'

import { Link } from 'react-router-dom';

import { logoutFetch } from '../smartComponents/fetchContainer.jsx'


export default class Main  extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message: "",
            name: "",
            age: "",
            allMessages: [],
        }

        this.logoutButton = () => {
            logoutFetch().then(data => localStorage.setItem('token', data.token))
        }
    }
  
    render(){       
        return (
            <div className="home-page">
                <div>
                    <ul class="nav justify-content-center">
                        <li class="nav-item">
                            <Link to="/allchats" class="nav-link active" href="#">Чаты</Link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Уведомления</a>
                        </li>
                        <li class="nav-item">
                            <Link to='/signin'class="nav-link" onClick={()=>this.logoutButton()}>Выход</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
