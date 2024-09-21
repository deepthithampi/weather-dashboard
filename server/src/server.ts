import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
 app.use(express.static('public'));
 app.use(express.static('../../client/dist'));
 //app.use(express.static("../client/dist"));
//app.use(express.static('../../../client/dist'));
// app.use(express.static(path.join(__dirname, '../client/dist')));

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
 app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));


//console.log(`API_BASE_URL: ${process.env.API_BASE_URL}, API_KEY: ${process.env.API_KEY}`);