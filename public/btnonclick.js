
function submission(states) {
//提交,url =/admin/plan/[name]
    if(states ==0){
        $('input[name="states"]').val(0);
    }else {
        $('input[name="states"]').val(1);
    }
    //alert('===============sub');
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/admin/plan/insert" ,//url
        data: $('#plan').serialize(),
        success: function (result) {
        console.log(result);//打印服务端返回的数据(调试用)
        if (result.resultCode == 200) {
        alert("添加成功");
        window.location.reload();
        };
        },error : function() {
        alert("异常！");
        }
    });
}
//查看需求计划详情,可选择多条
function viewPlan(ID) {
    $('#planlist').removeAttr('method');
    $('#planlist').attr('method',"get");
    $('#planlist').removeAttr('action');
    $('#planlist').attr('action',"/admin/plan/updateplan");
    $('#demandid').val(ID);
    $('#planlist').submit();
}
function tijiaobtn() {
    //formofplan
    $('#formofplan').removeAttr('action');
    $('#formofplan').attr('action',"/admin/plan/tjstate");
    $('#formofplan').submit();
}

function copy() {
//复制
}

function print() {
//打印
}

function exp() {
//导出
}
function fujian() {
//附件
}
function print() {
//提醒
}
function print() {
//删除
}
function print() {
//关闭/退出,查询后点击详情页，退出到查询页
}