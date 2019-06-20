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
  var p = document.getElementById("players");
  var i;
 console.log("hi!");
  for (i = 0; i < data.length; i++) {
    if(data[i] === "tetris")
    {
      //do smth
    }
   console.log(data);
    p.innerHTML += '<tr>' + '<td>' + data[i].name + ' ' + data[i].score + '</td>' + '<td>' + data[i].info + '</td>' + '<td>' + data[i].info + '</td>' + '</tr>';
  }
}