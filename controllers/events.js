

//Generaremos las funciones que devolveran objetos como
// {
//     ok:true,
//     msg: 'Tipo de consulta'
// }

const Event = require("../models/EventModel");

const getEvents = async (req, res) => {

    //Con el método "populate()", podremos acceder a una cantidad de datos detallada de la propiedad que se le indica.

    const events = await Event.find()
        .populate('user', 'name');

    return res.json({
        ok: true,
        events
    })

}

const addEvent = async (req, res) => {

    const event = new Event(req.body);
    // console.log( req.uid );

    try {

        event.user = req.uid;

        const savedEvent = await event.save();

        return res.status(201).json({
            ok: true,
            msg: 'Evento agregado correctamente.',
            event: savedEvent
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un problema al crear el evento',
            error,
        });
    }

}

const updateEvent = async (req, res) => {

    const eventID = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventID );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese ID.',
            })
        }

        if( event.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                msg: 'No tienes la autorización de eliminar el documento de otros.'
            })

        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventID, newEvent, { new: true } );

        return res.json({
            ok: true,
            event: updatedEvent
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador.',
        })
    }

}


const removeEvent = async (req, res) => {

    const eventID = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventID );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese ID.',
            })
        }

        if( event.user.toString() !== uid ){

            return res.status(401).json({
                ok: false,
                msg: 'No tienes la autorización de modificar el documento de otros.'
            })

        }

        await Event.findByIdAndDelete( eventID );

        res.json({
            ok: true,
            msg: 'Evento eliminado con éxito.'
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador.',
        })
    }

    // return res.status(200).json({
    //     ok: true,
    //     msg: 'El evento ha sido removido con éxito'
    // })

}


module.exports = {
    getEvents,
    addEvent,
    updateEvent,
    removeEvent
}