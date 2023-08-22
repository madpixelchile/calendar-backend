
const { response } = require('express'); //Solo para mantener el tipado al desarrollar, esto no es obligatorio aquí
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generateJWT } = require('../helpers/jwt');


// const { validationResult } = require('express-validator');

//Controllers

const createUser = async (req, res = response) => {

    const { name, email, password } = req.body;
    // console.log(req.body);

    try {

        let user = await User.findOne({ email });
        // console.log('USUARIO:', user);

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo',
            })
        }

        user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generar JWT ( JSON WEB TOKEN )
        const token = await generateJWT( user.id, user.name );

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor habla con el administrador'
        })
    }

    //Se le debe de poner return a todas los condicionales para que no siga corriendo el código
    //Ya que de no cortarlo generará errores.
    //Se le antepone el tipo de error antes de continuar con la estructura de respuesta para devolver el status res.status(400)
    // if( name.length < 5 ){
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe de contener 5 letras mínimo'
    //     })
    // };

    //Manejo de errores
    // const errors = validationResult( req );

    // if( !errors.isEmpty() ){  // o simplemente buscar que "errors" venga if(errors)
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     })
    // }

    // console.log(errors);


}

const loginUser = async (req, res = response) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario con ese email',
            })
        }

        //Confirmar el password

        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta.'
            })
        }

        //Generar nuestro JWT (JSON WEB TOKEN)
        const token = await generateJWT( user.id, user.name );

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor habla con el administrador'
        })

    }

}

const revalidateToken = async( req, res = response ) => {

    const { uid, name } = req;

    //Generar un nuevo JWT y retornarlo en esta petición
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        // uid,
        // name,
        token
        // msg: 'renew'
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}