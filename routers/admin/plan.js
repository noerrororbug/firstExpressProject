let express = require("express");
let router = new express.Router();

// 导入数据库模块

const mysql = require("../../config/db.js");
const xuqiucode = require("../../public/xuqiucode.js");
// 导入时间格式化

//const moment = require("moment");

// 导入分页方法
const page = require("../../common/page.js");
router.post('/tjstate',function (req,res,next) {
    let id = req.body.deid;
    //console.log(id);
    mysql.query("update xuqiu set state=1,xuqiustate ='已提交汇总' where demandid = ?",
        [id],function (err,data) {
           if(err){
               throw err;
           }else {
               if(data.affectedRows==1){
                   res.send("<script>alert('已提交');window.location='/admin/plan/planlist'</script>");
               }else {
                   res.send("<script>alert('提交失败');window.history.go(-1)</script>");
               }
           }
        });
});
//年度计划
router.get('/yearplan',function(req,res,next){
    //分类mclass,物料material,供应商supplier,部门,
    var j = {};
    //部门列表
    var depart = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from depart',function (err,depart) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(depart);
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
    var mclass = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from mclass',function (err,mclass) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(mclass);
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
            mysql.query('select * from mclass m,material ma where m.classcode = ma.classcode',function (err,material) {
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
    //同步写法
    async function dp(){
        try {
            let dp = await depart();
            let mc = await mclass();
            let ma = await material();
            //let ur = await person();
            let su = await supplier();
            res.render('admin/plan/yearplan.html',{data:dp,
                cdata:mc,
                material:ma,
                //users:ur,
                sup:su
            });
        } catch (error) {
            // 捕获await中Promise的reject的数据
        }
    }
    dp();
});

router.post('/insert',function (req,res,next) {
    //type,xuqiuname,departid,xuqiurenyuan,classcode,mcode,
    //guige,xinhao,danwei,xiuqiunum,month,xuqiudate,huoyuan,
    //qiwangsid,gudinsid,beizhu
    //需求计划编码
    var countDemand = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select count(demandid)count from xuqiu' ,function (err,count){
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(count);
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

    var insert = function(count){
        var promise = new Promise(function (resolve,reject) {
            var authorID = req.session.YzmMessageUid;
            //console.log(req.body);
            let{xqtype,dingdantype,xuqiuname,xuqiubumen,yusuannei,xuqiurenyuan,
                classcode,classname,mcode,mname,guige,xinhao,danwei,xuqiunum,
                month,xuqiudate,huoyuan,qiwangsid,gudinsid,beizhu,states} = req.body;
            var demandID = xuqiucode.demandID(xuqiudate,authorID,xqtype,count);
            var zhuizhongma = xuqiucode.zhuizhongma(demandID);
            if(yusuannei==undefined){
                yusuannei='否';
            }
            if(dingdantype==undefined){
                dingdantype='否';
            }
            if(qiwangsid==undefined||qiwangsid==NaN){
                qiwangsid=1;
            }
            if(gudinsid==undefined||gudinsid==NaN){
                gudinsid=1;
            }
            if(beizhu==undefined){
                beizhu='';
            }
            times = new Date();
            var createTime = times.getFullYear()+'-'+(times.getMonth()+1)+'-'+times.getDate();
            //state{0保存未提交，1提交未审核，2审核失败，3审核成功}
            //console.log(xuqiubumen)
            var sql = "insert into xuqiu (demandid,xqtype,dingdantype,author,createTime,xuqiuname,xuqiubumen,yusuannei,xuqiurenyuan,classcode,classname,mcode,mname,guige,xinhao,danwei,xuqiunum" +
                ",month,xuqiudate,huoyuan,qiwangsid,gudinsid,beizhu,zhuizhongma,state,xuqiustate)value(?,?,?,?,?,?,?,?,?,?," +
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            var xqstate = states==0?'自由':'已提交汇总';
            mysql.query(sql,[demandID,xqtype,dingdantype,authorID,createTime,xuqiuname,Number(xuqiubumen),yusuannei,xuqiurenyuan,
                classcode,classname,mcode,mname,guige,xinhao,danwei,xuqiunum,month,xuqiudate,huoyuan,qiwangsid,gudinsid,beizhu,zhuizhongma,states,xqstate],function (err,date) {
                if (err) {
                    throw err;
                }else{
                    // mysql.query('insert into process(demandid,uid,time,explains)value(?,?,?,?)',
                    //     [demandID,authorID,createTime,'新增数据'],function (err,res) {
                    //     if(err)
                    //         throw err;
                    // });
                    resolve(date);
                }
            })
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
    var canuse = function(count){
        xuqiudate = req.body.xuqiudate;
        xqtype = req.body.xqtype;
        var authorID = req.session.YzmMessageUid;
        var demandID = xuqiucode.demandID(xuqiudate,authorID,xqtype,count);
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select demandid from xuqiu where demandid=?',[demandID] ,function (err,data){
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    //console.log(data.length)
                    resolve(data);
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
    async function tongbu(){
        try {
            let count = await countDemand();
            var c = count[0].count+1;
            var flag = true;
            while (flag) {
                let canu = await canuse(Number(c));
                //console.log('============='+canu.length)
                if(canu.length == 0){
                    flag = false;
                    let data = await insert(Number(c));
                    if (data.affectedRows==1) {
                        //mysql.query(insert into );
                        res.send({resultCode:200});
                    }else{
                        res.send("<script>alert('添加失败');history.go(-1)</script>");
                    }
                }else {
                    c++;
                }
            }
        }catch (e) {
            throw e;
        }
    }
    tongbu();
});
//月度计划
router.get('/monthplan',function(req,res,next){
    //分类mclass,物料material,供应商supplier,部门,
    var j = {};
    //部门列表
    var depart = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from depart',function (err,depart) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(depart);
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
    var mclass = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from mclass',function (err,mclass) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(mclass);
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
            mysql.query('select * from mclass m,material ma where m.classcode = ma.classcode',function (err,material) {
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
    //同步写法
    async function dp(){
        try {
            let dp = await depart();
            let mc = await mclass();
            let ma = await material();
            let su = await supplier();
            res.render('admin/plan/monthplan.html',{data:dp,
                cdata:mc,
                material:ma,
                //users:ur,
                sup:su
            });
        } catch (error) {
            // 捕获await中Promise的reject的数据
        }
    }
    dp();
});

//紧急计划
router.get('/urgentplan',function(req,res,next){
    //分类mclass,物料material,供应商supplier,部门,
    var j = {};
    //部门列表
    var depart = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from depart',function (err,depart) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(depart);
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
    var mclass = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from mclass',function (err,mclass) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(mclass);
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
            mysql.query('select * from mclass m,material ma where m.classcode = ma.classcode',function (err,material) {
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
    //同步写法
    async function dp(){
        try {
            let dp = await depart();
            let mc = await mclass();
            let ma = await material();
            let su = await supplier();
            res.render('admin/plan/urgentplan.html',{data:dp,
                cdata:mc,
                material:ma,
                //users:ur,
                sup:su
            });
        } catch (error) {
            // 捕获await中Promise的reject的数据
        }
    }
    dp();
});

//需求计划列表
// router.post('/planlist',function (req,res,next) {
//     //req.session.YzmMessageIsAdmin && req.session.YzmMessageUid
//     //分页显示
//     //可以按不同的字段模糊查询
//     let rid = req.session.UserRid;
//     let uid = req.session.YzmMessageUid;
//     let current_page = req.query.current_page ? req.query.current_page :1;
//     let keyword = req.query.keyword ? req.query.keyword :"";
//     let lineSize = req.query.lineSize ? req.query.lineSize :5;
//     let column = req.query.column ? req.query.column :'demandid';
//     //分页实现
//     if(rid!=1){
//         //var sql = 'select * FROM users limit '+num+' offset '+ (current_page-1)*num
//         var sql = 'select demandid,xqtype,author,createTime,xuqiuname,state from xuqiu ' +
//             'where '+column +' like '+"'%"+keyword+"%'"+' limit '+lineSize+' offset '+(current_page-1)*lineSize;
//         //console.log('================================='+sql);
//         mysql.query("select count(*) tot from xuqiu where ? like ? ",[column,'%'+keyword+'%'],function(err,data){
//             // 判断
//             if (err) {
//                 throw err;
//             }else{
//                 // 获取总数据
//                 let tot = data[0].tot;
//                 let fpage = page(tot,current_page,lineSize);
//                 // 查看数据
//                 mysql.query("select demandid,xqtype,author,createTime,xuqiuname,state from xuqiu where ? like ? limit ?,?",[column,'%'+keyword+'%',fpage.start,fpage.lineSize],function(err,data){
//                     // 判断是否错误
//                     if (err) {
//                         return "";
//                     }else{
//                         res.render(
//                             "admin/plan/planlist.html",
//                             {
//                                 data:data,
//                                 show:fpage.show,
//                                 keyword:keyword
//                             }
//                         );
//                     }
//                 });
//             }
//         });
//     }else if(rid==1){
//         var sql = 'select demandid,xqtype,author,createTime,xuqiuname,state from xuqiu ' +
//             'where author='+uid+' and '+column +' like '+"'%"+keyword+"%'"+' limit '+lineSize+' offset '+(current_page-1)*lineSize;
//         mysql.query(sql,function (err,data) {
//             if(err){
//                 //console.log(sql);
//                 throw err;
//             }else {
//                 res.render('admin/plan/planlist.html',{
//                     data:data,
//                     lineSize:lineSize,
//                     current_page:current_page,
//                     //pagenum:Math.ceil(data.length()/lineSize)
//                 });
//             }
//         });
//     }
// });
router.get('/planlist',function (req,res,next) {
    //console.log(req.query)
    let rid = req.session.UserRid;
    let uid = req.session.YzmMessageUid;
    let current_page = req.query.p ? req.query.p :1;
    let keyword = req.query.keyword ? req.query.keyword :"";
    let lineSize = req.query.lineSize ? req.query.lineSize :5;
    let column = req.query.column ? req.query.column :'demandid';
    if(column=='state'){
        keyword=0;
    }
    //分页实现
    //console.log(rid+keyword)
    if(rid!=1){
        //var sql = 'select * FROM users limit '+num+' offset '+ (current_page-1)*num
        // var sql = 'select demandid,xqtype,author,createTime,xuqiuname,state from xuqiu ' +
        //     'where '+column +' like '+"'%"+keyword+"%'"+' limit '+lineSize+' offset '+(current_page-1)*lineSize;
        //console.log('================================='+sql);
        var csql = 'select count(demandid) tot from xuqiu where ' +column+' like '+"'%"+keyword+"%'";
        //console.log(csql);
        mysql.query(csql,function(err,data){
            // 判断
            if (err) {
                throw err;
            }else{
                // 获取总数据
                //console.log(data)
                let tot = data[0].tot;
                let fpage = page(tot,current_page,lineSize);
                // 查看数据
                //console.log(current_page+" "+keyword+' '+lineSize+' '+column+' '+tot)
                var sql ="select demandid,xqtype,author,createTime,xuqiuname,state from xuqiu where "+column+" like "+"'%"+keyword+"%'"+"limit ?,?";
                //console.log(sql)
                mysql.query(sql,[Number(fpage.start),Number(fpage.size)],function(err,data){
                    // 判断是否错误
                    if (err) {
                        throw err;
                    }else{
                        res.render(
                            "admin/plan/planlist.html",
                            {
                                data:data,
                                show:fpage.show,
                                keyword:keyword
                            }
                        );
                    }
                });
            }
        });
    }else if(rid==1) {
        var csql = 'select count(demandid) tot from xuqiu where author=' + uid + ' and ' + column + ' like ' + "'%" + keyword + "%'";
        //console.log(csql);
        mysql.query(csql, function (err, data) {
            // 判断
            if (err) {
                throw err;
            } else {
                // 获取总数据
                //console.log(data)
                let tot = data[0].tot;
                let fpage = page(tot, current_page, lineSize);
                // 查看数据
                //console.log(current_page + " " + keyword + ' ' + lineSize + ' ' + column + ' ' + tot)
                var sql = "select demandid,xqtype,author,createTime,xuqiuname,state from xuqiu where author=" + uid + ' and ' + column + " like " + "'%" + keyword + "%'" + "limit ?,?";
                //console.log(sql)
                mysql.query(sql, [Number(fpage.start), Number(fpage.size)], function (err, data) {
                    // 判断是否错误
                    if (err) {
                        throw err;
                    } else {
                        res.render(
                            "admin/plan/planlist.html",
                            {
                                data: data,
                                show: fpage.show,
                                keyword: keyword
                            }
                        );
                    }
                });
            }
        });
    }
});

//需求修改
router.get('/updateplan',function (req,res,next) {
    var xuqiuinfo = function(){
        var promise = new Promise(function (resolve,reject) {
            //console.log(req.query)
            let demandid = req.query.demandid;
            mysql.query('select * from xuqiu,depart,uname_info where uname_info.uid =xuqiu.author and demandid = ? and xuqiu.xuqiubumen=depart.id',[demandid]
                ,function (err,datainfo) {
                    if(err){
                        throw err;
                    }else {
                        //console.log(data)
                        resolve(datainfo);
                        //res.render('admin/plan/updateplan.html',{data:data});
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
    var mclass = function(){
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select * from mclass',function (err,mclass) {
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(mclass);
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
            mysql.query('select * from mclass m,material ma where m.classcode = ma.classcode',function (err,material) {
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
    var process = function(){
        let demandid = req.query.demandid;
        var promise = new Promise(function (resolve,reject) {
            mysql.query('select uname,time,opinion,explains from process,uname_info where demandid = ? and process.uid=uname_info.uid',[demandid] ,function (err,pro){
                if(err){
                    throw err;
                }else {
                    //res.end(JSON.stringify(depart));
                    resolve(pro);
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
            let info = await xuqiuinfo();
            let mc = await mclass();
            let me = await material();
            let sup = await supplier();
            let liu = await process();
            res.render('admin/plan/updateplan.html',{
                data:info,
                mclass:mc,
                meter:me,
                sup:sup,
                liu:liu,
                useridentify:req.session.YzmMessageUid
            });
        }catch (error) {
            console.log('async tbu /updateplan errror');
            throw error;
        }
    }
    tbu();
});

router.post('/updateplan',function (req,res,next) {
   let{xuqna,bz,deid,clco,
       clna,mco,mna,gge,xhao,cID,
       chT,cyy}=req.body;
   //变量名必须和html表单中的name名字一样
   //console.log(req.body);
   var sql = "update xuqiu set xuqiuname =?,beizhu=?,classcode=?,classname=?,mcode=?,mname=?,guige=?,xinhao=?,changeID=?,changeTime=?,cyuanyin=?,state=0,xuqiustate='自由',dindsp=0,bumenzgsp=0 where demandid=?";
   mysql.query(sql,[xuqna,bz,clco,clna,mco,mna,gge,xhao,Number(cID),String(chT),cyy,deid],function (err,data) {
       if(err)
           throw err;
       else {
           if(data.affectedRows==1){
               times = new Date();
               var pTime = times.getFullYear()+'-'+(times.getMonth()+1)+'-'+times.getDate();
               var psql = "insert into process(demandid,uid,time,opinion,explains)value(?,?,?,?,?)";
               mysql.query(psql,[deid,req.session.YzmMessageUid,pTime,'','修改计划'],function (err,udplan) {
                   if(err)
                       throw err;
               });
               res.send("<script>alert('更新成功');location.href='/admin/plan/planlist';</script>");
           }
           else{
               res.send("<script>alert('更新失败');history.go(-1);</script>");
           }
       }
   });
});


router.get('/sum',function (req,res,next) {
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
    var sumtijiao = function(){
        var promise = new Promise(function (resolve,reject) {
            var sql = "";
            //console.log('departid'+req.session.did);
            //console.log('Rid'+req.session.UserRid );
            sql = "select * from xuqiu where state=3 and xuqiustate = '已提交汇总'";
            mysql.query(sql,function (err,data) {
                if(err){
                    throw err;
                }else {
                    resolve(data);
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
            let data = await sumtijiao();
            res.render('admin/plan/plansummary.html',{
                data:data,
                sup:sup
            });
        }catch (error) {
            console.log('async tbu admin/plan/sum errror');
            throw error;
        }
    }
    tbu();
});

//审批
router.get('/approval',function (req,res,next) {
    //state =1xuqiustate='已提交汇总' xuqiubumen=req.session.did
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
    var shenpi = function(){
        var promise = new Promise(function (resolve,reject) {
            var sql = "";
            let did = req.session.did;
            if(did == 3 && req.session.UserRid ==2){
                //生产主管，审批订单型需求
                sql = "select * from xuqiu where state=1 and xuqiustate = '已提交汇总' and dingdantype = '是' and dindsp =0 and xqtype != '紧急计划'";
            }else if(did != 3 && req.session.UserRid ==2){
                sql = "select * from xuqiu where state=1 and xuqiustate = '已提交汇总' and dingdantype = '否' and bumenzgsp=0 and xqtype != '紧急计划' and xuqiubumen="+did;
            }else if(req.session.UserRid ==0||req.session.UserRid ==3){
                //需求计划员最后审批
                sql = "select * from xuqiu where state=1 and xuqiustate = '已提交汇总' and (dindsp=1 or bumenzgsp=1 or xqtype='紧急计划')";
            }
            if(sql!=''){
                mysql.query(sql,function (err,data) {
                    if(err){
                        throw err;
                    }else {
                        resolve(data);
                    }
                });
            }else {
                resolve(0);
            }
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
            let data = await shenpi();
            res.render('admin/plan/approval.html',{
                data:data,
                sup:sup
            });
        }catch (error) {
            console.log('async tbu admin/plan/sum errror');
            throw error;
        }
    }
    tbu();
});
//第一次审批，需求部门主管审批
router.post('/approval',function (req,res,next) {
    //console.log(req.body.check.length);
    let ids = req.body.check;
    //let len = ids.length;
    var idsql = "(";
    if(typeof(ids)=="object"){
        ids.forEach(e=>{
            idsql += e+',';
        });
        idsql.substring(0,idsql.lastIndexOf(','));
        idsql+=')';
    }else {
        idsql+=ids+')';
    }
    //console.log(idsql);
    var sql = "";
    if(req.session.did == 3 && req.session.UserRid ==2){
        sql = "update xuqiu set dindsp = 1 where demandid in "+idsql;
    }else if(req.session.did != 3 && req.session.UserRid ==2){
        sql = "update xuqiu set bumenzgsp = 1 where demandid in "+idsql;
    }else if(req.session.UserRid ==0||req.session.UserRid ==3){
        //需求计划员完成审批
        sql = "update xuqiu set state=3 where demandid in "+idsql;
    }
    //console.log(sql);
    mysql.query(sql,function (err,data) {
       if(err){
           throw err;
       }else {
            if(data.affectedRows != 0){
                //insert审批流程信息
                var psql = "insert into process(demandid,uid,time,opinion,explains)value(?,?,?,?,?)";
                times = new Date();
                var pTime = times.getFullYear()+'-'+(times.getMonth()+1)+'-'+times.getDate();
                if(typeof(ids)=="object"){
                    ids.forEach(e=>{
                       mysql.query(psql,[e,req.session.YzmMessageUid,pTime,'审批通过',''],
                           function (err,data) {
                               if(err){
                                   throw err;
                               }
                           });
                    });
                }else {
                    mysql.query(psql,[ids,req.session.YzmMessageUid,pTime,'审批通过',''],
                        function (err,data) {
                            if(err){
                                throw err;
                            }
                        });
                }
                res.send({resultCode:200});
            }else {
                res.send("<script>alert('审批失败');window.history.go(-1)</script>");
            }
       }
    });

});
//审批退回
router.post('/backavl',function (req,res,next) {
    let ids = req.body.check;
    //let len = ids.length;
    var idsql = "(";
    if(typeof(ids)=="object"){
        ids.forEach(e=>{
            idsql += e+',';
        });
        idsql.substring(0,idsql.lastIndexOf(','));
        idsql+=')';
    }else {
        idsql+=ids+')';
    }
    var sql = "update xuqiu set state=0,xuqiustate='自由',dindsp=0,bumenzgsp=0 where demandid in"+ids;
    mysql.query(sql,function (err,upplan) {
        if(err){
            throw err;
        }else if(upplan.affectedRows!=0){
            if(typeof(ids)=="object"){
                times = new Date();
                var pTime = times.getFullYear()+'-'+(times.getMonth()+1)+'-'+times.getDate();
                ids.forEach(e=>{
                    mysql.query("insert into process(demandid,uid,time,opinion)value(?,?,?,?)",
                        [e,req.session.YzmMessageUid,pTime,'审批退回'],function (err,uppro) {
                        if(err){
                            throw err;
                        }
                    });
                });
            }else {
                mysql.query("insert into process(demandid,uid,time,opinion)value(?,?,?,?)",
                    [ids,req.session.YzmMessageUid,pTime,'审批退回'],function (err,uppro) {
                        if(err){
                            throw err;
                        }
                    });
            }
            res.send("<script>alert('操作成功');window.location.reload()</script>");
        }else {
            res.send("<script>alert('操作失败');window.history.go(-1)</script>");
        }
    });
});


module.exports = router;