//从后台请求食品的数据,然后添加到页面中
var XHR = new XMLHttpRequest();
XHR.onreadystatechange = function () {
  if (XHR.readyState === 4 && XHR.status === 200) {
    generAllMoudle(JSON.parse(XHR.responseText), '.menuGridContainer',3);
  }
}
XHR.open('get', '/menu/getmenu', true);
XHR.send();


//获取第一个推荐食品
var XHRforReco = new XMLHttpRequest();
XHRforReco.onreadystatechange = function () {
  if (XHRforReco.readyState === 4 && XHRforReco.status === 200) {
    generRecoCard(JSON.parse(XHRforReco.responseText));
  }
}
XHRforReco.open('get', '/getFirstReco', true);
XHRforReco.send();

function generRecoCard(contentObject) {
  //动态添加图片
  generPic(contentObject.pic, 'id="recommendImg"', 'a[href="/foodDetailPage"]');

  document.querySelector('a[href="/foodDetailPage"]').href=`/foodDetailPage?id=${contentObject.id}`;
  //动态添加star&title
  generNameAndStar(contentObject.point, contentObject.name, 'id="recFoorTitle"', 'class="starGroup"',
    "#starAndNameCon");

  //获取所有的selection的boxgroupStr,并且设置后两个display:none
  var allBoxGroupStr = '';
  for (select in contentObject.selection) {
    if (select === 'Size') {
      allBoxGroupStr += generOneBoxGroup(select, contentObject.selection[select], false);
    } else {
      allBoxGroupStr += generOneBoxGroup(select, contentObject.selection[select], true);
    }
  }

  //将两个按钮连接到boxgroupStr后面,
  var forminnerHtml = allBoxGroupStr +
    `<a href="/foodDetailPage?id=${contentObject.id}">
          <p class="bigButton black background-lightGray">Customize & Add</p>
        </a>
        <input type="submit" class="bigButton white background-red redButton" value="Add to Cart">`

  //将forminnerHtml放入form中
  document.querySelector('form[action="/addToCart"]').innerHTML = forminnerHtml;

  document.querySelectorAll('.outerBox:first-of-type>input').forEach(function (input) {
    input.setAttribute('checked', 'checked');
  });

  addHandlerToButton('input[type="submit"]', 'form[action="/addToCart"]', "#recFoorTitle");
}