$(function() {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 获取列表数据
  function initArt () {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        //console.log(res);
        if (res.status !== 0)
          return layer.msg('获取失败')
        var htmlStr = template('tpl-tab', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }
  initArt()

  // 分页功能
  function renderPage(total) {
    laypage.render({
      elem: 'page',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      limits: [2, 3, 5, 10],
      layout: ['limit', 'prev', 'page', 'next'],
      jump: function(obj, first) {
        console.log(obj.curr);
        console.log(first);
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first)
          initArt()
      }
    })
  }

  // 获取分类内容
  $.ajax({
    url: '/my/article/cates',
    method: 'GET',
    success: function(res) {
      if (res.status !== 0)
        return layer.msg('失败')
      var htmlStr = template('tpl-cate', res)
      $('[name=cate_id]').html(htmlStr)
      form.render()
    }
  })

  // 提交按钮
  $('#form-search').on('submit', function(e){
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initArt()
  })
  
  // 删除按钮
  $('tbody').on('click', 'btn-del', function() {
    var id = $(this).attr('data-id')
    var len = $('btn-del').length
    layer.confirm('确定', {icon: 3, title:'提示'}, function(index){
      //do something
      $.ajax({
        url: '/my/article/delete/' + id,
        method: 'Get',
        success: function(res) {
          if (res.status === 1)
            return layer.msg('fail')
          layer.msg('success')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1
          }
          initArt()
        }
      })
      
      layer.close(index);
    });
  })
})

