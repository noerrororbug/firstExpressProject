let express = require("express");

let router = new express.Router();

// 导入数据库模块

const mysql = require("../../config/db.js");

// 导入时间格式化
const crypto = require('crypto');
const moment = require("moment");

// 导入分页方法

const page = require("../../common/page.js");

// 会员管理首页
router.get('/userlist',function(req,res,next){
	// res.send("会员管理首页");
	// 如何开发分页
	// 第一页 0,5
	// 第二页 5,5
	// 第三页 10,5
	// 第四页 15,5
	// 获取页码
	let p = req.query.p ? req.query.p :1;

	// 接受检索的数据

	let search = req.query.search ? req.query.search :"";
	// 默认每页展示数据
	let size=3;

	// 计算总数据
	mysql.query("select count(*) tot from user where uname like ? ",['%'+search+'%'],function(err,data){
		// 判断
		if (err) {
			return "";
		}else{
			// 获取总数据
			let tot = data[0].tot;
			let fpage = page(tot,p,size);
			// 查看数据
			mysql.query("select uid,uname,rname from user,role where user.rid=role.rid and uname like ?  order by uid desc limit ?,?",['%'+search+'%',Number(fpage.start),Number(fpage.size)],function(err,data){
				// 判断是否错误
				if (err) {
					return "";
				}else{
					// 将时间格式化
					// data.forEach(item=>{
					// 	item.time = moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss");
					// })
					// 加载页面
					res.render(
						"admin/user/userlist.html",
						{
							data:data,
							show:fpage.show,
							search:search
						}
					);
				}
			});
		}
	});
});

router.get('/useradd',function (req,res,next) {
    var depart = function () {
        var promise = new Promise(function (resolve, reject) {
            mysql.query('select id,name from depart', function (err, de) {
                if (err) {
                    throw err;
                } else {
                    //res.end(JSON.stringify(depart));
                    resolve(de);
                }
            });
        });
        promise.then(function (value) {
            // success
            //console.log(value);
            return value;
        }, function (value) {
            // failure
        });
        return promise;
    }

    var role = function () {
        var promise = new Promise(function (resolve, reject) {
            mysql.query('select rid,rname from role', function (err, role) {
                if (err) {
                    throw err;
                } else {
                    //res.end(JSON.stringify(depart));
                    resolve(role);
                }
            });
        });
        promise.then(function (value) {
            // success
            //console.log(value);
            return value;
        }, function (value) {
            // failure
        });
        return promise;
    }
    async function tb() {
        try {
            let dp = await depart();
            let ro = await role();
            res.render('admin/user/useradd.html', {
                depart: dp,
                role: ro
            });
        } catch (err) {
            // 捕获await中Promise的reject的数据
            throw err;
        }
    }
    tb();
});

router.post('/useradd',function (req,res,next) {
    //
    let {uid,password,uname,departid,rid}=req.body;
    //console.log(req.body);
    let sha1 = crypto.createHash('sha1');
    password = sha1.update(password).digest('hex');
    mysql.query('insert into user(uid,password,uname,departid,rid,state,createdate)value(?,?,?,?,?,?,?)',
        [uid,password,uname,departid,rid,1,new Date()],function (err,data) {
            if(err){
                throw err;
            }else {
                if(data.affectedRows ==1){
                    res.send("<script>alert('添加成功');location.href='/admin/user/useradd'</script>");
                }else {
                    res.send("<script>alert('添加失败');history.go(-1)</script>");
                }
            }
        });
});



module.exports = router;