import { useState } from 'react'
import Login from './components/Login.jsx'
import './App.css'
import { GoogleLogin } from '@react-oauth/google';

function App() {
  

  return (

    <div className="app">
      <main className="main">
        <Login />
      </main>
    </div>

  )
}

export default App;
