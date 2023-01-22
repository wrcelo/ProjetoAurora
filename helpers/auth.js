module.exports.checarFuncionario = function (req, res, next){
    const userId = req.session.userId;
    const perfil = req.session.perfil;
    if(!userId || perfil === 4){
        res.redirect('/login/logout');
    }
    next();
}

module.exports.checarAssociado = function (req, res, next){
    const userId = req.session.userId;
    const perfil = req.session.perfil;
    if(!userId || perfil != 4){
        res.redirect('/login/logout');
    }
    next();
}

module.exports.checarSessao = function (req, res, next){
    const userId = req.session.userId;
    if(!userId){
        res.redirect('/login/logout');
    }
    next();
}