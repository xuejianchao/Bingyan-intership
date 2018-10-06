//注意,这个函数会清除container的innerHtml
function generPic(picSrc, picAttr, picContainerSelector) {
  var detailImgStr = `<img ${picAttr} src="${picSrc}" alt="">`
  document.querySelector(picContainerSelector).innerHTML = detailImgStr;
}

//生成星星和title,因为他们总是在一起,所以放在一起
function generNameAndStar(point, name, titleAttr, groupAttr, containerSelector) {
  var starGroupStr = '';
  var pointInt = parseInt(point);

  for (var i = 0; i < pointInt; i++) {
    starGroupStr += '<span class="red">★</span>';
  }
  for (var i = 4; i >= pointInt; i--) {
    starGroupStr += '<span class="gray">★</span>';
  }

  var nameAndStarStr =
    `<h2 ${titleAttr}>${name}</h2>
    <div ${groupAttr}>
      ${starGroupStr}
    </div>`

  document.querySelector(containerSelector).innerHTML = nameAndStarStr;
}

//只负责生成表格中的boxgroup部分
//而且是返回值的,返回的是直接能用的boxgroup的html字符串
function generOneBoxGroup(selectionName, select, noDisplay) {
  var boxStrs = '';
  for (var i = 0; i < select.length; i++) {
    boxStrs +=
      `<div class="outerBox">
    <input id="${selectionName+i}" name="${selectionName}" type="radio" value="${select[i][0]}">
    <label class="Box" for="${selectionName+i}">
      <span class="h6 formerLable">${select[i][0]}</span>
      <span class="h6 laterLable">${select[i][2]}</span>
    </label>
  </div>`
      .trim();
  }
  //注意,如果label的for属性写错了,点击label就不能改变radio的状态

  var boxsGroupStr = '';
  if (noDisplay) {
    boxsGroupStr = `<div class="boxGroup" style="display:none">${boxStrs}</div>`;
  } else {
    boxsGroupStr = `<div class="boxGroup">${boxStrs}</div>`;
  }
  return boxsGroupStr;
}