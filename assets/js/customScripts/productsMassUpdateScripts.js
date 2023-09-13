$(document).ready(function(){

    // save preview settings of the listing table
    $("#prodPreviewSettingsSaveBtn").click(function() {
        var checked_name        = ($("#prevSetting_name").is(':checked'))? 1 : 0;
        var checked_code        = ($("#prevSetting_code").is(':checked'))? 1 : 0;
        var checked_active      = ($("#prevSetting_active").is(':checked'))? 1 : 0;
        var checked_prices      = ($("#prevSetting_prices").is(':checked'))? 1 : 0;
        var checked_stock       = ($("#prevSetting_stock").is(':checked'))? 1 : 0;
        var checked_weight      = ($("#prevSetting_weight").is(':checked'))? 1 : 0;
        var checked_skroutz     = ($("#prevSetting_skroutz").is(':checked'))? 1 : 0;
        var checked_bestprice   = ($("#prevSetting_bestprice").is(':checked'))? 1 : 0;
        var checked_shopflix    = ($("#prevSetting_shopflix").is(':checked'))? 1 : 0;
        var checked_car         = ($("#prevSetting_car").is(':checked'))? 1 : 0;
        var checked_facebook    = ($("#prevSetting_facebook").is(':checked'))? 1 : 0;
        var checked_google      = ($("#prevSetting_google").is(':checked'))? 1 : 0;
        var checked_listno      = ($("#prevSetting_listno").is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {
                values: 'saveMassUpdatePreviewSettings', 
                settingsPreview: {
                    name: checked_name, 
                    prices: checked_prices,
                    stock: checked_stock,
                    weight: checked_weight,
                    active: checked_active,
                    productCode: checked_code,
                    skroutz: checked_skroutz,
                    bestprice: checked_bestprice,
                    shopflix: checked_shopflix,
                    car: checked_car,
                    facebook: checked_facebook,
                    google: checked_google,
                    listno: checked_listno
                }
            },
            type: "POST", 
            success: function(output){	
                location.reload();
            }
        });
    });



    // check / uncheck all checkboxes for active
    $("#massUpdateCheckAllActive").click(function() {
        // find the new checkstatus
        var checkStatus = ($(this).is(':checked'))? true : false;

        // get the list of checkboxes
        var activeChecksList = $(".activityMassCheckbox");
        for (var activeCheck of activeChecksList) {
            // change it depending on checkStatus
            $(activeCheck).prop( "checked", checkStatus );
        }
    });

    // check / uncheck all checkboxes for skroutz xml
    $("#massUpdateCheckAllSkroutz").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("skroutzMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for skroutz xml
    $("#massUpdateCheckAllBestprice").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("bestpriceMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for shopflix xml
    $("#massUpdateCheckAllShopflix").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("shopflixMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for skroutz xml
    $("#massUpdateCheckAllCargr").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("cargrMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for skroutz xml
    $("#massUpdateCheckAllFacebook").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("facebookMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for skroutz xml
    $("#massUpdateCheckAllGoogle").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("googleMassCheckbox", checkStatus);
    });
    
    // check / uncheck all checkboxes for use stock level
    $("#massUpdateCheckAllUseStock").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("useStockMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for delete
    $("#massUpdateCheckAllDelete").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("deleteMassCheckbox", checkStatus);
    });



    // check / uncheck all checkboxes for active
    $("#massUpdateCheckAllActive_mobile").click(function() {
        // find the new checkstatus
        var checkStatus = ($(this).is(':checked'))? true : false;
       
        // get the list of checkboxes
        var activeChecksList = $(".activityMassCheckbox");

        for (var activeCheck of activeChecksList) {
            // change it depending on checkStatus
            $(activeCheck).prop( "checked", checkStatus );
        }
    });

    // check / uncheck all checkboxes for skroutz xml
    $("#massUpdateCheckAllSkroutz_mobile").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("skroutzMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for shopflix xml
    $("#massUpdateCheckAllShopflix_mobile").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("shopflixMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for use stock level
    $("#massUpdateCheckAllUseStock_mobile").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("useStockMassCheckbox", checkStatus);
    });

    // check / uncheck all checkboxes for delete
    $("#massUpdateCheckAllDelete_mobile").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("deleteMassCheckbox", checkStatus);
    });

    function checkUncheckBoxes(className, checkStatus){
        // get the list of checkboxes
        var elementList = $("."+className);
        
        for (var elementItem of elementList) {
            // change it depending on checkStatus
            $(elementItem).prop( "checked", checkStatus );
        }
    }
});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}