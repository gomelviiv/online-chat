import React, {useState} from 'react';
import './ModalChat.css'


export default function ModalChat(props){
    let [chatName, setChatName] = useState('')
    let [password, setPassword] = useState(null)
    let [checked, setChecked] = useState(false);

    return(
        <form >
            <div className="form-group">
                <label for="exampleInputEmail1">Chat name</label>
                <input  
                    className="form-control" 
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp"
                    onChange={(e) => setChatName(e.target.value)}
                />
            </div>
            {
                checked ? <div className="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input
                                type="password" 
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        : ''
            }
            
            <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={()=>{setChecked(!checked)}}/>
                <label className="form-check-label" for="exampleCheck1">Make chat private</label>
            </div>
         
            <button type="submit" onClick={()=>props.createChatbutton({name:chatName, password})} className="btn btn-primary but-create-chat">Create</button>
            <button className="btn btn-primary m-3" onClick={props.handleCloseModal}>Close Modal</button>
        </form>
    )
}