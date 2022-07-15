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
let sigfoxResponse = {};

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
        console.log("ERROR HACIENDO ALGO:");
        console.log(error);
    }
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
    unsubscribeError.style.display = "none";

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

    const response = getDevices(
        username.value,
        password.value,
        group.value,
        deviceType.value
    );

    response.then((dataJson) => {
        console.log("DATA RECIBIDA DESDE BACKEND UAAP: ");
        sigfoxResponse = dataJson;
        console.log(dataJson);
        pintarData(dataJson);
        if (dataJson.data.length != 0)
            unsubscribeButton.style.display = "inline-block";
        else unsubscribeButton.style.display = "none";
        loadingData(false);
    });
});

//cuando se hace click en el boton Unsubscribe All
unsubscribeButton.addEventListener("click", (e) => {
    e.preventDefault();
    unsubscribeError.style.display = "none";

    if (!sigfoxResponse.hasOwnProperty("data")) {
        unsubscribeError.textContent = "No devices to unsubscribe!";
        unsubscribeError.style.display = "block";
        return;
    }

    //crear request put al backend uapp para desuscribir
    console.log("rutina para desuscribir");

    // // armar json para devolver al frontend
    JsonToUns = {
        data: [],
    };

    Rdata = sigfoxResponse.data;
    Rdata.forEach((element) => {
        JsonToUns.data[Rdata.indexOf(element)] = {
            id: element.id,
            unsubscriptionTime: "12345",
        };
    });
});
