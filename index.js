const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser')           //Body-Parser
const {User} = require("./models/User")             //User 모듈 가져오기

app.use(bodyParser.urlencoded({extended: true}))    //application/x-www-form-urlencoded
app.use(bodyParser.json())                          //application/json

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://seo:0000@boiler-plate.mlzqt.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err))


//기본 Route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//회원가입 Route
app.post('/register', (req, res) => {

    //회원가입 시 필요한 정보들을 client에서 가져와서 DB 저장

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})