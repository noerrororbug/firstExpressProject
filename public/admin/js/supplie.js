$(function () { //设置点击行复选框为选择状态
  $("#list").on("click", "tr", function () {
    var input = $(this).find("input");
    if (!$(input).prop("checked")) {
      $(input).prop("checked", true)
    } else {
      $(input).prop("checked", false);
    }
  });
})

function serch(){
  $('#suplist').removeAttr('method');
  $('#suplist').attr('method',"post");
  $('#suplist').removeAttr('action');
  $('#suplist').attr('action',"/admin/supplier/serchlist");
  $('#suplist').submit();
}

function delSup(){
  // 确认框
  $('#suplist').removeAttr('method');
  $('#suplist').attr('method',"get");
  if (confirm("您确认要删除？")) {
    // 发送ajax请求删除数据
    var id = '(';
    $.each($('input:checkbox:checked'),function(){
      id +=$(this).val()+',';
    });
    id = id.substring(0, id.lastIndexOf(','));
    id +=')';
    if(id.length <= 2)
    {
      alert('选择要删除的数据');
      return;
    }
    $.get("/admin/supplier/ajax_del",{id:id},function(data){
      // 判断是否删除成功
      if (data==1) {
        window.location.reload();
      }else {
        alert('删除失败');
      }
    });
  };
}
function addsup() {
  $('#suplist').removeAttr('method');
  $('#suplist').attr('method',"post");
  $('#suplist').removeAttr('action');
  $('#suplist').attr('action',"/admin/supplier/add");
  $('#suplist').submit();
}