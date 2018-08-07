var triviaGame = {
    anyGameOptions: {
        gameRunning: false,
        timerInterval: "",
        qAnswered: 0,
        qCorrect: 0,
        qMissed: 0,
        completion: {

        }
    },
    hardMode: {
        baseGame: {
            timerLength: 0,
            timerReset: 5,
            resetLength: 3,
            resetInterval: "",
            newQuest: function(){
                tHMbg = triviaGame.hardMode.baseGame;
                if( triviaGame.questionBank.active.activeBank.length === 0) {
                    triviaGame.anyGameOptions.completion();
                    return;
                } else {
                setTimeout(this.runGame, 1000 * this.resetLength)
                $(`#timeStamp`).html(`<p>New Question in: ${this.resetLength} Seconds</p>`)
                }
            },
//** Reset game to base board, use once game is finished.
            resetGame: function(){
                triviaGame.anyGameOptions.qAnswered = 0;
                triviaGame.anyGameOptions.qCorrect = 0;
                triviaGame.anyGameOptions.qMissed = 0;

                triviaGame.hardMode.baseGame.runGame();
            },
//** Initiate the game
            runGame: function(){
                const tHMbg = triviaGame.hardMode.baseGame;
                tHMbg.timerLength = tHMbg.timerReset
                triviaGame.anyGameOptions.gameRunning = true;

                $(`#timeStamp`).html(`<p>Time Remaining: ${tHMbg.timerLength} Seconds</p>`)
                
                tHMbg.chooseQuestion();
                tHMbg.createQuestionHTML();
                triviaGame.anyGameOptions.timerInterval = setInterval(tHMbg.decrement, 1000);
            },
            // checkCondition: function(selection){
            //     const userGuess = parseInt($(this).attr("id"));
            //     const tHMbg = triviaGame.hardMode.baseGame
            //     const tqAcQ = triviaGame.hardMode.questionBank.active.currentQuestion;
            //     clearInterval(triviaGame.anyGameOptions.timerInterval);
            //     triviaGame.anyGameOptions.qAnswered++; 
            
            //     if ((userGuess - 1) === tqAcQ.answer){
            //         $("#question").html(`<p>Correct!</p>`);
            //         $("#responses").empty();
            //         triviaGame.anyGameOptions.qCorrect++;
            //     } else {
            //         $(`#question`).html(`<p>Nope!</p>`);
            //         $("#responses").html(`<p>The correct response was ${tqAcQ.guesses[tqAcQ.answer]}</p>`)
            //     }
            //     tHMbg.newQuest();
            // },
//** Timer function to decrease 
            decrement: function() {
                const tHMbg = triviaGame.hardMode.baseGame;
                tHMbg.timerLength--;
                if(tHMbg.timerLength === 1) {
                $(`#timeStamp`).html(`<p>Time Remaining: ${tHMbg.timerLength} Second</p>`)
                } else {
                $(`#timeStamp`).html(`<p>Time Remaining: ${tHMbg.timerLength} Seconds</p>`)
                }

                if(tHMbg.timerLength === 0) {
                    tHMbg.timerStop();

                    tHMbg.timesUp();
                    triviaGame.anyGameOptions.timerRunning = false;
                }
            },
            //** Timer Stop function
            timerStop: function() {
                clearInterval(triviaGame.anyGameOptions.timerInterval)
            },
            //** Function for when the Timer runs out
            timesUp: function() {
                const tqAcQ = triviaGame.questionBank.active.currentQuestion;
                triviaGame.anyGameOptions.qAnswered++;
                triviaGame.anyGameOptions.qMissed++;
                $(`#question`).empty();
                $(`#responses`).empty();

                $(`#question`).html(`<p>Times up!</p>`);
                $(`#responses`).html(`<p>The correct response was ${tqAcQ.guesses[tqAcQ.answer]}</p>`);
                triviaGame.hardMode.baseGame.newQuest();
            },
            //** Function to choose which question should be up
            chooseQuestion: function() {
                const tqA = triviaGame.questionBank.active;
                const number = Math.floor(Math.random() * tqA.activeBank.length)
                if( tqA.activeBank.length === 0) {
                    triviaGame.hardMode.baseGame.completion();
                    return;
                }
                tqA.currentQuestion = tqA.activeBank[number]
                tqA.activeBank.splice(number,1);
            },
            //** Handles HTML creation of the current question.
            createQuestionHTML: function() {
                const tqAcQ = triviaGame.questionBank.active.currentQuestion;
                $(`#question`).html(`<p>${tqAcQ.question}</p>`)

                let count = 1;
                $(`#responses`).empty();
                tqAcQ.guesses.forEach(ele => {
            // TODO: Create variable of true or false, if true prepend or if false append
                    let choiceButton = $(`<button>`);
                    $(choiceButton).addClass(`btn btn-primary btn-lg btn-block mycss-HMAnswerButton`);
                    $(choiceButton).attr(`id`,`${count}`);
                    $(choiceButton).attr(`type`,`button`);
                    $(choiceButton).text(ele)
                    $(`#responses`).append(choiceButton);
                    count++
                });
            },

        },
    },
    questionBank: {
        active: {
            activeBank: [],
            currentQuestion: [],
        },
        bankOne: [
                question1 = {
                    question: `Question 1`,
                    guesses: ["Fish","Blue","Yellow","Yellowish"],
                    answer: 0
                },
                question2 = {
                    question: `Question 2`,
                    guesses: ["Q","R","S","Batman Symbol"],
                    answer: 3
                },
                question3 = {
                    question: `Question 3`,
                    guesses: ["Crocodile","Bear","Wuzzy","Fuzzy"],
                    answer: 0
                },
                question4 = {
                    question: `Question 4`,
                    guesses: ["1","2","3","4"],
                    answer: 2
                },
                question5 = {
                    question: `Question 5`,
                    guesses: ["1","2","3","4"],
                    answer: 2
                }
        ],
        riddles: [
            question1 = {
                question: `What is always on its way here, but never arrives?`,
                guesses: [`An Amazon Package`,`Tomorrow`,`Comets`, `Spaghetti`],
                answer: 1
            },
            question2 = {
                question: `What is the beginning of eternity, the end of time and space, the beginning of every end and the end of every race?`,
                guesses: [`e`,`Meaning`,`God`,`Bowl of Soup`],
                answer: 0
            },
            question3 = {
                question: `If april showers bring May flowers, what do Mayflowers bring?`,
                guesses: [`patience`,`joy`,`pilgrams`,`heat`],
                answer: 2
            },
            question4 = {
                question: `The more there is, the less you see. What am I?`,
                guesses: [`Tall People`,`Lies`,`Smoke`,`Darkness`],
                answer: 3
            },
            question5 = {
                question: `You can have me, but cannot hold me. Gain me and quicly lose me. If treated with care, I can be great. And if betrayed
                I will break.  What am I?`,
                guesses: [`A porcupine`,`Glass`,`Trust`,`Snowball`],
                answer: 2
            },
            question6 = {
                question: `I never stop. I control your life but without me, you wouldn't go anywhere. What am I?`,
                guesses: [`Transportation`,`Time`,`Social Media`,`Treadmill`],
                answer: 2
            },
            question7 = {
                question: `If you break me I don't stop working. If you touch me I may be snared. If you lose me
                 nothing will matter. What am I?`,
                guesses: [`Money`,`Your Heart`,`Friendship`,`Trust`],
                answer: 1
            },
            question8 = {
                question: `If you know me, you'll want to share me, but if you share me, I'll be gone. What am I?`,
                guesses: [`A secret`,`Money`,`Ice Cream`,`An empty bed`],
                answer: 0
            },
            question9 = {
                question: `What does man love more than life? What does he fear more than death and mortal strife? What does
                every contendted man desire? What do the poor have, and the rich require? What does every man carry to his grave?`,
                guesses: [`Clothes`,`Nothing`,`Their name`,`Ambition`],
                answer: 1
            },
            question10 = {
                question: `The smartest man alive will always overlook one thing. What is it?`,
                guesses: [`42`,`The Answer`,`His nose`,`A mountain`],
                answer: 2
            },
        ]
    }
    
}

// Start Game button, only shows when page is loaded.
$(`#startGame`).on(`click`,triviaGame.hardMode.baseGame.runGame)

// testing createQuestionHTML(), need active to be... active
triviaGame.questionBank.active.activeBank = triviaGame.questionBank.riddles

// Start of Answer on click
$(`body`).on(`click`,`.mycss-HMAnswerButton`, function() {
    const userGuess = parseInt($(this).attr("id"));
    const tHMbg = triviaGame.hardMode.baseGame
    const tqAcQ = triviaGame.questionBank.active.currentQuestion;
    clearInterval(triviaGame.anyGameOptions.timerInterval);
    triviaGame.anyGameOptions.qAnswered++;
    $(`#question`).empty();
    $(`#responses`).empty(); 

    if ((userGuess - 1) === tqAcQ.answer){
        $("#question").html(`<p>Correct!</p>`);
        triviaGame.anyGameOptions.qCorrect++;
    } else {
        $(`#question`).html(`<p>Nope!</p>`);
        $(`#responses`).html(`<p>The correct response was ${tqAcQ.guesses[tqAcQ.answer]}</p>`)
    }
    tHMbg.newQuest();
})

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