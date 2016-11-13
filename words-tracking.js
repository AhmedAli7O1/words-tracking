(function () {

    var index = 0;
    var words = [];
    var currentWord;
    var wordsTimer;

    // init jquery plugin
    $.fn.wordsTracking = function (userOptions) {

        // set defult options
        var options = {};

        // override default options by user options
        options = $.extend(options, userOptions);

        // set local element object
        var element = $(this);

        // on start timer
        $('#' + options.startButtonId).click(function () {
            // set start time.
            wordsTimer = Date.now();
            // start tracking user input.
            $(element).on('input', trackWords);
        });

        // on turn off timer
        $('#' + options.stopButtonId).click(function () {
            // stop tracking user input
            $(element).off('input', trackWords);
            stopWordsTracking();
        });

        // return element object for seek of Chaining
        return element;

    };

    // track words in user input and timestamp it.
    function trackWords () {

        var input = $(this).val();                                // full input
        var lastChar = input.charAt(input.length - 2);            // last user input
        var currentChar = input.charAt(input.length - 1);         // current user input

        // if current user input not empty or white space
        if (currentChar.length > 0 && currentChar !== ' ') {

            // case 1 : last user input was nothing or white space
            if (lastChar === '' || lastChar === ' ') {
                // make sure there's a current tracked word
                if (currentWord) {
                    // append End Time
                    currentWord.end = getTimerTime();
                    // append the last word to the object
                    currentWord.text = input.slice(index, input.length).split(' ')[0];
                    // push to words array
                    if (currentWord.text.length > 0 && currentWord.text !== ' '){
                        words.push(currentWord);
                    }

                    updateResults(words); // -------- DEBUG

                    // create a new object to store the next word
                    currentWord = new TimedWord(getTimerTime());
                    index = input.length - 1;
                }
                // if no tracked words.
                else {
                    currentWord = new TimedWord(getTimerTime());
                    index = input.length - 1;
                }
            }

        }

    }

    // finish words tracking.
    function stopWordsTracking () {
        var inputBox = $('textarea').val();
        if (currentWord) {
            // append End Time
            currentWord.end = getTimerTime();
            // append the last word to the object
            currentWord.text = inputBox.slice(index, inputBox.length).trim();
            // push to words array
            if (currentWord.text.length > 0 && currentWord.text !== ' '){
                words.push(currentWord);
            }

            updateResults(words); // -------- DEBUG

        }
    }

    // get timestamp from the current working timer.
    function getTimerTime () {

        // get total elapsed seconds.
        var totalMilliseconds = Date.now() - wordsTimer;

        var hours = Math.floor(totalMilliseconds / (60 * 60 * 1000));
        var minutes = Math.floor( totalMilliseconds / (60 * 1000) % 60 );
        var seconds = Math.floor(( totalMilliseconds / 1000 ) % 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return hours + ':' + minutes + ':' + seconds;

    }

    // Word Object.
    function TimedWord(start) {
        this.start = start || null;
    }

    function updateResults (words) {
        console.log(words);
        $('#results .words span').text(words.length);
    }

})( jQuery );
