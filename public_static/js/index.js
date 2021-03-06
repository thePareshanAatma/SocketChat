var socket=io();

var loadStatus=0;

        $(()=>{

            setTimeout(()=>{
                $('#loading').fadeOut(100);
                let roomName="";
                var chatSection=$('#chatSection');
                var msgBox=$('#message')
                var sendBtn=$('#send');
                var chatBox=$('#chat');

                var initialMsg=msgBox.val();
                var currMsg="";

                var userbox= $('#UserDetails')
                    userbox.show();
                var roombox=$('#RoomDetails')

                var usernamebox=$('#username');
                // var loginBtn=$('#loginbtn');

                sendBtn.click(()=>{
                    socket.emit('msg',{
                        message:msgBox.val(),
                        room:roomName
                    })
                })

                socket.on('msg',(data)=>{
                    chatBox.append(`                    
                    <div class="media mess">
                        <img class="mr-3" src="..." alt="Generic placeholder image">
                        <div class="media-body">
                            <h5 class="mt-0">${data.sender}</h5>
                                ${data.message}
                            </div>
                    </div>
                    `)
                })


                window.onkeydown= function (event) {
                    // Auto-focus the current input     when a key is typed
                    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
                        usernamebox.focus();$('#roomname').focus();
                    }
                    // When the client hits ENTER on their keyboard
                    if (event.which === 13) {
                        if(loadStatus==0) {
                            loadStatus=1;
                            username = usernamebox.val();
                            socket.emit('login', {
                                username: username
                            });
                        }

                        else if(loadStatus==1)
                        {
                            loadStatus=2;
                             roomName=$('#roomname').val()
                            socket.emit('room',{
                                roomName:roomName
                            })
                        }
                    }
                };

                socket.on('roomNotThere',()=>{
                    let roomMessage=$('#roomMessage');
                    roomMessage.html(`<p><Roo></Roo>m doesn't exist. Wanna create it? <button id="yes">YES</button>  <button id="no">NO</button></p>`)
                    $('#yes').click(()=>{
                        roomName=$('#roomname').val();
                        roombox.fadeOut();
                        $('#loading').show();
                        socket.emit('room_',{
                            roomName:roomName
                        })

                    })
                    $('#no').click(()=>{
                        roomMessage.fadeOut();
                        $('#roomname').clear();
                    })
                })


                socket.on('roomJoined',(data)=>{
                    $('#loading').fadeOut();
                    $('#chatSection').show();
                    chatBox.append(`<div class="mess">There are ${data.strength} people in the room </div><div class="mess">${data.you} joined</div>`);

                })

                socket.on('logged_in',(data)=>{
                    if(data.loginStatus===0)
                    {
                        loadStatus=0;
                        alert('Username not available');

                    }
                    else{
                        userbox.fadeOut(100);
                        roombox.show();
                    }

                })

                socket.on('someJoined',(data)=>{
                    chatBox.append(`<p>${data.joinedUser} joined</p>`)
                })

                socket.on('typing',(data)=>{
                    if(a===0) {
                        chatBox.append(`<p class="typing">${data.userTyping} is typing...</p>`)
                        a=1
                    }
                })


                socket.on('left',(data)=>{
                    chatBox.append(`<p>${data.userLeft} left</p>`)
                })

                setInterval(()=>{
                    currMsg=msgBox.val()
                    if(currMsg==="" || currMsg===initialMsg) {
                        socket.emit('noTyping');
                    }
                    else{
                        initialMsg=currMsg;
                        socket.emit('typing');
                    }
                },500)

                socket.on('noTyping',(data)=>{
                    $('.typing').remove();
                    a=0;
                })

            },1000);

        })






