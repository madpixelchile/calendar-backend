const { Router } = require('express');
const { check, checkExact, body } = require('express-validator');
const { validateEvents } = require('../middlewares/validateEvents');
const { getEvents, updateEvent, removeEvent, addEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validateJWT');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Esto quiere decir que todos los servicios tendrán el middleware agregado de validateJWT
//SI queremos excluir algun endpoint de la validación, debemos de ponerlo arriba de esta validación
router.use( validateJWT ); 
//-------------------------------------------------------------------------------------------------//

//Get events
router.get('/', getEvents);

//Create events
router.post('/add', 
    [
    //Middlewares
    // body('title'),
    // body('start'),
    // body('end'),
    check('title','El título es obligatorio').not().isEmpty(),
    // check('notes','El contenido de la nota es obligatoria').not().isEmpty(),
    check('start','La fecha de inicio es obligatoria').custom( isDate ),
    check('end','La fecha de término es obligatoria').custom( isDate ),
    // checkExact([], { message: 'Solo title, start y end están permitidos' }),
    validateEvents],
    addEvent);

//Update events
router.put('/:id',
    // [
    //     body('id'),
    //     check('id', 'El id es obligatorio').not().isEmpty(),
    //     checkExact([], { message: 'Solo el campo de id está permitido' }),
    //     validateEvents
    // ]
    updateEvent);

//Delete events
router.delete('/delete/:id',
    // [
    //     body('id'),
    //     check('id', 'El id es obligatorio').not().isEmpty(),
    //     checkExact([], { message: 'Solo el campo de id está permitido' }),
    // ]
    removeEvent);

module.exports = router;