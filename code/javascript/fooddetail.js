var redheart = document.querySelector("#redheart");
var blackheart = document.querySelector("#blackheart");

function clickhandler(ev){
  var clicked = ev.target;
  if(clicked === redheart){
    blackheart.style.display="inline";
    clicked.style.display="none";
  } else {
    redheart.style.display="inline";
    clicked.style.display="none";
  }
}

redheart.addEventListener('click',clickhandler);
blackheart.addEventListener('click',clickhandler);