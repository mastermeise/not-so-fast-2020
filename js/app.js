//Function for converting from CSV to JSON. This function is consider as a backend component for performing this task.
var csvrows;
var csvjsonConverter = (csvdata, delimiter) => {
    let arrmatch = [];
    let array = [[]];
    let quotevals = "";
    let jsonarray = [];
    let k = 0;

    //Uses regular expression to parse the CSV data and determines if any values has their own quotes in case if any
    // delimiters are within.
    let regexp = new RegExp(("(\\" + delimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");

    //This will loop to find any matchings with the regular expressions.
    csvrows = csvdata.split("\n");
    var prevquestion = "";
    for (var i = 0; i < csvrows.length; i++) {
        if (csvrows[i].length > 2 && csvrows[i].indexOf(",") != -1) {
            var reg = regexp;
            var firstpart = csvrows[i].substring(0, csvrows[i].lastIndexOf(","));
            var secondpart = csvrows[i].substring(csvrows[i].lastIndexOf(",") + 1, csvrows[i].length - 1);
            console.log('\n\n\n\nrow="' + csvrows[i] + '"');

            if (typeof secondpart === "undefined") {
                prevquestion = prevquestion + "\n" + firstpart;
            }
            else if ((secondpart.length <= 2 && secondpart.indexOf(",") != -1) || secondpart == "") {
                prevquestion = prevquestion + "\n" + firstpart;
            } else {
                if (prevquestion != "") {
                    firstpart = prevquestion;
                    secondpart = csvrows[i];
                }
                prevquestion = "";
                //if (firstpart!="#ERROR!")
                {
                    console.log('\n1st= *' + firstpart, '*\n2nd *' + secondpart + "*");
                    array[array.length - 1].push(firstpart);
                    array[array.length - 1].push(secondpart);
                    array.push([]);
                    //array.push(firstpart,secondpart);
                    //array.push(secondpart);
                }
            }
        }
    }




    console.log(array);

    //This will parse the resulting array into JSON format
    for (let i = 0; i < array.length - 1; i++) {
        jsonarray[i - 1] = {};
        for (let j = 0; j < array[i].length && j < array[0].length; j++) {
            let key = array[0][j];
            jsonarray[i - 1][key] = array[i][j]
        }
    }

    //This will determine what the properties of each values are from the JSON
    //such as removing quotes for integer value.
    for (k = 0; k < jsonarray.length; k++) {
        let jsonobject = jsonarray[k];
        for (let prop in jsonobject) {
            if (!isNaN(jsonobject[prop]) && jsonobject.hasOwnProperty(prop)) {
                jsonobject[prop] = +jsonobject[prop];
            }
        }
    }

    //This will stringify the JSON and formatting it.
    let formatjson = JSON.stringify(jsonarray, null, 2);

    //Returns the converted result from CSV to JSON
    return formatjson;
};

//This jQuery will perform in the front-end to convert from CSV to JSON.
$(function () {
    //When the 'Convert' button is clicked, it will first make sure if the csv file is uploaded and then it goes to the
    //convert function above to convert it from CSV to JSON. Afterwards, it will print the result in a textarea.
    $("#fileBtn").change(function () {
        var csv = $("#fileBtn")[0].files[0];
        if (csv !== undefined) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var rows = e.target.result;
                var convertjson = csvjsonConverter(rows, ',');
                localStorage.setItem('uploadedjson', convertjson);
                console.log(convertjson);

            };
            reader.readAsText(csv);
        }
        else {
            alert("Please upload your csv file.");
        }
    });

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    document.getElementById("downloadBtn").addEventListener("click", function () {
        $.get(chrome.extension.getURL('template.csv'), {}, function (response) {
            download("data.csv", response);
        });
    });
   
    document.getElementById("web").addEventListener("change", function () {
        localStorage.setItem('blocked_websites', $(this).val() );
    });

    $(".numBtn").each(function (i, choice1) {
        document.getElementsByClassName("numBtn")[i].addEventListener("click", function () {
          $(this).removeClass("unSelectedBtn").addClass("SelectedBtn");
		localStorage.setItem('num_of_questions', $(this).html() );
         
          $(this).siblings().each(function (i, choice) {
                choice = $(choice);
                choice.removeClass("SelectedBtn").addClass("unSelectedBtn");
                console.log(i, (choice).html());
            });
        });

    });


});