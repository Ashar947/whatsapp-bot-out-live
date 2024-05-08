$(document).ready(() => {

    Get();
    GetRole();

});

function Get() {

    $.ajax({
        url: '/get_user',
        method: 'get',
        success: osGet,
        error: (err) => {
            console.log(err)
        }
    });

}

function osGet(res) {

    if (res.length > 0) {

        $('#DT').empty();

        $.each(res, (i, obj) => {

            var id = obj.id;
            var role_id = obj.role_id;
            var role_name = obj.RoleName;
            var name = obj.name;
            var email = obj.email;
            var status = '';

            if (obj.status === 1) {
                status = `<div class="d-flex align-items-center gap-2 justify-content-center">
                    <span class="badge bg-success rounded-3 fw-semibold">
                        Active
                    </span>
                </div>`;
            } else {
                status = `<div class="d-flex align-items-center justify-content-center gap-2">
                    <span class="badge bg-danger rounded-3 fw-semibold">
                        Deactive
                    </span>
                </div>`;
            }

            $('#DT').append(`<tr id="${id}" role_id="${role_id}" name="${name}" email="${email}" status="${obj.status}">
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${id}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${role_name}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${name}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${email}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${status}</h6>
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
                                    <a class="dropdown-item" onclick="EditModal(${id})">
                                        <i class="ti ti-pencil fs-6 text-primary me-2"></i>
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" onclick="DeleteModal(${id})">
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

function GetRole() {

    $.ajax({
        url: '/get_role',
        method: 'get',
        success: osGetRole,
        error: (err) => {
            console.log(err)
        }
    });

}

function osGetRole(res) {

    $('#AddModal #Role, #EditModal #Role').empty();
    $('#AddModal #Role, #EditModal #Role').append('<option value="">Please Select</option>');

    if (res.length > 0) {

        $.each(res, (i, obj) => {

            var RoleID = obj.id;
            var RoleName = obj.name;
            $('#AddModal #Role, #EditModal #Role').append(`<option value="${RoleID}">${RoleName}</option>`);

        });

    } else {
        console.error('Role Not Found');
    }

}

function AddModal() {
    $('#AddModal').find('form').removeClass('was-validated')
    $('#AddModal').modal('show');
}

function Add(el) {

    var form = $(el).parents().eq(1);
    $(form).addClass('was-validated');
    var RoleID = $('#AddModal #Role').val();
    var Name = $('#AddModal #Name').val().trim();
    var Email = $('#AddModal #Email').val().trim();
    var Password = $('#AddModal #Password').val().trim();
    var Status = $('#AddModal #status').is(':checked') ? '1' : '0';
    var Data = new Object();

    if (RoleID !== "" && Name !== "" && Email !== "" && Password !== "") {

        Data.RoleID = RoleID;
        Data.Name = Name;
        Data.Email = Email;
        Data.Password = Password;
        Data.Status = Status;

        $.ajax({
            url: '/add_user',
            method: 'POST',
            data: Data,
            success: osAdd,
            error: (err) => {
                console.log(err)
            }
        });

    }

}

function osAdd(res) {

    if (res) {
        $('#AddModal').modal('hide');
        ClearFields();
        Get();
    } else {
        console.error(res.error);
    }
}

function EditModal(UserID) {

    $('#EditModal').find('form').removeClass('was-validated');

    var TR = $(`tr[id="${UserID}"]`);
    var role_id = $(TR).attr('role_id');
    var name = $(TR).attr('name');
    var email = $(TR).attr('email');
    var status = $(TR).attr('status') === '1' ? true : false;

    $('#EditModal #Role').val(role_id).trigger('change');
    $('#EditModal #Name').val(name);
    $('#EditModal #Email').val(email);
    $('#EditModal #status').prop('checked', status);
    $('#EditModal #Update').attr('onclick', `Updated(${UserID})`);
    $('#EditModal').modal('show');
}

function Updated(UserID) {

    $('#EditModal').find('form').addClass('was-validated');

    var UserId = UserID;
    var role_id = $('#EditModal #Role').val();
    var name = $('#EditModal #Name').val();
    var email = $('#EditModal #Email').val();
    var password = $('#EditModal #Password').val();
    var status = $('#EditModal #status').is(":checked") ? '1' : '0';
    var Data = new Object();

    if (role_id !== "" && name !== "" && email !== "" && password !== "") {

        Data.id = UserId;
        Data.RoleID = role_id;
        Data.Name = name;
        Data.Email = email;
        Data.Password = password;
        Data.Status = status;

        $.ajax({
            url: '/edit_user',
            method: 'POST',
            data: Data,
            success: osEdit,
            error: (err) => {
                console.log(err)
            }
        });
    }
}

function osEdit(res) {
    if (res) {
        $('#EditModal').modal('hide');
        ClearFields();
        Get();
    } else {
        console.error(res.error);
    }
}

function DeleteModal(UserID) {
    var TR = $(`tr[id="${UserID}"]`);

    $('#DeleteModal').modal('show');

    $('#DeleteModal #confirmDelete').on('click', function () {
        $('#DeleteModal').modal('hide');
        DeleteConfirmed(UserID);
    });
}

function DeleteConfirmed(UserID) {
    $.ajax({
        url: '/delete_user',
        method: 'POST',
        data: {
            UserId: UserID
        },
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
    $('#AddModal #Role').val('');
    $('#AddModal #Name').val('');
    $('#AddModal #Email').val('');
    $('#AddModal #Password').val('');
    $('#Addmodal #status').prop('checked', false);
    $('#EditModal #Password').val('');
}