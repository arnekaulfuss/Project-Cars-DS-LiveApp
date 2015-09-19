(function (jst, $, _) {

  var templateList = _.keys(jst);

  $('[data-template]').each(function () {
    var $this = $(this);
    var $data = $this.data();

    var templateName = $data['template'];

    if (templateName.indexOf('.html')) {
      templateName = templateName.replace('.html', '');
    }

    var templatePath = 'assets/templates/' + templateName + '.html'

    if (templateList.indexOf(templatePath) >= 0) {
      $this.html(jst[templatePath]({data: $data['templateData']}));
    }
  });
}(JST, jQuery, _))
