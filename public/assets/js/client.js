$(document).ready(() => {

    Get();
});

function Get() {

    $.ajax({
        url: '/get_client',
        method: 'get',
        success: osGet,
        error: (err) => { console.log(err) }
    });

}

function osGet(res) {

    if (res.length > 0) {

        $('#DT').empty();

        $.each(res, (i, obj) => {

            var id = obj.id;
            var user_id = obj.user_id;
            var client_number = obj.client_number;
            var client_name = obj.client_name;
            var client_email = obj.client_email;



            $('#DT').append(`<tr id="${id}" user_id="${user_id}" client_number="${client_number}" client_name="${client_name}" client_email="${client_email}">
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${id}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${user_id}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${client_number}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${client_name}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${client_email}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0 fs-4">
                        <div class="dropdown">
                            <button class="btn shadow p-1 fs-5 dropdown-toggle" type="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="ti ti-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" onclick="Edit(${id})">
                                        <i class="ti ti-pencil fs-6 text-primary me-2"></i>
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" onclick="Delete(${id})">
                                        <i class="ti ti-trash fs-6 text-danger me-2"></i>
                                        Delete
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
    $('#DT_table').DataTable();
}

function Edit(ClientID) {

    $('#EditModal').find('form').removeClass('was-validated');

    var TR = $(`tr[id="${ClientID}"]`);
    var clientname = $(TR).attr('client_name');
    var clientemail = $(TR).attr('client_email');

    $('#EditModal #ClientName').val(clientname);
    $('#EditModal #ClientEmail').val(clientemail);
    $('#EditModal #Update').attr('onclick', `Updated(${ClientID})`);
    $('#EditModal').modal('show');
}

function Updated(ClientID) {

    $('#EditModal').find('form').addClass('was-validated');
    var ClientId = ClientID;
    var ClientName =  $('#EditModal #ClientName').val();
    var ClientEmail =  $('#EditModal #ClientEmail').val();
    var Data = new Object();

    if (ClientName !== "" && ClientEmail !== "") {
        Data.id = ClientId;
        Data.Client_Name = ClientName;
        Data.Client_Email = ClientEmail;

        $.ajax({
            url: '/edit_client',
            method: 'POST',
            data: Data,
            success: osEdit,
            error: (err) => { console.log(err) }
        });
    }
}

function osEdit(res) {
    if (res) {
        $('#EditModal').modal('hide');
        Get();
        ClearFields();
    } else {
        console.error(res.error);
    }
}
function Delete(ClientID) {
    var TR = $(`tr[id="${ClientID}"]`);

    $('#DeleteModal').modal('show');

    $('#DeleteModal #confirmDelete').on('click', function () {
        $('#DeleteModal').modal('hide');
        DeleteConfirmed(ClientID);
    });
}

function DeleteConfirmed(ClientID) {
    $.ajax({
        url: '/delete_client',
        method: 'POST',
        data: { id: ClientID },
        success: osDelete,
        error: function (err) {
            console.log(err);
        }
    });
}
function osDelete(res) {
    if (res) {
        $('#DeleteModal').modal('hide');
        Get();
    } else {
        console.error(res.error);
    }
}
function ClearFields() {
    $('#EditModal #ClientName').val('');
    $('#EditModal #ClientEmail').val('');
}