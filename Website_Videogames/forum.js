
window.onload = function(){
  GetReview();
}

function openGame(evt, gameName) {
var i, x, tablinks;
x = document.getElementsByClassName("game");
for (i = 0; i < x.length; i++) {
x[i].style.display = "none";
}
tablinks = document.getElementsByClassName("tablink");
for (i = 0; i < x.length; i++) {
tablinks[i].className = tablinks[i].className.replace();
}
document.getElementById(gameName).style.display = "block";
}

function saveReview(game,rating,review){
var data ={"game" : gameName,"rating" : gameRating, "review" : gameReview};

          fetch('http://localhost:3000/reviews',{
            method:'POST',
            body:JSON.stringify(data),
            headers:{
              'ACCEPT':'application/json',
              'Content-Type':'application/json'
            }
          }).then/(res=>res.json())
          .then(response => console.log('Sucess:',JSON.stringify(data)))
          .catch(error=>console.error('Error:',error));

    }

    function GetReview(){
          var myInit = {method: 'GET',
                        headers:{'Accept': 'application/json','Content-Type':'application/json'},
                        cache:'default'
                        }
          var myRequest = new Request('http://localhost:3000/reviews',myInit);

          fetch('http://localhost:3000/reviews')
          .then(response=>{
            return response.json();
          })
          .then(data=>{

            WriteHtml(data);
          })
    }

    function WriteHtml(data){
      var p = document.getElementById("reviews");

      for (var i = 0; i < data.length; i++) {
        p.innerHTML+='<h3>'+ data[i].game+'</h3>' +'<p>'+ data[i].review+ '</p>';
      }

    }
    window.onload = function(){
      GetReview();
    }
