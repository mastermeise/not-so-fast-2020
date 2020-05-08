var notSoFast = {};
notSoFast.white_list = [];

var chosenQuiz = (localStorage.getItem('quizzes'));
console.log('chesenQuiz', chosenQuiz);
if (chosenQuiz == null) {
	localStorage.setItem('num_of_questions', 5);
	var quizzes = '{"id":"#spanishBtn","title":"#spanishBtn","on":true}';
	localStorage.setItem('quizzes', quizzes);
	localStorage.setItem('blocked_websites', 'facebook.com, reddit.com,');

}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	var blocked_websites, website, tabUrl = changeInfo.url;
	console.log("onUpdated();");

	//check where the tab is coming from for forwarded links
	if (tabUrl) {
		for (var i = 0; i < notSoFast.white_list.length; i++) {
			if (notSoFast.white_list[i] == tabId) {
				return;
			}
		}
		console.log(tabUrl.indexOf("http"));

		if (!(tabUrl.indexOf("http://") != -1 || tabUrl.indexOf("https://") != -1))
			return;
		console.log("2");

		if (tabUrl.indexOf('?passed=true') == -1) {
			tabUrl = tabUrl.replace('http://', '').replace('https://', '');
			blocked_websites = (localStorage.getItem('blocked_websites'));
			blocked_websites = blocked_websites.replace(/\s/g, '');
			blocked_websites = blocked_websites.split(',');
			console.log(tabUrl, blocked_websites);

			for (var j = 0; j < blocked_websites.length; j++) {
				website = blocked_websites[j];
				console.log(website,tabUrl ,website.indexOf('/')!=-1 && website.indexOf("/") < (tabUrl.length-1), website.indexOf("/") , (tabUrl.length-1) );
				
				if( !(website.indexOf('/')!=-1 && website.indexOf("/") < (tabUrl.length-1 ) )){
				if (tabUrl.indexOf(website) != -1 && website != "") {
					console.log(website, tabUrl, "\n", tabUrl.indexOf("/"), tabUrl.indexOf(website), tabUrl.indexOf("/") > tabUrl.indexOf(website));
					if (tabUrl.indexOf("/") > tabUrl.indexOf(website)) {

						chrome.tabs.update(tab.id, { url: 'chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/quiz.html?url=' + changeInfo.url });
					}
				}
			}
			else if(tabUrl==website.replace('http://', '').replace('https://', '')){
				chrome.tabs.update(tab.id, { url: 'chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/quiz.html?url=' + changeInfo.url });
			}
			}
		}
		else if (tabUrl.indexOf('?passed=true') >= 0) {
			notSoFast.white_list.push(tabId);
		}
	}
});