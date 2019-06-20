function GetPlayers() {
  var myInit = {
    method: 'GET',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    cache: 'default'
  };

  var myRequest = new Request('http://localhost:3000/scores', myInit);

  fetch('http://localhost:3000/scores')
    .then(response => {
      return response.json();
    })
    .then(data => {
        console.log(data);
      WriteHtml(data);
    })
}

function WriteHtml(data) {
  var t = document.getElementById("tetris");
  var p = document.getElementById("pong");
  var s = document.getElementById("snake");
  var i;
 console.log("hi!");
  for (i = 0; i < data.length; i++) {
    if(data[i].game === "pong")
    {
      p.innerHTML += '<tr>' + '<td>' + data[i].name + '<td>' + data[i].score + '</tr>';
    }
    else if(data[i].game === "tetris")
    {
      t.innerHTML += '<tr>' + '<td>' + data[i].name + '<td>' + data[i].score + '</tr>';
    }
    else if(data[i].game === "snake")
    {
      s.innerHTML += '<tr>' + '<td>' + data[i].name + '<td>' + data[i].score + '</tr>';
    }
    
   console.log(data);
    
  }
}