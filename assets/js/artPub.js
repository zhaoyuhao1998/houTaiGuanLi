$(function() {
  var layer = layui.layer
  var form = layui.form
  // 1. 初始化图片裁剪器
  var $image = $('#image')
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  $image.cropper(options)
  // 文章状态
  var art_state = '已发布'

  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function(res) {
        if (res.status === 1)
          return layer.msg('Fail')
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  function publishArticle(fd) {
    $.ajax({
      url: '/my/article/add',
      method: 'POST',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0)
          return layer.msg('发布文章失败')
        layer.msg('发布文章成功')
        location.href = './artList.html'
      }
    })
  }

  // 初始化文章条目
  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 拿到用户选择的图片
  // 文件是change事件
  $('#ipt-file').on('change', function(e) {
    var file = e.target.files[0]
    if (file.length === 0)
      return
    var newImgURL = URL.createObjectURL(file)
    $image
     .cropper('destroy')      // 销毁旧的裁剪区域
     .attr('src', newImgURL)  // 重新设置图片路径
     .cropper(options)        // 重新初始化裁剪区域
  })
  $('#btn-cho').on('click', function(e) {
    $('#ipt-file').click()
  })

  // 草稿按钮
  $('#btnSave2').on('click', function(e) {
    art_state = '草稿'
  })

  // 提交表单
  $('#form-pub').on('submit', function(e) {
    
    // 1.阻止默认行为
    e.preventDefault()
    // 2.创建FormData对象
    var fd = new FormData($(this)[0])
    // 3.追加发布状态
    fd.append('state', art_state)
    // 4.追加裁剪后的图片
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        publishArticle(fd)
      })
    // publishArticle(fd)
  })
})