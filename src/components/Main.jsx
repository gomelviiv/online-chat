import React from 'react';
import './Main.css'

import { Link } from 'react-router-dom';

import { logoutFetch } from '../smartComponents/fetchContainer.jsx'

import {getUser} from '../smartComponents/fetchContainer.jsx'
import { useEffect } from 'react';
import { useState } from 'react';


export default function Main(props){
        let [classNotif, setClassNotif] = useState('notif-no')
        let [propsState, setPropsState] = useState(props)

        useEffect(()=>{
            setPropsState(props)
            statusNotifications()
         
        },[props])

        useEffect(()=>{
            getUser().then(data=> 
                {
                    localStorage.setItem('userEmail', data.email)
                    
                })
        }, [])
        const logoutButton = () => {
            logoutFetch().then(data => localStorage.setItem('token', data.token))
        }
        const statusNotifications = () => {
            if(propsState.notification != undefined && props.notification.some((val)=>val ==localStorage.getItem('userEmail')) ){
                setClassNotif('notif-yes')
            } else {
                setClassNotif('notif-no')
            }
        }
    return (
        
        <div className="home-page">
            <div>
                <ul className="nav justify-content-center">
                  
                    <li className={`nav-item ${classNotif}`}>
                         <Link to="/allchats" class="nav-link" href="#">Chats</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/'className="nav-link" onClick={()=>logoutButton()}>Exit</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
    
}
