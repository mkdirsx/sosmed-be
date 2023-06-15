const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.static('Public'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).send(
        '<h1>API</h1>'
    )
});

app.listen(process.env.PORT, () => {
    console.log('API running in port: ', process.env.PORT);
});
