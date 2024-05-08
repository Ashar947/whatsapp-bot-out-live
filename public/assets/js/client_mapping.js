$(document).ready(() => {

    GetClients();
    GetUsersByAdmin();
});


function GetClients() {

    $.ajax({
        url: '/AllClientsByUserID',
        method: 'POST',
        data: {
            UserID: '1'
        },
        success: osGetClients,
        error: (err) => {
            console.error(err)
        }
    });

}

function osGetClients(res) {
    
    $('#DT').empty();
    if (res.length > 0) {


        $.each(res, (i, obj) => {

            i++;
            var id = obj.id;
            var client_number = obj.client_number.split('@')[0];
            var user = 'Admin';
            $('#DT').append(`<tr id="${id}">
                <td class="border-bottom-0">
                    <h6>${id}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6>${client_number}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6>${user}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6>
                        <div class="dropdown">
                            <button class="btn shadow p-1 fs-5 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ti ti-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" onclick="EditModal(${id})">
                                        <i class="ti ti-pencil fs-6 text-primary me-2"></i>
                                        Edit
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </h6>
                </td>
            </tr>`);

        });

    } else {
        console.error(res.error);
    }

}

function GetUsersByAdmin() {

    $.ajax({
        url: '/Get_Users_By_UserID',
        method: 'GET',
        data: { UserID: '1' },
        success: osGetUsersByAdmin,
        error: (err) => { console.error(err) }
    });

}

function osGetUsersByAdmin(res) {

    if (res.length > 0) {

        $('#Users').empty().append('<option value="">-- Please Select --</option>');

        $.each(res, (i, obj) => {

            var UserID = obj.id;
            var UserName = obj.name;

            $('#Users').append(`<option value="${UserID}">${UserName}</option>`);
        });

    } else {
        console.error(res.error);
    }

}

function EditModal(id) {
    $('#Users').removeClass('border-danger');
    $('#Assign').attr('onclick', `Assign(${id})`);
    $('#EditModal').modal('show');
}

function Assign(id) {

    var AssignID = $('#Users').val();
    var ClientID = id;
    var data = new Object();

    if (AssignID !== '') {

        data.UserID = AssignID;
        data.ClientID = ClientID;
        
        $.ajax({
            url: '/UpdateClientUserID',
            method: 'POST',
            data: data,
            success: osAssign,
            error: (err) => { console.error(err) }
        });

    }

    if (AssignID === '') {
        $('#Users').addClass('border-danger');
        $('#Users').siblings('.errorMsg').removeClass('d-none');
    }

}

function osAssign(res) {

    if (res === true) {
        $('#EditModal').modal('hide');
        GetClients();
    } else {
        console.error(res.error);
    }
}