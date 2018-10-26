document.addEventListener('DOMContentLoaded', () => {
  

  var message = {
    name: 'samir',
    post: 'first post'
  }

  var flag = false

if(document.querySelector('#index_name')) {
    name = document.querySelector('#index_name').value
    message.name = name
    console.log(message)
  }
  
 if(document.querySelector('#post_post')) {
    post = document.querySelector('#post_post').value
    message.post = post
    console.log(message)
    flag = true
  }

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect',() => { 
    console.log('Client connected');
    if(document.querySelector('#button')) {
      button = document.querySelector('#button')
      button.onclick = ( ) => {
        console.log('click')
        console.log(message)
        socket.emit('post event', message)
      }
    }
    // // Each button should emit a "submit vote" event
    //   document.querySelector('#button').forEach(button => {
    //       button.onclick = () => {
    //           console.log('click')
    //           socket.emit('post event', message);
    //       };
    //   });
  }) 

  socket.on('newpost event', post => {
    console.log(post);
  })

});