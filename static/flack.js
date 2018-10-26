document.addEventListener('DOMContentLoaded', () => {
  
// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    // socket.on('connect', () => {
    //   if (document.querySelector('#form-post')) {
    //     document.querySelector('#form-post').onsubmit = (event) => {
    //       name = document.querySelector('#form-name').value
    //       post = document.querySelector('#form-post').value
    //       console.log({"name": name, "post": post})
    //       socket.emit('new post', {"name": name, "post": post})
    //     }
    //   }
    // });

    socket.on('connect', () => {
      if (document.querySelector('#message_button')) {
        document.querySelector('#message_button').onclick = ( ) => {
          
          name = document.querySelector('#message_name').innerHTML;
          post = document.querySelector('#message_input').value;

          socket.emit('newpost', {
            name: name,
            post: post
          })
        }
      }
    })

    socket.on('broadcast_post', (message) => {
      console.log(message);

      if (document.querySelector('#messages')) {
        let li = document.createElement('li');
        li.className = "list-group-item";
        let litext = document.createTextNode(message.name + " : " +message.post)
        li.appendChild(litext)
        document.querySelector('#messages').appendChild(li);
      }
    });
      
});
