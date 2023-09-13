$(document).ready(function() {
    $('select[name="lang"]').change(function(e) {
        window.location.href = window.location.origin + window.location.pathname + '?lang=' + e.target.value;
    });

    if ($('#addEditPromotionTranslationsModal').length) {
        // event listener when promotion translation modal is shown
        $('#addEditPromotionTranslationsModal')[0].addEventListener('show.bs.modal', function(e) {
            // get id from clicked button parent element
            var promotionId = $(e.relatedTarget).parent().data('promotionId');
            // pass promotion id to modal element as data
            $('#addEditPromotionTranslationsModal').data('promotionId', promotionId);
            // trigger change of language select to initialize first's language translation values
            $('#addEditPromotionTranslationsModal #modal_transLang').trigger('change');
        });
    }

    $('#addEditPromotionTranslationsModal #modal_transLang').change(function(e) {
        // get promotion id from modal
        var promotionId = $('#addEditPromotionTranslationsModal').data('promotionId');
        
        // find promotion related to opened modal
        var promotionTranslations = promotions.find(function(promotion) {
            return parseInt(promotion.promoId) === promotionId;
        }).translations;

        // get language of languages select element
        var languageSelected = e.target.value;
        // find translation related to selected language
        var translation = promotionTranslations.find(function(translation) {
            return translation.language = languageSelected;
        });
        
        if (translation) {
            // populate translation modal inputs
            $('#addEditPromotionTranslationsModal #modal_promoId').val(translation.id);
            $('#addEditPromotionTranslationsModal #modal_transName').val(translation.foreignName);
        }
    });

    // event listener for clicking save on promotion translation modal
    $('#submitEditPromotionTransBtn').click(function() {
        // get id of translation from hidden input
        var translationId = $('#addEditPromotionTranslationsModal #modal_promoId').val();
        // get translation name
        var translationName = $('#addEditPromotionTranslationsModal #modal_transName').val();

        $.ajax({
            url: "ajaxFunctions.php",
            data: {
                values: 'updatePromotionTranslationAjax',
                translationId: translationId,
                translationName: translationName,
            },
            type: "POST", 
            success: function(output){	
                var updated = parseInt(output);

                if (updated) {
                    location.reload();
                }
            },
        });
    });
});