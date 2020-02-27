$(document).ready(function() {
    $('#plan').bootstrapValidator({
        message: 'This value is not valid',
        excluded: [':disabled'],//关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',//显示验证成功或者失败时的一个小图标
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },fields: {
            xuqiuname: {
                message: '需求计划名称不能为空',//默认提示信息
                validators: {
                    notEmpty: {
                        message: '需求计划名称必填不能为空'
                    },
                    stringLength: {
                        max: 20,
                        message: '输入长度不能超过20位'
                    }
                }
            },
            xuqiubumen:{
                message: '需求部门必选',
                validators: {
                    notEmpty:{
                        message:'需求部门必选'
                    }
                }
            },
            xuqiurenyuan:{
                message:'需求人员必填',
                validators:{
                    notEmpty: {
                        message:'需求人员必填'
                    },
                    stringLength: {
                        max: 10,
                        message: '输入长度不能超过10位'
                    }
                }
            },
            classcode:{
                message: '物料分类编码必选',
                validators: {
                    notEmpty:{
                        message:'物料分类编码必选'
                    }
                }
            },
            mcode:{
                message:'必选项',
                validators:{
                    notEmpty:{
                        message:'物料编码必选'
                    }
                }
            },
            guige:{
                message:'必填项',
                validators:{
                    stringLength: {
                        max: 10,
                        message: '输入长度不能超过10位'
                    }
                }
            },
            xinhao:{
                message:'必填项',
                validators:{
                    stringLength: {
                        max: 10,
                        message: '输入长度不能超过10位'
                    }
                }
            },
            xuqiunum:{
                message:'必填项',
                validators:{
                    notEmpty:{
                        message:'数量必填'
                    },
                    digits: {
                        message: '该值只能包含数字'
                    }
                }
            },
            month:{
                message:'必填项',
                validators:{
                    notEmpty:{
                        message:'必填项'
                    }
                }
            },
            xuqiudate:{
                message:'必填项',
                validators:{
                    notEmpty:{
                        message:'必填项'
                    },
                    date: {
                        format: 'YYYY/MM/DD',
                        message: '日期无效'
                    }
                }
            }
        }
    })
});