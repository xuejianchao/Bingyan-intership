var http = require("http");
var fs = require('fs');
var Router = require('node-router');

var routers = new Router();
var router = routers.push;

var mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'text/javascript'
};

var foodinfo = {
  type: 'foodcontent',
  content: [{
    //还要考虑怎么给每个食物生成一个界面==>用ajax要来的数据填充detail上的大部分内容
    name: 'Veggie Cheese Extravaganza',
    pic: '../images/th(2).png', //目前都只用这一个
    point: '2',
    descript: "For a vegetarian looking for a BIG treat that goes easy on the spices, this one's got it all. The onions, the capsicum, those delectable mushrooms - with paneer and golden corn to top it all.",
    basicPrice: 199,
    selection: {
      size: [
        ['Medium', 251, '₹450'],
        ['Large', 791, '₹990'],
        ['Small', 0, '₹199']
      ],
      crust: [
        ['Stanard', 0, ''],
        ['Garlic Roasted', 0, 'free'],
        ['Cheese Burst', 0, 'free']
      ],
      Topping: [
        ['Stanard', 0, ''],
        ['Extra Cheese', 0, ''],
        ['Extra Spice', 0, '']
      ]
    }
  }, {

  }]
}

//首先实现加载home和menu吧,都是主要是菜单栏
//↓ 在菜单界面中,响应"给我食物的数据"的请求的路由
router('/menu/getmenu', function (req, res) {
  //遍历foodinfo数组,按照规定的格式返回一个json
  var jsonToReturn = {
    type: 'foodcontent',
    content: []
  }

  var foodNum = foodinfo.content.length;

  for (var i = 0; i < foodNum; i++) {
    var oneFoodInfo = {
      name: foodinfo.content[i].name,
      basicPrice: foodinfo.content[i].basicPrice,
      pic: foodinfo.content[i].pic
    };
    jsonToReturn.content.push(oneFoodInfo);
    console.log(i);
  }
  console.log(jsonToReturn);
  res.send(jsonToReturn);
})

//提供静态资源的路由
router('/menu', '/home', function (req, res) {
  if (req.url.split('.')[1] == 'html') {
    var path = './html' + req.url;
  } else {
    var path = './html' + req.url + '.html';
  }
  fs.readFile(path, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.writeHead('200', {
        "Conten-Tpye": 'text/html'
      });
      res.write(data);
      res.end();
    }
  })
})

router('/css', function (req, res) {
  var url = '.' + req.url;
  fs.readFile(url, function (err, data) {
    res.writeHead('200', {
      "Conten-Tpye": 'text/css'
    });
    res.write(data);
    res.end();
  })
})

router('/javascript', function (req, res) {
  var url = '.' + req.url;
  fs.readFile(url, function (err, data) {
    res.writeHead('200', {
      "Conten-Tpye": 'text/javscript'
    });
    res.write(data);
    res.end();
  })
})

router('/images', function (req, res) {
  var url = '.' + req.url;
  var type = mime[url.split('.')[2]];

  fs.readFile(url, function (err, data) {
    res.writeHead('200', {
      "Conten-Tpye": type
    });
    res.end(data, 'binary');
  })
})



http.createServer(routers).listen(8000);