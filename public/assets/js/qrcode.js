$(document).ready(() => {

    var socket = io();

    socket.on('qrCode', (res) => {
        console.log('socket qrCode res =>', res)

        if ($('#qrCode').children('img').length > 0) {
            $('#qrCode').empty().html('<div id="qrcodeCanvas"><canvas width="400" height="400"></canvas></div>');
            $('#stopBot').remove();
        }
        $('.loader').hide();
        $('h1').text('QR CODE');
        $('h2').text('Scan This Qr Code to Start the Whatsapp bot.');
        $('#qrcodeCanvas').empty();
        $('#qrcodeCanvas').qrcode({
            width: 400,
            height: 400,
            text: res
        });
    });

    socket.on('botReady', (res) => {
        console.log('socket botReady res =>', res)
        if (res === true) {
            $('.loader').hide();
            $('h1').text('Bot Is On..');
            $('h2').text('Whatsapp Bot Is Working Right Now.');
            $('#qrCode').empty().html('<img src="../assets/images/bot.png" alt="bot is working">');
            if ($('#stopBot').length === 0) {
                $('.firstCol').append('<button class="btn btn-danger mt-5 d-flex" id="stopBot">Stop Bot</button>');
            }
        }
    });

    $(document.body).on('click', '#stopBot', DeleteSession);
});

function DeleteSession(el) {
    console.log('function DeleteSession res =>', el)


    $(el.currentTarget).html('<span class="Btnloader loader d-inline-block"></span>');

    $.ajax({
        url: "/stop_bot",
        method: "GET",
        success: (res) => {
            console.log(res)
        },
        error: (err) => {
            console.log(err)
        }
    });

}