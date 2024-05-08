const { Client, LocalAuth  } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    authStrategy: new LocalAuth({
        clientId: 'Bot'     
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
    },
});


// Start your client
client.initialize();


module.exports = client;