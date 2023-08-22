
const jwt = require('jsonwebtoken');

const generateJWT = async( uid, name )=>{

    let generatedToken;

    await new Promise(( resolve, reject ) => {

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, ( err, token )=>{

            if( err ){
                console.log( err );
                reject( 'No se pudo genera el TOKEN' );
            }

            resolve( token );

        })
    }).then(( token )=>{
        generatedToken = token;
    })

    return generatedToken;
}

module.exports = {
    generateJWT,
}