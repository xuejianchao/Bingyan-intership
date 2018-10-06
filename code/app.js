var http = require("http");
var fs = require('fs');
var url = require('url');
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
      id: '1',
      name: 'Veggie Cheese Extravaganza',
      pic: '../images/th(2).png', //目前都只用这一个
      point: '2',
      descript: "For a vegetarian looking for a BIG treat that goes easy on the spices, this one's got it all. The onions, the capsicum, those delectable mushrooms - with paneer and golden corn to top it all.",
      basicPrice: 199,
      selection: {
        Size: [
          ['Medium', 251, '₹450'],
          ['Large', 791, '₹990'],
          ['Small', 0, '₹199']
        ],
        Crust: [
          ['Stanard', 0, ''],
          ['Garlic Roasted', 0, 'free'],
          ['Cheese Burst', 0, 'free']
        ],
        Topping: [
          ['Stanard', 0, ''],
          ['Extra Cheese', 0, '₹99'],
          ['Extra Spice', 0, '']
        ]
      }
    }, {
      id: "2",
      name: 'Paneer Pan Pizza',
      pic: '../images/pannerPizza.jpg',
      point: '5',
      descript: "Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. ",
      basicPrice: 199,
      selection: {
        Size: [
          ['Medium', 251, '₹450'],
          ['Large', 791, '₹990'],
          ['Small', 0, '₹199']
        ],
        Crust: [
          ['Stanard', 0, ''],
          ['Garlic Roasted', 0, 'free'],
          ['Cheese Burst', 0, 'free']
        ],
        Topping: [
          ['Stanard', 0, ''],
          ['Extra Cheese', 99, '₹99'],
          ['Extra Spice', 0, '']
        ]
      }
    }, {
      id: "3",
      name: 'Burger',
      pic: '../images/burger.jpg',
      point: '4',
      descript: "Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. ",
      basicPrice: 149,
      selection: {
        Size: [
          ['Medium', 50, '₹199'],
          ['Large', 150, '₹299'],
          ['Small', 0, '₹149']
        ],
        Stuffing: [
          ['Stanard', 0, ''],
          ['Extra Cheese', 49, '₹49'],
          ['Extra Meet', 0, '']
        ]
      }
    }, {
      id: "4",
      name: 'Salad',
      pic: '../images/salad.jpg',
      point: '3',
      descript: "Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. ",
      basicPrice: 149,
      selection: {
        Size: [
          ['Medium', 50, '₹199'],
          ['Large', 150, '₹299'],
          ['Small', 0, '₹149']
        ],
        Stuffing: [
          ['Stanard', 0, ''],
          ['Extra Cheese', 49, '₹49'],
          ['Extra Meet', 0, '']
        ]
      }
    }


  ]
}


router(function (req, res, next) {
  var urlParsed = url.parse(req.url);
  console.log(urlParsed);

  if (urlParsed.pathname === '/foodDetailPage') {
    //这个就只是用来接收"前往food-detail"的请求的.
    fs.readFile('./html/foodDetailPage.html', function (err, data) {
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
  } else if (urlParsed.pathname === '/foodDetailContent') {
    //用来响应"请给我某个食物的详细信息"的请求.
    var targetid = urlParsed.query.split('=')[1];

    //根据querystring中的id找到目标食物,然后返回
    //这里不能用forEach();
    for(var i=0;i<foodinfo.content.length;i++){
      if(targetid == foodinfo.content[i].id){
        res.send(JSON.stringify(foodinfo.content[i]));
      }
    }
  } else {
    next();
  }
})


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
      pic: foodinfo.content[i].pic,
      id: foodinfo.content[i].id
    };
    jsonToReturn.content.push(oneFoodInfo);
    console.log(i);
  }
  console.log(jsonToReturn);
  res.send(jsonToReturn);
})

//提供静态资源的路由
router('/menu', '/home', '/food_detail', function (req, res) {
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