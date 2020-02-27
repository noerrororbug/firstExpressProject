//需求编码,日期+作者id+类型+序号（依次递增）
//追踪编码，用于物料追踪，需求计划编码+随机编码，物料追踪码不可重复
//生成需求编码

exports.demandID = function demandID(date,author,type,count) {
    if(!(date&&author&&type&&count)){
        return -1;
    }else {
        var data = date.replace(/\-/g,'');
        if(type=='年度计划'){
            type=0;
        }else if(type=='月度计划'){
            type=1;
        }else {
            type=2;
        }
        return data+author+type+count;
    }
}

exports.zhuizhongma = function zhuizhongma(demandID){
    var num ='';
    for (let i = 0; i < 4; i++) {
        num += Math.floor(Math.random()*10);
    }
    return demandID+num;
}
