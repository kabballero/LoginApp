import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter,Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import App from './App';
import  Login from './components/login'
import Capo from './components/caporegime'
import Soldier from './components/soldier'
import Unauthorized from './components/unauthorized';

const container = document.getElementById('root');
const root = createRoot(container);
const storedToken = localStorage.getItem('token');
let decoded;
if(storedToken){
    decoded = jwt_decode(storedToken);
    console.log(decoded.role)
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/Unauthorized',
    element: < Unauthorized/>
  },
  {
    path: '/capo',
    element: decoded && decoded.role === 'caporegime' ? <Capo /> : <Navigate to="/Unauthorized" />
  },
  {
    path: '/soldier',
    element: decoded && decoded.role === 'soldier' ? <Soldier /> : <Navigate to="/Unauthorized" />
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>
);

