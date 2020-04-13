import React, { useState } from 'react'

function Sign(){
    const [count, setState] = useState(0);
    
    return (
        <div className="sign-up">
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input 
                        type="email" 
                        class="form-control" 
                        onChange={(e)=>this.changeInput('email', e.target.value)} 
                        id="exampleInputEmail1" 
                        aria-describedby="emailHelp"
                    />
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input 
                        class="form-control" 
                        onChange={(e)=>this.changeInput('password', e.target.value)} 
                        id="exampleInputPassword1"
                    />
                </div>
                <button type="submit" onClick={()=>this.sendMessage()} class="btn btn-primary">Registration</button>
            </form>
        </div>
    )
}
