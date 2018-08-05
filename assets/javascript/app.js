var triviaGame = {
    anyGameOptions: {
        gameRunning: false,
    },
    hardMode: {
        baseGame: {
            timerLength: 10,
            // timerCount: triviaGame.hardMode.baseGame.timerLength,
            timerInterval: "",
            qAnswered: 0,
            qCorrect: 0,
            // Reset game to base board, use once game is finished.
            resetGame: function(){
                this.questionsAnswered = 0;
                this.questionsCorrectly = 0;
            },
            // Iniate the game
            runGame: function(){
                clearInterval(this.timerInterval);
                $("#timeStamp").html(`<p>Time Remaining: ${triviaGame.hardMode.baseGame.timerLength} Seconds</p>`)
                
                triviaGame.hardMode.baseGame.createQuestionHTML();
                triviaGame.hardMode.baseGame.timerInterval = setInterval(triviaGame.hardMode.baseGame.decrement, 1000);
            },
            // Timer function to decrease
            decrement: function() {
                triviaGame.hardMode.baseGame.timerLength--;
                $("#timeStamp").html(`<p>Time Remaining: ${triviaGame.hardMode.baseGame.timerLength} Seconds</p>`)

                if(triviaGame.hardMode.baseGame.timerLength === 0) {
                    triviaGame.hardMode.baseGame.timerStop();

                    triviaGame.hardMode.baseGame.timesUp();
                }
            },
            //Timer Stop function
            timerStop: function() {
                //TBD
            },
            // Function for when the Timer runs out
            timesUp: function() {
                $("#question").html(`<p>Times up!</p>`);
                $("#responses").empty();
            },
            // Function to choose which question should be up
            chooseQuestion: function() {
                //TBD
            },
            // Handles HTML creation of the current question.
            createQuestionHTML: function() {
                $("#question").empty();
                $("#question").html(`<p>${triviaGame.hardMode.questionBank.active.currentQuestion.question}</p>`)

                let count = 1;
                $("#responses").empty();
                triviaGame.hardMode.questionBank.active.currentQuestion.guesses.forEach(ele => {
                    // Create variable of true or false, if true prepend or if false append
                    let choiceButton = $(`<button>`);
                    $(choiceButton).addClass("btn btn-primary btn-lg btn-block mycss-AnswerButton");
                    $(choiceButton).attr("id",`answer${count}`);
                    $(choiceButton).attr("type","button");
                    $(choiceButton).text(ele)
                    $("#responses").append(choiceButton);
                    count++
                });
            },

        },
        questionBank: {
            active: {
                activeBank: {},
                currentQuestion: {

                },
                questionsAnswered: {},
            },
            bankOne: {
                question1: {
                    question: `Question 1`,
                    guesses: ["Fish","Blue","Yellow","Yellow-2"],
                    answer: "3"
                },
                question2: {
                    question: `Question 2`,
                    guesses: ["Q","R","S","Batman Symbol"],
                    answer: "3"
                },
                question3: {
                    question: `Question 3`,
                    guesses: ["Crocodile","Bear","Wuzzy","Fuzzy"],
                    answer: "3"
                },
                question4: {
                    question: `Question 4`,
                    guesses: ["1","2","3","4"],
                    answer: "3"
                },
                question5: {
                    question: `Question 5`,
                    guesses: ["1","2","3","4"],
                    answer: "3"
                },
            }

        }
    }
}

// Start Game button, only shows when page is loaded.
$("#startGame").on("click",triviaGame.hardMode.baseGame.runGame)

// testing createQuestionHTML(), need active to be... active
triviaGame.hardMode.questionBank.active.currentQuestion = triviaGame.hardMode.questionBank.bankOne.question1

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