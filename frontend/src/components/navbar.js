import React from 'react';
import '../css/mycss.css';

export default function Navbar() {
     function handleClick(){
        localStorage.removeItem('token');
        window.location.href='http://localhost:3000';
    }
    return (
        <div className='navbar'>
            <h2 style={{position:'relative', right:'32%', fontSize:'25px'}}>CosaNostra</h2>
            <button className='logoutButton' onClick={handleClick}>sign out</button>
        </div>
    )
}