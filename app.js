const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/secrets');
const trySchema = new mongoose.Schema({
    email : String ,
    password : String
});
const secret = "thisislittlesecret.";
trySchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const item = mongoose.model('second', trySchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/register', (req, res) => {
    const newUser = new item({
        email : req.body.username,
        password : req.body.password
    })
    newUser.save()
    .then(() => {
        res.render('secrets');
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    item.findOne({email: username})
    .then(() => {
        if(foundUser){
            if(foundUser.password === password){
                res.render('secrets');
            }
        }
    }).catch((err)=>{
        console.log(err);
    })

})

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
})


app.listen(3000, () => {
    console.log('Listening on port 3000');
})