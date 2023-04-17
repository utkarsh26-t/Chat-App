const socket = io();
//Saving username of user, currently using the chat app
let username = null;

//Incoming message sound
let mySound = new Audio('./audio.mp3');

$('#chat-wrapper').hide();

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

    let friendsMsg = (data.sender !== username);
    
    //setting alignment of msg-if friends msg then left else right
    if(friendsMsg){
        mySound.play();
        $('#chat').append(`<li class="border p-2 mb-2 left"><span class="fw-bold">${data.sender} : </span><span>${data.msg}</span></li>`);
    }
    else{
        $('#chat').append(`<li class="border p-2 mb-2 right"><span class="fw-bold">You : </span><span>${data.msg}</span></li>`)
    }
    
    $("#chat").scrollTop($("#chat").outerHeight());
});

$('#login-btn').click(() => {
    username = $('#username').val();
    
    socket.emit('login', {
        username : username
    })


    socket.on('currentOnlineUsers', (loggedIn) => {
        //It is logical to show only logged in users other than the user currently using that chat app
        const showLoggedIn = loggedIn.filter((loggedUsername) => loggedUsername !== username);

        $('#users-online').empty();

        for (let userOnline of showLoggedIn) {
            $('#users-online').append(`<li>${userOnline}</li>`)
        }

    })

    $('#login').hide();
    $('#chat-wrapper').show();

    $('#username').val("");
});

// Managing loggedIn state after someone logs out
socket.on('user-logged-out', (loggedIn) => {
    //It is logical to show only logged in users other than the user currently using that chat app
    const showLoggedIn = loggedIn.filter((loggedUsername) => loggedUsername !== username);

    $('#users-online').empty();

    for (let userOnline of showLoggedIn) {
        $('#users-online').append(`<li>${userOnline}</li>`)
    }

})

