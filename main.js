
import { Movies } from './js/model/movies.js';
import { Seats } from './js/model/seats.js';
import  Users  from './js/model/users.js';
import { Tickets } from './js/model/tickets.js';
// import Connection from '../db/connect/connect.js';

const obj = new Users;
const obj2 = new Seats
const obj3 = new Tickets
const obj4 = new Movies
//!API para Listar Usuarios
// console.log(await obj.getUsers());
//!API para agregar Usuarios
console.log(await obj.registrarNuevoUsuario());
//!API para listar Asientos disponibles
// console.log(await obj2.getSeats())
//!API para comprar asientos
// console.log(await obj3.comprarBoleto())
//!API para reservar asientos
// console.log(await obj3.reservarBoleto());
//!API para cancelar reserva
// console.log(await obj3.cancelarReserva()); 
//!API para listar peliculas
// console.log(await obj4.getMoviesDescription());
//!API para listar peliculas con sinopsis
// console.log (await obj4.getMovie())
//!API para listar pelicula por nombre
// console.log(await obj4.getMovieForName())
//!API para agregar peliculas
// console.log(await obj4.agregarPelicula());
