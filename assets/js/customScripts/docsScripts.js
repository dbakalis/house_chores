$(document).ready(function(){

    // on toast hide clean the url (remove the message parameter)
    $('#sliderLangPicker').on('change', function (element) {
        window.location.href = $(this).val();
    });


    // delete product
    $(".docsListTbody").on("click", ".deleteDoc", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var docId           = $(this).attr("docId");
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteDocAjax', docId: docId},
                type: "POST", 
                success: function(output){	
                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){ 
                        $(buttonDelete).parents('tr:first').remove();             
                    });
                }
            });
            
        }
    });

    // delete doc translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteDocTranslationAjax', transId: transId},
                type: "POST", 
                success: function(output){	
                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){ 
                        $(buttonDelete).parents('tr:first').remove();                    
                    });
                }
            });
            
        }
    });

    $('#select-language').change(function(e) {
        location.href = 'slider.php?lang=' + e.target.value;
    });

    // quick activity change
    $(".docsListTbody").on("click", ".quickDocActive", function () {
        var activitySwitch      = $(this);
        var docId              = $(this).attr("docId");
        var newStatus           = (activitySwitch.is(':checked'))? 1 : 0;
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', docId: docId, newStatus: newStatus},
            type: "POST", 
            success: function(output){	
                
            }
        });
    });
});

// if we are in slider view
if ($('.slider-settings').length) {
    // init slides
    initSliderSettings();

    $('.btn-add-slide').click(function() {
        var nextPosition = settings.slides.length > 0 ? Math.max(...settings.slides.map((s) => s.order)) + 1 : 1;

        var slide = {
            id: Math.random().toString().slice(-5),
            order: nextPosition,
        };

        settings.slides.push(slide);

        $('.btn-save').show();
        $('.no-slides-message').hide();

        renderSlide(slide);
    });

    // initialize hide button on max slides message alert
    $('.max-slides-message .btn-hide').click(function() {
        $('.max-slides-message').addClass('d-none');
    });
}

/**
 * Initialize slides list by rendering each slide using the renderSlide method
 */
function initSliderSettings() {
    // if config has not created yet
    settings.slides = settings.slides || [];

    if (settings.slides.length > 0) {
        // render each slide
        settings.slides.forEach(function(slide) {
            renderSlide(slide);
        });
        // hide message appearing when no slides exist yet
        $('.no-slides-message').hide();
    } else {
        // hide save button because there is nothing to save
        $('.btn-save').hide();
        // show message appearing when no slides exist yet
        $('.no-slides-message').show();
    }
}

function renderSlide(slide) {
    // get a clone element of the slide template
    var slideItemTemplate = $('.slide[template]').clone(true).removeAttr('template').removeClass('d-none');
    slideItemTemplate.attr('id', slide.id);
    slideItemTemplate.find('input[name="id[]"]').val(slide.id);
    if (slide.active === '1') {
        slideItemTemplate.find('.active-toggle').attr('checked', '');
        slideItemTemplate.find('input[name="active[]"]').val('1');
    } else {
        slideItemTemplate.find('input[name="active[]"]').val('0');
    }
    slideItemTemplate.find('input[name="order[]"]').val(slide.order);
    slideItemTemplate.find('input[name="url[]"]').val(slide.url);
    slideItemTemplate.find('input[name="title[]"]').val(slide.title);
    slideItemTemplate.find('input[name="subtitle[]"]').val(slide.subtitle);
    slideItemTemplate.find('input[name="black[]"]').val(slide.black);
    slideItemTemplate.find('input[name="image[]"]').val(slide['image']);
    slideItemTemplate.find('input[name="mobile-image[]"]').val(slide['mobile-image']);
    slideItemTemplate.find('input[name="title-size[]"').val(slide['title-size']);
    slideItemTemplate.find('input[name="subtitle-size[]"').val(slide['subtitle-size']);
    slideItemTemplate.find('input[name="top-position[]"').val(slide['top-position']);
    slideItemTemplate.find('input[name="left-position[]"').val(slide['left-position']);
    slideItemTemplate.find('input[name="text-color[]"').val(slide['text-color']);
    slideItemTemplate.find('select[name="text-weight[]"').val(slide['text-weight']);
    slideItemTemplate.find('input[name="backdrop[]"').val(slide.backdrop);

    // every time active toggle changes
    slideItemTemplate.find('.active-toggle').change(function(e) {
        // count active slides
        var activeSlidesCount = $('.slide[id] .active-toggle:checked').length;

        if (activeSlidesCount > parseInt(maxSlidesPermitted)) {
            // if user reached the limit
            e.target.checked = false;
            $('.max-slides-message').removeClass('d-none');
        } else {
            // change the hidden (active / not active) value of slide
            slideItemTemplate.find('input[name="active[]"]').val(e.target.checked ? '1' : '0');
        }
    });

    // render the image to be shown in it's preview container
    if (slide['image'] && slide['image'].length > 0) {
        slideItemTemplate.find('.image-showcase').append(`
            <img class="w-100" src="../../images/sliderImages/${slide['image']}" />
        `);
    }

    // initialize toggle settings button (to show/hide the settings of the slide)
    slideItemTemplate.find('.btn-toggle-settings').attr('href', '#settingsCollapse' + slide.id);
    // initialize the settings container
    slideItemTemplate
        .find('.settings.collapse')
        .attr('id', 'settingsCollapse' + slide.id)
        // change the icon to caret down (ready for opening settings)
        .on('show.bs.collapse', function() {
            slideItemTemplate.find('.btn-toggle-settings').find('i').removeClass('bi-caret-down-fill').addClass('bi-caret-up-fill');
        })
        // change the icon to caret up (ready for closing settings)
        .on('hide.bs.collapse', function() {
            slideItemTemplate.find('.btn-toggle-settings').find('i').removeClass('bi-caret-up-fill').addClass('bi-caret-down-fill');
        });

    // on button remove slide click
    slideItemTemplate.find('.btn-remove').click(function() {
        // remove the slide element
        slideItemTemplate.remove();
        // remove slide object from the array
        settings.slides.splice(settings.slides.findIndex((s) => s.id === slide.id), 1);

        // if no slides left show a message
        if (settings.slides.length === 0) {
            $('.no-slides-message').show();
        }
    });

    // append slide element to the container
    $('.slider-settings .slides-container').append(slideItemTemplate);

    // if it is the first slide
    if (slideItemTemplate.index() === 1) {
        // disable removal of the slide
        slideItemTemplate.find('.btn-remove').hide();
    }

    // initialize Uppy instance
    var uppy = new Uppy.Core();

    // set styling options of Uppy
    uppy.use(Uppy.Dashboard, {
        inline: true,
        target: $('.slides-container .slide[id="' + slide.id + '"] .image-drag-drop')[0],
        theme: 'light',
        height: 180,
    });

    // on file selected (added on uppy) do a HTTP post request to the endpoint
    uppy.on('file-added', (file) => {
        uppy.use(Uppy.XHRUpload, { 
            endpoint: '../filemanager/sliderImageUpload.php',
            fieldName: 'my_file',
        });
    });

    // on successfull upload set cat_image hidden field the uploaded image name
    uppy.on('complete', (result) => {
        var newImageName = result.successful[0].name.replace(' ', '_');

        slideItemTemplate.find('.image-showcase').append(`
            <img class="w-100" src="../../images/sliderImages/${newImageName}" />
        `);

        slideItemTemplate.find('input[name="image[]"]').val(newImageName);
    });

    // keep Uppy instance to the slide object
    slide.fileUploadInstance = uppy;
}

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}
