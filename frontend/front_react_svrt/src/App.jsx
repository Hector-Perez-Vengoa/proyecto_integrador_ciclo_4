import { useState } from 'react'
import Login from './components/Login.jsx'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import './App.css'
import { GoogleLogin } from '@react-oauth/google';

function App() {
  

  return (

    <div className="app">
      <Header />
      <main className="main">
        <Login />
      </main>
      <Footer />
    </div>

  )
}

export default App;
