let express = require("express");
let router = new express.Router();

// 导入数据库模块
const mysql = require("../../config/db.js");
const page = require("../../common/page.js");
router.get('/suplist',function(req,res,next){
    mysql.query('select * from supplier',function (err,data) {
        if(err){
            throw err;
        }else {
            res.render('admin/supplier/suplist.html',{
                data:data
            });
        }
    });
});
//按名字查询
router.post('/serchlist',function (req,res,next) {
    let keyWord = req.body.keyWord;
    //console.log(req.body);
    var sql = "select * from supplier where sname like '%"+keyWord+"%'";
    //console.log('======================='+sql);
    mysql.query(sql,function (err,data) {
        if(err){
            throw err;
        }else {
            res.render('admin/supplier/suplist.html',{
                data:data
            });
        }
    });
});

// 无刷新删除数据

router.get("/ajax_del",function(req,res,next){
    // 接受到删除的数据
    let {id} = req.query;

    // 删除数据
    var sql = "delete from supplier where sid in "+id;
    //console.log('======='+sql);
    mysql.query(sql,function(err,data){
        if (err) {
            throw err;
        }else{
            if (data.affectedRows!=0) {
                res.send("1");
            }else{
                res.send("0");
            }
        }
    });
});

router.post("/add",function(req,res,next){
    let sname = req.body.sname;
    let phone = req.body.phone;
    let email = req.body.email;
    //console.log(req.body);
    mysql.query('insert into supplier(sname,phone,email)value(?,?,?)',[sname,phone,email],function (err,data) {
        if(err){
            throw err;
        }else{
            res.send("<script>alert('添加成功');location.href='/admin/supplier/suplist'</script>")
        }
    });
});

//物料
router.get('/materiallist',function (req, res, next) {
    var supplier = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select sid,sname from supplier' ,function (err,sup){
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(sup);
                }
            });
        });
        promise.then(function (value) {
            // success
            //console.log(value);
            return value;
        },function (value) {
            // failure
        });
        return promise;
    }
    var material = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from mclass',function (err,material) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(material);
                }
            });
        });
        promise.then(function (value) {
            // success
            //console.log(value);
            return value;
        },function (value) {
            // failure
        });
        return promise;
    }
    var datam = function(){
        var promise = new Promise(function (resolve,reject) {
            let keyword = req.query.keyword ? req.query.keyword :"";
            let p = req.query.p ? req.query.p :1;
            let size=5;
            mysql.query('select count(*) tot from material where mname like ?',['%'+keyword+'%'],function (err,count) {
                if(err){
                    throw err;
                }else {
                    let tot = count[0].tot;
                    let fpage = page(tot,p,size);
                    mysql.query('select * from material ma,mclass mc where ma.classcode=mc.classcode and mname like ? limit ?,?',
                        ['%'+keyword+'%',Number(fpage.start),Number(fpage.size)],function (err,material) {
                            if(err){
                                throw err;
                            }else {
                                //res.end(JSON.stringify(depart));
                                resolve({
                                    material:material,
                                    keyword:keyword,
                                    show:fpage.show
                                });
                            }
                        });
                }
            });
        });
        promise.then(function (value) {
            // success
            //console.log(value);
            return value;
        },function (value) {
            // failure
        });
        return promise;
    }
    async function tbu() {
        try{
            let sup = await supplier();
            let m = await material();
            var data = await datam();
            //console.log('===='+data);
            res.render('admin/supplier/materiallist.html',{
                m:m,
                sup:sup,
                data:data.material,
                keyword:data.keyword,
                show:data.show
            });
        }catch (error) {
            console.log('async tbu admin/supplier/materiallist error');
            throw error;
        }
    }
    tbu();
});
router.post('/materiallist',function (req,res,next) {
    let mcode = req.body.mcode;
    let mname = req.body.mname;
    let classcode = req.body.classcode;
    let dw = req.body.dw;
    var sql = "insert into material(mcode,mname,classcode,danwei)value(?,?,?,?)";
    mysql.query(sql,[mcode,mname,classcode,dw],function (err,data) {
        if(err){
            throw err;
        }else if(data.affectedRows==1){
            res.send("<script>alert('新增数据成功');window.location='/admin/supplier/materiallist'</script>");
        }else {
            res.send("<script>alert('新增数据失败');window.history.go(-1)</script>");
        }
    });
});

module.exports = router;