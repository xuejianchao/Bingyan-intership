var redheart = document.querySelector("#redheart");
var blackheart = document.querySelector("#blackheart");

function clickhandler(ev) {
  var clicked = ev.target;
  if (clicked === redheart) {
    //注意,点击红心是取消喜欢的意思,所以后面应该写/dislike
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function () {
      if (XHR.readyState === 4 && XHR.status === 200) {
        var state = JSON.parse(XHR.responseText).state;
        if (state == 'success') {
          blackheart.style.display = "inline";
          clicked.style.display = "none";
        } else {
          alert('Oops,something went wrong.');
        }
      }
    }

    XHR.open('get', `/dislike?id=${foodid}`, true);
    XHR.send();

  } else {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function () {
      if (XHR.readyState === 4 && XHR.status === 200) {
        var state = JSON.parse(XHR.responseText).state;
        if (state == 'success') {
          redheart.style.display = "inline";
          clicked.style.display = "none";
        } else {
          alert('Oops,something went wrong.');
        }
      }
    }
    XHR.open('get', `/like?id=${foodid}`, true);
    XHR.send();
  }
}

redheart.addEventListener('click', clickhandler);
blackheart.addEventListener('click', clickhandler);

//基础页面(没啥东西)加载完成,就向服务器请求这个食物的数据
var querystring = window.location.href.split("?")[1].split('=');
var XHR = new XMLHttpRequest();

XHR.onreadystatechange = function () {
  if (XHR.readyState === 4 && XHR.status === 200) {
    generFoodDetail(JSON.parse(XHR.responseText));
  }
}
XHR.open('get', `/foodDetailContent?id=${querystring[1]}`, true);
XHR.send();

var foodid = 0;
//生成页面
function generFoodDetail(responseJSON) {
  console.log(responseJSON);
  foodid = responseJSON.id;
  document.title = responseJSON.name;

  //根据文件中的like数据,初始化界面上黑红心的显示情况

  if (responseJSON.like === true) {
    redheart.style.display = 'inline';
    blackheart.style.display = 'none';
  }

  //大图片
  generPic(responseJSON.pic, '', ".imgContainer, .detailImg");

  //食物名称和星星
  generNameAndStar(responseJSON.point, responseJSON.name, 'class="foodTitle"', 'class="starGroup"', '#nameAndStar');

  //装饰条应该不用动态生成.

  //↓生成详细信息
  var detailInfoStr = `<h5 class="detail gray">${responseJSON.descript}</h5>`

  //↓ 生成表格
  var forminnerHTML = '';

  for (select in responseJSON.selection) {
    console.log(select);
    //对每一个选项,生成title和boxgroup
    var titleStr = `<h4>${select}</h4>`;
    var boxsGroupStr = generOneBoxGroup(select, responseJSON.selection[select], false);
    forminnerHTML += titleStr + boxsGroupStr;
  }

  forminnerHTML += '<input type="submit" class="bigButton white background-red redButton" value="Add to Cart">';


  //生成表格元素,向其中添加内容
  var formouterHTML = `<form action="/addtocart" method="POST">${forminnerHTML}</form>`;
  document.querySelector('#GoToRightDown').innerHTML = detailInfoStr + formouterHTML;

  document.querySelectorAll('.outerBox:first-of-type>input').forEach(function (input) {
    input.setAttribute('checked', 'checked');
  })

  //要放在这个生成函数中,因为生成函数是一个回调函数
  addHandlerToButton('input[type="submit"]', 'form', '.foodTitle');
}