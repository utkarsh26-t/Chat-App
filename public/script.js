const socket = io();

$('#chatbox').hide();

$('#send-btn').click(() => {
    const msgText = $('#inp').val();
    const dest = $('#reciever-name').val();

    if(msgText){
        socket.emit('send-msg', {
            //telling the server to send the message to this reciever only
            dest : dest,
            //message to be sent
            msg : msgText
        })
    }
 
    $('#reciever-name').val("");
    $('#inp').val("")
});



socket.on('received-msg', (data) => {
    $('#chat').append(`<li class="border p-2 rounded-pill mb-2"><span class="fw-bold">${data.username} : </span><span>${data.msg}</span></li>`)
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