// 导入express
let express = require("express");

// 实例化
let router = express.Router();
const crypto = require('crypto');
const mysql = require("../config/db.js");
// 监听用户的访问地址

router.use(function(req,res,next){
	// 判断url地址
	// 是否可以直接进行访问
	if (req.url != "/login" && req.url != "/check") {
		// 判断是否登录YzmMessageIsAdmin
		if (req.session.YzmMessageIsAdmin && req.session.YzmMessageUid) {
			next();
		}else{
			//console.log("sessionFalse")
			res.send("<script>alert('请登录');location.href='/admin/login'</script>");
		}
	}else{
		next();
	}
});
// 登录页面
router.get("/login",function(req,res,next){
	res.render("admin/login.html");
});

// 登录处理操作
router.post("/check",function(req,res,next){
	// 接受数据

	let {username,password} = req.body;
	username+=""

	// 判断
	if (username) {
		if (password) {
			// 密码加密
			let sha1 = crypto.createHash('sha1');
			password = sha1.update(password).digest('hex');
			// 判断数据库中是否存在该用户
			mysql.query("select * from user where uid = ? and password = ? and state = 1",[username,password],function(err,data){
				
				if (err) {
					throw err;
				}else{

					if (data.length) {
						//成功
						req.session.YzmMessageIsAdmin = true;
						req.session.YzmMessageUid = data[0].uid;
						req.session.UserRid = data[0].rid;
						req.session.did = data[0].departid;
						//req.session.rid = data[0].rid;
						var groups = "select gid,title,gicon from groups where gid in(select gid from rg where rid =?)";
						var actions = "select gid,url,name,aicon,type from actions where gid in(select gid from rg where rid =?)";
                        var s = groups+";"+actions;
						mysql.query(s,[data[0].rid,data[0].rid],function (err,row) {
							if(err){
								throw err;
							}else {
                                res.render("admin/index",{
                                    user:data,
                                    groups:row[0],
                                    actions:row[1]
                                });
								//console.log(typeof grow);
							}
						});
                        //   console.log("gggggggggggggg"+j.groups);
						//console.log(j.g);
						//res.render("admin/index",{groups:g,actions:a,user:data[0]});
						//render不能要前面的斜杆,send需要
						//res.send("<script>alert('登录成功');location.href='/admin/'</script>");

					}else{
						res.send("<script>alert('登录失败');location.href='/admin/login'</script>");
					}
				}
			});
		}else{
			res.send("<script>alert('请登录');location.href='/admin/login'</script>");
		}
	}else{
		res.send("<script>alert('请登录');location.href='/admin/login'</script>");
	}
})
// router.get('/welcome',function (req,res,next) {
// 	mysql.query('select * from userinfo where uid=?',[req.session.YzmMessageUid],
// 		function (err,data) {
// 			if(err){
// 				throw err;
// 			}else {
// 				res.render('admin/welcome.html',{
// 					user:data
// 				});
// 			}
// 		});
// });
//修改密码
router.get('/pschange',function (req,res,next) {
	res.render('admin/pschange.html');
});
router.post('/pschange',function (req,res,next) {
	let uid = req.session.YzmMessageUid;
	let {pwd,repwd} = req.body;
	if(pwd.length >=6){
		if(pwd==repwd){
			let sha1 = crypto.createHash('sha1');
			pwd = sha1.update(pwd).digest('hex');
			mysql.query('update user set password=? where uid=?',
				[pwd,uid],function (err,data) {
					if(err){
						throw err;
					}else {
						if(data.affectedRows==1){
							req.session.YzmMessageIsAdmin = false;
							req.session.YzmMessageUid = "";
							res.send("<script>alert('密码修改成功');location.href='/admin/login'</script>");
						}
					}
				})
		}else {
			//两次密码不一样
			res.send("<script>alert('两次密码不一致');window.history.go(-1);s</script>");
		}
	}else {
		res.send("<script>alert('长度小于6！');window.history.go(-1);s</script>")
	}
});
// 退出路由
router.get("/logout",function(req,res,next){
	req.session.YzmMessageIsAdmin = false;
	req.session.YzmMessageUid = "";
	res.send("<script>alert('退出成功');location.href='/admin/login'</script>");

});
// 后台首页路由

router.get("/",function(req,res,next){

	// 加载对应后台页面
	res.render("admin/index");
});

// 后台欢迎页面

router.get("/welcome",function(req,res,next){
	// 加载对应欢迎页面
	res.render("admin/welcome");
});

let adminRouter = require('./admin/admin');
router.use('/admin',adminRouter);

// 用户管理
let userRouter = require('./admin/user');
router.use('/user',userRouter);


//新建需求管理
let planRouter = require('./admin/plan.js');
router.use('/plan',planRouter);
//供应商管理
let supRouter = require('./admin/supplier.js');
router.use('/supplier',supRouter);
//需求汇总管理
let gotherRouter = require('./admin/approval.js');
router.use('/gother',gotherRouter);
module.exports = router;