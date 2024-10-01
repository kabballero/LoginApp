import React from 'react';
import '../css/mycss.css'

export default function Unauthorized(){
    return(
        <div className='container' style={{backgroundColor:'#423d37b4'}}>
            <h1>you lost lil boi?</h1>
            <button className='button' onClick={()=>{window.location.href='http://localhost:3000'}}>
                go home to mama
            </button>
        </div>
    )
}