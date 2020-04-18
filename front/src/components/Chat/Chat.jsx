import React, { useState, useEffect } from 'react';
import './Chat.css'

import { Link } from 'react-router-dom';

import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

import {getDataToEachChat, connectOrdisconectForChat} from '../../smartComponents/fetchContainer.jsx'

export default function Chat() {
    
        let [message,setMessage] = useState('')
        let [allMessages,setAllMessages] = useState([])
        let [statusUserInthisServer,setStatusUserInthisServer] = useState(false) //изменить на FALSE
        let [userWhoTypingMessage,setUserWhoTypingMessage] = useState([])
           
        const changeMessage = () =>{
            socket.emit('typing a message', {token: localStorage.getItem('token')})
      
        }
        useEffect(()=>{
            socket.on('typing a message', function(data){
                if(data.status == true){
                    if(userWhoTypingMessage.indexOf(data.email) == -1){
                        setUserWhoTypingMessage([...userWhoTypingMessage, data.email])
                    }
                } else {
                    for(let i in userWhoTypingMessage){
                        if(data.email==userWhoTypingMessage[i]){
                            if(userWhoTypingMessage.length === 1){
                                setUserWhoTypingMessage([])
                            } else {
                                userWhoTypingMessage.splice(userWhoTypingMessage.indexOf(data.email), 1);
                                setUserWhoTypingMessage(userWhoTypingMessage)
                            }
                        }
                    }
                }
            })
        },[userWhoTypingMessage])

        useEffect(()=>{
            socket.on('chat message', function(data){
                setAllMessages([...allMessages, data])
            })
        })
        useEffect(()=>{
            getDataToEachChat().then(data => {
                setStatusUserInthisServer(data.statusUserInthisServer)
                setAllMessages(data.chat[0].messages)
            })
        },[statusUserInthisServer])

   

        const createMessage = () => {
            const chatInformation = { id:window.location.href.split('/').pop() ,message, token: localStorage.getItem('token')}
            socket.emit('chat message', chatInformation );
        }
        const addToChat = (value) => {
            const chatInformation = { id:window.location.href.split('/').pop(), status: value }
            connectOrdisconectForChat(chatInformation).then(data=>setStatusUserInthisServer(data.statusUserInthisServer))
        }
    
        console.log('return ',userWhoTypingMessage)

      return (
        <div className="chat">
            <div className="">Название чата:</div>
            {statusUserInthisServer ?
                <button 
                    className="button-chat" 
                    onClick={()=>addToChat('false')
                }>Выйти из чата</button>
                    :
                <button 
                    className="button-chat" 
                    onClick={()=>addToChat('true')}
                >Войти в чат</button>
            }
            <Link to={`/allchats`}>
                <button className="button-chat" onClick={()=>addToChat('true')}>Другие чаты</button>
            </Link>
            {statusUserInthisServer ?
                <ul id="messages">
                    {allMessages.map(value => (
                        <li className="d-flex each-message">
                            <div>
                                {value.user}
                            </div>
                            <div>
                                {value.message}
                            </div>
                        </li>    
                    ))}
                </ul>
            : ""}
            {statusUserInthisServer ?
                <form action="">
                    <div className="who-typing">
                        {userWhoTypingMessage.length>0 ? 'Набирает сообщение: ' : ''}
                        {userWhoTypingMessage.length>0 ?userWhoTypingMessage.map(value => [
                            <label>{`${value},`}</label>
                        ]) : ''}
                    </div>
                    <input type="text" onChange={(e) =>{changeMessage(); setMessage(e.target.value)}}
                    />
                    <button onClick={() => createMessage()}>Send</button>
                </form>   : ""}
        </div>
        );
    
}
