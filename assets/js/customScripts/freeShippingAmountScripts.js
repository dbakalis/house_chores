$(document).ready(function() {
    $('#modal_transLang').change(function(e) {
        location.href = 'index.php?lang=' + e.target.value;
    });
});