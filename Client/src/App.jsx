import React from 'react'
import { io } from "socket.io-client";
const App = () => {

  const socket=io("http://localhost:2724");


  return (
    <div>
      <h1>Hello world</h1>
    </div>
  )
}

export default App

