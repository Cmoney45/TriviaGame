var triviaGame = {
    anyGameOptions: {
        timerRunning: false,
        questionOnBoard: false,
    },
    hardMode: {
        baseGame: {
            timerLength: 10,
            timerReset: 10,
            timerInterval: "",
            qAnswered: 0,
            qCorrect: 0,
            newQuest: function(){
                setTimeout(this.runGame, 2000)
            },
//** Reset game to base board, use once game is finished.
            resetGame: function(){
                this.questionsAnswered = 0;
            },
//** Initiate the game
            runGame: function(){
                const tHMbg = triviaGame.hardMode.baseGame;
                tHMbg.timerLength = tHMbg.timerReset

                clearInterval(this.timerInterval);
                $("#timeStamp").html(`<p>Time Remaining: ${tHMbg.timerLength} Seconds</p>`)
                
                tHMbg.chooseQuestion();
                tHMbg.createQuestionHTML();
                tHMbg.timerInterval = setInterval(tHMbg.decrement, 1000);
            },
            checkCondition: function(selection) {
                this.newQuest();

            },
            onwards: function(){
                const tHMbg = triviaGame.hardMode.baseGame;

                tHMbg.timerLength = tHMbg.timerReset;
                tHMbg.chooseQuestion();
                tHMbg
            },
//** Timer function to decrease
            decrement: function() {
                const tHMbg = triviaGame.hardMode.baseGame;
                tHMbg.timerLength--;
                $("#timeStamp").html(`<p>Time Remaining: ${tHMbg.timerLength} Seconds</p>`)

                if(tHMbg.timerLength === 0) {
                    tHMbg.timerStop();

                    tHMbg.timesUp();
                    triviaGame.anyGameOptions.timerRunning = false;
                }
            },
            //** Timer Stop function
            timerStop: function() {
                clearInterval(triviaGame.hardMode.baseGame.timerInterval)
            },
            //** Function for when the Timer runs out
            timesUp: function() {
                const tHMqAcQ = triviaGame.hardMode.questionBank.active.currentQuestion;
                $("#question").html(`<p>Times up!</p>`);
                $("#responses").empty();
                $("#responses").html(`<p>The correct response was ${tHMqAcQ.guesses[tHMqAcQ.answer]}</p>`);
                triviaGame.hardMode.baseGame.checkCondition();
                triviaGame.hardMode.baseGame.timerLength = triviaGame.hardMode.baseGame.timerReset;
            },
            //** Function to choose which question should be up
            chooseQuestion: function() {
                const tHMqA = triviaGame.hardMode.questionBank.active;
                const number = Math.floor(Math.random() * tHMqA.activeBank.length)
                if( tHMqA.activeBank.length === 0) {
                    triviaGame.hardMode.baseGame.completion();
                    return;
                }
                if( tHMqA.questionsAnswered.lenth >= 0){
                    tHMqA.questionsAnswered.push(tHMqA.currentQuestion.splice(0,1));
                }
                tHMqA.currentQuestion = tHMqA.activeBank[number]
                tHMqA.activeBank.splice(number,1);
                tHMqA.activeBank.activeQuestionCount = tHMqA.activeBank.length
            },
            //** Handles HTML creation of the current question.
            createQuestionHTML: function() {
                const tHMqAcQ = triviaGame.hardMode.questionBank.active.currentQuestion;
                $("#question").empty();
                $("#question").html(`<p>${tHMqAcQ.question}</p>`)

                let count = 1;
                $("#responses").empty();
                tHMqAcQ.guesses.forEach(ele => {
            // TODO: Create variable of true or false, if true prepend or if false append
                    let choiceButton = $(`<button>`);
                    $(choiceButton).addClass("btn btn-primary btn-lg btn-block mycss-AnswerButton");
                    $(choiceButton).attr("id",`${count}`);
                    $(choiceButton).attr("type","button");
                    $(choiceButton).text(ele)
                    $("#responses").append(choiceButton);
                    count++
                });
            },

        },
        questionBank: {
            active: {
                activeBank: [],
                currentQuestion: [],
                questionsAnswered: [],
            },
            bankOne: [
                    question1 = {
                        question: `Question 1`,
                        guesses: ["Fish","Blue","Yellow","Yellow-2"],
                        answer: "0"
                    },
                    question2 = {
                        question: `Question 2`,
                        guesses: ["Q","R","S","Batman Symbol"],
                        answer: "3"
                    },
                    question3 = {
                        question: `Question 3`,
                        guesses: ["Crocodile","Bear","Wuzzy","Fuzzy"],
                        answer: "0"
                    },
                    question4 = {
                        question: `Question 4`,
                        guesses: ["1","2","3","4"],
                        answer: "3"
                    },
                    question5 = {
                        question: `Question 5`,
                        guesses: ["1","2","3","4"],
                        answer: "3"
                    }
            ],
        }
    }
}

// Start Game button, only shows when page is loaded.
$("#startGame").on("click",triviaGame.hardMode.baseGame.runGame)

// testing createQuestionHTML(), need active to be... active
triviaGame.hardMode.questionBank.active.activeBank = triviaGame.hardMode.questionBank.bankOne
triviaGame.hardMode.questionBank.active.activeQuestionCount = triviaGame.hardMode.questionBank.bankOne.length
// Start of Answer on click
$("body").on("click",".mycss-AnswerButton",function(){alert("WOW")})

//!~~ Hard Mode Pseudo Code
//Need a timer to countdown from 10 seconds. This resets every time you answer a question.
    //if the time runs out, you lose the round
//Need a question bank that has questions with four "possible" answers, and a true answer
//Randomizes the answers to never be in the same order. 
//Player selects one answer and 
    // if correct, a pop up comes up and says that was the correct answer. After a few seconds, 
        //display next quesiton
    // if incorrect, tell the player they selected the wrong option and then display the correct
        //answer. wait a few seconds and show the next question.
//?? final screen, show number of correct answers, incorrect answers, and an option to restart
    //the game.(without reloading)g