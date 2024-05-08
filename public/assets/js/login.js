$(document).ready(() => {

    Bootstrap_validation();

});

function UserLogin(el) {

    if ($('.form-control').hasClass('Error'))
        $('.form-control').removeClass('Error');

    $('.invalid-feedback').hide();
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();
    var data = new Object();

    if (email !== '' && password !== '') {

        data.email = email;
        data.password = password;

        $.ajax({
            url: '/UserLogin',
            method: 'POST',
            data: data,
            success: osUserLogin,
            error: (err) => { console.log(err) }
        });

    }

}

function osUserLogin(res) {

    if (res.result) {
        window.location = '/index';
    } else {
        var ErrArr = res.error.split(':');
        $(`#${ErrArr[0]}`).addClass('Error');
        $(`#${ErrArr[0]}`).siblings('.invalid-feedback').text(ErrArr[1]).show();
    }
}

function Bootstrap_validation() {

    (() => {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })()

}