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


router(function (req, res, next) {
  var urlParsed = url.parse(req.url);
  // console.log(urlParsed);

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

    fs.readFile('./json/menu.json', function (err, data) {
      if (err) {
        res.send(err);
      } else {
        var foodinfo = JSON.parse(data);
        for (var i = 0; i < foodinfo.content.length; i++) {
          if (targetid == foodinfo.content[i].id) {
            res.send(JSON.stringify(foodinfo.content[i]));
          }
        }
      }

    })

  } else if (urlParsed.pathname === '/getFirstReco') {
    //用来响应"请给我第一个推荐食品的详细信息"的请求.
    fs.readFile("./json/recommend.json", function (err, data) {
      if (err) {
        res.send(err);
      } else {
        //获取推荐列表中的第一个
        var targetid = JSON.parse(data).content[0];
        fs.readFile('./json/menu.json', function (err, data) {
          if (err) {
            console.log(err);
          } else {
            var menuJSONContent = JSON.parse(data).content;
            var len = menuJSONContent.length;

            for (var i = 0; i < len; i++) {
              //对菜单中的视频遍历
              if (targetid === menuJSONContent[i].id) {
                res.send(JSON.stringify(menuJSONContent[i]));

              }
            }
          }
        })
      }
    })
  } else if (urlParsed.pathname === '/like' || urlParsed.pathname === '/dislike') {
    var json = {
      state: ''
    };

    var queryId = urlParsed.query.split('=')[1];

    fs.readFile('./json/menu.json', function (err, data) {
      if (err) {
        console.log(err);
        res.send(json);
      } else {
        var cartjson = JSON.parse(data);
        var content = cartjson.content;
        var len = content.length;
        for (var i = 0; i < len; i++) {
          if (content[i].id == queryId) {
            if (urlParsed.pathname === '/like') {
              content[i].like = true;
              console.log(`${content[i].name} is liked`);
              break;
            } else if (urlParsed.pathname === '/dislike') {
              content[i].like = false;
              console.log(`${content[i].name} is disliked`);
              break;
            }
          }
        }

        fs.writeFile('./json/menu.json', JSON.stringify(cartjson), (err) => {
          if (err) {
            console.log(err);
            res.send(json);
          } else {
            res.send({
              state: 'success'
            });

          }
        });
      }
    })
  } else if (urlParsed.pathname === '/deleteorder') {

    fs.readFile('./json/cart.json', function (err, data) {
      var json = {
        state: ''
      };
      if (err) {
        console.log(err);
        res.send(json);
      } else {
        var cartJSON = JSON.parse(data);
        var cartArray = cartJSON.content;
        var queryOrderId = urlParsed.query.split('=')[1];

        for (var i = 0; i < cartArray.length; i++) {
          if (cartArray[i].id === queryOrderId) {
            cartArray.splice(i, 1);
            break;
          }
        }

        fs.writeFile('./json/cart.json', JSON.stringify(cartJSON), 'utf8', (err) => {
          res.send({
            state: 'success'
          });
        })

      }
    })

  } else if (urlParsed.pathname === '/' || urlParsed.pathname === '/DEV') {
    fs.readFile('./html/onboarding.html', function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.writeHead('200', {
          'Content-Type': 'text/html'
        });
        res.write(data);
        res.end();
      }
    })
  } else {
    next();
  }
})



//↓ 购物车界面
router('/cart/get', function (req, res) {
  fs.readFile("./json/cart.json", function (err, data) {
    if (err) {
      res.send(err);
    } else {
      console.log(data);
      res.send(JSON.stringify(JSON.parse(data)));
    }
  })
});

router('/cart', function (req, res) {
  fs.readFile('./html/cart.html', function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.writeHead('200', {
        'Content-Type': "text/html"
      });
      res.write(data);
      res.end();
    }
  })
})


//接受'添加至购物车'的请求
router('/addtocart', function (req, res) {
  var json = {
    state: 'success'
  };
  Date.prototype.today = function () {
    return (this.getFullYear()) + '/' + (this.getMonth() + 1) + '/' + ((this.getDate() < 10) ? '0' : '') + this.getDate();
  }
  Date.prototype.now = function () {
    return (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes() + ':' + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
  }
  console.log(req.query);

  //有内置的方法,一下就解析成了
  var thisorder = JSON.parse(JSON.stringify(req.query));

  var newDate = new Date();
  thisorder.time = newDate.today() + "-" + newDate.now();

  fs.readFile('./json/cart.json', function (err, data) {
    if (err) {
      res.send(err);
    } else {
      var cartContent = JSON.parse(data);
      cartContent.content.push(thisorder);
      console.log(cartContent);
      fs.writeFile('./json/cart.json', JSON.stringify(cartContent), 'utf8', (err) => {
        if (err) {
          fs.writeFile('./json/cart.json', data, 'utf8');
          res.send(200, {
            state: 'wrong'
          })
        }
        res.send(200, json);
      })
    }
  })

});

//↓ 在菜单界面中,响应"给我食物的数据"的请求的路由
router('/menu/getmenu', function (req, res) {
  //遍历foodinfo数组,按照规定的格式返回一个json
  var jsonToReturn = {
    type: 'foodcontent',
    content: []
  }

  fs.readFile('./json/menu.json', function (err, data) {
    var foodinfo = JSON.parse(data);
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

})

//↓ 在推荐界面中,响应"给我食物的数据"的请求的路由
router('/recommend/getreco', function (req, res) {
  //遍历recoFoodInfo数组,按照规定的格式返回一个json
  var jsonToReturn = {
    type: 'foodcontent',
    content: []
  }
  fs.readFile('./json/recommend.json', function (err, data) {
    var recoFoodInfo = JSON.parse(data);
    var recoFoodIDList = recoFoodInfo.content;


    fs.readFile('./json/menu.json', function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var menuJSONContent = JSON.parse(data).content;
        var len = menuJSONContent.length;

        for (var i = 0; i < len; i++) {
          //对菜单中的视频遍历
          var propIndex = recoFoodIDList.indexOf(menuJSONContent[i].id);
          if (propIndex >= 0) {
            var oneFoodInfo = {
              name: menuJSONContent[i].name,
              basicPrice: menuJSONContent[i].basicPrice,
              pic: menuJSONContent[i].pic,
              id: menuJSONContent[i].id
            };
            jsonToReturn.content.push(oneFoodInfo);
          }
        }
        res.send(jsonToReturn);
      }

    })
  })
})

//提供静态资源的路由
router('/menu', '/recommend', '/home', '/food_detail', '/onboarding', function (req, res) {
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