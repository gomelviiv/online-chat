import React from 'react';
import './AllChats.css'

import { Link } from 'react-router-dom';

import Search from '../Search/Search.jsx'
import {getAllChatsFetch, createChatFetch, getInformationEachChatById} from '../../smartComponents/fetchContainer.jsx'

import Main from '../Main.jsx'
import ModalChat from './ModalChat/ModalChat.jsx'
import ModalPassword from './ModalPassword/ModalPassword.jsx'

import  { Redirect } from 'react-router'

import Modal from 'react-modal';

export default class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          name: "",
          password: '',
          showModal: false,
          arr: [],
          modalPassawordToChat: false,
          allUsersChats: [],
        }

        this.modal = (name, bul) => {this.setState({ [name]: bul })}

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

        this.createChatbutton = (value) =>{ //если вынести это в обычную функцию перестает работать
          if(value.name != ''){
            createChatFetch(value).then(data => {this.setState({allUsersChats: [...this.state.allUsersChats, data]})})    
          } else {
            alert('Ввездите данные для чата')
          }
        }
      }

    componentDidMount(){
      getAllChatsFetch().then(data => this.setState({allUsersChats: data}))
    }

    // createChatbutton (value){ ЧИТАЙ ВЫШЕ!!!!
    //   if(value.name != ''){
    //     console.log(this.state.allUsersChats)
    //     createChatFetch(value).then(data => {this.setState({allUsersChats: [...this.state.allUsersChats, data]})})
    //   } else {
    //     alert('Ввездите данные для чата')
    //   }
    // 
    // }
    render(){
      console.log(this.state.password)
      return (
        <div className="all-chats">
          <Main/>
          <button className="new-chat" onClick={()=>this.modal('showModal', true)}>Создать чат</button>
          <Modal 
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            overlayClassName='modal-window'
          >
            <ModalChat handleCloseModal={()=>this.modal('showModal', false)} createChatbutton={this.createChatbutton}/>
          </Modal>
          <Modal 
            isOpen={this.state.modalPassawordToChat}
            contentLabel="Minimal Modal Example"
            overlayClassName='modal-window'
          >
            <ModalPassword checkPassword={this.checkPassword} modalClose={this.modal}/>
          </Modal>
          <Search/>   
          <div>
            {this.state.allUsersChats.map(value => (
              <div className="card all-chat-cards">
                <div className="card-body">
                    <h5 className="card-title">{value.name}</h5>
                    {/* <Link to={`/chat/${value._id}`} className="btn btn-primary">Перейти к чату</Link> */}
                    <button onClick={()=> {this.goToChat(value._id, value.password)}} className="btn btn-primary">Перейти к чату</button>
                </div>
              </div>
              ))
            }
          </div>
      </div>
      );
    }
}