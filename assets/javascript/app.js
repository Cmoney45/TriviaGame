var triviaGame = {
    anyGameOptions: {
        gameRunning: false,
        wordBankChosen: "",
        difficultySelected: "",
        timerInterval: "",
        qAnswered: 0,
        qCorrect: 0,
        qMissed: 0,
        timerLength: 0,
        completion: function() {
            this.gameRunning = false;
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
        setDifficulty: function() {
            triviaGame.anyGameOptions.difficultySelected = $(this).attr("data-mode");
        },
        chooseQuestionbank: function() {
            triviaGame.anyGameOptions.wordBankChosen = $(this).attr("data-bank");
        }
    },
    easy: {

    },
    hardest: {
        timerReset: 10,
        resetReset: 2,
    },
    hard: {
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
            triviaGame.hard.hardInternalSetting = triviaGame.anyGameOptions.difficultySelected;
            triviaGame.qBanks.active.activeBank = triviaGame.qBanks[triviaGame.anyGameOptions.wordBankChosen].slice(0)

            triviaGame.hard.runGame();
        },
    //** Initiate the game
        runGame: function(){
            if (triviaGame.hard.hardInternalSetting === "hardest"){
                triviaGame.anyGameOptions.timerLength = triviaGame.hardest.timerReset;
            } else {
            triviaGame.anyGameOptions.timerLength = triviaGame.hard.timerReset;
            }
            triviaGame.anyGameOptions.gameRunning = true;

            $(`#timeStamp`).html(`<p>Time Remaining: ${triviaGame.anyGameOptions.timerLength} Seconds</p>`)
            
            triviaGame.hard.chooseQuestion();
            triviaGame.hard.createQuestionHTML();
            triviaGame.anyGameOptions.timerInterval = setInterval(triviaGame.hard.decrement, 1000);
        },
    //** New question interval loop
        newQuest: function(){
            if( triviaGame.qBanks.active.activeBank.length === 0) {
                triviaGame.anyGameOptions.completion()
                return;
            } else {
                if(triviaGame.hard.hardInternalSetting === "hardest"){
                    triviaGame.hard.resetLength = triviaGame.hardest.resetReset;
                } else {
                    triviaGame.hard.resetLength = triviaGame.hard.resetReset;
                }
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
            }
        },
    //** On click condition for the answer buttons
        checkCondition: function(){
            const userGuess = parseInt($(this).attr("id"));
            clearInterval(triviaGame.anyGameOptions.timerInterval);
            triviaGame.anyGameOptions.qAnswered++; 
        
            if ((userGuess - 1) === triviaGame.qBanks.active.currentQuestion.answer){
                $("#question").html(`<p>Correct!</p>`);
                $("#responses").empty();
                triviaGame.anyGameOptions.qCorrect++;
            } else {
                $(`#question`).html(`<p>Nope!</p>`);
                $("#responses").html(`<p>The correct response was ${triviaGame.qBanks.active.currentQuestion.guesses[triviaGame.qBanks.active.currentQuestion.answer]}</p>`)
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
    qBanks: {
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
                guesses: [`An Amazon package`,`Tomorrow`,`Comets`, `Spaghetti`],
                answer: 1
            },
            question2 = {
                question: `What is at the beginning of eternity, the end of time and space, the beginning of every end and the end of every race?`,
                guesses: [`The letter e`,`Meaning`,`God`,`Nothing`],
                answer: 0
            },
            question3 = {
                question: `If April showers bring May flowers, what do Mayflowers bring?`,
                guesses: [`Patience`,`Joy`,`Pilgrams`,`Heat`],
                answer: 2
            },
            question4 = {
                question: `<p>The more there is, the less you see. <p>What am I?`,
                guesses: [`Tall People`,`Lies`,`Smoke`,`Darkness`],
                answer: 3
            },
            question5 = {
                question: `<p>You can have me, but cannot hold me. 
                <p>Gain me and quickly lose me. 
                <p>If treated with care, I can be great. 
                <p>And if betrayed, I will break.  <p>What am I?`,
                guesses: [`A porcupine`,`Glass`,`Trust`,`Snowball`],
                answer: 2
            },
            question6 = {
                question: `<p>I never stop. 
                <p>I control your life but without me, you wouldn't go anywhere. 
                <p>What am I?`,
                guesses: [`A car`,`Time`,`Social Media`,`A treadmill`],
                answer: 1
            },
            question7 = {
                question: `<p>If you break me I don't stop working. 
                <p>If you touch me I may be snared. 
                <p>If you lose me nothing will matter. 
                <p>What am I?`,
                guesses: [`Money`,`Your Heart`,`Friendship`,`Trust`],
                answer: 1
            },
            question8 = {
                question: `<p>If you know me, you'll want to share me, but if you share me, I'll be gone. 
                <p>What am I?`,
                guesses: [`A secret`,`Money`,`Ice Cream`,`An empty bed`],
                answer: 0
            },
            question9 = {
                question: `<p>What does man love more than life? 
                <p>What does he fear more than death and mortal strife? 
                <p>What does every contented man desire? 
                <p>What do the poor have, and the rich require?`,
                guesses: [`Clothes`,`Nothing`,`Their name`,`Ambition`],
                answer: 1
            },
            question10 = {
                question: `<p>Even the smartest man alive will always overlook one thing. 
                <p>What is it?`,
                guesses: [`42`,`The Answer`,`His nose`,`A mountain`],
                answer: 2
            },
        ]
    }
    
}

// Start Game button and reset button, only looking at hard mode currently.
$(`body`).on(`click`,`#reset`, triviaGame.hard.resetGame)

// Clicking a Hard mode button will initiate the check condition function, which checks if your answer was correct or not.
$(`body`).on(`click`,`.mycss-HMAnswerButton`, triviaGame.hard.checkCondition)

$(`.difficulty`).on(`click`, triviaGame.anyGameOptions.setDifficulty);

$(`.qBank`).on(`click`, triviaGame.anyGameOptions.chooseQuestionbank)