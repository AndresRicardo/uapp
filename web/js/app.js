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
const unsubscribeButton = document.querySelector("#unsubscribeButton");
const end = document.querySelector("#end");
const unsubscribeSuccessful = document.querySelector("#unsubscribeSuccessful");
const unsubscribeError = document.querySelector("#unsubscribeError");
const devicesTable = document.querySelector("#devicesTable");
const tableBody = document.querySelector("#devicesTableBody");
const templateFila = document.querySelector("#templateFila").content;

const loading = document.querySelector("#loading");

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
    let dd = fecha.getDate();
    let mm = fecha.getMonth() + 1;
    let yy = fecha.getFullYear().toString();

    if (Number(dd) <= 9) dd = `0${dd}`;
    if (Number(mm) <= 9) mm = `0${mm}`;

    return `${yy}-${mm}-${dd}`;
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
const pintarData = (response) => {
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
            fragment.appendChild(clone);
        });
        tableBody.appendChild(fragment);
    } else {
        unsubscribeError.textContent = "No devices to unsubscribe!";
        unsubscribeError.style.display = "block";
    }
};

//cuando se hace click en el boton Get Devices
getDevicesButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    usernameError.style.display = "none";
    passwordError.style.display = "none";
    groupError.style.display = "none";
    deviceTypeError.style.display = "none";
    unsubscribeButton.style.display = "none";
    end.style.display = "none";
    unsubscribeError.style.display = "none";
    unsubscribeSuccessful.style.display = "none";

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
    if (error) return;

    //se pone la fecha actual al input date
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    end.style.display = "inline-block";
    end.value = formatoFecha(hoy);
    end.min = formatoFecha(hoy);
    console.log(end.min);

    const getdevicesResponse = getDevices(
        username.value,
        password.value,
        group.value,
        deviceType.value
    );

    getdevicesResponse.then((dataJson) => {
        console.log("DATA RECIBIDA DESDE BACKEND UAAP: ");
        getDevicesResponse = dataJson;
        console.log(dataJson);
        pintarData(dataJson);
        if (dataJson.data.length != 0) {
            unsubscribeButton.style.display = "inline-block";
            end.style.display = "inline-block";
        } else {
            unsubscribeButton.style.display = "none";
            end.style.display = "none";
        }
        loadingData(false);
    });
});

//cuando se hace click en el boton Unsubscribe All
unsubscribeButton.addEventListener("click", (e) => {
    e.preventDefault();
    loadingData(true);
    unsubscribeError.style.display = "none";
    unsubscribeSuccessful.style.display = "none";

    //crear request post al backend uapp para dar de baja multiples devices
    console.log("RUTINA PARA DAR DE BAJA MULTIPLES DEVICES");

    //si no hay devices para dar de baja
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
            unsubscriptionTime: end.valueAsNumber,
        };
    });

    let unsubResponse = unsubscribeMultipleDevices(
        username.value,
        password.value,
        group.value,
        requestBody
    );

    unsubResponse.then((resp) => {
        console.log("DATA RECIBIDA DESDE BACKEND UAAP: ");
        unsubscribeResponse = resp;
        console.log(resp);

        if (resp.ok) unsubscribeSuccessful.style.display = "inline-block";

        loadingData(false);
    });
});
