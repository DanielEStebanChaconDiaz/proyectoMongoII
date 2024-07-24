
import {conectarConMongoDB} from './js/crud.js';
import Connection  from './db/connect/connect.js'
import { ObjectId } from 'mongodb';


// Conectar a la base de datos
console.log(await conectarConMongoDB())