$(document).ready(function() {
    $('.btn-generate-xml').click(function(e) {
        var button = $(e.target);
        var xmlType = button.data('xmlType');
        var defaultButtonText = button.text();

        button.html(`<div class="spinner-border" role="status" style="width: 15px; height: 15px;"><span class="visually-hidden">Loading...</span></div>&nbsp;${defaultButtonText}`);

        var generationFile = xmlType + '-xml.php';
        if (['facebook', 'google'].indexOf(xmlType) > -1) {
            generationFile = xmlType + '-csv.php';
        }

        $.ajax({
            url: generationFile,
            method: "GET",
            success: function() {
                showSuccessMessage(xmlGeneratedTranslation);
                    getXmlFileData(xmlType, function(data) {
                    renderXmlFileData(data);
                });
            },
            complete: function() {
                button.text(defaultButtonText);
            },
        });
    });

    var xmlType = $('.btn-generate-xml').data('xmlType');
    getXmlFileData(xmlType, function(data) {
        renderXmlFileData(data);
    });


    function getXmlFileData(xmlType, callback) {
        var dataFile = '../../../xml_csv_exports/' + xmlType + '_xml/products.xml';
        if (['facebook', 'google'].indexOf(xmlType) > -1) {
            dataFile = '../../../xml_csv_exports/' + xmlType + '_csv/products.csv';
        }

        $.ajax({
            url: 'ajaxFunctions.php',
            data: {
                values: 'getXmlData',
                url: dataFile,
            },
            method: 'POST',
            success: function(response) {
                if (typeof callback !== 'undefined') {
                    callback(JSON.parse(response));
                }
            },
        });
    }

    function renderXmlFileData(data) {
        $('.xml-product-count').text(data.productCount || 0);
        $('.xml-updated-at').text(data.updatedAt || '');
        if (data.updatedAt) {
            $('.xml-updated-at-label').text(updatedAtTranslation + ' ' + moment(data.updatedAt, 'DD-MM-YYYY hh:mm').fromNow());
        }
    }
});
