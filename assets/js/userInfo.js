$(function() {
  var form = layui.form
  // 输入限制
  form.verify({
    nickname: function (value) {
      if (value.length > 6 )
        return '昵称长度过长'
    }
  })

  initUserInfo()

  // 重置
  $('#reset').on('click', function(e){
    e.preventDefault()
    initUserInfo()
  })

  // 提交
  $('.layui-form').on('submit', function(e){
    e.preventDefault()
    $.ajax({
    url: '/my/userinfo',
    method: 'POST',
    data: $(this).serialize(),
    success: function(res) {
      if (res.status !== 0)
        return layer.msg('提交用户信息失败')
      layer.msg(res.message)
      // 更新头像和昵称
      window.parent.getUserInfo()
    }
  })
  })
  
})

// 初始化用户信息
function initUserInfo() {
  var layer = layui.layer
  var form = layui.form
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    success: function(res) {
      if (res.status !== 0)
        return layer.msg('获取用户信息失败')
      form.val('formUser', res.data)
    }
  })
}