import React,{useState,useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import '../css/mycss.css'

export default function Login (){
    const [username,setUsername]=useState([]);
    const[password,setPassword]=useState([]);
    async function handleSubmit(e){
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const token=await fetch(`http://localhost:9103/login`,{
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData}).then((res) => res.json())
        .catch((e) => {console.log("Post error: "+ e.message)})
        if(!token){
            alert("fuck off")
            return
        }
        localStorage.setItem('token', token.token);
        const decoded = jwt_decode(token.token);
        if(decoded.role=='caporegime'){
            window.location.href='http://localhost:3000/capo'
        }
        else if(decoded.role=='soldier'){
            window.location.href='http://localhost:3000/soldier'
        }
        else{
            alert("something went wrong")
        }
        console.log(decoded.role)
    }
    return(
        <form className='container' onSubmit={handleSubmit}>
            <h2>login</h2>
            <table>username</table>
            <input type='text' placeholder='username' onChange={(e)=>{setUsername(e.target.value)}}/>
            <table>password</table>
            <input type="password" placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
            <button className='button' type='submit'>login</button>
        </form>
    )
} 