import { setupServer } from '../src/server.js';
import { initMongoDB } from './db/initMongoDB.js';

initMongoDB();
setupServer();
