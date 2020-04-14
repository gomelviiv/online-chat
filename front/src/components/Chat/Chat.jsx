import React from 'react';
import './Chat.css'

import { Link } from 'react-router-dom';

import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

import {getDataToEachChat, connectOrdisconectForChat} from '../../smartComponents/fetchContainer.jsx'

export default class AllChats extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            showModal: false,
            allUsersChats: [],
            message: '',
            allMessages: [],
            allUsers: [],
            statusUserInthisServer: false,
            userWhoTypingMessage: [],
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        
        this.changeMessage = (name, value) =>{
            this.setState({[name]: value}, ()=>{
                socket.emit('typing a message', {token: localStorage.getItem('token')})
            });
        }
        this.createMessage = () => {
            const chatInformation = { id:window.location.href.split('/').pop() ,message: this.state.message , token: localStorage.getItem('token')}
            socket.emit('chat message', chatInformation );
        }
        this.addToChat = (value) => {
            const chatInformation = { id:window.location.href.split('/').pop(), status: value }
            connectOrdisconectForChat(chatInformation).then(data=>this.setState({statusUserInthisServer: data.statusUserInthisServer}))
        }
    }
    componentDidMount(){
        let that = this
        socket.on('typing a message', function(data){
            if(data.status == true){
                console.log(typeof(that.state.userWhoTypingMessage))
                if(that.state.userWhoTypingMessage.indexOf(data.email) == -1){
                    that.setState({
                        userWhoTypingMessage: [...that.state.userWhoTypingMessage, data.email]
                    }, ()=>{
                        console.log(that.state.userWhoTypingMessage)
                    })
                }
                
            } else {
                if(that.state.userWhoTypingMessage.length==1){
                    if(data.email==that.state.userWhoTypingMessage[0]){
                        const newArray = that.state.userWhoTypingMessage.splice(that.state.userWhoTypingMessage.indexOf(data.email), 1);
                        console.log('newARray',newArray)
                        that.setState({
                            userWhoTypingMessage:[]
                        })
                    }
                } 
                const newArray = that.state.userWhoTypingMessage.splice(that.state.userWhoTypingMessage.indexOf(data.email), 1);
            }
        })
        socket.on('chat message', function(data){
            that.setState({
                allMessages: [...that.state.allMessages, data],
            })
        })
        getDataToEachChat().then(data => {
            this.setState({
                allMessages: data.chat[0].messages,
                statusUserInthisServer: data.statusUserInthisServer,
            })
        })
    }
    handleOpenModal () {
      this.setState({ showModal: true });
    }
    
    handleCloseModal () {
      this.setState({ showModal: false });
    }
    render(){
      return (
        <div className="chat">
            <div className="">Название чата:</div>
            {this.state.statusUserInthisServer ?
                <button 
                    className="button-chat" 
                    onClick={()=>this.addToChat('false')
                }>Выйти из чата</button>
                    :
                <button 
                    className="button-chat" 
                    onClick={()=>this.addToChat('true')}
                >Войти в чат</button>
            }
            <Link to={`/allchats`}>
                <button className="button-chat" onClick={()=>this.addToChat('true')}>Другие чаты</button>
            </Link>
            {this.state.statusUserInthisServer ?
                <ul id="messages">
                    {this.state.allMessages.map(value => (
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
            {this.state.statusUserInthisServer ?
            
            <form action="">
                <div className="who-typing">
                    {this.state.userWhoTypingMessage.length>0 ? 'Набирает сообщение: ' : ''}
                    {this.state.userWhoTypingMessage.length>0 ?this.state.userWhoTypingMessage.map(value => [
                        <label>{`${value},`}</label>
                    ]) : ''}
                </div>
                <input 
                    type="text"
                    onChange={(e) => this.changeMessage('message', e.target.value)}
                />
                <button
                    onClick={() => this.createMessage()}
                >Send</button>
            </form>   : ""}
        </div>
        );
    }
}


 // const chatInformation = { id:window.location.href.split('/').pop() ,message: this.state.message}
            // fetch('http://localhost:3000/api/chating',
            // {
            //     method: "POST",
            //     body: JSON.stringify(chatInformation),
            //     headers: {
            //         "Content-Type": "application/json",
            //         "x-access-token": localStorage.getItem('token')
            //       },
            // })
            // .then(function(response) {
            //     if (!response.ok) {
            //         return Promise.reject(new Error(
            //             'Response failed: ' + response.status + ' (' + response.statusText + ')'
            //         ));
            //     }
            //     return response.json();
            // }).then(function(data) {
            //     console.log('data', data)

            // }).catch(function(error) {
            //     console.log(error)
            // });
            // var socket = io();