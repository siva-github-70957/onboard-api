const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./db/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     credentials: true,
//     origin: 'http://127.0.0.1:3000',
// }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));


mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(" database connection successull"))
    .catch((err) => console.log('Connecting Database Error : ', err));


app.post('/login', async (req, res) => {
    const { userName, lpassword } = req.body;
    const UserDoc = await UserModel.findOne({ userName });
    if (UserDoc) {
        if (lpassword === UserDoc.password)
            res.status(200).json('login success');
        else
            res.status(400).json('password incorrect');
    } else {
        res.status(422).json('user not found');
    }
})

app.post('/createUser', async (req, res) => {
    const { fullName, userName, password, collegeName,
        passedOut, telegramId, collegeCity, collegeDistrict,
        collegeState, receivedOnboarding, role } = req.body;
    try {
        const userDoc = await UserModel.create({
            fullName, userName, password, college: collegeName,
            yearOfPassedOut: passedOut, telegramId, collegeCity, collegeDistrict,
            collegeState, receivedOnboarding, role
        });
        res.status(200).json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
    res.status(200);
})

app.get('/count', async (req, res) => {
    let totalcount = 0;
    let receivedNumber = 0;
    let aseReceivedNumber = 0;
    let waitingNumber = 0;
    let aseWaitingNumber = 0
    const client = new MongoClient(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
    const collection = await client.db('test').collection('users');
    totalcount = await collection.countDocuments();
    receivedNumber = await collection.countDocuments({ receivedOnboarding: true });

    waitingNumber = await collection.countDocuments({ receivedOnboarding: false });

    aseReceivedNumber = await collection.countDocuments({ receivedOnboarding: true, role: false });

    aseWaitingNumber = await collection.countDocuments({ receivedOnboarding: false, role: false });

    let taseReceivedNumber = receivedNumber - aseReceivedNumber;

    let taseWaitingNumber = waitingNumber - aseWaitingNumber;
    res.json({ totalcount, receivedNumber, aseReceivedNumber, taseReceivedNumber, waitingNumber, aseWaitingNumber, taseWaitingNumber });

    // client.connect(err => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }

    //     collection.countDocuments((err, count) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }

    //         console.log(`Count of all documents in collection: ${count}`);
    //         totalcount = totalcount + count;
    //         client.close();
    //     });
    // }).then(() => res.json(totalcount))
    //     .catch((err) => console.log('found eror', err));

})


app.get('/', (req, res) => {
    res.json('you are in server of onboarding site');
})

app.listen(4000, () => {
    console.log('Server started on port 4000');
});