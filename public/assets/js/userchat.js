$(document).ready(() => {

    $('.chat-box-inner-part').hide();

    var UserID = $('#UserID').val();

    if (UserID === '1' || UserID === '2') {
        $('#SelectDiv').removeClass('d-none');
    }

    $(document.body).on('change', '#UserSelect', GetClientByUserID);

    Get_User(UserID);

    var socket = io();

    socket.on('clients', (res) => {
        SocketAppend(res);
    });

    socket.on('all_clients', (res) => {
        clientAppend(res);
    });

    AllClientsByUserID();
    $(document.body).on('keyup', '#message-type-box', SendMsg)
});

function AllClientsByUserID() {

    var UserID = $('#UserID').val();

    $.ajax({
        url: '/AllClientsByUserID',
        method: 'POST',
        data: {
            UserID: UserID
        },
        success: osAllClientsByUserID,
        error: (err) => {
            console.error(err)
        }
    });
}

function osAllClientsByUserID(res) {

    $('#AllClients').empty();
    if(res.length > 0){


        $.each(res, (i, obj) => {

            var ClientID = obj.id;
            var client_number = obj.client_number;
            var ClientNo = obj.client_number.split('@')[0];
            var NewClientNo = '0' + ClientNo.slice(2, ClientNo.length);
            var ClientName = obj.client_name;
            var ClientEmail = obj.client_email;
    
            $('#AllClients').append(`<li>
                <a onclick="GetChatsByClientID(${ClientID})" class="Client px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user bg-light-subtle" id="chat_user_${ClientID}" data-user-id="${ClientID}">
                    <div class="d-flex align-items-center">
                        <div class="ms-3 d-inline-block w-100">
                            <h6 class="mb-1 fw-semibold chat-title" clientNo="${client_number}" clientID="${ClientID}" data-username="James Anderson">
                               ${ClientName === "" ? NewClientNo : ClientName}
                            </h6>
                        </div>
                    </div>
                    <p class="fs-2 mb-0 text-muted">15 mins</p>
                </a>
            </li>`);
    
        });

    }else{
        console.error(res.error);
    }

}

function GetChatsByClientID(ClientID) {

    $.ajax({
        url: '/GetChatsByClientID',
        method: 'POST',
        data: {
            ClientID: ClientID
        },
        success: osGetChatsByClientID,
        error: (err) => {
            console.error(err)
        }
    });

}

function osGetChatsByClientID(res) {

    if (res.length > 0) {

        var clientID = res[0].client_id;
        var client_number = $(`#chat_user_${clientID}`).find('.chat-title').attr('clientno');
        var ClientName = $(`#chat_user_${clientID}`).find('.chat-title').text().trim();

        $('#ClientName').attr({
            clientID: clientID,
            client_number: client_number
        }).text(ClientName);
        
        $('#chatlist').empty();

        $.each(res, (i, obj) => {

            var id = obj.id;
            var ClientID = obj.client_id;
            var userType = obj.usertype;
            var message = obj.message.replace(/\?\n\n\?/g, "<br><br>");
            message = message.replace(/\?\n/g, "<br>");
            message = message.replace(/\n/g, "<br>");

            if (userType === '1') {
                $('#chatlist').append(`<div id="${id}" class="hstack gap-3 align-items-start mb-7 justify-content-start">
                    <div>
                        <div class="p-2 text-bg-light rounded-1 d-inline-block text-dark fs-3">
                        ${message}
                        </div>
                    </div>
                </div>`);
            } else {
                $('#chatlist').append(`<div id="${id}" class="hstack gap-3 align-items-start mb-7 justify-content-end">
                <div class="text-end">
                    <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
                        ${message}
                    </div>
                </div>
            </div>`);
            }
        });

        $('.chat-box-inner-part').show();
        $(".simplebar-content-wrapper").stop().animate({ scrollTop: $(".simplebar-content-wrapper")[0].scrollHeight}, 1000);
    } else {
        $('.chat-box-inner-part').hide();
        console.error(res.error);
    }
}

function SendMsg(el) {

    if (el.key === 'Enter') {

        var ClientID = $('#ClientName').attr('clientid');
        var ClientNo = $('#ClientName').attr('client_number');
        var message = $('#message-type-box').val().trim();
        var data = new Object();

        if (message !== '') {
            data.ClientID = ClientID;
            data.ClientNo = ClientNo;
            data.message = message;

            $.ajax({
                url: '/SendMsg',
                method: 'POST',
                data: data,
                success: osSendMsg,
                error: (err) => {
                    console.error(err)
                }
            });
        }

    }

}


function osSendMsg(res, ClientID) {

    if (res.length > 0) {
        $('#message-type-box').val('');
        SocketAppend(res);
    } else {
        console.error(res);
    }
}

function Get_User(UserID) {

    if (UserID === '1' || UserID === '2') {

        $.ajax({
            url: '/Get_Users_By_UserID',
            method: 'get',
            data: { UserID: UserID },
            success: osGet_User,
            error: (err) => { console.error(err) }
        });

    }

}

function osGet_User(res) {

    if (res.length > 0) {

        $('#UserSelect').empty();
        $('#UserSelect').append('<option value=""> -- Please Select -- </option>');

        $.each(res, (i, obj) => {

            var UserID = obj.id;
            var name = obj.name;

            $('#UserSelect').append(`<option value="${UserID}">${name}</option>`);
        });

    } else {
        console.error(res.error);
    }
}

function GetClientByUserID(el) {

    var self = el.target;
    var UserID = $(self).val();

    if(UserID !== ''){

        $.ajax({
            url: '/AllClientsByUserID',
            method: 'POST',
            data: { UserID: UserID },
            success: osAllClientsByUserID,
            error: (err) => {console.error(err) }
        });

    }else{
        AllClientsByUserID();
    }
    
}


function SocketAppend(res) {

    var ClientID = res[0].toString();
    var message  = res[1];
    var userType = res[2];

    message = message.replace(/\?\n\n\?/g, "<br><br>");
    message = message.replace(/\?\n/g, "<br>");
    message = message.replace(/\n/g, "<br>");

    if ($(`#ClientName[clientid="${ClientID}"]`).length > 0) {

        if (userType === '1') {

            $('#chatlist').append(`<div class="hstack gap-3 align-items-start mb-7 justify-content-start">
                <div>
                    <div class="p-2 text-bg-light rounded-1 d-inline-block text-dark fs-3">
                    ${message}
                    </div>
                </div>
            </div>`);

        } else {
            $('#chatlist').append(`<div class="hstack gap-3 align-items-start mb-7 justify-content-end">
                <div class="text-end">
                    <div class="p-2 bg-info-subtle text-dark rounded-1 d-inline-block fs-3">
                        ${message}
                    </div>
                </div>
            </div>`);
        }
    }

    $(".simplebar-content-wrapper").stop().animate({ scrollTop: $(".simplebar-content-wrapper")[0].scrollHeight}, 1000);

}

function clientAppend(res){
    
    if(res.length > 0){

        $.each(res, (i, obj) => {

            if($('#UserID').val() == obj.user_id){

                var ClientID = obj.id;
            
                if($(`#chat_user_${ClientID}`).length === 0){
                    var client_number = obj.client_number;
                    var ClientNo = obj.client_number.split('@')[0];
                    var NewClientNo = '0' + ClientNo.slice(2, ClientNo.length);
                    var ClientName = obj.client_name;
                    var ClientEmail = obj.client_email;
            
                    $('#AllClients').append(`<li>
                        <a onclick="GetChatsByClientID(${ClientID})" class="Client px-4 py-3 bg-hover-light-black d-flex align-items-start justify-content-between chat-user bg-light-subtle" id="chat_user_${ClientID}" data-user-id="${ClientID}">
                            <div class="d-flex align-items-center">
                                <div class="ms-3 d-inline-block w-100">
                                    <h6 class="mb-1 fw-semibold chat-title" clientNo="${client_number}" clientID="${ClientID}" data-username="James Anderson">
                                       ${ClientName === "" ? NewClientNo : ClientName}
                                    </h6>
                                </div>
                            </div>
                            <p class="fs-2 mb-0 text-muted">15 mins</p>
                        </a>
                    </li>`);
                }
            }
            
        });

    }

}