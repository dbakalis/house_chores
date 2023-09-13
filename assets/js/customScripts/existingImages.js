$(document).ready(function(){

    // populate modal with images on open button first click
    $("#existingImagesOpenBtn").click(function() {
        var ulExistingImages = $("#existingImagesListModal");
        var existingSource   = $(this).attr("existSource");

        // set hidden field value on existing images modal
        $("#modal_hiddenExistingSource").val(existingSource);

        // if modal has no images in the list then populate it.
        // if it has then there is no reason to run this ajax again
        if(ulExistingImages.html() == ""){
            $.ajax({
                url: "../includes/generalAjaxFunctions.php",
                data: {values: 'populateExistingImages', existingSource: existingSource},
                type: "POST", 
                success: function(output){	
                    ulExistingImages.html(output)

                    // also add an attribute on the submit button so we know where the submit came from
                    $("#chooseExistingImageBtn").attr("cameFrom", existingSource)
                }
            });
        }
    });
    
    // populate modal with images on open button first click - ONLY for slider cause we cant have many ids of #existingImagesOpenBtn
    $(".existingImagesOpenBtn").click(function() {
        var ulExistingImages    = $("#existingImagesListModal");
        var existingSource      = $(this).attr("existSource");
        var sliderImageIndex    = $(this).attr("sliderImageIndex");

        // set hidden field value on existing images modal
        $("#modal_hiddenExistingSource").val(existingSource);
        
        // also on slider only set the slider image index
        $("#modal_hiddenSliderImageIndex").val(sliderImageIndex);

        // if modal has no images in the list then populate it else there is no reason to run this ajax again
        if(ulExistingImages.html() == ""){
            $.ajax({
                url: "../includes/generalAjaxFunctions.php",
                data: {values: 'populateExistingImages', existingSource: existingSource},
                type: "POST", 
                success: function(output){	
                    ulExistingImages.html(output)

                    // also add an attribute on the submit button so we know where the submit came from
                    $("#chooseExistingImageBtn").attr("cameFrom", existingSource)
                }
            });
        }
    });

    // set img preview in modal from clicked from left side
    $("#existingImagesListModal").on("click", ".existingPhotoImage", function () {
        var imageName = $(this).data("src");

        // get existing source from modal
        var existingSource = $("#modal_hiddenExistingSource").val();

        if(existingSource == "category"){
            $("#existingImagePreviewArea").attr("src","../../images/categoriesImages/"+imageName);
        }else if(existingSource == "products"){
            $("#existingImagePreviewArea").attr("src","../../images/uploads/thumbs/"+imageName);
        }else if(existingSource == "blackfriday"){
            $("#existingImagePreviewArea").attr("src","../../images/blackFridayImages/"+imageName);
        }else if(existingSource == "category-news"){
            $("#existingImagePreviewArea").attr("src","../../images/categoriesNewsImages/"+imageName);
        }else if(existingSource == "news"){
            $("#existingImagePreviewArea").attr("src","../../images/newsImages/"+imageName);
        }else if(existingSource == "slider"){
            $("#existingImagePreviewArea").attr("src","../../images/sliderImages/"+imageName);
        }else if(existingSource == "manufacturer"){
            $("#existingImagePreviewArea").attr("src","../../images/manufacturersImages/"+imageName);
        }

        var listActives = document.getElementsByClassName("existingPhotoImage active");
        $(listActives[0]).removeClass("active");
        $(this).addClass("active");
    });

    // on choose button on modal event - differs between forms
    $("#existingImagesModal").on("click", "#chooseExistingImageBtn", function () {
        var chosenImageFull = $("#existingImagePreviewArea").attr("src");
        var subitCameFrom   = $("#chooseExistingImageBtn").attr("cameFrom");

        if(chosenImageFull == ""){
            alert("Επιλέξτε εικόνα απο την αριστερή στήλη.");
        }else{
            var theImage        = chosenImageFull.split('/').pop();
            var theImageHidden  = theImage.replace("thumb_", "");

            /*** Determine what to do based on the form we use*/
            if(theImage){
                if(subitCameFrom == "category"){

                    $("#cat_image").val(theImage);
                    $("#cat-img-preview").attr("src",chosenImageFull);
        
                    $("#cat-img-preview").show();
                    $("#cat-img-preview-div").show();
                    $(".removeImgButton").show();
        
                    uppy.reset();
    
                }else if(subitCameFrom == "category-news"){

                    $("#cat_image").val(theImage);
                    $("#cat-img-preview").attr("src",chosenImageFull);
        
                    $("#cat-img-preview").show();
                    $("#cat-img-preview-div").show();
                    $(".removeImgButton").show();
        
                    uppy.reset();
    
                }else if(subitCameFrom == "manufacturer"){

                    $("#manufactureImage_hidden").val(theImage);
                    $("#man-img-preview").attr("src",chosenImageFull);
        
                    $("#man-img-preview").show();
                    $("#man-img-preview-div").show();
                    $(".removeImgButton").show();
        
                    uppy.reset();
    
                }else if(subitCameFrom == "products"){

                    // number of addititional photos - comes from config
                    var imageSlots = existingImagesSlots; 
    
                    // current empty image hidden fields
                    var emptyHiddenList = [];
    
                    // fill the hidden fields array
                    for (let i = 0; i < imageSlots; i++) {
                        if( $("#image"+i).val() == ""){
                            emptyHiddenList.push($("#image"+i));
                        }
                    }
    
                    // loop the hidden fields and add the image in the first possible slot
                    var done = 0;
                    $.each(emptyHiddenList, function( key, hidField ) {
                        if(done == 0){
                            // current looped empty hidden input id
                            var hidId 		= hidField.attr("id");
                            let hidIdIndex 	= hidId.replace("image", "");
                
                            // image value
                            var imageSrc = "../../images/uploads/thumbs/" + theImage;
                
                            // image src preview
                            hidField.val(theImageHidden);
                
                            // show the sortable list elements and set some info
                            $("#prevMainImgSrc"+hidIdIndex).attr("src",imageSrc);
                            $("#imageName"+hidIdIndex).text(theImage);
                            $("#prevMoreImg"+hidIdIndex).show();
                            $("#imageRemove_"+hidIdIndex).show();
                
                            done = 1;
                        }
                    });
    
                    // uppy.reset();
                }else if(subitCameFrom == "blackfriday"){
                    $("#image").val(theImage);
                    $("#bf-cat-img-preview").attr("src",chosenImageFull);
        
                    $("#bf-cat-img-preview").show();
                    $("#bf-cat-img-preview-div").show();
                    $(".removeImgButton").show();
        
                    uppy.reset();
                }else if(subitCameFrom == "news"){
                    $("#image").val(theImage);
                    $("#news-img-preview").attr("src",chosenImageFull);
        
                    $("#news-img-preview").show();
                    $("#news-img-preview-div").show();
                    $(".removeImgButton").show();
        
                    uppy.reset();
                }else if(subitCameFrom == "slider"){
                    var sliderImageIndex = $("#modal_hiddenSliderImageIndex").val();

                    if(sliderImageIndex !=""){
                        $("#slider"+sliderImageIndex+"_image").val(theImage);
                        $("#sliderImgPrev_"+sliderImageIndex).attr("src", "../../images/sliderImages/"+theImage);
                        
                        $("#sliderImgPrev_"+sliderImageIndex).show();
                        $(".removeImgButton").show();
                    }
                }
            }else{
                alert("Επιλέξτε εικόνα απο την αριστερή στήλη.");
            }
            
        }
    });

    // on choose button on modal event - differs between forms
    $(".removeImgButton").click(function () {
        var subitCameFrom  = $("#existingImagesOpenBtn").attr("existsource");

        // if its undefined that means the id existingImagesOpenBtn doesnt exist.
        // then a class may exist ;) ==> so we are in slider docs
        if(subitCameFrom == undefined){
            subitCameFrom = $(".existingImagesOpenBtn").attr("existsource");
        }

        if(subitCameFrom == "category"){

            uppy.reset();
            $("#cat_image").val("");
            $("#cat-img-preview").hide();
            $("#cat-img-preview-div").hide();
            $(this).hide();

        }else if(subitCameFrom == "category-news"){

            uppy.reset();
            $("#cat_image").val("");
            $("#cat-img-preview").hide();
            $("#cat-img-preview-div").hide();
            $(this).hide();

        }else if(subitCameFrom == "manufacturer"){

            uppy.reset();
            $("#manufactureImage_hidden").val("");
            $("#man-img-preview").hide();
            $("#man-img-preview-div").hide();
            $(this).hide();

        }else if(subitCameFrom == "products"){

            var pressedId   = $(this).attr("id");
            var splitIdArr	= pressedId.split("_");
            var imgIndex 	= splitIdArr[splitIdArr.length-1];

            $("#image"+imgIndex).val("");
            $("#prevMoreImg"+imgIndex).hide();
            $(this).hide();
            uppy.reset();

            // getting the children of the sorting list (images)
            var listElements = $("#sortable").children();

            // loop the elements of sortable and store its children with ids arrays
            var listImages 	= [];
            var listRmvBtns = [];
            var listLis 	= [];
            var listSpans 	= [];
            var listPosIndx = [];
            
            listElements.each(function(key,val){
                listLis.push($(val));
                listSpans.push($(val["children"][0]["children"][1]["children"][0]["children"][1]["children"][0]));
                listRmvBtns.push($(val["children"][0]["children"][1]["children"][0]["children"][2]["children"][0]));
                listImages.push($(val["children"][0]["children"][0]["children"][0]));
                listPosIndx.push($(val["children"][0]["children"][1]["children"][0]["children"][0]["children"][0]));
            });

            // get current total hidden elements - also create an array with ints (ids) of the leght of the elements
            var hidElementsCur 	= 0 ;
            var counter0 		= 0 ;
            var myElementsIds 	= [] ;

            $.each(listImages, function( key, imgElement ) {
                if($(listLis[counter0]).css('display') == 'none'){
                    hidElementsCur +=1;
                }
    
                myElementsIds.push(counter0);
                counter0 +=1;
            });

            // reverse the stored elements - we need it for hidden fieds later
            myElementsIds.reverse();
            
            // loop image elemtns and set the hidden fields. Also change the remove buttons ids
            var counter 	= 0;
            var counterLoop = 0;
            var counterH 	= hidElementsCur;

            $.each(listImages, function( key, imgElement ) {
                var imgSrc 			= imgElement.attr("src");
                var imgSrcArr		= imgSrc.split("/");
                var imgeName 		= imgSrcArr[imgSrcArr.length-1];
    
                // elements of sortable
                if($(listLis[counterLoop]).css('display') != 'none'){
    
                    $("#image"+counter).val(imgeName);
                    $(listImages[counterLoop]).attr('id',"prevMainImgSrc"+counter);
                    $(listSpans[counterLoop]).attr('id',"imageName"+counter);
                    $(listLis[counterLoop]).attr('id',"prevMoreImg"+counter);
                    $(listRmvBtns[counterLoop]).attr('id',"imageRemove_"+counter);
                    $(listPosIndx[counterLoop]).attr('id',"imgPositionIndex_"+counter);
                    $(listPosIndx[counterLoop]).text(counter+1);
    
                    counter +=1;
                }else{
    
                    $("#image"+myElementsIds[counterH-hidElementsCur]).val(imgeName);
                    $(listImages[counterLoop]).attr('id',"prevMainImgSrc"+myElementsIds[counterH-hidElementsCur]);
                    $(listSpans[counterLoop]).attr('id',"imageName"+myElementsIds[counterH-hidElementsCur]);
                    $(listLis[counterLoop]).attr('id',"prevMoreImg"+myElementsIds[counterH-hidElementsCur]);
                    $(listRmvBtns[counterLoop]).attr('id',"imageRemove_"+myElementsIds[counterH-hidElementsCur]);
                    $(listPosIndx[counterLoop]).attr('id',"imgPositionIndex_"+myElementsIds[counterH-hidElementsCur]);
                    $(listPosIndx[counterLoop]).text(myElementsIds[counterH-hidElementsCur]+1);
    
                    counterH +=1;
                }
    
                counterLoop +=1;
            });
    
            // do some cleaning
            $(".ui-state-default").each(function(key,elementx){
                if($(elementx).css('display') == 'none'){
                    var cleanIndex 	= $(elementx).attr("id").replace("prevMoreImg", "");
                    $("#image"+cleanIndex).val("");
                }
            });
        }else if(subitCameFrom == "blackfriday"){

            uppy.reset();
            $("#image").val("");
            $("#bf-cat-img-preview").hide();
            $("#bf-cat-img-preview-div").hide();
            $(this).hide();
        }else if(subitCameFrom == "news"){

            uppy.reset();
            $("#image").val("");
            $("#news-img-preview").hide();
            $("#news-img-preview-div").hide();
            $(this).hide();
        }else if(subitCameFrom == "slider"){

            var sliderImageIndex = $(this).attr("sliderImageIndex");

            if(sliderImageIndex !=""){
                $("#slider"+sliderImageIndex+"_image").val("");
                $("#sliderImgPrev_"+sliderImageIndex).attr("src", ""); 

                $("#sliderImgPrev_"+sliderImageIndex).hide(); 
                $(this).hide(); 
            }
        }
    });

});