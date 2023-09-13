$(document).ready(function() {
    var sendingEmail = false;
    $('.btn-interested').click(function(e) {
        if (!sendingEmail) {
            sendingEmail = true;

            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'sendEmailAjax',
                    addon: {
                        label: e.target.dataset.addonLabel,
                    },
                },
                type: "POST", 
                success: function(output) {
                    var response = JSON.parse(output);
                    
                    if (response.status === 'ok') {
                        alert('Έχουμε ενημερωθεί με μήνυμα για το πρόσθετο που σας ενδιαφέρει');
                    }

                    sendingEmail = false;
                },
            });
        }
    });

    var searchQuery = "";

    function onSearchQueryChange() {
        if (searchQuery.trim().length >= 3) {
            var results = [];

            addonsData.forEach(function(addon) {
                if (addon.label.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) {
                    results.push(addon);
                }
            });

            $('#addons-state-tabs').hide();
            $('.tab-content').hide();
            $('.search-results-container').show();
            
            $('.search-results-container').empty();

            if (results.length > 0) {
                results.forEach(function(addon) {
                    var addonElClone = $('.addon[data-id="' + addon.name + '"]').parent().clone(true);
                    $('.search-results-container').append(addonElClone);
                });
            } else {
                $('.search-results-container').html(`
                    <div class="m-4">Δεν βρέθηκαν πρόσθετα κατά την αναζήτηση</div>
                `);
            }
        } else {
            $('#addons-state-tabs').show();
            $('.tab-content').show();
            $('.search-results-container').hide();
        }
    }

    $('#input-search-query').on('input', function(e) {
        searchQuery = e.target.value;

        onSearchQueryChange();
    });
});