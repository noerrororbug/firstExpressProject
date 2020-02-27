//a[{},{},{}]
//b[{},{},{}]
//根据a,b中相同的字段，把b中的{}放入a中对应的{}中

function nesting(a,b) {
    for(e in a){
        for(item in b){

        }
    }
}
var j = {
    'groups':g,
    'actions':a,
    'user':data[0]
};
res.render("/admin/userlist.html",{data:j});
<% (data.groups).forEach(item=>{ %>
<h2><span class="<%=item.gicon%>"></span><%=item.title%></h2>
    <ul >
    <% (data.actions).forEach(e=>{ %>
    <%if(e.gid==item.gid && e.type<=(data.user).rid){%>
    <li><a href="<%=e.url%>" target="right"><span class="<%=e.aicon%>"></span><%=e.name%></a></li>
        <%}%>
    <%}) %>
</ul>
<%}) %>