var triviaGame = {
    // options to be used in any game mode
    anyGameOptions: {
        // TODO - use gameRunning to not allow changes of the buttons while running. You change in the middle but the game is decided at the start.
        gameRunning: false,
        // store the current question bank. if 0, cannot start game
        wordBankChosen: "0",
        // store the current difficulty. if 0, cannot start game
        difficultySelected: "0",
        // used to stop the timer
        timerInterval: "",
        // questions counter
        qAnswered: 0,
        // correctly answered questions coutner
        qCorrect: 0,
        // missed answers counter due to time running out
        qMissed: 0,
        // game timer to be used for any mode
        timerLength: 0,
        // completion that gives the score page for any game mode
        completion: function() {
            // stops game, see it's TODO
            this.gameRunning = false;
            // dialogue for the ending
            $(`#timeStamp`).empty();
            $(`#question`).html(`<p> The End! <p>There were ${this.qAnswered} questions in this word bank. <p>Here's how you did!`);
            $(`#responses`).html(`<p>Correct answers: ${this.qCorrect}/${this.qAnswered}</p>`);
            if(this.qAnswered === this.qCorrect){
                $(`#responses`).append(`<p>You answered them all correctly! Way to go!`)
            } else {
            $(`#responses`).append(`<p>Incorrect answers: ${this.qAnswered - this.qCorrect - this.qMissed}/${this.qAnswered}</p>`);
            }
            if(this.qMissed !== 0){
            $(`#responses`).append(`<p>Unanswered: ${this.qMissed}/${this.qAnswered}</p>`)
            }
            $(`#responses`).append(`<button type="button" class="btn btn-primary btn-lg btn-block" id="reset">Start again?`)
        },
        // to be used with click event to set difficulty
        setDifficulty: function() {
            triviaGame.anyGameOptions.difficultySelected = $(this).attr("data-mode");
        },
        // to be used with click event to set the word bank
        chooseQuestionbank: function() {
            triviaGame.anyGameOptions.wordBankChosen = $(this).attr("data-bank");
        },
        // to be used with click event to start and restart game
        runGame: function() {
            if (triviaGame.anyGameOptions.difficultySelected === '0' || triviaGame.anyGameOptions.wordBankChosen === '0'){
                if (triviaGame.anyGameOptions.difficultySelected === '0' && triviaGame.anyGameOptions.wordBankChosen === '0') {
                    $(`#timeStamp`).html(`<p>Please choose a difficulty and a Question bank from the buttons above`)
                } else
                if (triviaGame.anyGameOptions.difficultySelected === '0') {
                    $(`#timeStamp`).html(`<p>Please choose a difficulty from the buttons above`)
                } else
                if (triviaGame.anyGameOptions.wordBankChosen === '0') {
                    $(`#timeStamp`).html(`<p>Please choose a Question bank from the buttons above`)
                }
            } else {
                //TODO - use the current game mode and run the game based on the difficulty
                //currently hard is the only difficulty
                triviaGame.hard.resetGame()
            }
        }
    },
    //TODO - was going to create the easy version to be an option
    // easy: {
    // },

    // Hardest difficulty, uses hard but makes the timers much faster
    hardest: {
        timerReset: 10,
        resetReset: 2,
    },
    hard: {
        // base variables to be used and defines the difficulty
        timerReset: 30,
        resetLength: 0,
        resetReset: 5,
        resetInterval: "",
        hardInternalSetting: "",
    //** Reset game to base board, use once game is finished.
        resetGame: function(){
            triviaGame.anyGameOptions.qAnswered = 0;
            triviaGame.anyGameOptions.qCorrect = 0;
            triviaGame.anyGameOptions.qMissed = 0;
            // sets the difficulty internally to stick while the game is running
            triviaGame.hard.hardInternalSetting = triviaGame.anyGameOptions.difficultySelected;
            // sets the question bank to the active here. Makes it not update while game is running
            triviaGame.qBanks.active.activeBank = triviaGame.qBanks[triviaGame.anyGameOptions.wordBankChosen].slice(0)

            triviaGame.hard.runGame();
        },
    //** Initiate the game
        runGame: function(){
            // if no more questions, then run the completion screen
            if( triviaGame.qBanks.active.activeBank.length === 0) {
                triviaGame.anyGameOptions.completion()
                return;
            } else {
                // if it is hardest, use the hard timers
                if (triviaGame.hard.hardInternalSetting === "hardest"){
                    triviaGame.anyGameOptions.timerLength = triviaGame.hardest.timerReset;
                } else {
                triviaGame.anyGameOptions.timerLength = triviaGame.hard.timerReset;
                }
                triviaGame.anyGameOptions.gameRunning = true;
                // displays the first timer value
                $(`#timeStamp`).html(`<p>Time Remaining: ${triviaGame.anyGameOptions.timerLength} Seconds</p>`)
                
                triviaGame.hard.chooseQuestion();
                triviaGame.hard.createQuestionHTML();
                triviaGame.anyGameOptions.timerInterval = setInterval(triviaGame.hard.decrement, 1000);
            }
        },
    //** New question interval loop
        newQuest: function(){
            // sets reset timer based on difficulty
                if(triviaGame.hard.hardInternalSetting === "hardest"){
                    triviaGame.hard.resetLength = triviaGame.hardest.resetReset;
                } else {
                    triviaGame.hard.resetLength = triviaGame.hard.resetReset;
                }
                // sets resetInterval for the reset question timer
            triviaGame.hard.resetInterval = setInterval(function(){
                    triviaGame.hard.resetLength--;
                    if(triviaGame.hard.resetLength === 1) {
                    $(`#timeStamp`).html(`<p>New Question in: ${triviaGame.hard.resetLength} Second</p>`)
                    } else {
                    $(`#timeStamp`).html(`<p>New Question in: ${triviaGame.hard.resetLength} Seconds</p>`)
                    }
                    if(triviaGame.hard.resetLength === 0){
                        clearInterval(triviaGame.hard.resetInterval);
                        triviaGame.hard.runGame();
                    }
            }, 1000);
            $(`#timeStamp`).html(`<p>New Question in: ${this.resetLength} Seconds</p>`)
        },
    //** On click condition for the answer buttons
        checkCondition: function(){
            const userGuess = parseInt($(this).attr("id"));
            clearInterval(triviaGame.anyGameOptions.timerInterval);
            triviaGame.anyGameOptions.qAnswered++; 
        
            if ((userGuess - 1) === triviaGame.qBanks.active.currentQuestion.answer){
                $("#question").html(`<p>Correct!</p>`);
                $("#responses").empty();
                $("#responses").html(`<img src=${triviaGame.qBanks.active.currentQuestion.picture} id="anwPic"></img>`)
                triviaGame.anyGameOptions.qCorrect++;
            } else {
                $(`#question`).html(`<p>Nope!</p>`);
                $("#responses").html(`<p>The correct response was ${triviaGame.qBanks.active.currentQuestion.guesses[triviaGame.qBanks.active.currentQuestion.answer]}</p>`)
                $("#responses").append(`<img src=${triviaGame.qBanks.active.currentQuestion.picture} id="anwPic"></img>`)
            }
            triviaGame.hard.newQuest();
        },
    //** Timer function to decrease 
        decrement: function() {
            triviaGame.anyGameOptions.timerLength--;
            if(triviaGame.anyGameOptions.timerLength === 1) {
            $(`#timeStamp`).html(`<p>Time Remaining: ${triviaGame.anyGameOptions.timerLength} Second</p>`)
            } else {
            $(`#timeStamp`).html(`<p>Time Remaining: ${triviaGame.anyGameOptions.timerLength} Seconds</p>`)
            }

            if(triviaGame.anyGameOptions.timerLength === 0) {
                triviaGame.hard.timerStop();
                triviaGame.hard.timesUp();
            }
        },
    //** Timer Stop function
        timerStop: function() {
            clearInterval(triviaGame.anyGameOptions.timerInterval)
        },
    //** Function for when the Timer runs out
        timesUp: function() {
            triviaGame.anyGameOptions.qAnswered++;
            triviaGame.anyGameOptions.qMissed++;
            $(`#question`).empty();
            $(`#responses`).empty();

            $(`#question`).html(`<p>Times up!</p>`);
            $(`#responses`).html(`<p>The correct response was ${triviaGame.qBanks.active.currentQuestion.guesses[triviaGame.qBanks.active.currentQuestion.answer]}</p>`);
            $("#responses").append(`<img src=${triviaGame.qBanks.active.currentQuestion.picture} id="anwPic"></img>`)
            triviaGame.hard.newQuest();
        },
    //** Function to choose which question should be up
        chooseQuestion: function() {
            const number = Math.floor(Math.random() * triviaGame.qBanks.active.activeBank.length)
            triviaGame.qBanks.active.currentQuestion = triviaGame.qBanks.active.activeBank[number]
            triviaGame.qBanks.active.activeBank.splice(number,1);
        },
    //** Handles HTML creation of the current question.
        createQuestionHTML: function() {
            $(`#question`).html(`<p>${triviaGame.qBanks.active.currentQuestion.question}</p>`)

            let count = 1;
            $(`#responses`).empty();
            triviaGame.qBanks.active.currentQuestion.guesses.forEach(ele => {
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
    // Location for the quesiton banks
    qBanks: {
        // a copy of the selected bank will reside here to be used in the game
        active: {
            activeBank: [],
            currentQuestion: [],
        },
        money: [
                question1 = {
                    question: `Created in 2009, what was the first decentralized cryptocurrency?`,
                    guesses: ["Bitcoin","Altcoin","Doge-coin","Thai bhat"],
                    answer: 0,
                    picture: "assets/images/money/question1.gif"
                },
                question2 = {
                    question: `What is the name of the official currency of Costa Rica?`,
                    guesses: ["Dollar","Peso","Euro","Colón"], 
                    answer: 3,
                    picture: "assets/images/money/question2.jpg"
                },
                question3 = {
                    question: `What year was the two dollar bill last printed in the United States?`,
                    guesses: ["2014","2018","2004","2009"],
                    answer: 0,
                    picture: "assets/images/money/question3.jpg"
                },
                question4 = {
                    question: `How much will the typical married couple retiring at age 65 spend on out-of-pocket costs for health care throughout retirement (in today's dollars)?`,
                    guesses: ["$50,000","$100,000","$157,000","$266,000"],
                    answer: 3,
                    picture: "assets/images/money/question4.jpg"
                },
                question5 = {
                    question: `If you purchase a bond and interest rates rise, what will happen to the price of the bond?`,
                    guesses: ["Rise","Stay the same","Fall","All of the Above"],
                    answer: 2,
                    picture: "assets/images/money/question5.png"
                },
                question6 = {
                    question: `A typical 65-year-old man can expect to live, on average, for how many more years?`,
                    guesses: ["10 more years","15 more years","20 more years","25 more years"],
                    answer: 2,
                    picture: "assets/images/money/question6.jpg"
                },
                question7 = {
                    question: `What is the average annual rate of inflation for college tuition around the country?`,
                    guesses: ["2%","5%","8%","11%"],
                    answer: 2,
                    picture: "assets/images/money/question7.png"
                },
                question8 = {
                    question: `If you delay saving and investing until you are 40, rather than 30, how much less money will you have when your 65? (on average)`,
                    guesses: ["5% less","10% less","15% less","20% less"],
                    answer: 2,
                    picture: "assets/images/money/question8.jpg"
                },
        ],
        riddles: [
            question1 = {
                question: `What is always on its way here, but never arrives?`,
                guesses: [`An Amazon package`,`Tomorrow`,`Comets`, `Spaghetti`],
                answer: 1,
                picture: "assets/images/riddles/question1.jpg"
            },
            question2 = {
                question: `What is at the beginning of eternity, the end of time and space, the beginning of every end and the end of every race?`,
                guesses: [`The letter e`,`Meaning`,`God`,`Nothing`],
                answer: 0,
                picture: "assets/images/riddles/question2.gif"
            },
            question3 = {
                question: `If April showers bring May flowers, what do Mayflowers bring?`,
                guesses: [`Patience`,`Joy`,`Pilgrams`,`Heat`],
                answer: 2,
                picture: "assets/images/riddles/question3.jpg"
            },
            question4 = {
                question: `<p>The more there is, the less you see. <p>What am I?`,
                guesses: [`Tall People`,`Lies`,`Smoke`,`Darkness`],
                answer: 3,
                picture: "assets/images/riddles/question4.jpg"
            },
            question5 = {
                question: `<p>You can have me, but cannot hold me. 
                <p>Gain me and quickly lose me. 
                <p>If treated with care, I can be great. 
                <p>And if betrayed, I will break.  <p>What am I?`,
                guesses: [`A porcupine`,`Glass`,`Trust`,`Snowball`],
                answer: 2,
                picture: "assets/images/riddles/question5.gif"
            },
            question6 = {
                question: `<p>I never stop. 
                <p>I control your life but without me, you wouldn't go anywhere. 
                <p>What am I?`,
                guesses: [`A car`,`Time`,`Social Media`,`A treadmill`],
                answer: 1,
                picture: "assets/images/riddles/question6.gif"
            },
            question7 = {
                question: `<p>If you break me I don't stop working. 
                <p>If you touch me I may be snared. 
                <p>If you lose me nothing will matter. 
                <p>What am I?`,
                guesses: [`Money`,`Your Heart`,`Friendship`,`Trust`],
                answer: 1,
                picture: "assets/images/riddles/question7.gif"
            },
            question8 = {
                question: `<p>If you know me, you'll want to share me, but if you share me, I'll be gone. 
                <p>What am I?`,
                guesses: [`A secret`,`Money`,`Ice Cream`,`An empty bed`],
                answer: 0,
                picture: "assets/images/riddles/question8.gif"
            },
            question9 = {
                question: `<p>What does man love more than life? 
                <p>What does he fear more than death and mortal strife? 
                <p>What does every contented man desire? 
                <p>What do the poor have, and the rich require?`,
                guesses: [`Clothes`,`Nothing`,`Their name`,`Ambition`],
                answer: 1,
                picture: "assets/images/riddles/question9.gif"
            },
            question10 = {
                question: `<p>Even the smartest man alive will always overlook one thing. 
                <p>What is it?`,
                guesses: [`42`,`The Answer`,`His nose`,`A mountain`],
                answer: 2,
                picture: "assets/images/riddles/question10.jpg"
            },
        ]
    }
    
}

// Start Game button and reset button, only looking at hard mode currently.
$(`body`).on(`click`,`#reset`, triviaGame.anyGameOptions.runGame)

// Clicking a Hard mode button will initiate the check condition function, which checks if your answer was correct or not.
$(`body`).on(`click`,`.mycss-HMAnswerButton`, triviaGame.hard.checkCondition)

// sets difficulty when a button is clicked
$(`.difficulty`).on(`click`, triviaGame.anyGameOptions.setDifficulty);
// sets the current question bank
$(`.qBank`).on(`click`, triviaGame.anyGameOptions.chooseQuestionbank)