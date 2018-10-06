//get按钮添加的handler作用是:当点击时,采集form中的数据,用get方法,发送到'/addtocart'中.
function addHandlerToButton(buttonSelector, formSelector, foodNameSelector) {
  var button = document.querySelector(buttonSelector);
  button.addEventListener('click', function (e) {
    //↓添加到购物车的handler
    e.preventDefault();

    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function () {
      if (XHR.readyState === 4 && XHR.status === 200) {
        var message = JSON.parse(XHR.responseText).message;
        if (message == 'success') {
          alert('Add to cart Successfully');
        }
      }
    }

    //如果页面中只有一个form的话,这个
    var formData = new FormData(document.querySelector(formSelector));
    //↓ 制造送给后台的数据
    var info = '';
    var foodtitle = document.querySelector(foodNameSelector).innerHTML;
    for (var pair of formData.entries()) {
      info += '&' + pair[0] + '=' + pair[1];
    }
    info += '&' + 'foodtitle' + '=' + foodtitle;

    XHR.open('get', 'addtocart?' + info, true);
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();
  })
}
