const jwt = require('jsonwebtoken');

//VERIFICAR ROL admin
let verificarRol = (req,res,next) =>{
    let usuario = req.usuario;
    
    if(usuario.role !== "ADMIN_ROLE"){
        res.json({
            ok:false,
            err:{
                message: 'No es Administrador'
            }
        });
    }
    next();
}

//VERIFICAR TOKEN
let verificaToken = (req,res,next) =>{
    let token = req.get('token');

    //si el token no viene devolver error y no continuar
    if(!token){
        return res.status(401).json({
            ok: false,
            err:{
                name: "TokenNeeded",
                message: "El Token no ha sido enviado"
            }
        });
    }
    
    jwt.verify(token, process.env.SEED, (err,decoded) =>{
        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    name: "InvalidToken",
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario
        // next();

    });
    next();
}


let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    // res.json(token);

    jwt.verify(token, process.env.SEED, (err,decoded) =>{
        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    name: "InvalidToken",
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario
        next();

    });
    // next();
};

module.exports = {
    verificaToken, verificarRol, verificaTokenImg
}