const {User} = require('../models/User');

let auth = (req, res, next) => {
    //인증 처리를 하는 곳

    //1. 클라이언트 쿠키에서 token 가져옴
    let token = req.cookies.x_auth;

    //2. token 복호화 한 후 유저 찾음
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        //유저 있으면 Okay!
        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = {auth};