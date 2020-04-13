import React from 'react';
import './AllChats.css'

import { Link } from 'react-router-dom';

import Search from '../Search/Search.jsx'
import {getAllChatsFetch, createChatFetch} from '../../smartComponents/fetchContainer.jsx'
import Main from '../Main.jsx'

import Modal from 'react-modal';

export default class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          name: "",
          showModal: false,
          allUsersChats: [],
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        
        this.changeNameChat = (name, value) =>{
          this.setState({[name]: value});
        }
        this.createChatbutton = () => {
            const chatInformation = { name: this.state.name }
            createChatFetch(chatInformation).then(data => this.setState({allUsersChats: [...this.state.allUsersChats, data]}))
        }
    }
    componentDidMount(){
      getAllChatsFetch().then(data => this.setState({allUsersChats: data}))
    }
    handleOpenModal () {
      this.setState({ showModal: true });
    }
    
    handleCloseModal () {
      this.setState({ showModal: false });
    }
    render(){
      return (
        <div className="all-chats">
          <Main/>
          <button className="new-chat" onClick={this.handleOpenModal}>Создать чат</button>
          <Modal 
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            overlayClassName='modal-window'
          >
            <form >
              <div className="form-group">
                <label for="exampleInputEmail1">Название чата</label>
                <input  
                  className="form-control" 
                  id="exampleInputEmail1" 
                  aria-describedby="emailHelp"
                  onChange={(e) => this.changeNameChat('name', e.target.value)}
                />
              </div>
              <button type="submit" onClick={()=>this.createChatbutton()} className="btn btn-primary but-create-chat">Создать</button>
              <button className="btn btn-primary m-3" onClick={this.handleCloseModal}>Close Modal</button>
            </form>
            </Modal>
          <Search/>   
          <div>
            {this.state.allUsersChats.map(value => (
              <div className="card all-chat-cards">
                <div className="card-body">
                    <h5 className="card-title">{value.name}</h5>
                    <Link to={`/chat/${value._id}`} className="btn btn-primary">Перейти к чату</Link>
                </div>
              </div>
              ))
            }
          </div>
      </div>
      );
    }
}
