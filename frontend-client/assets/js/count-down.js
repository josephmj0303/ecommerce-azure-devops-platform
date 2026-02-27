function initializeCountdown(elementId, endDate) {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  const countDown = new Date(endDate).getTime();
  
  const interval = setInterval(function() {
      const now = new Date().getTime(),
            distance = countDown - now;

      const daysElement = document.querySelector(`#${elementId} .days`);
      const hoursElement = document.querySelector(`#${elementId} .hours`);
      const minutesElement = document.querySelector(`#${elementId} .minutes`);
      const secondsElement = document.querySelector(`#${elementId} .seconds`);

      if (daysElement && hoursElement && minutesElement && secondsElement) {
        daysElement.innerText = Math.floor(distance / day);
        hoursElement.innerText = Math.floor((distance % day) / hour);
        minutesElement.innerText = Math.floor((distance % hour) / minute);
        secondsElement.innerText = Math.floor((distance % minute) / second);
      }

      //do something later when date is reached
      if (distance < 0) {
          const countdownElement = document.querySelector(`#${elementId}`);
          if (countdownElement) {
              countdownElement.style.display = "none";
          }
          clearInterval(interval);
      }
  }, 1000);
}

// Initialize countdowns
initializeCountdown('countdown1', '2027-12-30');
initializeCountdown('countdown2', '2027-12-20');
initializeCountdown('countdown3', '2027-11-24');
initializeCountdown('countdown4', '2027-11-11');
initializeCountdown('countdown5', '2027-11-13');
initializeCountdown('countdown6', '2027-11-03');
initializeCountdown('countdown7', '2027-11-03');
initializeCountdown('countdown8', '2027-11-03');
initializeCountdown('countdown9', '2027-11-03');
initializeCountdown('countdown10', '2027-12-03');
initializeCountdown('countdown11', '2027-11-15');
initializeCountdown('countdown12', '2027-11-15');
initializeCountdown('countdown13', '2027-11-15');
initializeCountdown('countdown14', '2027-11-15');
initializeCountdown('countdown15', '2027-11-15');
initializeCountdown('countdown16', '2027-11-15');
initializeCountdown('countdown17', '2027-11-15');
initializeCountdown('countdown18', '2027-11-15');
initializeCountdown('countdown19', '2027-11-15');
initializeCountdown('countdown20', '2027-11-15');
initializeCountdown('countdown21', '2027-11-15');
initializeCountdown('countdown22', '2027-11-15');
initializeCountdown('countdown23', '2027-11-15');
initializeCountdown('countdown24', '2027-11-15');
initializeCountdown('countdown25', '2027-11-15');
initializeCountdown('countdown26', '2027-11-15');