const getDevicesList = document.querySelector("#getDevicesList");
const singleDeviceUnsubscribe = document.querySelector(
    "#singleDeviceUnsubscribe"
);
const multipleDeviceUnsubscribe = document.querySelector(
    "#multipleDeviceUnsubscribe"
);
const GetDevicesListForm = document.querySelector("#GetDevicesListForm");
const username = document.querySelector("#username");
const usernameError = document.querySelector("#usernameError");
const password = document.querySelector("#password");
const passwordError = document.querySelector("#passwordError");
const group = document.querySelector("#group");
const groupError = document.querySelector("#groupError");
const deviceType = document.querySelector("#deviceType");
const deviceTypeError = document.querySelector("#deviceTypeError");
const alertSuccess = document.querySelector(".alert-success");
const alertDanger = document.querySelector(".alert-danger");
const getDevicesButton = document.querySelector("#getDevicesButton");
const changeAllButton = document.querySelector("#changeAllButton");
const unsubscribeSuccessful = document.querySelector("#unsubscribeSuccessful");
const unsubscribeError = document.querySelector("#unsubscribeError");
const dateMethod = document.querySelector("#dateMethod");
const devicesTable = document.querySelector("#devicesTable");
const tableBody = document.querySelector("#devicesTableBody");
const templateFila = document.querySelector("#templateFila").content;
const item = document.querySelector(".item");
const ErrorRequest = document.querySelector("#ErrorRequest");
const getDevicesOptionButton = document.querySelector(
    "#getDevicesOptionButton"
);
const singleDeviceOptionButton = document.querySelector(
    "#singleDeviceOptionButton"
);
const multipleDevicesOptionButton = document.querySelector(
    "#multipleDevicesOptionButton"
);
const loading = document.querySelector("#loading");
const methodSelector = document.querySelector("#methodSelector");
methodSelector.selectedIndex = 0;

const regexpUserName = /^[A-Za-z0-9\s]+$/;
const regexpPassword = /^[A-Za-z0-9\s]+$/;
const regexpGroup = /^[A-Za-z0-9\s]+$/;
const regexpDeviceType = /^[A-Za-z0-9\s]+$/;

//data recibida desde sigfox
let getDevicesResponse = {};
let unsubscribeResponse = {};

//funcion para consultar al backend los devices en un determiando device type
async function getDevices(
    formusername,
    formpassword,
    formgroup,
    formdeviceType
) {
    const url = "http://localhost:3000/devices"; //para consultar devices en el device type especificado
    const options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            user: formusername,
            password: formpassword,
            groupid: formgroup,
            devicetypeid: formdeviceType,
            accept: "application/json",
            "content-Type": "application/json",
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
        console.log("ERROR OBTENIENDO DEVICES:");
        console.log(error);
        loadingData(false);
    }
}

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
const pintarData = (response, color = "black") => {
    if (response.data.length > 0) {
        console.log("pintando data recibida");
        devicesTable.style.display = "block";
        const fragment = document.createDocumentFragment();

        //limpiar el body de la tabla
        while (tableBody.childElementCount > 1) {
            tableBody.removeChild(tableBody.lastChild);
        }

        response.data.forEach((item) => {
            const clone = templateFila.cloneNode(true);
            clone.querySelector(".idItem").textContent = item.id;
            clone.querySelector(".dtItem").textContent = item.deviceType.id;
            clone.querySelector(".grItem").textContent = item.group.id;
            clone.querySelector(".tvItem").textContent = formatoFecha(
                new Date(item.token.end)
            ).today;

            clone.querySelector(".idItem").style.color = color;
            clone.querySelector(".dtItem").style.color = color;
            clone.querySelector(".grItem").style.color = color;
            clone.querySelector(".tvItem").style.color = color;
            fragment.appendChild(clone);
        });
        tableBody.appendChild(fragment);
    } else {
        unsubscribeError.textContent = "No devices to unsubscribe!";
        unsubscribeError.style.display = "block";
    }
};

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

//cuando se hace click en el boton Get Devices
getDevicesButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    usernameError.style.display = "none";
    passwordError.style.display = "none";
    groupError.style.display = "none";
    deviceTypeError.style.display = "none";
    changeAllButton.style.display = "none";
    dateMethod.style.display = "none";
    unsubscribeError.style.display = "none";
    unsubscribeSuccessful.style.display = "none";
    devicesTable.style.display = "none";
    ErrorRequest.style.display = "none";

    getDevicesResponse = {};

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
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    dateMethod.style.display = "inline-block";
    const fechas = formatoFecha(hoy);
    dateMethod.value = fechas.plusOneYear;
    dateMethod.min = fechas.today;

    const getdevicesResponse = getDevices(
        username.value,
        password.value,
        group.value,
        deviceType.value
    );

    getdevicesResponse.then((dataJson) => {
        console.log("DATA RECIBIDA DESDE BACKEND UAAP: ");
        if (dataJson) {
            getDevicesResponse = dataJson;
            console.log(dataJson);
            pintarData(dataJson);
            if (dataJson.data.length != 0) {
                changeAllButton.style.display = "inline-block";
                dateMethod.style.display = "inline-block";
            } else {
                changeAllButton.style.display = "none";
                dateMethod.style.display = "none";
            }
        } else {
            getDevicesResponse = {};
            ErrorRequest.style.display = "inline-block";
        }
        loadingData(false);
    });
});

//cuando se hace click en el boton changeAllButton
changeAllButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    unsubscribeError.style.display = "none";
    unsubscribeSuccessful.style.display = "none";

    //crear request post al backend uapp para cambiar token validity a multiples devices
    console.log("RUTINA PARA CAMBIAR TOKEN VALIDITY A MULTIPLES DEVICES");

    //si no hay devices para cambiar token validity
    if (!getDevicesResponse.hasOwnProperty("data")) {
        loadingData(false);
        unsubscribeError.textContent = "No devices to unsubscribe!";
        unsubscribeError.style.display = "block";
        return;
    }

    // body del request al backend de uapp
    let requestBody = {
        data: [],
    };

    //se llena el body del request
    let Rdata = getDevicesResponse.data;
    Rdata.forEach((element) => {
        requestBody.data[Rdata.indexOf(element)] = {
            id: element.id,
            unsubscriptionTime: dateMethod.valueAsNumber,
        };
    });

    let unsubResponse = unsubscribeMultipleDevices(
        username.value,
        password.value,
        group.value,
        requestBody
    );

    //LO QUE SE HACE CON LA RESPUESTA OBTENIDA DESDE EL BACKEND DE UAPP
    unsubResponse.then((resp) => {
        console.log(
            "RESPUESTA DEL BACKEND UAAP A LA SOLICITUD DE DAR DE BAJA: "
        );
        unsubscribeResponse = resp;
        console.log(resp);

        if (resp.hasOwnProperty("jobId")) {
            unsubscribeSuccessful.style.display = "inline-block";
            pintarData(getDevicesResponse, "green");
        }

        loadingData(false);
    });
});
