const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("My app is working now");
});

app.listen(3000, () => {
    console.log("My app is running on http://localhost:3000");
});