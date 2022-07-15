resp = {
    data: [
        {
            id: "4CFA57",
            name: "Loka servientrega 2",
            satelliteCapable: false,
            repeater: false,
            messageModulo: 4096,
            lastCom: 1644501901000,
            state: 0,
            comState: 5,
            pac: "21019B4F7E498C51",
            location: [Object],
            deviceType: [Object],
            group: [Object],
            lqi: 4,
            activationTime: 1644428414462,
            token: [Object],
            contract: [Object],
            creationTime: 1631965414175,
            modemCertificate: [Object],
            prototype: true,
            automaticRenewal: false,
            automaticRenewalStatus: 1,
            createdBy: "584f2b2a3c878972c8d7b5e4",
            lastEditionTime: 1631965414015,
            lastEditedBy: "584f2b2a3c878972c8d7b5e4",
            activable: true,
        },
        {
            id: "4CFAE3",
            name: "Loka prueba_Coordinadora",
            satelliteCapable: false,
            repeater: false,
            messageModulo: 4096,
            lastCom: 1651160599000,
            state: 0,
            comState: 5,
            pac: "86C956153C511B0D",
            location: [Object],
            deviceType: [Object],
            group: [Object],
            lqi: 4,
            activationTime: 1643732726510,
            token: [Object],
            contract: [Object],
            creationTime: 1643729994830,
            modemCertificate: [Object],
            prototype: true,
            automaticRenewal: true,
            automaticRenewalStatus: 1,
            createdBy: "61830433417581079da7f4d7",
            lastEditionTime: 1643729994678,
            lastEditedBy: "61830433417581079da7f4d7",
            activable: true,
        },
    ],
    paging: {},
};

toFront = {
    data: [],
};

resp.data.forEach((element) => {
    toFront.data[resp.data.indexOf(element)] = {
        id: element.id,
        unsubscriptionTime: "undefined",
    };
});

console.log(toFront);
