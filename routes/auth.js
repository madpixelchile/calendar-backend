
/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check, checkExact, body } = require('express-validator');
const router = Router();

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

//RUTAS
router.post( '/new', [
    //Middlewares
    body('name'),
    body('email'),
    body('password'),
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password debe de ser de al menos 6 caracteres').isLength({ min: 6 }),
    checkExact([], { message: 'Solo name, email y password están permitidos' }),
    validateFields
], createUser );


router.post( '/', [
    //Middlewares
    body('email'),
    body('password'),
    checkExact([], { message: 'Solo el mail y password están permitidos' }),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password debe de ser de al menos 6 caracteres').isLength({ min: 6 }),
    validateFields
] ,loginUser );


router.get( '/renew', 
//Middlewares
validateJWT
, revalidateToken );

module.exports = router;