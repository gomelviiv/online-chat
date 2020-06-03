import React from 'react';
import './App.css';

import {HashRouter, Route, } from 'react-router-dom';

import Main from './components/Main.jsx';
import AllChats from './components/AllChats/AllChats.jsx'
import Chat from './components/Chat/Chat.jsx'
import sign from './components/sign/sign.jsx'

export default class App extends React.Component {
  render(){
    
    return (
      <div>
          <HashRouter>
              <Route path='/' component={sign}/>
              <Route path='/allchats' component={AllChats}/>
              <Route path='/chat/:id' component={Chat}/>
          </HashRouter>
      </div>
        
     );
  }
}

