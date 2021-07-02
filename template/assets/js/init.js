(function($) {
  /* ----------------------------------------------
 * Menu active selection
 *
 * ---------------------------------------------- */
  $('#sidebar .nav-item > .nav-link').on('click', function (ev) {
    // ev.preventDefault();
    var  $itemMenu = $(this).parent(),
         $listMenu = $('#sidebar .nav-item');

    $listMenu.removeClass('active');
    $itemMenu.addClass('active');

  });

  $(document).on('click', '.pageto', function( e ) {
    e.preventDefault();
    let contentReplace = $('#change-content'),
        $localpage = $(this).attr('href'),
        pageRedir = $localpage;

        console.log(pageRedir);

    if ( pageRedir !== '' && pageRedir ) {
      loadContent(pageRedir, contentReplace);
    }
  });

  $(document).on('click', '.doc-list .checkbox', function () {
    $this = $(this);
    $listitem = $this.parent().parent().parent();
    if($($this).is(':checked')) {
      $listitem.addClass('completed');
    } else {
      $listitem.removeClass('completed');
    }
  })

})(jQuery);

function loadContent(part, contentReplace) {
  $.get(part, function (data, textStatus, jqXHR) {
    contentReplace.html(data);
    // $('html, body').animate( {scrollTop : 0}, 800 );
  });
}