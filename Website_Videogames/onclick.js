/*window.onload = function() {
  document.querySelector("#defaultOpen").onclick = event => openGame(event, 'HighScores')
  document.querySelector("#tetris-button").onclick = event => openGame(event, 'Tetris')
  document.querySelector("#snake-button").onclick = event => openGame(event, 'Snake')
  document.querySelector("#pong-button").onclick = event => openGame(event, 'Pong')
  document.getElementById("defaultOpen").click();
}*/

document.querySelector("#defaultOpen").addEventListener("click", function() 
{
    openGame(event, 'HighScores')
});

document.querySelector("#tetris-button").addEventListener("click", function() 
{
    tetrisRestart;
    openGame(event, 'Tetris')
});

document.querySelector("#snake-button").addEventListener("click", function() 
{
    snakeRestart;
    openGame(event, 'Snake')
});

document.querySelector("#pong-button").addEventListener("click", function() 
{
    //pongRestart;
    openGame(event, 'Pong')
});

document.getElementById("defaultOpen").click();

function openGame(evt, game) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(game).style.display = "block";
    evt.currentTarget.className += " active";
}
