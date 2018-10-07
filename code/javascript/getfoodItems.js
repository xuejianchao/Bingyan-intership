//然后放到界面上
function generAllMoudle(json,selector) {
  var foodItemArray = json.content;
  var foodNum = foodItemArray.length;
  for (var i = 0; i < foodNum; i++) {
    generOneFood(foodItemArray[i],selector);
  }
}


//测试没有问题
function generOneFood(onefoodjson,selector) {
  var appendSection = document.createElement('section');
  appendSection.classList.add('foodItem');

  var imgString =
    `<div class="imgContainer">
      <a href="/foodDetailPage?id=${onefoodjson.id}"><img class="imgWithRatio" src="${onefoodjson.pic}" alt=""></a>
      </div>`
    .trim();

  var infoString =
    `<div class="foodTextInfo">
     <h4>${onefoodjson.name}</h4>
     <h5 class="gray">
       <span>Starts from </span><span>₹${onefoodjson.basicPrice}</span>
     </h5>
   </div>`

  appendSection.innerHTML = imgString + infoString;

  document.querySelector(selector).append(appendSection);
}