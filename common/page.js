// 分页函数

function pagess(tot,p=1,size=5){
	// 计算截取的开始位置、结束位置
	let start = (p-1)*size;
	// 计算总页数
	let pages = Math.ceil(tot/size);
	// 展示分页效果
	let show ="";

	show +=`<a href="?p=1">首页</a>`; 
	show +=`<a href="?p=${ p- 1 >=1 ? p - 1 : 1 }">上一页</a> `;
	show +=`<span class="current">${p}</span>`;
	show +=`<a href="?p=${ Number(p)+Number(1) <= pages ?  Number(p)+Number(1) : pages }">下一页</a>`;
	show +=`<a href="?p=${pages}">尾页</a>`;

	return {
		start:start,
		size:size,
		show:show
	}
}

module.exports = pagess;