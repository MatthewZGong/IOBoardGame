import { Server } from 'socket.io';
import redisAdapter from 'socket.io-redis';

const io = new Server()