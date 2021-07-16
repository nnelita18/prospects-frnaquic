(function($) {
  /* ----------------------------------------------
      Preloader
    --------------------*/
  $(window).on('load', function () {
      $(".loader").fadeOut();
      $("#preloder").delay(200).fadeOut("slow");
  });
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
    $(".loader").css('display','block');
        // $("#preloder").removeClass('d-none');
        // $("#preloder").removeClass('d-none');
        $("#preloder").css('display','block');
    // $('html, body').animate( {scrollTop : 0}, 800 );
  })
  .done(function(data, textStatus, jqXHR) {
    // swal({
    //     title: 'Obteniendo datos',
    //     icon: 'success',
    //     timer: 800,
    //     button: false
    //   }).then(
    //     function() {},
    //     // handling the promise rejection
    //     function(dismiss) {
    //       if (dismiss === 'timer') {
    //         console.log('I was closed by the timer')
    //       }
    //     }
    //   )
    $(".loader").fadeOut();
        // $("#preloder").removeClass('d-none');
        // $("#preloder").removeClass('d-none');
        $("#preloder").delay(200).fadeOut("slow");
  })
  .fail(function(data, textStatus, jqXHR) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Ha ocurrido un error al obtener los datos!'
    }).then(
      function () {
        location.reload();
      }
    )
  })
  .always(function(data, textStatus, jqXHR) {
    contentReplace.html(data);
  });
}