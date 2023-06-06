require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Enter the Page Access Token from the previous step
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
// Accept JSON POST body
app.use(bodyParser.json());
// GET /webhook
app.get('/webhook', (req, res) => {
    // Facebook sends a GET request
    // To verify that the webhook is set up
    // properly, by sending a special challenge that
    // we need to echo back if the "verify_token" is as specified
    if (req.query['hub.verify_token'] === process.env.HUB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
        return;
    }
})

// POST /webhook
app.post('/webhook', async (req, res) => {
    // Facebook will be sending an object called "entry" for "leadgen" webhook event
    if (!req.body.entry) {
        return res.status(500).send({ error: 'Invalid POST data received' });
    }

    // Travere entries & changes and process lead IDs
    for (const entry of req.body.entry) {
        for (const change of entry.changes) {
            // Process new lead (leadgen_id)
           // await processNewLead(change.value.leadgen_id);
            await getToken(change.value.leadgen_id);
        }
    }

    // Success
    res.send({ success: true });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
//get tokenZoho
async function getToken(idLead){
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    try {
        const responseTkn = await axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${REFRESH_TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token`);
        token = responseTkn.data.access_token;
        console.log(token);
        console.log(idLead);
        await processNewLead(idLead, token);
    } catch (error) {
        console.log(error);
    }
}
//cargar lead en zoho
async function postZoho(data, tkn){
    var payLoad = new Object();
    payLoad.data = new Object();
    payLoad.data.Fecha_ingreso_dato = new Date().toLocaleDateString('es-AR');
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
          'Authorization': `Zoho-oauthtoken ${tkn}`,
          'Content-Type': 'application/json'
      },
      data : payLoad
    };
      
     await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
}
// Process incoming leads
async function processNewLead(leadId, tknZoho) {
    let response;
    var obj = new Object();
     try {
        // Get lead details by lead ID from Facebook API
        response = await axios.get(`https://graph.facebook.com/v9.0/${leadId}/?access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`);
        console.log(response);
    }
    catch (err) {
        // Log errors
        return console.warn(`An invalid response was received from the Facebook API:`, err.response.data ? JSON.stringify(err.response.data) : err.response);
    }
    // Ensure valid API response returned
    if (!response.data || (response.data && (response.data.error || !response.data.field_data))) {
        return console.warn(`An invalid response was received from the Facebook API: ${response}`);
    }

    // Proceso datos
    response.data.field_data.forEach(function(element) {obj[element.name] = element.values[0];});
    obj.phone_number =parseInt(obj.phone_number.substring(obj.phone_number.length - 10));
    console.log(obj);
   await postZoho(obj, tknZoho);
    }


function extractLast10Digits(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    return undefined;
  }

  // Eliminar cualquier carácter que no sea un dígito del número de teléfono
  const digitsOnly = phoneNumber.replace(/[^\d]/g, '');

  // Si el número de teléfono tiene menos de 10 dígitos, devolver undefined
  if (digitsOnly.length < 10) {
    return undefined;
  }

  // Devolver los últimos 10 dígitos del número de teléfono
  return parseInt(digitsOnly.substr(-10));
}

// Usar la función extractLast10Digits para extraer los últimos 10 dígitos del número de teléfono


