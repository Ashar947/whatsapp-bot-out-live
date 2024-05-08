$(document).ready(() => {

    Get();
});

function Get() {

    $.ajax({
        url: '/get_role',
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
            var role_name = obj.name;


            $('#DT').append(`<tr id="${id}" role="${role_name}">
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${id}</h6>
                </td>
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${role_name}</h6>
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

function AddModal() {
    $('#AddModal').find('form').removeClass('was-validated')
    $('#AddModal').modal('show');
}

function Add(el) {

    var form = $(el).parents().eq(1);
    $(form).addClass('was-validated');
    var RoleName = $('#AddModal #RoleName').val().trim();
    var Data = new Object();

    if (RoleName !== "") {

        Data.RoleName = RoleName;

        $.ajax({
            url: '/add_role',
            method: 'POST',
            data: Data,
            success: osAdd,
            error: (err) => { console.log(err) }
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

function Edit(RoleID) {

    $('#EditModal').find('form').removeClass('was-validated');

    var TR = $(`tr[id="${RoleID}"]`);
    var rolename = $(TR).attr('role');

    $('#EditModal #RoleName').val(rolename);
    $('#EditModal #Update').attr('onclick', `Updated(${RoleID})`);
    $('#EditModal').modal('show');
}

function Updated(RoleID) {

    $('#EditModal').find('form').addClass('was-validated');
    var RoleId = RoleID;
    var RoleName = $('#EditModal #RoleName').val();
    var Data = new Object();

    if (RoleName !== "") {
        Data.RoleId = RoleId;
        Data.RoleName = RoleName;

        $.ajax({
            url: '/edit_role',
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
        ClearFields();
        Get();
    } else {
        console.error(res.error);
    }
}
function Delete(RoleID) {
    var TR = $(`tr[id="${RoleID}"]`);

    $('#DeleteModal').modal('show');

    $('#DeleteModal #confirmDelete').on('click', function () {
        $('#DeleteModal').modal('hide');
        DeleteConfirmed(RoleID);
    });
}

function DeleteConfirmed(RoleID) {
    $.ajax({
        url: '/delete_role',
        method: 'POST',
        data: { RoleId: RoleID },
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
    $('#AddModal #RoleName').val('');
}