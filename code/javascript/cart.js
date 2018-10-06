getcartinfo();

function getcartinfo() {
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4 && XHR.status == 200) {
      generateMoudle(XHR.responseText);
    }
  }
  XHR.open('get', '/cart/get', true);
  XHR.send();
}

function generateMoudle(responseText) {
  //返回的应该是一个json,里面包含数组
  var responseArray = JSON.parse(responseText).content;
  var len = responseArray.length;

  for (var i = 0; i < len; i++) {
    var liList = '';

    for (j in responseArray[i]) {
      liList += `<li>${j}: ${responseArray[i][j]}</li>`;
    }

    var showstr =
      `<ul>
          ${liList}
      </ul> 
    `.trim();

    var divtoappend = document.createElement('div');
    divtoappend.innerHTML = showstr;
    document.querySelector('#showboard').append(divtoappend);
  }
}