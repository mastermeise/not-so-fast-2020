var quiz = {};

(function (window, undefined) {

	var $ = jQuery,
		questions,
		numOfQuestions,
		currentQuestion,
		currentQuestionNum,
		redirectUrl,
		started = false;

	quiz.init = function () {
		console.log("init();");

		quiz.initWelcome();

		$('#question').on('click', 'li', quiz.pickQuestion);
	};

	quiz.initWelcome = function () {
		var chosenQuiz = JSON.parse(localStorage.getItem('quizzes'));
		console.log('initWelcome', chosenQuiz);

		if (chosenQuiz)
			if (chosenQuiz.on) {
				if (chosenQuiz.id.indexOf("basic") != -1)
					$.get(chrome.extension.getURL('javascript.json'), {}, function (response) {
						questions = response;
					});
				else if (chosenQuiz.id.indexOf("spanish") != -1)
					$.get(chrome.extension.getURL('spanish.json'), {}, function (response) {
						questions = response;
					});
				else {
					questions = JSON.parse(localStorage.getItem('uploadedjson'));
					console.log('quest', questions);
				}
				numOfQuestions = localStorage.getItem('num_of_questions');
				numOfQuestions = (numOfQuestions ? numOfQuestions : 5);
				redirectUrl = window.location.search.split('=');
				redirectUrl = (redirectUrl.length > 0 ? redirectUrl[1] : 'www.google.com');

				$('#welcome p').html('Answer ' + numOfQuestions + ' questions to get to ' + redirectUrl.replace('http://', '').replace('https://', ''));
				$('#welcome li').on('click', quiz.start);
			}
			else {
				$('#welcome p').html('You have no quizzes chosen. Please go to the settings page.');
				$('#welcome li').html('Settings').on('click', function () {
					window.location = 'settings.html';
				});
			}
	};

	quiz.start = function () {
		console.log("start();");

		if (!started) {
			started = true;
			currentQuestionNum = 1;

			if (questions) {
				$('#welcome .single').animate({ left: -82, opacity: 0 }, 600, 'easeInQuad', function () {
					$(this).parent().hide();
				});
				$('#question').show();

				quiz.nextQuestion();
			}
			else {
				setTimeout(quiz.start, 1000);
			}
		}
	};


	quiz.nextQuestion = function () {
		console.log("nextQuestion();");

		var newQuestion = $('<div class="single"></div>'),
			list = $('<ul class="answers"></ul>'),
			choices = [],
			image,
			rand,
			found;

		rand = Math.floor(Math.random() * questions.length);
		currentQuestion = questions.splice(rand, 1)[0];
		console.log(currentQuestion);

		image = currentQuestion.image;

		newQuestion.append('<span class="progress">' + currentQuestionNum + ' of ' + numOfQuestions + '</span>');
		newQuestion.append('<h1>' + currentQuestion.Question + (image ? ' <img src="' + image.url + '" />' : '') + '</h1>');

		for (var i = 0; i < 3; i++) {
			found = false;
			rand = Math.floor(Math.random() * (questions.length - i));
			do {
				for (var j = 0; j < choices.length; j++) {
					if (choices[j] == rand) {
						rand = (rand + 1 < questions.length ? rand + 1 : 0);
						found = true;
					}
				}
			} while (found);

			choices.push(questions[rand]);

		}

		choices.splice(Math.floor(Math.random() * 4), 0, currentQuestion);

		console.log("questions[rand]", (questions[rand]));
		console.log("choices", choices);

		list.empty();
		for (i = 0; i < choices.length; i++) {
			image = choices[i].image;
			list.append('<li class="option">' + choices[i].Answer + (image ? ' <img src="' + image.url + '" />' : '') + '</li>');
		}

		newQuestion.append(list);
		$('#question div.single').addClass('fade').css('left', 12).animate({ left: -70, opacity: 0 }, 600, 'easeInQuad', function () {
			$(this).remove();
		});
		$('#question').append(newQuestion);
		newQuestion.delay(200).animate({ left: 0, opacity: 1 }, 500, 'easeOutQuad');

		/*	var opClick = function (e) {
				e.preventDefault();
				console.log("clicked", this);
	
				return false;
			};
			var optionc = document.getElementsByClassName('option');
			for (var op_item = 0; op_item < optionc.length; op_item++) {
				// console.log(backgrounds[bg_item]);
				optionc[op_item].addEventListener('click', opClick)
			}
		*/
		console.log(list);


	};

	quiz.pickQuestion = function () {
		console.log("pickQuestion();");
		//		console.log('https://api.quizlet.com/2.0/sets/' + chosenQuiz.id + '?client_id=DvyRJVGqjG');

		if (currentQuestion.Answer == $(this).html()) {
			currentQuestionNum++;
			//console.log("added 1 to curr num", currentQuestion);
			$(this).append('<img src="img/choice_check.png" />');
		}
		else {
			$(this).append('<img src="img/choice_x.png" />');
			$(this).siblings().each(function (i, choice) {
				choice = $(choice);
				//console.log(i,(choice).html()==currentQuestion.Answer);

				if (choice.html() == currentQuestion.Answer) {
					choice.append('<img src="img/choice_check.png" />');
				}
			});
		}

		if (currentQuestionNum <= numOfQuestions) {
			setTimeout(quiz.nextQuestion, 1000);
		}
		else {
			setTimeout(function () {
				window.location = redirectUrl + '?passed=true';
			}, 1000);
		}

		return false;
	};

	$(function () {
		quiz.init();
	});
}(window));