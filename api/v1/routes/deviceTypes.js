express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const { json } = require("express");

let router = express.Router();

//middleware propio de nosotros, se ejecuta para todas las rutas definidad en este router
router.use((req, res, next) => {
    console.log(req.ip); //solo por poner nu ejemplo de algo que se hará en este router

    next();
});

// define the home page route
router.get("/", function (req, res) {
    res.send("Device Types home page");
});

module.exports = router;
