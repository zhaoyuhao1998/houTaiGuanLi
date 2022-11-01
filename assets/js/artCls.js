function initArticle() {
  // 获取文章分类数据
  $.ajax({
    url: '/my/article/cates',
    method: 'GET',
    success: function(res) {
      //console.log(res.data);
      var htmlStr = template('tpl-table', res)
      $('tbody').html(htmlStr)
    }
  })
}

$(function() {
  var layer = layui.layer
  var form = layui.form
  initArticle()

  var indexAdd = null
  // 添加类别按钮效果
  $('#getCls').on('click', function(o) {
    indexAdd = layer.open({
      tpye: 1,
      title: '添加类别',
      content: $('#art-add').html(),
      area: ['500px', '300px'],
    });     
  })
  // 添加类别代理事件
  $('body').on('submit', '#form-add', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $('#form-add').serialize(),
      success: function(res) {
        if (res.status !== 0)
          return layer.msg('失败')
        layer.msg(res.message)
        layer.close(indexAdd)
        initArticle()
      }
    })
  })

  // 修改类别按钮效果
  var indexEdit = null
  $('body').on('click', '.btn-edit', function(e) {
    indexEdit = layer.open({
      tpye: 1,
      title: '修改类别',
      content: $('#art-edit').html(),
      area: ['500px', '300px'],
      btn: '',
    });
    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        console.log(res.data);
        form.val('form-edit', res.data)
      }
    }) 
  })
  // 事件委托
  $('body').on('submit', '#form-edit', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0)
          return layer.msg('失败')
        layer.close(indexEdit)
        initArticle()
      }
    })
  })

  // 删除表单
  $('tbody').on('click', '.btn-del', function(e) {
    layer.confirm('确认删除', function(index){
      //do something
      var id = $(this).attr('data-id')
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        suucess: function(res) {
          if (res.status !== 0)
            return layer.msg('删除分类失败！')
          layer.msg('删除分类成功！')
          initArtCateList() 
        }
      })
      layer.close(index)
    });
  })

})
