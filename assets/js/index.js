$(function() {
  var layer = layui.layer
  // 获取用户信息
  getUserInfo()

  // 退出按钮
  $('#exitBtn').on('click', function(res) {
    layer.confirm('退出登录？', {icon: 3, title:'提示'}, function(index){
      //do something
      // 1.清除token
      localStorage.removeItem('token')

      // 2.返回登陆页面
      location.href = '/login.html'
      
      layer.close(index);
    });
  })
})
  

function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function(res) {
      if (res.status !== 0)
        return console.log(res.message)
      let data = res.data
      //console.log(data)
      // 1.欢迎 xxx
      let name = data.nickname || data.username
      $('#welcome').html('欢迎 ' + name)
      // 2.渲染头像
      renderAvatar(data)
    },
    complete: function(res) {
      //console.log(res)
      if (res.responseJSON.status !== 0) {
        localStorage.removeItem('token')
        location.href = '/login.html'
      }
    }
  })
}

function renderAvatar(user) {
  if (!user.user_pic) {
    let name = user.nickname || user.username
    $('.text-avater').html(name[0].toUpperCase()).show()
    $('.layui-nav-img').hide()
  } else {
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avater').hide()
  }

}