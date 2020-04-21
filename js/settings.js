var settings = {};

//test
(function(window, undefined) {
    var $ = jQuery,
        blocked_websites,
        quizzes,
        currentSet;

    settings.init = function() {
        settings.initScroll();
        settings.getWebsites();

        $('#basicBtn').on('click', settings.btnBasicClick);
        $('#spanishBtn').on('click', settings.btnSpanishClick);
        $('#uploadBtn').on('click', settings.btnUploadClick);

    };

    settings.btnBasicClick = function() {
        changeSelection('#basicBtn', "unSelectedBtn", "SelectedBtn");
        $('#spanishBtn').removeClass("SelectedBtn").addClass("unSelectedBtn");
        $('#uploadBtn').removeClass("SelectedBtn").addClass("unSelectedBtn");
    };
    settings.btnSpanishClick = function() {
        changeSelection('#spanishBtn', "unSelectedBtn", "SelectedBtn");
        $('#basicBtn').removeClass("SelectedBtn").addClass("unSelectedBtn");
        $('#uploadBtn').removeClass("SelectedBtn").addClass("unSelectedBtn");

    };
    settings.btnUploadClick = function() {
        changeSelection('#uploadBtn', "unSelectedBtn", "SelectedBtn");
        $('#spanishBtn').removeClass("SelectedBtn").addClass("unSelectedBtn");
        $('#basicBtn').removeClass("SelectedBtn").addClass("unSelectedBtn");

    };

    function changeSelection(id, class1, class2) {
        var selected;
        if ($(id).hasClass(class1)) {
            $(id).switchClass(class1, class2);
            selected = true;
        } else {
            $(id).switchClass(class2, class1);
            selected = false;
        }
        console.log(id, selected);
        var quizzes = '{"id":"' + id + '","title":"' + id + '","on":' + selected + '}';
        console.log(quizzes);
        localStorage.setItem('quizzes', quizzes);

        if (id == "#uploadBtn") {
            $('#fileBtn').removeClass("hiddenBtn").addClass("showBtn");
            $('.uploader').removeClass("hiddenBtn").addClass("showBtn");
            $('#downloadBtn').removeClass("hiddenBtn").addClass("showBtn");
        }
        if (id != "#uploadBtn" || (id == "#uploadBtn" && selected == false)) {
            $('#fileBtn').removeClass("showBtn").addClass("hiddenBtn");
            $('.uploader').removeClass("showBtn").addClass("hiddenBtn");
            $('#downloadBtn').removeClass("showBtn").addClass("hiddenBtn");
        }
        $(id).css('display', '');



    }
    settings.initScroll = function() {
        var numOfQuestions = localStorage.getItem('num_of_questions');
        $(".numBtn").each(function(i, choice) {
            if ($(this).html() == numOfQuestions)
                $(this).removeClass("unSelectedBtn").addClass("SelectedBtn");
        });
        var chosenQuiz = JSON.parse(localStorage.getItem('quizzes'));
        $(".unSelectedBtn").each(function(i, choice) {
            if (this.id && chosenQuiz) {
                console.log((this).id);
                if ("#" + (this).id == chosenQuiz.id) {
                    $(this).removeClass("unSelectedBtn").addClass("SelectedBtn");
                    if ("#" + (this).id == "#uploadBtn") {
                        $('#fileBtn').removeClass("hiddenBtn").addClass("showBtn");
                        $('.uploader').removeClass("hiddenBtn").addClass("showBtn");
                        $('#downloadBtn').removeClass("hiddenBtn").addClass("showBtn");
                    }
                }
            }
        });
    };


    settings.getWebsites = function() {
        var prevfile = localStorage.getItem('uploadedfilename');
        $("#prevFile").html(prevfile);
        blocked_websites = localStorage.getItem('blocked_websites');
        $("#web").val(blocked_websites);
    };


    $(function() {
        settings.init();
    });

    //Having the finished button close the window.
    $('#finished').click(function() {
        window.close();
    });

}(window));