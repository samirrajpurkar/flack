document.addEventListener('DOMContentLoaded', () => {
  // Set links for list of channels
  document.querySelectorAll('#channels_a .nav-link').forEach(link => {
    link.onclick = () => {
      console.log(link.dataset.channel);
      load_channel(link.dataset.channel);
      return false;
    }
  });

  // Renders Channel View
  function load_channel(channelname) {
    const request = new XMLHttpRequest();
    request.open('GET', `/${channelname}`);
    request.onload = () => {
      const response = request.responseText;
      const messages = JSON.parse(response);
      document.querySelector('#channel_view').innerHTML = ""
      messages.forEach(function (message) {
        appendElement_li('#channel_view', message);
      });
    }
    request.send();
  }


  function appendElement_li(queryselector, text) {
    let li = document.createElement('li');
    li.className = "list-group-item";
    let litext = document.createTextNode(text)
    li.appendChild(litext)
    document.querySelector(queryselector).appendChild(li);
  }

// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

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
