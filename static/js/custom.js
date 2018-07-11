/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
(function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})(jQuery, 'smartresize');

var chatSocket;

function init_socketio() {
    chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/details/' + 'device_' + device_pk + '/');
    chatSocket.onclose = function (e) {
        console.error('Socket closed unexpectedly');
    };
}

/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            } else {
                if ($BODY.is(".nav-sm")) {
                    $SIDEBAR_MENU.find("li").removeClass("active active-sm");
                    $SIDEBAR_MENU.find("li ul").slideUp();
                }
            }
            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        console.log('clicked - menu toggle');

        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: {preventDefault: true}
        });
    }
};
// /Sidebar

var randNum = function () {
    return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};

// Panel toolbox
$(document).ready(function () {
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function () {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery

// iCheck
$(document).ready(function () {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

// hover and retain popover when on popover content
var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    var container, timeout;

    originalLeave.call(this, obj);

    if (obj.currentTarget) {
        container = $(obj.currentTarget).siblings('.popover');
        timeout = self.timeout;
        container.one('mouseenter', function () {
            // We entered the actual popover – call off the dogs
            clearTimeout(timeout);
            // Let's monitor popover content instead
            container.one('mouseleave', function () {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
        });
    }
};

$('body').popover({
    selector: '[data-popover]',
    trigger: 'click hover',
    delay: {
        show: 50,
        hide: 400
    }
});

function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
}

/* STARRR */

function init_starrr() {

    if (typeof(starrr) === 'undefined') {
        return;
    }
    console.log('init_starrr');

    $(".stars").starrr();

    $('.stars-existing').starrr({
        rating: 4
    });

    $('.stars').on('starrr:change', function (e, value) {
        $('.stars-count').html(value);
    });

    $('.stars-existing').on('starrr:change', function (e, value) {
        $('.stars-count-existing').html(value);
    });

};

function init_skycons() {

    if (typeof(Skycons) === 'undefined') {
        return;
    }
    console.log('init_skycons');

    var icons = new Skycons({
            "color": "#73879C"
        }),
        list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
        ],
        i;

    for (i = list.length; i--;)
        icons.set(list[i], list[i]);

    icons.play();

}


function init_chart_doughnut() {

    if (typeof(Chart) === 'undefined') {
        return;
    }

    console.log('init_chart_doughnut');

    if ($('.canvasDoughnut').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "Symbian",
                    "Blackberry",
                    "Other",
                    "Android",
                    "IOS"
                ],
                datasets: [{
                    data: [15, 20, 30, 10, 30],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut').each(function () {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }
}

function init_gauge() {

    if (typeof(Gauge) === 'undefined') {
        return;
    }

    console.log('init_gauge [' + $('.gauge-chart').length + ']');

    console.log('init_gauge');


    var chart_gauge_settings = {
        lines: 12,
        angle: 0,
        lineWidth: 0.4,
        pointer: {
            length: 0.75,
            strokeWidth: 0.042,
            color: '#1D212A'
        },
        limitMax: 'false',
        colorStart: '#1ABC9C',
        colorStop: '#1ABC9C',
        strokeColor: '#F0F3F3',
        generateGradient: true
    };


    if ($('#chart_gauge_01').length) {

        var chart_gauge_01_elem = document.getElementById('chart_gauge_01');
        var chart_gauge_01 = new Gauge(chart_gauge_01_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text').length) {

        chart_gauge_01.maxValue = 6000;
        chart_gauge_01.animationSpeed = 32;
        chart_gauge_01.set(3200);
        chart_gauge_01.setTextField(document.getElementById("gauge-text"));

    }

    if ($('#chart_gauge_02').length) {

        var chart_gauge_02_elem = document.getElementById('chart_gauge_02');
        var chart_gauge_02 = new Gauge(chart_gauge_02_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text2').length) {

        chart_gauge_02.maxValue = 9000;
        chart_gauge_02.animationSpeed = 32;
        chart_gauge_02.set(2400);
        chart_gauge_02.setTextField(document.getElementById("gauge-text2"));

    }
}

/* AUTOSIZE */

function init_autosize() {
    if (typeof $.fn.autosize !== 'undefined') {
        autosize($('.resizable_textarea'));
    }
};

/* PARSLEY */

function init_parsley() {

    if (typeof(parsley) === 'undefined') {
        return;
    }
    console.log('init_parsley');

    $ /*.listen*/('parsley:field:validate', function () {
        validateFront();
    });
    $('#demo-form .btn').on('click', function () {
        $('#demo-form').parsley().validate();
        validateFront();
    });
    var validateFront = function () {
        if (true === $('#demo-form').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    $ /*.listen*/('parsley:field:validate', function () {
        validateFront();
    });
    $('#demo-form2 .btn').on('click', function () {
        $('#demo-form2').parsley().validate();
        validateFront();
    });
    var validateFront = function () {
        if (true === $('#demo-form2').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    try {
        hljs.initHighlightingOnLoad();
    } catch (err) {
    }

};


/* INPUTS */

function onAddTag(tag) {
    alert("Added a tag: " + tag);
}

function onRemoveTag(tag) {
    alert("Removed a tag: " + tag);
}

function onChangeTag(input, tag) {
    alert("Changed a tag: " + tag);
}

// tags input
function init_TagsInput() {

    if (typeof $.fn.tagsInput !== 'undefined') {

        $('#tags_1').tagsInput({
            width: 'auto'
        });

    }

};

/* SELECT2 */

function init_select2() {

    if (typeof(select2) === 'undefined') {
        return;
    }
    console.log('init_toolbox');

    $(".select2_single").select2({
        placeholder: "Select a state",
        allowClear: true
    });
    $(".select2_group").select2({});
    $(".select2_multiple").select2({
        maximumSelectionLength: 4,
        placeholder: "With Max Selection limit 4",
        allowClear: true
    });

};

/* CROPPER */

function init_cropper() {


    if (typeof($.fn.cropper) === 'undefined') {
        return;
    }
    console.log('init_cropper');

    var $image = $('#image');
    var $download = $('#download');
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
    var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        crop: function (e) {
            $dataX.val(Math.round(e.x));
            $dataY.val(Math.round(e.y));
            $dataHeight.val(Math.round(e.height));
            $dataWidth.val(Math.round(e.width));
            $dataRotate.val(e.rotate);
            $dataScaleX.val(e.scaleX);
            $dataScaleY.val(e.scaleY);
        }
    };


    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();


    // Cropper
    $image.on({
        'build.cropper': function (e) {
            console.log(e.type);
        },
        'built.cropper': function (e) {
            console.log(e.type);
        },
        'cropstart.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'cropmove.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'cropend.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'crop.cropper': function (e) {
            console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
        },
        'zoom.cropper': function (e) {
            console.log(e.type, e.ratio);
        }
    }).cropper(options);


    // Buttons
    if (!$.isFunction(document.createElement('canvas').getContext)) {
        $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }

    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }


    // Download
    if (typeof $download[0].download === 'undefined') {
        $download.addClass('disabled');
    }


    // Options
    $('.docs-toggles').on('change', 'input', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var type = $this.prop('type');
        var cropBoxData;
        var canvasData;

        if (!$image.data('cropper')) {
            return;
        }

        if (type === 'checkbox') {
            options[name] = $this.prop('checked');
            cropBoxData = $image.cropper('getCropBoxData');
            canvasData = $image.cropper('getCanvasData');

            options.built = function () {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            };
        } else if (type === 'radio') {
            options[name] = $this.val();
        }

        $image.cropper('destroy').cropper(options);
    });


    // Methods
    $('.docs-buttons').on('click', '[data-method]', function () {
        var $this = $(this);
        var data = $this.data();
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }

        if ($image.data('cropper') && data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option);
                    break;

                case 'getCroppedCanvas':
                    if (result) {

                        // Bootstrap's Modal
                        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                        if (!$download.hasClass('disabled')) {
                            $download.attr('href', result.toDataURL());
                        }
                    }

                    break;
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    });

    // Keyboard
    $(document.body).on('keydown', function (e) {
        if (!$image.data('cropper') || this.scrollTop > 300) {
            return;
        }

        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }
    });

    // Import image
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {

                        // Revoke when load complete
                        URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }


};

/* CROPPER --- end */

/* KNOB */

function init_knob() {

    if (typeof($.fn.knob) === 'undefined') {
        return;
    }
    console.log('init_knob');

    $(".knob").knob({
        change: function (value) {
            //console.log("change : " + value);
        },
        release: function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel: function () {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
         return value + '%';
         },*/
        draw: function () {

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv) // Arc
                    ,
                    pa // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }

    });

    // Example of infinite knob, iPod click wheel
    var v, up = 0,
        down = 0,
        i = 0,
        $idir = $("div.idir"),
        $ival = $("div.ival"),
        incr = function () {
            i++;
            $idir.show().html("+").fadeOut();
            $ival.html(i);
        },
        decr = function () {
            i--;
            $idir.show().html("-").fadeOut();
            $ival.html(i);
        };
    $("input.infinite").knob({
        min: 0,
        max: 20,
        stopper: false,
        change: function () {
            if (v > this.cv) {
                if (up) {
                    decr();
                    up = 0;
                } else {
                    up = 1;
                    down = 0;
                }
            } else {
                if (v < this.cv) {
                    if (down) {
                        incr();
                        down = 0;
                    } else {
                        down = 1;
                        up = 0;
                    }
                }
            }
            v = this.cv;
        }
    });

};

/* INPUT MASK */

function init_InputMask() {

    if (typeof($.fn.inputmask) === 'undefined') {
        return;
    }
    console.log('init_InputMask');

    $(":input").inputmask();

};

/* SMART WIZARD */

function init_SmartWizard() {

    if (typeof($.fn.smartWizard) === 'undefined') {
        return;
    }
    console.log('init_SmartWizard');

    $('#wizard').smartWizard();

    $('#wizard_verticle').smartWizard({
        transitionEffect: 'slide'
    });

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');

};

function init_charts() {

    console.log('run_charts  typeof [' + typeof(Chart) + ']');

    if (typeof(Chart) === 'undefined') {
        return;
    }

    console.log('init_charts');


    Chart.defaults.global.legend = {
        enabled: false
    };


    if ($('#canvas_line').length) {

        var canvas_line_00 = new Chart(document.getElementById("canvas_line"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line1').length) {

        var canvas_line_01 = new Chart(document.getElementById("canvas_line1"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line2').length) {

        var canvas_line_02 = new Chart(document.getElementById("canvas_line2"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line3').length) {

        var canvas_line_03 = new Chart(document.getElementById("canvas_line3"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line4').length) {

        var canvas_line_04 = new Chart(document.getElementById("canvas_line4"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    // Line chart
    //TODO the format of message need to reformat

    if ($('#xyzLineChart').length) {

        var ctx = document.getElementById("xyzLineChart");
        var xyzLineChartDataX = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var xyzLineChartDataY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var xyzLineChartDataZ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var xyzLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "8", "9", "10", "11", "12", "13", "14", "15"],
                datasets: [{
                    label: "X dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: xyzLineChartDataX
                }, {
                    label: "Y dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: xyzLineChartDataY
                }, {
                    label: "Z dataset",
                    backgroundColor: "rgba(22, 100, 106, 0.29)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: xyzLineChartDataZ
                }]
            },
        });

        chatSocket.addEventListener("message", function (e) {
            var data = JSON.parse(e.data);
            var message = JSON.parse(data['message']);
            if (message['Name'].startsWith("HNC")) {
                xyzLineChartDataX.push(parseFloat(message['PositionInfo']['Ax_1'].split(":")[1].split(" ")[0]));
                xyzLineChartDataX.shift();
                xyzLineChartDataY.push(parseFloat(message['PositionInfo']['Ax_2'].split(":")[1].split(" ")[0]));
                xyzLineChartDataY.shift();
                xyzLineChartDataZ.push(parseFloat(message['PositionInfo']['Ax_3'].split(":")[1].split(" ")[0]));
                xyzLineChartDataZ.shift();
            }else if (message['Name'].startsWith("1200")) {
                xyzLineChartDataX.push(parseFloat(message['PositionInfo']['Rax_1'].split(":")[1].split(" ")[0]));
                xyzLineChartDataX.shift();
                xyzLineChartDataY.push(parseFloat(message['PositionInfo']['Rax_2'].split(":")[1].split(" ")[0]));
                xyzLineChartDataY.shift();
                xyzLineChartDataZ.push(parseFloat(message['PositionInfo']['Rax_3'].split(":")[1].split(" ")[0]));
                xyzLineChartDataZ.shift();
            }

            xyzLineChart.update();
        });
    }

    if ($('#abcLineChart').length) {

        var ctx = document.getElementById("abcLineChart");
        var abcLineChartDataA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var abcLineChartDataC = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var abcLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "8", "9", "10", "11", "12", "13", "14", "15"],
                datasets: [{
                    label: "A dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: abcLineChartDataA
                }, {
                    label: "C dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: abcLineChartDataC
                }]
            },
        });

        chatSocket.addEventListener("message", function (e) {
            var data = JSON.parse(e.data);
            var message = JSON.parse(data['message']);
            if (message['Name'].startsWith("HNC")) {
                xyzLineChartDataX.push(parseFloat(message['PositionInfo']['Ax_4'].split(":")[1].split(" ")[0]));
                xyzLineChartDataX.shift();
                xyzLineChartDataY.push(parseFloat(message['PositionInfo']['Ax_5'].split(":")[1].split(" ")[0]));
                xyzLineChartDataY.shift();
            }else if (message['Name'].startsWith("1200")) {
                xyzLineChartDataX.push(parseFloat(message['PositionInfo']['Rax_4'].split(":")[1].split(" ")[0]));
                xyzLineChartDataX.shift();
                xyzLineChartDataY.push(parseFloat(message['PositionInfo']['Rax_5'].split(":")[1].split(" ")[0]));
                xyzLineChartDataY.shift();
            }
            abcLineChart.update();
        });
    }

    if ($('#chart_plot_spindle_load').length) {

        var ctx = document.getElementById("chart_plot_spindle_load");
        var chart_plot_spindle_load_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var chart_plot_spindle_load = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                datasets: [{
                    label: "spindle load dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: chart_plot_spindle_load_data
                },]
            },
        });

        chatSocket.addEventListener("message", function (e) {
            var data = JSON.parse(e.data);
            var message = JSON.parse(data['message']);
            chart_plot_spindle_load_data.push(message['attributes'][5]['value']);
            chart_plot_spindle_load_data.shift();
            chart_plot_spindle_load.update();
        });
    }

    if ($('#chart_plot_spindle_speed').length) {

        var ctx = document.getElementById("chart_plot_spindle_speed");
        var chart_plot_spindle_speed_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var chart_plot_spindle_speed = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                datasets: [{
                    label: "spindle speed dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: chart_plot_spindle_speed_data
                },]
            },
        });

        chatSocket.addEventListener("message", function (e) {
            var data = JSON.parse(e.data);
            var message = JSON.parse(data['message']);
            chart_plot_spindle_speed_data.push(message['attributes'][6]['value']);
            chart_plot_spindle_speed_data.shift();
            chart_plot_spindle_speed.update();
        });
    }

    // Bar chart

    if ($('#mybarChart').length) {

        var ctx = document.getElementById("mybarChart");
        var mybarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: '# of Votes',
                    backgroundColor: "#26B99A",
                    data: [51, 30, 40, 28, 92, 50, 45]
                }, {
                    label: '# of Votes',
                    backgroundColor: "#03586A",
                    data: [41, 56, 25, 48, 72, 34, 12]
                }]
            },

            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }


    // Doughnut chart

    if ($('#canvasDoughnut').length) {

        var ctx = document.getElementById("canvasDoughnut");
        var data = {
            labels: [
                "Dark Grey",
                "Purple Color",
                "Gray Color",
                "Green Color",
                "Blue Color"
            ],
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                hoverBackgroundColor: [
                    "#34495E",
                    "#B370CF",
                    "#CFD4D8",
                    "#36CAAB",
                    "#49A9EA"
                ]

            }]
        };

        var canvasDoughnut = new Chart(ctx, {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: data
        });

    }

    // Radar chart

    if ($('#canvasRadar').length) {

        var ctx = document.getElementById("canvasRadar");
        var data = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: "rgba(3, 88, 106, 0.2)",
                borderColor: "rgba(3, 88, 106, 0.80)",
                pointBorderColor: "rgba(3, 88, 106, 0.80)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            }, {
                label: "My Second dataset",
                backgroundColor: "rgba(38, 185, 154, 0.2)",
                borderColor: "rgba(38, 185, 154, 0.85)",
                pointColor: "rgba(38, 185, 154, 0.85)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }]
        };

        var canvasRadar = new Chart(ctx, {
            type: 'radar',
            data: data,
        });

    }


    // Pie chart
    if ($('#pieChart').length) {

        var ctx = document.getElementById("pieChart");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var pieChart = new Chart(ctx, {
            data: data,
            type: 'pie',
            otpions: {
                legend: false
            }
        });

    }


    // PolarArea chart

    if ($('#polarArea').length) {

        var ctx = document.getElementById("polarArea");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset'
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var polarArea = new Chart(ctx, {
            data: data,
            type: 'polarArea',
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });

    }
}

/* COMPOSE */

function init_compose() {

    if (typeof($.fn.slideToggle) === 'undefined') {
        return;
    }
    console.log('init_compose');

    $('#compose, .compose-close').click(function () {
        $('.compose').slideToggle();
    });

};

/* DATA TABLES */

function init_DataTables() {

    console.log('run_datatables');

    if (typeof($.fn.DataTable) === 'undefined') {
        return;
    }
    console.log('init_DataTables');

    var handleDataTableButtons = function () {
        if ($("#datatable-buttons").length) {
            $("#datatable-buttons").DataTable({
                dom: "Bfrtip",
                buttons: [{
                    extend: "copy",
                    className: "btn-sm"
                }, {
                    extend: "csv",
                    className: "btn-sm"
                }, {
                    extend: "excel",
                    className: "btn-sm"
                }, {
                    extend: "pdfHtml5",
                    className: "btn-sm"
                }, {
                    extend: "print",
                    className: "btn-sm"
                },],
                responsive: true
            });
        }
    };

    TableManageButtons = function () {
        "use strict";
        return {
            init: function () {
                handleDataTableButtons();
            }
        };
    }();

    $('#datatable').dataTable();

    $('#datatable-keytable').DataTable({
        keys: true
    });

    $('#datatable-responsive').DataTable();

    $('#datatable-scroller').DataTable({
        ajax: "js/datatables/json/scroller-demo.json",
        deferRender: true,
        scrollY: 380,
        scrollCollapse: true,
        scroller: true
    });

    $('#datatable-fixed-header').DataTable({
        fixedHeader: true
    });

    var $datatable = $('#datatable-checkbox');

    $datatable.dataTable({
        'order': [
            [1, 'asc']
        ],
        'columnDefs': [
            {orderable: false, targets: [0]}
        ]
    });
    $datatable.on('draw.dt', function () {
        $('checkbox input').iCheck({
            checkboxClass: 'icheckbox_flat-green'
        });
    });

    TableManageButtons.init();

};

$(document).ready(function () {
    init_socketio();
    init_sidebar();
    init_InputMask();
    init_cropper();
    init_knob();
    init_TagsInput();
    init_parsley();
    init_SmartWizard();
    init_charts();
    init_skycons();
    init_select2();
    init_DataTables();
    init_chart_doughnut();
    init_gauge();
    init_starrr();
    init_compose();
    init_autosize();
});
