const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const mongoose = require('mongoose')

const user = require('./model')

mongoose.connect('mongodb://localhost/oauthdemo');

app.use('/', express.static(path.join(__dirname, 'template')))

app.use(bodyParser.json());

app.post('/login-with-facebook', async (req, res) => {
    const {accessToken, userID} = req.body;
    const response = await fetch(`https://graph.facebook.com/v13.0/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`)
    const json = await response.json();
    if (json.id === userID) {
        // a valid user
        let resp = await user.findOne({facebookID: userID});
        if (resp) {
            res.json({status: 'ok', data: 'You are logged in '});
        } else {
            const person = new user({
                name: 'Kishan',
                facebookID: userID,
                accessToken
            })
            await person.save();

            res.json({status: 'ok', data: 'You are registered and logged in'});
        }
    } else {
        res.json({status: 'error', data: 'Don\'t try to f with us'})
    }
})


app.listen(8080, _ => console.log('listening'));
