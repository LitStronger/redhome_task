var express = require('express');
var mysql = require('mysql');
var config = require('../config');
var router = express.Router();

/*返回操作结果 */
var pool = mysql.createPool(config.db);
/*
var res_JSON = function(res,ret){
  if(typeof ret === 'undefined'){
    res.json({
      code:'-200',
      msg: '操作失败'
    });
  }
  else{
    res.json(ret);
  }
};*/

/*
以下分别是处理
1、post请求：进行用户注册
2、get请求：返回用户信息
*/

router.use('/login', function (req, res){

  var data = {};  //用于返回注册情况 已存在/成功/失败
  pool.getConnection(function(err,connection){
    var name = req.body.name;
    var password = req.body.password;
    var _res = res; //不明白为什么要把res赋给_res，但不赋值会报错
    console.log(typeof(name) + password);


   connection.query(`SELECT * FROM form`, function(err, res){
      var isTrue = false;//用于判断用户名是否存在
      if(res){
        for(var i = 0; i < res.length; i++){
          if(res[i].name == name){
            isTrue = true;
            console.log("isTrue"+isTrue+res[i].name);
          }
        }
      }
      
      if(isTrue){
        data.result ={
          code : 1, 
          msg :'用户名已存在',
        }
      }else{
        connection.query(`INSERT INTO form(name, password) value(?, ?)`,[name, password], function(err, result){
          if(result){
            data.result = {
              code : 200,
              msg : '注册成功'
            }
          }else{
            data.result = {
              code : -1,
              msg : '注册失败'
            }
          }
          if(err) throw err;
        });
      }
      if(err) data.err = err;
  });
  
  setTimeout(function(){
    res.status(data.result.code);
    res.send(data.result);
   },300);
   connection.release();
  });
});

router.get('/user_message', function(req, res){
  var data = {}; 
  pool.getConnection(function(err, connection){
    var name = req.query.name;
    connection.query("SELECT * FROM form WHERE name='"+name+"'", function(err, res){
      if(res){
        console.log("1res:" + res);
        data.result ={
          info : res,
          code :200
        }
      }else{
        console.log("2res:" + res);
        data.result ={
          info : "NOT FOUND",
          code : 404
        }
      }
      if(err) throw err;
    })
    setTimeout(function(){
        //es_JSON(_res,data);
        //res.json(data.result);
        res.status(data.result.code);
        res.send(data.result);
      },300);
     connection.release();
  })
});


module.exports = router;
