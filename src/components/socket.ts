import { io } from "socket.io-client";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export const socket= io(API_BASE_URL)

socket.on ('connect', ()=>{
    console.log('Connected:', socket.id)
})

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});


export default socket