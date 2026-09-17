import express, { json } from 'express';
import http from 'http';
import { matchRouter } from './routes/matches.js';
import 'dotenv/config';
import { attachWebSocketServer } from './ws/server.js';


const port = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';
const app = express();

const server = http.createServer(app);

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello from Express Server");
});

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(port,HOST,() => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost${port}`: `http://${HOST}:${port}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket server is running on ${baseUrl.replace('http','ws')}/ws`);
})
