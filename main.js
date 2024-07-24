
import {Login} from './js/crud.js';
import Connection  from './db/connect/connect.js'
import { ObjectId } from 'mongodb';

const obj = new Login
// Conectar a la base de datos
console.log(await obj.login())