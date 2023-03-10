let i = 0;
let correctCount = 0;
let firstGuess = true;

function start() {
    i = 0;
    correctCount = 0;
    quiz = getQuiz(document.getElementById("lengthSelect").value,
        document.getElementById("categorySelect").value);
    loadQuestion(0);
    document.getElementById("title").style.display = "none";
    document.getElementById("setup").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById('score').style.display = "block";
}

function results() {
    document.getElementById('score').innerHTML = `Final score: ${correctCount} out of ${quiz.length}`;
    document.getElementById("quiz").style.display = "none";
    document.getElementById("setup").style.display = "block";
    document.getElementById("title").style.display = "block";
    const result = {
        correct: correctCount,
        quizLength: quiz.length,
        category: quiz[0].category
    }
    var json = JSON.stringify(result);
    //fs.appendFile('triviaResults.json', json, function(err){});
}

function next() {
    document.getElementById('next').style.background = 'white';
    backgroundColor('none').play();
    if (i < quiz.length - 1) {
        i++;
        loadQuestion(i);
    } else results()
}

function getCategories() {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", 'https://opentdb.com/api_category.php', false);
    Httpreq.send(null);
    let categories = JSON.parse(Httpreq.responseText).trivia_categories;

    var categorySelect = document.getElementById("categorySelect");
    categories.forEach(function (category) {
        var el = document.createElement("option");
        el.textContent = category.name;
        el.value = category.id;
        categorySelect.appendChild(el);
    })
}

function getQuiz(length, category) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", 'https://opentdb.com/api.php?amount=' + length +
        '&category=' + category, false);
    Httpreq.send(null);
    let json_obj = JSON.parse(Httpreq.responseText);

    quiz = [];
    for (let i = 0; i < length; i++) {
        quiz.push({
            question: json_obj.results[i].question,
            category: json_obj.results[i].category,
            incorrect: json_obj.results[i].incorrect_answers,
            correct: json_obj.results[i].correct_answer
        });
    }
    return quiz;
}

function loadQuestion() {
    document.getElementById('description').innerHTML = correctCount + '/' + quiz.length + ' ' + quiz[i].category;
    document.getElementById('question').innerHTML = 'Q' + (i + 1) + ': ' + quiz[i].question;

    // remove old answers
    var answersBox = document.getElementById("answersBox");
    answersBox.innerHTML = ''

    // create answers array
    let answers = [];
    let count = 0;
    answerAmount = quiz[i].incorrect.length + 1;
    correctPos = Math.floor(Math.random() * answerAmount)
    for (let pos = 0; pos < answerAmount; pos++)
        if (pos == correctPos)
            answers[correctPos] = quiz[i].correct;
        else answers[pos] = quiz[i].incorrect.pop();

    // Create answer buttons
    for (let pos = 0; pos < answers.length; pos++) {
        var el = document.createElement("button");
        el.class = "answer";
        el.id = 'a' + pos;
        el.textContent = answers[pos];
        if (pos == correctPos)
            el.onclick = function () {
                correct(pos);
            };
        else el.onclick = function () {
            incorrect(pos);
        };

        answersBox.appendChild(el);
    }
    firstGuess = true;
}

function correct(pos) {
    if (firstGuess) {
        backgroundColor('green').play();
        document.getElementById('next').style.background = 'lightgreen'
        correctCount++;
    }
    document.getElementById('a' + pos).style.background = 'lightgreen';
    firstGuess = false;
}

function incorrect(pos) {
    if (firstGuess) {
        backgroundColor('red').play();
        document.getElementById('next').style.background = 'red'
    }
    document.getElementById('a' + pos).style.background = 'red';
    firstGuess = false;
}