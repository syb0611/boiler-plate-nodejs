const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key')

const bodyParser = require('body-parser')           //Body-Parser
const cookieParser = require('cookie-parser');      //cookie-parser

const {auth} = require('./middleware/auth');        //auth
const {User} = require("./models/User")             //User 모듈 가져오기

app.use(bodyParser.urlencoded({extended: true}))    //application/x-www-form-urlencoded
app.use(bodyParser.json())                          //application/json
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err))


//기본 Route
app.get('/', (req, res) => {
    res.send('Hello World! Hi!')
})

//회원가입 Route
app.post('/api/users/register', (req, res) => {

    //회원가입 시 필요한 정보들을 client에서 가져와서 DB 저장

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    })
})

//로그인 Route
app.post('/api/users/login', (req, res) => {
    //1. 요청한 email을 DB에서 찾기
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "해당 이메일의 사용자가 존재하지 않습니다."
            });
        }

        //2. DB에 요청 email 있으면 비밀번호 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({
                    loginSuccess: false, 
                    message: "비밀번호가 일치하지 않습니다."
                });
            }

            //3. 비밀번호 맞다면 Token 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //user에 token 들어있는 상태
                //토큰 저장. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id});
            });
        });
    });
});

//Auth Route
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어 통과해서 왔다는 얘기는 Authentication이 True!

    //클라이언트에게 정보 전달
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, //role 0 -> 일반 유저, 0이 아니면 -> admin
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

//로그아웃 Route
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id}, 
        {token: ""},
        (err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})