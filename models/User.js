//mongoose 모듈 가져오기
const mongoose = require('mongoose')

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

//schema를 model로 감싸주기
const User = mongoose.model('User', userSchema)

//User model을 다른 데서도 사용 가능하도록 export 해주기
module.exports = {User}
