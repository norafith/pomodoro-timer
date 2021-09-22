const domStuff = (() => {
    const buttons = document.querySelectorAll("button");
    const breakStatusText = document.querySelector("#break-status");
    const notificationSound = new Audio("files/notification_sound.mp3");

    function workingTime() {
        document.body.classList.remove("body-break");
        document.body.classList.add("body-working");

        buttons.forEach((button) => {
            button.classList.remove("btn-break");
            button.classList.add("btn-working");
        });

        breakStatusText.textContent = "Time to work!";
    }

    function breakTime() {
        document.body.classList.remove("body-working");
        document.body.classList.add("body-break");

        buttons.forEach((button) => {
            button.classList.remove("btn-working");
            button.classList.add("btn-break");
        });

        breakStatusText.textContent = "Break!";
    }

    function reset() {
        buttons.forEach((button) => {
            button.classList.remove("btn-break");
            button.classList.add("btn-working");
        })

        breakStatusText.textContent = "Press button to start!";
    }

    function initButtonAnimations() {
        function buttonActive(e) {
            e.target.classList.add("btn-active");
        }

        function buttonToNormal(e) {
            e.target.classList.remove("btn-active");
        }

        buttons.forEach((button) => {
            button.addEventListener("click", buttonActive);
            button.addEventListener("transitionend", buttonToNormal);
        })
    }

    return { workingTime, breakTime, reset, notificationSound, initButtonAnimations };
})();

const timer = (() => {
    const timerElement = document.querySelector("#timer");
    
    let breakStatus = false;
    let workingTimerStatus = false;
    let counting;

    function count() {
        let values = timerElement.textContent.split(":");
        let minutes = Number(values[0]);
        let seconds = Number(values[1]);

        if (seconds < 59) {
            seconds += 1;
        } else {
            seconds = 0;
            minutes += 1;
        }
        
        if (String(seconds).length == 1) {
            seconds = "0" + String(seconds)
        } else {
            seconds = String(seconds)
        };
        if (String(minutes).length == 1) {
            minutes = "0" + String(minutes)
        } else {
            minutes = String(minutes)
        };
 
        timerElement.textContent = minutes + ":" + seconds;

        if (timerElement.textContent == "25:00" & !breakStatus) {
            breakStatus = true;
            workingTimerStatus = false;
            clearInterval(counting);
            domStuff.breakTime();
            domStuff.notificationSound.play()
        } else if (timerElement.textContent == "05:00" & breakStatus) {
            breakStatus = false;
            workingTimerStatus = false;
            clearInterval(counting);
            domStuff.workingTime();
            domStuff.notificationSound.play();
        }
    }

    function restart() {
        clearInterval(counting);
        timerElement.textContent = "00:00";
        breakStatus = false;
        workingTimerStatus = false;
        counting = 0;
        domStuff.reset();
    }

    function start() {
        if (!workingTimerStatus) {
            workingTimerStatus = true;
            if (!counting) domStuff.workingTime();
            counting = setInterval(count, 1000);
            timerElement.textContent = "00:00";
        }
    }

    return { count, restart, start }
})();

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", (e) => timer.start());

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", (e) => timer.restart());

domStuff.initButtonAnimations();


