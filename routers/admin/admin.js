let express = require("express");

let router = new express.Router();

const mysql = require("../../config/db.js");

const crypto = require('crypto');
// 导入moment模块
const moment = require("moment");
//const page = require("../../common/page.js");
router.get('/pri',function(req,res,next){
	let search = req.query.search ? req.query.search :"经理";
	var sql = "select title from groups where gid in (select gid from rg where rid in(select rid from role where rname like ?))";
	mysql.query(sql,['%'+search+'%'],function (err,data) {
		if(err){
			throw err;
		}else {
			res.render('admin/admin/rolegroup.html',{
				data:data,
				search:search
			});
		}
	});
});

router.get('/departadd',function(req,res,next){
	res.render('admin/admin/departadd.html');
});
//增加部门
router.post('/departadd',function(req,res,next){
	mysql.query('insert into depart(name)value(?)',[req.body.departname],
		function (err,data) {
			if(err){
				throw err;
			}else {
				if(data.affectedRows==1){
					//成功
					res.send("<script>alert('添加成功');location.href='/admin/admin/departadd'</script>");
				}else {
					res.send("<script>alert('添加失败');history.go(-1)</script>");
				}
			}
		});
});

// 管理员管理首页
router.get('/',function(req,res,next){
	// 获取地址栏数据 req.query
	// 获取表单数据 req.body
	let search = req.query.search ? req.query.search :"";
	mysql.query("select * from admin where username like ? order by id desc",[`%${search}%`],function(err,data){
		// 判断是否执行成功
		if (err) {
			return "";
		}else{
			data.forEach(item=>{
				item.time = moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss");
			});
			res.render("admin/admin/userlist.html",{data:data,search:search});
		}
	});

});

// 管理员管理添加页面
router.get('/add',function(req,res,next){
	// res.send("管理员管理添加页面");
	// 加载页面
	res.render("admin/admin/add.html");
});
// 管理员的添加功能
router.post("/add",function(req,res,next){
	// 接受数据
	let {username,password,repassword,status} = req.body;

	// 判断用户名是否书写
	if (username) {
		// 判断用户名长度
		if (username.length>=6 && username.length<=12) {
			// 判断密码
			if (password) {
				// 判断两次密码师傅一直
				if (password == repassword) {
					// 判断该用户名是否已经注册
					mysql.query("select * from admin where username = ?",[username],function(err,data){
						// 判断是否有错误
						if (err) {
							return "";
						}else{
							// 判断该用户名是否注册
							if (data.length==0) {
								// 没有注册，我们需要插入数据
								// 当前时间戳
								let time = Math.round((new Date().getTime())/1000);
								// 密码加密
								let md5 = crypto.createHash('md5');
								password = md5.update(password).digest('hex');

								mysql.query("insert into admin(username,password,status,time) value(?,?,?,?)",[username,password,status,time],function(err,data){
									// 判断
									if (err) {
										return "";
									}else{
										// 判断是否执行成
										if (data.affectedRows==1) {
											res.send("<script>alert('添加成功');location.href='/admin/admin'</script>");

										}else{
											res.send("<script>alert('添加失败');history.go(-1)</script>");

										}
									}
								})
							}else{	
								res.send("<script>alert('该账户名已经注册，请重新输入');history.go(-1)</script>");
							}
						}
					});

				}else{
					res.send("<script>alert('两次密码不一致');history.go(-1)</script>");
				}
			}else{
				res.send("<script>alert('请输入密码');history.go(-1)</script>");
			}
		}else{
			res.send("<script>alert('用户名长度6-12位之间');history.go(-1)</script>");
		}
	}else{
		res.send("<script>alert('请输入账户名');history.go(-1)</script>");
	}
});

// 无刷新修改状态

router.get("/ajax_status",function(req,res,next){
	// 接受对应的数据
	let {id,status} = req.query;

	// 修改数据
	mysql.query("update admin set status=? where id = ?",[status,id],function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				res.send("1");
			}else{
				res.send("0");
			}
		}
	});
})

// 管理员管理修改页面
router.get('/edit',function(req,res,next){

	// 接受数据的ID

	let id = req.query.id;

	// 查询对应数据
	mysql.query("select * from admin where id = "+id,function(err,data){
		// 判断
		if (err) {
			return "";
		}else{
			// 加载修改页面
			res.render("admin/admin/edit.html",{data:data[0]});
		}
	})	

});

// 管理员数据修改功能
router.post("/edit",function(req,res,next){
	// 接受表单提交的数据
	let {username,password,repassword,id,status} = req.body;
	
	// 判断该用户是否修改密码
	let sql = "";
	if (password) {

		// 密码加密
		let md5 = crypto.createHash('md5');
		password = md5.update(password).digest('hex');
		// sql语句
		sql = `update admin set status = ${status},password = '${password}' where id = ${id}`;		
	}else{
		// sql语句
		sql = `update admin set status = ${status} where id = ${id}`;
	}

	// 执行sql语句

	mysql.query(sql,function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				res.send("<script>alert('修改成功');location.href='/admin/admin'</script>");
			}else{
				res.send("<script>alert('修改失败');history.go(-1)</script>");
			}
		}
	});

});


// 无刷新删除数据
router.get("/ajax_del",function(req,res,next){
	// 接受地址栏数据

	let id = req.query.id;

	// 删除数据

	mysql.query(`delete from admin where id = ${id}`,function(err,data){
		if (err) {
			return "";
		}else{
			// 判断是否执行成功
			if (data.affectedRows==1) {
				res.send("1");
			}else{
				res.send("0");
			}
		}
	});
})

module.exports = router;