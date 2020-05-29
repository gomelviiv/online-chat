import React from 'react';
import './Search.css'

import { Link } from 'react-router-dom';

import {getInformationEachChatById} from '../../smartComponents/fetchContainer.jsx'

import Modal from 'react-modal';
import ModalPassword from '../AllChats/ModalPassword/ModalPassword.jsx'

import io from "socket.io-client";
const socket = io.connect("https://back-online-chat.herokuapp.com");

export default class Search  extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            auth: false,
            chatName: '',
            modalPassawordToChat: false,
            chats: [],
        }
        this.modal = (name, bul) => {this.setState({ [name]: bul })}

        this.changeInput = (name, value) =>{
            this.setState({[name]: value}, ()=>socket.emit('chat name', this.state.chatName));
        
        }
        this.seacrchButton = () => {
            socket.emit('chat name', this.state.chatName);
        }
        this.goToChat = (_id, password) =>{
            if(password == '' || password == undefined){
              // return <Redirect to={`/chat/${_id}`}/>    ДОДЕЛАТЬ REDIRECT!!!!!!!!!!!!!!!!!!!
              window.location.href = `/?#/chat/${_id}`
            } else {
              console.log(_id)
              getInformationEachChatById(_id).then(data=>this.setState({password: data[0].password}))
              
              this.modal('modalPassawordToChat', true);
            }
            this.checkPassword = (password) => {
              if(password == this.state.password){
                window.location.href = `/?#/chat/${_id}`
              } else {
                alert('Пароль не верный')
              }
            }
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
                <Modal 
                    isOpen={this.state.modalPassawordToChat}
                    contentLabel="Minimal Modal Example"
                    overlayClassName='modal-window'
                >
                    <ModalPassword checkPassword={this.checkPassword} modalClose={this.modal}/>
                </Modal>
                <div className="result-searching">
                    {this.state.chats.map(value =>(
                        <div className="card all-chat-cards result-searching-s">
                            <div className="card-title">{value.name}</div>
                            {/* <div><Link to={`/chat/${value._id}`} className="btn btn-primary">Перейти к чату</Link></div> */}
                            <button onClick={()=> {this.goToChat(value._id, value.password)}} className="btn btn-primary">Перейти к чату</button>

                        </div>   
                    ))}
                </div>
            </div>   
        );
    }
    
}
