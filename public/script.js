const socket = io();

$('#chatbox').hide();

$('#send-btn').click(() => {
    const msgText = $('#inp').val();
    
    socket.emit('send-msg', {
        msg : msgText
    })

    $('#inp').val("")
});


socket.on('received-msg', (data) => {
    $('#chat').append(`<li class="border-0 shadow p-2 rounded-pill mb-2"><span class="fw-bold">${data.username}: </span>  <span class="text-muted">${data.msg}</span></li>`)
    $("#chat").scrollTop($("#chat").outerHeight());
});

$('#login-btn').click(() => {
    const username = $('#username').val();
    
    socket.emit('login', {
        username : username
    })

    $('#login').hide();
    $('#chatbox').show();

    $('#username').val("");
})