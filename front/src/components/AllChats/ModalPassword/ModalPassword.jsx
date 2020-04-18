import React, { useState} from 'react';

export default function ModalPassword(props){
    
    let [password, setPassword] = useState('')

    return(
        <form>
            <div className="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" onChange={(e)=> setPassword(e.target.value)} className="form-control" id="exampleInputPassword1"/>
            </div>
            <button onClick={()=>props.checkPassword(password)} type="submit" className="btn btn-primary">Submit</button>
            <button onClick={()=>props.modalClose('modalPassawordToChat', false)} type="submit" className="btn btn-primary">Close</button>
      </form>
    )
}