document.addEventListener('DOMContentLoaded', () => {
  
// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
      if (document.querySelector('#form-post')) {
        document.querySelector('#form-post').onsubmit = (event) => {
          name = document.querySelector('#form-name').value
          post = document.querySelector('#form-post').value
          console.log({"name": name, "post": post})
          socket.emit('new post', {"name": name, "post": post})
        }
      }
    });

    socket.on('newpost event', (message) => {
      console.log(message);
      if(document.querySelector('#yes')) {
        document.querySelector('#yes').innerHTML = message.name + " : " + message.message;  
      }
    });
      
});
