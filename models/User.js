//mongoose 모듈 가져오기
const mongoose = require('mongoose')

//bycrypt 모듈 가져오기
const bycrypt = require('bcrypt');
//saltRounds 값 설정
const saltRounds = 10;

//jsonwebtoken 모듈 가져오기
const jwt = require('jsonwebtoken');

//mongoose 이용해서 schema 생성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, 
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//저장하기 전에 수행
userSchema.pre('save', function(next) {

    var user = this;

    //비밀번호 바뀔 때만 적용되도록 조건
    if(user.isModified('password')) {
        //비밀번호 암호화
        bycrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);

            bycrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//입력한 비밀번호와 DB 저장된 비밀번호 같은지 비교하는 method
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bycrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

//토큰 생성하는 method
userSchema.methods.generateToken = function(cb) {

    var user = this;

    //jsonwebtoken 이용하여 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
};

//schema를 model로 감싸주기
const User = mongoose.model('User', userSchema)

//User model을 다른 데서도 사용 가능하도록 export 해주기
module.exports = {User}
