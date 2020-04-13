import React from 'react';
import './App.css';

import {HashRouter, Route, } from 'react-router-dom';

import Main from './components/Main.jsx';
import SignIn from './components/SignIn/SignIn.jsx'
import SignUp from './components/SignUp/SignUp.jsx'
import AllChats from './components/AllChats/AllChats.jsx'
import Chat from './components/Chat/Chat.jsx'

export default class App extends React.Component {
  render(){
    return (
        <HashRouter>
            <Route path='/main' component={Main}/>
            <Route path='/signin' component={SignIn}/>
            <Route path='/signup' component={SignUp}/>
            <Route path='/allchats' component={AllChats}/>
            <Route path='/chat/:id' component={Chat}/>
        </HashRouter>
     );
  }
}

