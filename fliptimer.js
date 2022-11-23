var runFliptimer = false;
var flipTimerTargetDate = new Date("2022-11-24");

function setFlipTimer(date) {
    flipTimerTargetDate = date
    runFliptimer = true;
}

setInterval(() => {
    if(runFliptimer)
    {
        const currentDate = new Date();
        const timeBetweenDates = Math.ceil((flipTimerTargetDate - currentDate) / 1000);
        flipAllCards(timeBetweenDates);
    }
}, 100);

function flip(flipCard, newNumber) {
    const topHalf = flipCard.querySelector('.flip-card-top');
    const startNum = parseInt(topHalf.textContent);
    
    if(newNumber === startNum) return;

    const bottomHalf = flipCard.querySelector('.flip-card-bottom');
    const topFlip = document.createElement('div');
    topFlip.classList.add('top-flip');
    const bottomFlip = document.createElement('div');
    bottomFlip.classList.add('bottom-flip');
   
    topHalf.textContent = startNum;
    bottomHalf.textContent = startNum;
    topFlip.textContent = startNum;
    bottomFlip.textContent = newNumber;

    topFlip.addEventListener("animationstart", e => {
        topHalf.textContent = newNumber;
    })
    topFlip.addEventListener("animationend", e => {
        topFlip.remove();
    })
    bottomFlip.addEventListener("animationend", e => {
        bottomHalf.textContent = newNumber;
        bottomFlip.remove();
    })

    flipCard.append(topFlip, bottomFlip);
}

function flipAllCards(time) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600) % 24;
    const days = Math.floor(time / 86400);

    const daysOnes = document.querySelector('[data-days-ones]');
    const hoursTens = document.querySelector('[data-hours-tens]');
    const hourOnes = document.querySelector('[data-hours-ones]');
    const minutesTens = document.querySelector('[data-minutes-tens]');
    const minutesOnes = document.querySelector('[data-minutes-ones]');
    const secondsTens = document.querySelector('[data-seconds-tens]');
    const secondsOnes = document.querySelector('[data-seconds-ones]');

    flip(secondsOnes, seconds % 10);
    flip(secondsTens, Math.floor(seconds / 10));

    flip(minutesOnes, minutes % 10);
    flip(minutesTens, Math.floor(minutes / 10));

    flip(hourOnes, hours % 10);
    flip(hoursTens, Math.floor(hours / 10));

    flip(daysOnes, days);
}