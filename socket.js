import {Server} from 'socket.io';
let socketio;

export default {
    init : (httpserver) =>{
         socketio = new Server(httpserver,{
            cors: {
                origin: 'http://localhost:3000',
                methods: ['POST', 'GET']
            }
        });
        return socketio;
    },
    getIo : ()=>{
        if(!socketio){
             throw new Error('socket.io not initialized ');
        }
        return socketio;
    }
}