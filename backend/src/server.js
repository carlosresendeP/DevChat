import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
console.log('SERVIDOR RUNNING ON PORT 8080'); 

// Evento disparado ao estabelecer uma conexão com um cliente
wss.on('connection', (ws) => {

    ws.on('error', console.error);

    ws.send("Mensagem enviado pelo Servidor")

    //todos os clientes conectados recebem a mensagem
    ws.on('message', (data) => {
;
        wss.clients.forEach((clients)=>{
            clients.send(data.toString());
        }) 
    });

    console.log('client connected');

});