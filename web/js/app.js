//#region   /////////////////////////////// OBTENER ELEMENTOS DEL DOM

// elementos del sidebar
const username = document.querySelector("#username");
const usernameError = document.querySelector("#usernameError");
const password = document.querySelector("#password");
const passwordError = document.querySelector("#passwordError");
const authenticateButton = document.querySelector("#authenticateButton");
const getDevicesList = document.querySelector("#getDevicesList");
const getDevicesOptionButton = document.querySelector(
    "#getDevicesOptionButton"
);
const singleDeviceOptionButton = document.querySelector(
    "#singleDeviceOptionButton"
);
const multipleDevicesOptionButton = document.querySelector(
    "#multipleDevicesOptionButton"
);

//elementos del get devices
const GetDevicesListForm = document.querySelector("#GetDevicesListForm");
const group = document.querySelector("#group");
const groupError = document.querySelector("#groupError");
const deviceType = document.querySelector("#deviceType");
const deviceTypeError = document.querySelector("#deviceTypeError");
const getDevicesButton = document.querySelector("#getDevicesButton");
const ErrorGettingDevices = document.querySelector("#ErrorGettingDevices");

//elementos del update a device
const singleDeviceUnsubscribe = document.querySelector(
    "#singleDeviceUnsubscribe"
);
const deviceID = document.querySelector("#deviceID");
const ErrorDeviceId = document.querySelector("#ErrorDeviceId");
const validateSingleDeviceButton = document.querySelector(
    "#validateSingleDeviceButton"
);
const ErrorValidatingDevice = document.querySelector("#ErrorValidatingDevice");

//elementos del update multiple devices
const multipleDeviceUnsubscribe = document.querySelector(
    "#multipleDeviceUnsubscribe"
);
const csvFileInput = document.querySelector("#csvFileInput");
const validateDevicesButton = document.querySelector("#validateDevicesButton");
const ErrorValidatingDevices = document.querySelector(
    "#ErrorValidatingDevices"
);

// elemntos del area de camios
const changeArea = document.querySelector("#changeArea");
const methodSelector = document.querySelector("#methodSelector");
const dateMethod = document.querySelector("#dateMethod");
const durationMethod = document.querySelector("#durationMethod");
const updateButton = document.querySelector("#updateButton");
const alertSuccess = document.querySelector("#alertSuccess");
const alertError = document.querySelector("#alertError");
const loading = document.querySelector("#loading");
const devicesTable = document.querySelector("#devicesTable");
const tableBody = document.querySelector("#devicesTableBody");
const templateFila = document.querySelector("#templateFila").content;
const item = document.querySelector(".item");

//#endregion

//#region   /////////////////////////////// VARIABLES GLOBALES Y EXPRESIONES REGULARES
const regexpUserName = /^[A-Za-z0-9\s]+$/;
const regexpPassword = /^[A-Za-z0-9\s]+$/;
const regexpGroup = /^[A-Za-z0-9\s]+$/;
const regexpDeviceType = /^[A-Za-z0-9\s]+$/;
const regexpDeviceId = /^[A-Fa-f0-9\s]+$/;

let globalUsername = "";
let globalPassword = "";
let globalGetDevicesResponse = {}; //data recibida desde sigfox
let globalUnsubscribeResponse = {}; //data recibida desde sigfox
//#endregion

//#region   /////////////////////////////// FUNCIONES
//funcion para consultar al backend los devices en un determiando device type
async function getDevices(
    formUsername,
    formPassword,
    formDeviceID = "",
    formGroupId = "",
    formDeviceTypeId = ""
) {
    let url = "http://localhost:3000/devices"; //para consultar devices en el device type especificado
    const options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            user: formUsername,
            password: formPassword,
            deviceid: formDeviceID,
            groupid: formGroupId,
            devicetypeid: formDeviceTypeId,
            accept: "application/json",
            "content-Type": "application/json",
        },
    };

    let params = new URLSearchParams();

    if (formDeviceID.length > 0) {
        params.append("id", formDeviceID);
        options.headers.deviceid = formDeviceID;
    }
    if (formGroupId.length > 0) {
        params.append("groupIds", formGroupId);
        options.headers.groupid = formGroupId;
    }
    if (formDeviceTypeId.length > 0) {
        params.append("deviceTypeId", formDeviceTypeId);
        options.headers.devicetypeid = formDeviceTypeId;
    }

    url = `${url}?${params.toString()}`;

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
            return responseJson;
        } else {
            console.log("RESPUESTA SERVER ERROR");
            console.log(`RESPUESTA CODE: ${response.status}`);
        }
    } catch (error) {
        console.log("ERROR OBTENIENDO DEVICES:");
        console.log(error);
        loadingData(false);
    }
}

// //funcion para obtener un resulado de una busqueda a partir de una listado de devices
// function getInfoDevices(request) {
//     console.log("_______________INICIO GETINFODEVICES______________");
//     let respuesta = { data: [] };

//     request.data.forEach((element) => {
//         let url = "http://localhost:3000/devices";
//         const options = {
//             method: "GET", // *GET, POST, PUT, DELETE, etc.
//             mode: "cors", // no-cors, *cors, same-origin
//             credentials: "same-origin", // include, *same-origin, omit
//             headers: {
//                 user: username.value,
//                 password: password.value,
//                 deviceid: element.id,
//                 accept: "application/json",
//                 "content-Type": "application/json",
//             },
//         };

//         let params = new URLSearchParams();
//         params.append("id", element.id);
//         url = `${url}?${params.toString()}`;

//         let data = fetch(url, options);
//         data.then((resp) => resp.json()).then((dataJson) => {
//             console.log(`dataJson.data[0]: ${dataJson.data[0].id}`);
//             respuesta.data.push(dataJson.data[0]);
//         });
//     });

//     // while (respuesta.data.length === 0) {}
//     console.log(`DATA DEVUELTA DE TODA LA CONSULTA: ${respuesta}`);
//     console.log(`DATA DEVUELTA DE TODA LA CONSULTA.data: ${respuesta.data}`);
//     console.log("_______________FIN GETINFODEVICES______________");

//     return respuesta;
// }

//funcion para desuscribir multiples devices
async function unsubscribeMultipleDevices(
    username,
    password,
    group,
    requestBody
) {
    const url = "http://localhost:3000/devices/bulk/unsubscribe"; //para consultar devices en el device type especificado
    const options = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            user: username,
            password: password,
            groupid: group,
            accept: "application/json",
            "content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    };

    console.log("Request post:");
    console.log(JSON.stringify(options));

    try {
        const response = await fetch(url, options);
        try {
            console.log("PARSEO JSON DATA CORRECTO");
            return response.json();
        } catch (error) {
            console.log(`ERROR PARSEANDO JSON, ERROR CAPTURADO: ${error}`);
            return `ERROR PARSEANDO JSON, ERROR CAPTURADO: ${error}`;
        }
    } catch (error) {
        return `ERROR DANDO DE BAJA DEVICES, ERROR CAPTURADO: ${error}`;
    }
}

//funcion para verificar que los cambios se realizaron con exito
function verificarCambios(user, pss, dev, grp, devt, request) {
    console.log("_______________INICIO VERIFICARCAMBIOS______________");

    let valoresSigfox = getDevices(user, pss, "", grp, devt);

    let dataVerificada = { data: [] };

    valoresSigfox.then((dataJson) => {
        dataJson.data.forEach((element) => {
            request.data.forEach((ele) => {
                if (ele.id == element.id) {
                    if (ele.unsubscriptionTime == element.unsubscriptionTime)
                        element["verificacion"] = true;
                    else element["verificacion"] = false;

                    dataVerificada.data.push(element);
                }
            });
        });

        console.log("DATA VERIFACADA: ", dataVerificada);
        pintarData(dataVerificada);
        console.log("_______________FIN VERIFICARCAMBIOS______________");
    });
}

//para formatear la fecha
function formatoFecha(fecha) {
    let day = fecha.getDate();
    let newDay = fecha.getDate() + 1;
    let month = fecha.getMonth() + 1;
    let newMonth = fecha.getMonth() + 2;
    let year = fecha.getFullYear();
    let newYear = fecha.getFullYear() + 1;

    if (Number(day) <= 9) day = `0${day}`;
    if (Number(newDay) <= 9) newDay = `0${newDay}`;
    if (Number(month) <= 9) month = `0${month}`;
    if (Number(newMonth) <= 9) newMonth = `0${newMonth}`;

    let resp = {
        today: `${year}-${month}-${day}`,
        tomorrow: `${year}-${month}-${newDay}`,
        plusOneMonth: `${year}-${newMonth}-${day}`,
        plusOneYear: `${newYear}-${month}-${day}`,
    };
    return resp;
}

//para establecer la fecha actual y minima permitida al input date
function setCurrentTime() {
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    dateMethod.style.display = "inline-block";
    const fechas = formatoFecha(hoy);
    dateMethod.value = fechas.plusOneYear;
    dateMethod.min = fechas.today;
}

//mostrar/ocultar spinner de carga
const loadingData = (estado) => {
    if (estado) {
        loading.classList.remove("d-none");
        loading.classList.add("d-flex");
    } else {
        loading.classList.remove("d-flex");
        loading.classList.add("d-none");
    }
};

//pintar en la pagina la informacion recibida
const pintarData = (Data, color = "black") => {
    console.log(`pintando data recibida Data: ${Data}`, Data);
    if (Data.data.length > 0) {
        console.log("entra al if");
        changeArea.style.display = "block";
        devicesTable.style.display = "block";
        const fragment = document.createDocumentFragment();

        //limpiar el body de la tabla
        while (tableBody.childElementCount > 1) {
            tableBody.removeChild(tableBody.lastChild);
        }

        Data.data.forEach((item) => {
            const clone = templateFila.cloneNode(true);
            clone.querySelector(".idItem").textContent = item.id;
            clone.querySelector(".dtItem").textContent = item.deviceType.id;
            clone.querySelector(".grItem").textContent = item.group.id;
            clone.querySelector(".tvItem").textContent = formatoFecha(
                new Date(item.token.end)
            ).today;

            if (item.verificacion == true) color = "green";
            if (item.verificacion == false) color = "red";

            clone.querySelector(".idItem").style.color = color;
            clone.querySelector(".dtItem").style.color = color;
            clone.querySelector(".grItem").style.color = color;
            clone.querySelector(".tvItem").style.color = color;
            fragment.appendChild(clone);
        });
        tableBody.appendChild(fragment);
    } else {
        alertError.textContent = "No devices to unsubscribe!";
        alertError.style.display = "block";
    }
};
//#endregion

//#region   /////////////////////////////// LISTENERS

//click en boton authenticate
authenticateButton.addEventListener("click", (e) => {
    e.preventDefault();
    usernameError.style.display = "none";
    passwordError.style.display = "none";

    let error = false;
    if (!regexpUserName.test(username.value)) {
        usernameError.style.display = "block";
        error = true;
    }
    if (!regexpPassword.test(password.value)) {
        passwordError.style.display = "block";
        error = true;
    }
    if (error) {
        loadingData(false);
        return;
    }
    globalUsername = username.value;
    globalPassword = password.value;
});

// si se selecciona la opcion del sidebar: Get devices
getDevicesOptionButton.addEventListener("click", (e) => {
    e.preventDefault();
    getDevicesOptionButton.style.backgroundColor = "DarkGray";
    singleDeviceOptionButton.style.backgroundColor = "transparent";
    multipleDevicesOptionButton.style.backgroundColor = "transparent";
    getDevicesList.style.display = "block";
    singleDeviceUnsubscribe.style.display = "none";
    multipleDeviceUnsubscribe.style.display = "none";
});

// si se selecciona la opcion del sidebar: Update a device
singleDeviceOptionButton.addEventListener("click", (e) => {
    e.preventDefault();
    getDevicesOptionButton.style.backgroundColor = "transparent";
    singleDeviceOptionButton.style.backgroundColor = "DarkGray";
    multipleDevicesOptionButton.style.backgroundColor = "transparent";
    getDevicesList.style.display = "none";
    singleDeviceUnsubscribe.style.display = "block";
    multipleDeviceUnsubscribe.style.display = "none";
});

// si se selecciona la opcion del sidebar: Update multiple devices
multipleDevicesOptionButton.addEventListener("click", (e) => {
    e.preventDefault();
    getDevicesOptionButton.style.backgroundColor = "transparent";
    singleDeviceOptionButton.style.backgroundColor = "transparent";
    multipleDevicesOptionButton.style.backgroundColor = "DarkGray";
    getDevicesList.style.display = "none";
    singleDeviceUnsubscribe.style.display = "none";
    multipleDeviceUnsubscribe.style.display = "block";
});

//cuando se hace click en el boton Get Devices
getDevicesButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    usernameError.style.display = "none";
    passwordError.style.display = "none";
    groupError.style.display = "none";
    deviceTypeError.style.display = "none";
    updateButton.style.display = "none";
    dateMethod.style.display = "none";
    alertError.style.display = "none";
    alertSuccess.style.display = "none";
    devicesTable.style.display = "none";
    ErrorDeviceId.style.display = "none";

    globalGetDevicesResponse = {}; //se vacia la variable con anteriores respuestas

    let error = false;

    if (!regexpUserName.test(username.value)) {
        usernameError.style.display = "block";
        error = true;
    }
    if (!regexpPassword.test(password.value)) {
        passwordError.style.display = "block";
        error = true;
    }
    if (!regexpGroup.test(group.value)) {
        groupError.style.display = "block";
        error = true;
    }
    if (!regexpDeviceType.test(deviceType.value)) {
        deviceTypeError.style.display = "block";
        error = true;
    }
    if (error) {
        loadingData(false);
        return;
    }

    //se pone la fecha actual y minima permitida al input date
    setCurrentTime();

    const getdevicesResponse = getDevices(
        username.value,
        password.value,
        "",
        group.value,
        deviceType.value
    );

    getdevicesResponse.then((dataJson) => {
        console.log("DATA RECIBIDA DESDE BACKEND UAAP: ");
        if (dataJson) {
            globalGetDevicesResponse = dataJson;
            console.log(dataJson);
            pintarData(dataJson);
            if (dataJson.data.length != 0) {
                updateButton.style.display = "inline-block";
                dateMethod.style.display = "inline-block";
            } else {
                updateButton.style.display = "none";
                dateMethod.style.display = "none";
            }
        } else {
            globalGetDevicesResponse = {};
            ErrorDeviceId.style.display = "inline-block";
        }
        loadingData(false);
    });
});

//cuando se hace click en el boton Validate Device
validateSingleDeviceButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    usernameError.style.display = "none";
    passwordError.style.display = "none";
    changeArea.style.display = "none";
    alertError.style.display = "none";
    alertSuccess.style.display = "none";
    devicesTable.style.display = "none";
    ErrorDeviceId.style.display = "none";
    ErrorValidatingDevice.style.display = "none";

    globalGetDevicesResponse = {}; //se vacia la variable con anteriores respuestas

    let error = false;

    if (!regexpUserName.test(username.value)) {
        usernameError.style.display = "block";
        error = true;
    }
    if (!regexpPassword.test(password.value)) {
        passwordError.style.display = "block";
        error = true;
    }
    if (!regexpDeviceId.test(deviceID.value)) {
        ErrorDeviceId.style.display = "block";
        error = true;
    }
    if (error) {
        loadingData(false);
        return;
    }

    //se pone la fecha actual y minima permitida al input date
    setCurrentTime();

    const getdevicesResponse = getDevices(
        username.value,
        password.value,
        deviceID.value
    );

    getdevicesResponse.then((dataJson) => {
        console.log("DATA RECIBIDA DESDE BACKEND UAAP: ");
        if (dataJson) {
            globalGetDevicesResponse = dataJson;
            console.log(dataJson);
            pintarData(dataJson);
            if (dataJson.data.length != 0) {
                updateButton.style.display = "inline-block";
                dateMethod.style.display = "inline-block";
            } else {
                updateButton.style.display = "none";
                dateMethod.style.display = "none";
            }
        } else {
            globalGetDevicesResponse = {};
            ErrorValidatingDevice.style.display = "inline-block";
        }
        loadingData(false);
    });
});

//cuando se selecciona un archivo csv
csvFileInput.addEventListener("change", (e) => {
    let fr = new FileReader();
    fr.readAsText(csvFileInput.files[0]);

    //cuando se termine de cargar el archivo
    fr.onload = function () {
        // arreglo de id's cargados desde csv
        let arr = fr.result.split("\n");

        console.log(`string de id's cargados desde csv: ${fr.result}`);
        console.log(`array de id's cargados desde csv: ${arr}`);

        globalGetDevicesResponse = {
            data: [],
        };

        arr.forEach((element) => {
            let item = {
                id: element.replaceAll('"', ""),
                deviceType: { id: "--" },
                group: { id: "--" },
                token: { state: "--", detailMessage: "N--", end: "--" },
            };

            if (!element.includes("Id") && element.length > 0)
                globalGetDevicesResponse.data.push(item);
        });

        console.log(`globalGetDevicesResponse: `, globalGetDevicesResponse);

        pintarData(globalGetDevicesResponse, "black");
    };
});

//cuando se hace click en boton validar multiple devices
validateDevicesButton.addEventListener("click", (e) => {
    e.preventDefault();
});

// al seleccionar el metodo para establecer el tiempo de dar de baja
methodSelector.addEventListener("change", (e) => {
    e.preventDefault();
    if (methodSelector.selectedIndex === 0) {
        document.querySelector("#dateMethod").style.display = "block";
        document.querySelector("#durationMethod").style.display = "none";
    }
    if (methodSelector.selectedIndex === 1) {
        document.querySelector("#dateMethod").style.display = "none";
        document.querySelector("#durationMethod").style.display = "block";
    }
});

//cuando se hace click en el boton Update
updateButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    alertError.style.display = "none";
    alertSuccess.style.display = "none";

    //crear request post al backend uapp para cambiar token validity a multiples devices
    console.log("RUTINA PARA CAMBIAR TOKEN VALIDITY A MULTIPLES DEVICES");

    //verificar si hay devices para hacer update
    if (!globalGetDevicesResponse.hasOwnProperty("data")) {
        loadingData(false);
        alertError.textContent = "No devices to unsubscribe!";
        alertError.style.display = "block";
        return;
    }

    // armar body del request al backend de uapp
    let requestBody = {
        data: [],
    };

    let Rdata = globalGetDevicesResponse.data;
    Rdata.forEach((element) => {
        requestBody.data.push({
            id: element.id,
            unsubscriptionTime: dateMethod.valueAsNumber,
        });
    });

    //hacer update de todos los devices de la lista
    let unsubResponse = unsubscribeMultipleDevices(
        username.value,
        password.value,
        group.value,
        requestBody
    );

    //operar respuesta obtenida del backend uapp
    unsubResponse.then((resp) => {
        console.log(
            "RESPUESTA DEL BACKEND UAAP A LA SOLICITUD DE DAR DE BAJA: "
        );
        globalUnsubscribeResponse = resp;
        console.log(resp);

        if (resp.hasOwnProperty("jobId")) {
            alertSuccess.style.display = "inline-block";

            //verificar que los cambios se efectuaron correctamente a todos los devices
            //se compara lo que se mandó a cambiar con la nueva información obtenida del backend
            verificarCambios(
                username.value,
                password.value,
                deviceID.value,
                group.value,
                deviceType.value,
                requestBody
            );
        }

        loadingData(false);
    });
});

//#endregion

//#region   /////////////////////////////// EJECUCIÓN
// se establece metodo al selector y fecha al input
methodSelector.selectedIndex = 0;
setCurrentTime();
//#endregion
