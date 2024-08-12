const ObjectId  = require('mongodb');
const Connection = require('../helpers/connect')
module.exports = class Seats{
    constructor(){
        this.connection = new Connection();
        this.db = process.env.DB_NAME;
    }
    async connect(){
        if(!this.db){
            try{
                this.db = await this.connection.connect();
            }catch(err){
                console.error('Error connecting to the database:', err);
            }
        }
        return this.db;
    }
    async getSeats(showtime_id){
        try{
            const colecciones = await this.db.collection('showtimes').aggregate([
                {$match:{ _id: ObjectId(`${showtime_id}`)}},
                {
                    $project: {
                        _id: 0,
                        date: 1,
                        time: 1,
                        theater: 1,
                        availableSeats: {
                            $filter: {
                                input: '$availableSeats',
                                as: 'seat',
                                cond: { $eq: [ '$seat.status', 'Disponible' ] }
                            }
                        }
                    }
                }
            ]).toArray();
            return colecciones;
        }
        catch(err){
            console.error('Error al recuperar asientos:', err);
        }
    }
}