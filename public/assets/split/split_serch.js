function goSplit(m) {
    //m=1上一页0下一页
    if(m==0){
        //下一页
        //lineSize = $('#lineSize').find("option:selected").val();
        //alert('=============')
        $('#current_page').val(Number($('#current_page').val())+1);
        $('#planlist').submit();
    }else if(m==1){
        //上一页
        if(Number($('#current_page').val())>1){
            $('#current_page').val(Number($('#current_page').val())-1);
            $('#planlist').submit();
        }else {
            alert('已经是第一页')
        }
    }
}