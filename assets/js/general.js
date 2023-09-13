var blueColor = "#36A2EB";
var lightBlueColor = '#8ACAF4';
var lighterBlueColor = '#EFFAFF';
var greenColor = "#46CBAA";
var lightGreenColor = "#A1EEDB";
var lighterGreenColor = '#EAF7F6';
var orangeColor = '#FE995F';
var lightOrangeColor = '#FBC4A4';

$(document).ready(function() {
    // autohide for success message on all pages
    setTimeout(function() {
        $(".success-message").fadeOut();
    }, 4000);

    // autohide for info message on all pages
    setTimeout(function() {
        $(".info-message").fadeOut();
    }, 4000);

    // autohide for error message on all pages
    setTimeout(function() {
        $(".error-message").fadeOut();
    }, 4000);
});

$.fn.switch = function(opts) {
    var element = this;
    var id = Math.random().toString().slice(-5);
    element.attr('id', 'switch-' + id);

    var labelMargin = 20;
    var leftOptionLabel = $(`<div>${opts.options[0].label}</div>`)
    var leftOptionLabelWidth = leftOptionLabel
        .css({ position: 'fixed', visibility: 'hidden', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '2px' })
        .appendTo('body')
        .width() + labelMargin;
    var rightOptionLabel = $(`<div>${opts.options[1].label}</div>`)
    var rightOptionLabelWidth = rightOptionLabel
        .css({ position: 'fixed', visibility: 'hidden', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '2px' })
        .appendTo('body')
        .width() + labelMargin;

    this.append(`
        <button type="button" class="btn btn-lg btn-toggle" data-toggle="button" aria-pressed="false" autocomplete="off">
            <div class="inner-handle"></div>
            <div class="handle"></div>
        </button>
        <style>
            #switch-${id} .btn-toggle:before {
                content: '${opts.options[0].label}' !important;
                width: ${leftOptionLabelWidth}px;
                left: -${leftOptionLabelWidth}px !important;
            }

            #switch-${id} .btn-toggle:after {
                content: '${opts.options[1].label}' !important;
                width: ${rightOptionLabelWidth}px;
                right: -${rightOptionLabelWidth}px !important;
            }
        </style>
    `);

    leftOptionLabel.remove();
    rightOptionLabel.remove();

    this.find('.btn-toggle').click(function(e) {
        element.find('.btn-toggle').toggleClass('active');

        if (element.find('.btn-toggle').hasClass('active')) {
            if (opts.options[1].onActivate !== 'undefined') {
                opts.options[1].onActivate();
            }
        } else {
            if (opts.options[0].onActivate !== 'undefined') {
                opts.options[0].onActivate();
            }
        }
    });
};

function showSuccessMessage(message) {
    var messageId = Math.random().toString().slice(-5);
    
    $('body').append(`
        <div class="position-sm-fixed top-0 start-50 mb-5" style="z-index: 2000">
            <div id="success-message-${messageId}" class="toast bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body text-white">
                    <div class="d-flex justify-content-between">
                        <span>${message}</span>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // bootstrap code to show the success-message toast
    const infoToast = document.getElementById(`success-message-${messageId}`);
    const infoToastInstance = bootstrap.Toast.getOrCreateInstance(infoToast)
    infoToastInstance.show()
};

function showErrorMessage(message) {
    var messageId = Math.random().toString().slice(-5);
    
    $('body').append(`
        <div class="position-sm-fixed top-0 start-50 mb-5" style="z-index: 2000">
            <div id="error-message-${messageId}" class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body text-white">
                    <div class="d-flex justify-content-between">
                        <span>${message}</span>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // bootstrap code to show the error-message toast
    const infoToast = document.getElementById(`error-message-${messageId}`);
    const infoToastInstance = bootstrap.Toast.getOrCreateInstance(infoToast)
    infoToastInstance.show()
};

function showMessage(message) {
    var messageId = Math.random().toString().slice(-5);
    
    $('body').append(`
        <div class="position-sm-fixed top-0 start-50 mb-5" style="z-index: 2000">
            <div id="message-${messageId}" class="toast bg-soft" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body">
                    <div class="d-flex justify-content-between">
                        <span>${message}</span>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // bootstrap code to show the message toast
    const infoToast = document.getElementById(`message-${messageId}`);
    const infoToastInstance = bootstrap.Toast.getOrCreateInstance(infoToast)
    infoToastInstance.show()
};

function getDiffBetweenValues(a, b) {
    var diff;
    diff = Math.abs(a - b);
    
    if (diff > 0) {
        if (a > b) {
            diff = (b * 100) / a;
            diff = 100 - diff;
        } else {
            diff = (a * 100) / b;
            diff = 100 - diff;
            diff = -diff;
        }
    }

    return diff;
}