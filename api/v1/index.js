require("dotenv").config();
express = require("express");
const cors = require("cors");
const { json } = require("express");
const devicesRouter = require("./routes/devices.js");
const deviceTypesRouter = require("./routes/deviceTypes.js");
const groupsRouter = require("./routes/groups.js");

const app = express();
const port = process.env.PORT;

//middleware de express
app.use(
    express.urlencoded({
        extended: true,
    })
);

//middleware de express
app.use(
    express.json({
        type: "*/*",
    })
);

//middleware de express
app.use(cors());

//middleware propio para el router devicesRouter
app.use("/devices", devicesRouter);

//middleware propio para el router deviceTypesRouter
app.use("/device-types", deviceTypesRouter);

//middleware propio para el router groupsRouter
app.use("/groups", groupsRouter);

console.clear();

app.listen(port, () => {
    console.log(
        `api: estoy ejecutandome en htttp://localhost:${process.env.PORT}`
    );
});
