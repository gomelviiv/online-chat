import React from 'react';
import './App.css';

import {HashRouter, Route, } from 'react-router-dom';

import Main from './components/Main.jsx';
import AllChats from './components/AllChats/AllChats.jsx'
import Chat2 from './components/Chat/Chat2.jsx'
import sign from './components/sign/sign.jsx'

export default class App extends React.Component {
  render(){
    return (
        <HashRouter>
            <Route path='/main' component={Main}/>
            <Route path='/sign' component={sign}/>
            <Route path='/allchats' component={AllChats}/>
            <Route path='/chat/:id' component={Chat2}/>
        </HashRouter>
     );
  }
}

