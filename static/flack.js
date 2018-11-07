document.addEventListener('DOMContentLoaded', () => {
  
  //Utitliy Function
  function appendElement_li(queryselector, text) {
    let li = document.createElement('li');
    li.className = "list-group-item";
    let litext = document.createTextNode(text)
    li.appendChild(litext)
    document.querySelector(queryselector).appendChild(li);
  }


  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


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

  // Set links for list of channels
  document.querySelectorAll('#channels_a .nav-link').forEach(link => {
    link.onclick = () => {
      load_channel(link.dataset.channel);
      return false;
    }
  });

  // Make the first room as the default view
  $('#default_click').click();

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

      document.querySelector('#channel_message_button').onclick = () => {
        
        post = document.querySelector('#channel_message_input').value;

        socket.emit(`${channelname}`, {
          "username": "sam",
          "room": `${channelname}`,
          "post": post
         }, function(result) {
          console.log(result);
        });

        document.querySelector('#channel_message_input').value=""

      }


    }
    request.send();
  }

  socket.on('connect', function() {
    socket.emit('room', 'first');
    socket.emit('room', 'second');
    socket.emit('room', 'third');
  })

  socket.on('first', function(post) {
    console.log('my first room post : ' + post);
    appendElement_li('#channel_view', post);
  });

  socket.on('second', function(username) {
    console.log('my second room post : ' + post);
    appendElement_li('#channel_view', post);
  });

  socket.on('third', function(username) {
    console.log('my first room post : ' + post);
    appendElement_li('#channel_view', post);
  });

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
