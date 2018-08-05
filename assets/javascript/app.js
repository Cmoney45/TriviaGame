var triviaGame = {
    anyGameOptions: {
        gameRunning: false,
    },
    hardMode: {
        baseGame: {
            timerLength: 10,
            timerCount: this.timerLength,
            timerInterval: "",
            questionsAnswered: 0,
            questionsCorrectly: 0,
            resetGame: function(){
                //reset game to base board game.
                this.questionsAnswered = 0;
                this.questionsCorrectly = 0;
            },
            runGame: function(){

            },
            gameTimer: setInterval(this.decrement, 1000),
            decrement: function() {
                this.timerCount--;
                $("#timeGoeshere").html(`<h2> ${this.timerCount} </h2>`)
            }

        },
        questionBank: {
            active: [],
            bankOne: {
                
            }

        }
    }
}
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