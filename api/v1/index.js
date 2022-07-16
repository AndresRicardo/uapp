require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    express.json({
        type: "*/*",
    })
);

app.use(cors());

console.clear();

//consulta devices al api sigfox
async function getDevicesFromSigfoxApi(user, pss, groupId, devTypeId) {
    console.log(`deviceTypeid = ${devTypeId}`);
    const auth = `${user}:${pss}`;
    const authCoded = Buffer.from(auth, "utf-8").toString("base64");
    // const authCoded = btoa(`${formusername}:${formpassword}`); //funciona pero btoa es obsoleta

    const url = `https://api.sigfox.com/v2/devices?deviceTypeId=${devTypeId}`;
    const options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, *cors, same-origin
        credentials: "include", // include, *same-origin, omit
        headers: {
            Authorization: `basic ${authCoded}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);

        if (response.ok) {
            console.log("DATOS DE LA SOLICITUD A SIGFOX");
            console.log("fetch ok");
            console.log("respuesta server ok");
            console.log(`codigo de respuesta: ${response.status}`);
            console.log("url: ", response.url);

            const responseJson = await response.json();

            console.log("PARSEO JSON DATA CORRECTO");
            // console.log(responseJson);
            return responseJson;
        } else {
            console.log("RESPUESTA SERVER ERROR");
            console.log(`RESPUESTA CODE: ${response.status}`);
            // console.log("RESPUESTA DATA: ");
            // console.log(response);
        }
    } catch (error) {
        console.log("ERROR HACIENDO ALGO:");
        console.log(error);
    }
}

//cuando hagan un get a http://localhost:3000/devices hacer esto
app.get("/devices", (req, res) => {
    console.log(`SE RECIBE UN REQUEST GET DESDE EL FRONTEND`);

    ///////////////////////////////////////////////////////////////// CAMBIAR ESTO
    //Obteniendo headers del request del frontend
    // const hostname = req.hostname;
    // const user = req.headers.user;
    // const password = req.headers.password;
    // const groupId = req.headers.groupid;
    // const deviceTypeId = req.headers.devicetypeid;

    const hostname = req.hostname;
    const user = process.env.SIGFOX_API_USERNAME;
    const password = process.env.SIGFOX_API_PASSWORD;
    const groupId = process.env.TEST_SIGFOX_GROUP;
    const deviceTypeId = process.env.TEST_SIGFOX_DEVICE_TYPE;
    /////////////////////////////////////////////////////////////////

    console.log(`INFORMACION DEL REQUEST:`);
    console.log(`api: request get desde http://${hostname} `);
    console.log(`api: header user: ${user}`);
    console.log(`api: header password: ${password}`);
    console.log(`api: header groupId: ${groupId}`);
    console.log(`api: header deviceTypeId: ${deviceTypeId}`);

    // consultar API sigfox por devices
    console.log("SE REALIZARÁ REQUEST A API SIGFOX");

    const response = getDevicesFromSigfoxApi(
        user,
        password,
        groupId,
        deviceTypeId
    );

    response.then((info) => {
        console.log("DATA RECIBIDA DESDE SIGFOX: ");
        console.log(info);
        res.send(info);
    });
});

//cuando hagan un post a http://localhost:3000/devices/bulk/unsubscribe hacer esto
app.post("/devices/bulk/unsubscribe", (req, res) => {
    console.log(`SE RECIBE UN REQUEST POST DESDE EL FRONTEND`);

    const respJson = JSON.stringify({
        msg1: "api: en un momento respondo a su request post",
        msg2: "asdf",
        msg3: "asdf",
        msg4: "asdf",
        msg5: "asdf",
    });
    console.log(`JSON A RESPONDER: ${respJson}`);
    res.send(respJson);

    // hacer request post al API sigfox para poner unsubscription date a los devices
});

app.listen(port, () => {
    console.log(`api: estoy ejecutandome en htttp://localhost:${port}`);
});
