var axios = require('axios');

const tokenZoho = async () => {
    try {
       
        const response = await axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.3bdd84b7afea88930d8ec9e7cd21f179.d9d7f50995e0e04478351430e9db5ce4&client_id=1000.0TAV98W17RZK77TNPMHQK1O2U804QD&client_secret=b4b1db786375ad85c09593769774186cd09082eaff&grant_type=refresh_token`);
        token = response.data.access_token;
        //test(token);
        //console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
}

function test(codigo, data) {
console.log('el codigo es: ' + codigo + ' y el data es: ' + data);
}

async function getToken(idLead){
    try {
        const response = await axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.3bdd84b7afea88930d8ec9e7cd21f179.d9d7f50995e0e04478351430e9db5ce4&client_id=1000.0TAV98W17RZK77TNPMHQK1O2U804QD&client_secret=b4b1db786375ad85c09593769774186cd09082eaff&grant_type=refresh_token`);
        token = response.data.access_token;
        //test(token);
       
    } catch (error) {
        console.log(error);
    }
}

getToken(12326741247);
