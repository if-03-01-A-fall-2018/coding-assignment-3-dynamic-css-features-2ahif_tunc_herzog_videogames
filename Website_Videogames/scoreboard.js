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
      var sortedData = SortPlayers(data);
      WriteHtml(sortedData);
    })
}

function SortPlayers(data) {
  var ix = JSON.stringify(data);
  var obj = JSON.parse(ix);

  var i;
  var j;
  for (i = 0; i < data.length; i++) {
    for (j = 0; j < data.length - i - 1; j++) {
      if (data[j].score < data[j + 1].score) {
        var temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
      }
    }
  }

  return data;
}

function WriteHtml(data) {
  var p = document.getElementById("players");
  var i;

  for (i = 0; i < data.length; i++) {
    p.innerHTML += '<tr>' + '<td>' + data[i].info + '</td>' + '<td>' + data[i].info + '</td>' + '<td>' + data[i].info + '</td>' + '</tr>';
  }
}