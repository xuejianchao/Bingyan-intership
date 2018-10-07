getcartinfo();

function getcartinfo() {
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4 && XHR.status == 200) {
      generateMoudle(XHR.responseText);
      addHandlerToDeleteButton();
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

    //responseArray[i]就是一个订单
    for (j in responseArray[i]) {
      liList += `<li class="${j}">${j}: ${responseArray[i][j]}</li>`;
    }

    var showstr =
      `<ul>
          ${liList} 
      </ul> <button id="${responseArray[i].id}">Delete this↑ order</button><hr>
    `.trim();

    var divtoappend = document.createElement('div');
    divtoappend.innerHTML = showstr;
    
    document.querySelector('#showboard').append(divtoappend);

    //向showboard中填充,而不是替换
  }
}

function addHandlerToDeleteButton() {
  var buttonList = document.querySelectorAll('button');

  buttonList.forEach(function (button) {
    button.addEventListener('click', requestDelete);
  })
}

function requestDelete(ev) {
  var orderid = ev.target.id;

  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4 && XHR.status === 200) {
      var state = JSON.parse(XHR.responseText).state;
      if (state == 'success') {
        alert('Delete from cart Successfully');
        var showboard = document.querySelector('#showboard');
        showboard.innerHTML='';
        getcartinfo();
      }
    }
  }

  XHR.open('get', `/deleteorder?orderid=${orderid}`, true);
  XHR.send();
}