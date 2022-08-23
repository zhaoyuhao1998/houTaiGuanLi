$(function() {
  // 点击注册账号
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击去登陆
  $('#link_login').on('click', function() {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从layui获取form对象
  var form = layui.form
  var layer = layui.layer
  // 校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位且无空格'],
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.post(
      '/api/reguser',
      {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val(),
      },
      function (res) {
        if (res.status !== 0)
          return layer.msg(res.message)
        layer.msg('注册成功')
        $('#link_login').click()
      }
    )
  })

  // 监听登录事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0)
          layer.msg(res.message)
        layer.msg('登陆成功')
        // 保存token
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })
})