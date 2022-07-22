const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);

// console.log(tiempoTranscurrido);
// console.log(hoy.toString());

function formatearFecha(fecha) {
    let dd = fecha.getDate();
    let mm = fecha.getMonth() + 1;
    let yy = fecha.getFullYear();
    let p1y = yy + 1;

    if (Number(dd) <= 9) dd = `0${dd}`;
    if (Number(mm) <= 9) mm = `0${mm}`;

    let resp = {
        today: `${yy}-${mm}-${dd}`,
        tomorrow: `${p1y}-${mm}-${dd}`,
    };
    return resp;
}

console.log(formatearFecha(hoy));
