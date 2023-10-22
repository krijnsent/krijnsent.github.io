$("#navbarCollapse").on('show.bs.collapse', function() {
    $('a.nav-link').click(function() {
        $("#navbarCollapse").collapse('hide');
    });
});