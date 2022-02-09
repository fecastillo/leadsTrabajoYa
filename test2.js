const axios = require('axios');


var ZOHO_TOKEN = '1000.c08c294234b9e627f1da5e1f266a0fa1.b05c22d2c19750b0de5b5b36e7bd3022';

var test = {
    full_name: 'Maia Alisandro',
    city: 'buenos aires',
    phone_number: 1126877029
  };

async function postZoho(data, tkn){
    var payLoad = new Object();
    payLoad.data = new Object();
    payLoad.data.Fecha_ingreso_dato = new Date().toLocaleDateString();
    payLoad.data.Origen_dato = "Facebook";
    payLoad.data.Nombre = data.full_name;
    payLoad.data.Localidad = data.city;
    payLoad.data.Telefono = data.phone_number;
    payLoad.data.Estado = "Sin contactar";
    payLoad.data.Asistio_entrevista = "Pendiente";
    var config = {
        method: 'post',
        url: 'https://creator.zoho.com/api/v2/autocredito/recursos-humanos-autocredito/form/Datos_a_llamar',
        headers: { 
          'Authorization': `Zoho-oauthtoken ${ZOHO_TOKEN}`,
          'Content-Type': 'application/json'
      },
      data : payLoad
    };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
}
postZoho(test);



//     // Get lead details from Facebook API
//     const {
//         field_data: {
//             nombre: { value: nombre },
//             localidad: { value: localidad },
//             telefono: { value: telefono },
//             estado: { value: estado },
//             asistio_entrevista: { value: asistio_entrevista },
//             fecha_ingreso_dato: { value: fecha_ingreso_dato }
//         }
//     } = response.data;
// 
//     // Create lead object
//     const lead = {
//         nombre,
//         localidad,
//         telefono,
//         estado,
//         asistio_entrevista,
//         fecha_ingreso_dato
//     };
// 
//     // Log lead details
//     console.log(`Lead Details: ${JSON.stringify(lead)}`);
// 
//     // Create lead in Zoho CRM
//     try {
//         // Create lead in CRM
//         const response = await axios.post(`https://crm.zoho.com/crm/v2/Leads?authtoken=${tknZoho}&scope=crmapi&newFormat=1`, lead);
//     }
//     catch (err) {
//         // Log errors
//         return console.warn(`An invalid response was received from the Zoho API:`, err.response.data ? JSON.stringify(err.response.data) : err.response);
//     }
// 
//     // Ensure valid API response returned
//     if (!response.data || (response.data && (response.data.error || !response.data.Leads))) {
//         return console.warn(`An invalid response was received from the Zoho API: ${response}`);
//     }
// 
//     // Log success
//     console.log(`Lead successfully created in Zoho CRM`);
// }