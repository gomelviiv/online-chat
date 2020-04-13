import React from 'react';
import './Search.css'

import { Link } from 'react-router-dom';


import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

export default class Search  extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            auth: false,
            chatName: '',
            chats: [],
        }
        this.changeInput = (name, value) =>{
            this.setState({[name]: value}, ()=>socket.emit('chat name', this.state.chatName));
        
        }
        this.seacrchButton = () => {
            socket.emit('chat name', this.state.chatName);
        }
    }
    componentDidMount(){
        let that = this;
        socket.on('chat name', function(data){
            that.setState({
                chats: data,
            })
        })
    }
    render(){
        return (
            <div>
                <form className="search" action="">
                    <input type="search" placeholder="Напишите название чата..." onChange={(e)=>{this.changeInput('chatName',e.target.value)}} required/>
                    <button type="submit" onClick={()=>this.seacrchButton()}>Search</button>                
                </form>
                <div className="result-searching">
                    {this.state.chats.map(value =>(
                        <div className="card all-chat-cards result-searching-s">
                            <div className="card-title">{value.name}</div>
                            <div><Link to={`/chat/${value._id}`} className="btn btn-primary">Перейти к чату</Link></div>
                        </div>   
                    ))}
                </div>
            </div>   
        );
    }
    
}
