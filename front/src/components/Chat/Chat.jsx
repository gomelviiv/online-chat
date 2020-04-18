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
        let [statusSmile, setStatusSmile] = useState(false)
        let [allImages, setAllImages] = useState([])
        let [smile, setSmile] = useState('')
           
        const changeMessage = (value) =>{
            socket.emit('typing a message', {token: localStorage.getItem('token'), message: value})
      
        }
        useEffect(()=>{
            socket.on('typing a message', function(data){
                if(data.status == true){
                    if(userWhoTypingMessage.indexOf(data.email) == -1){
                        setUserWhoTypingMessage([...userWhoTypingMessage, data.email])
                        setSmile(data.smile)
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
        
        useEffect(()=>{
            setAllImages(['http://localhost:3000/images/sad.png', 'http://localhost:3000/images/happy.png']) //ПЕРЕДЕЛАТЬ ОТПРАВКУ КАРТИНОК С СЕРВЕРА
        },[])

   

        const createMessage = () => {
            const chatInformation = { id:window.location.href.split('/').pop() ,message, token: localStorage.getItem('token')}
            socket.emit('chat message', chatInformation );
        }
        const addToChat = (value) => {
            const chatInformation = { id:window.location.href.split('/').pop(), status: value }
            connectOrdisconectForChat(chatInformation).then(data=>setStatusUserInthisServer(data.statusUserInthisServer))
        }
        const sendSmile = (value) => {
            const chatInformation = { id:window.location.href.split('/').pop() ,message: value, token: localStorage.getItem('token')}
            socket.emit('chat message', chatInformation );
        }
        
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
                                {value.message.indexOf('http://localhost:3000/images/') >=0 ? <img src={value.message}/> : value.message}
                            </div>
                        </li>    
                    ))}
                </ul>
            : ""}
            {statusUserInthisServer ?
                <form action="">
                    <label>
                    <div className="who-typing">
                        {smile ? <a onClick={()=>sendSmile(smile)}><img src={smile}/></a> : ''}
                        {userWhoTypingMessage.length>0 ? 'Набирает сообщение: ' : ''}
                        {userWhoTypingMessage.length>0 ? userWhoTypingMessage.map(value => [
                            <label>{`${value},`}</label>
                        ]) : ''}
                    </div>
                        <input type="text" className='change-message' onChange={(e) =>{changeMessage(e.target.value); setMessage(e.target.value)}}/>
                    </label>
                    <label className='smile'>
                    <div className="smiles">
                        {statusSmile ? allImages.map(value => [
                            <a onClick={()=>sendSmile(value)}><img src={value}/></a>
                        ]) : ''}
                    </div>
                        <button onClick={() => {setStatusSmile(!statusSmile)}}>Смайлики</button>
                    </label>
                    <label>
                        <button onClick={() => createMessage()}>Отправить</button>
                    </label>
                </form>   : ""}
        </div>
        );
    
}
