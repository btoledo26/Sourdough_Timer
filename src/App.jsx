import { useState, useEffect, useRef } from "react";
import "./App.css";

function Header() {
  return <div className="header">Sourdough Timer</div>;
}

function IncrementFoldsButton({ onClick }) {
  return <button onClick={onClick}>+</button>;
}

function DecrementFoldsButton({ onClick }) {
  return <button onClick={onClick}>-</button>;
}

function Timer() {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMS, setRemainingMS] = useState(0);
  const initialEndTimeRef = useRef(null); //the time the timer should end, used to reset timer
  const endTimeRef = useRef(null); //the time the timer should end

  useEffect(() => {
    if (!isRunning) return;

    /*if not running, calculate remaining time and set it
      this is for when the timer is paused, it will adjust the timer end point if user changes timer vals*/
    const updateTimer = () => {
      const remainingTime = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMS(remainingTime);

      if (remainingTime === 0) {
        setIsRunning(false);
      }
    };

    const intervalId = setInterval(updateTimer, 250); //checks the countdown every 250ms
    updateTimer(); //immediate call to update timer as it starts

    return () => clearInterval(intervalId);
  }, [isRunning]);

  function StartTimer() {
    if (remainingMS > 0) {
      endTimeRef.current = Date.now() + remainingMS;
    } else {
      const durationMS =
        (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) * 1000;
      if (durationMS <= 0) return;

      initialEndTimeRef.current = durationMS;
      setRemainingMS(durationMS);
      endTimeRef.current = Date.now() + durationMS;
    }

    setIsRunning(true);
  }

  function PauseTimer() {
    if (!isRunning) return;

    const remaining = Math.max(0, endTimeRef.current - Date.now());

    setRemainingMS(remaining);

    // Calculate the current time remaining
    const remainingHours = Math.floor(remainingMS / 3600000);
    const remainingMinutes = Math.floor((remainingMS % 3600000) / 60000);
    const remainingSeconds = Math.floor((remainingMS % 60000) / 1000);

    // Update the input fields
    setHours(String(remainingHours).padStart(2, "0"));
    setMinutes(String(remainingMinutes).padStart(2, "0"));
    setSeconds(String(remainingSeconds).padStart(2, "0"));
    setIsRunning(false);
  }

  function ToggleTimer() {
    if (isRunning) {
      PauseTimer();
    } else {
      StartTimer();
    }
  }

  function ResetTimer() {
    const duration = initialEndTimeRef.current ?? 0;
    endTimeRef.current = Date.now() + duration;
    setRemainingMS(duration); // Restore the duration captured when the timer was started
    setIsRunning(true); //ensures restart even when paused
  }

  function UpdateTimer(newHours, newMinutes, newSeconds) {
    if (isRunning) return;

    const durationMS =
      (Number(newHours) * 3600 + Number(newMinutes) * 60 + Number(newSeconds)) *
      1000;

    setRemainingMS(durationMS);
    initialEndTimeRef.current = durationMS;
  }

  function HandleInputOnChange(e, unit) {
    const value = e.target.value;

    // Allow only up to 2 digits
    if (!/^\d{0,2}$/.test(value)) return;

    const num = Number(value);

    // Restrict minutes and seconds to 0–59
    if (unit !== "hours" && num > 59) return;

    // Update the appropriate state
    if (unit === "hours") {
      setHours(value);
    } else if (unit === "minutes") {
      setMinutes(value);
    } else if (unit === "seconds") {
      setSeconds(value);
    }

    // Update the actual timer duration
    const newHours = unit === "hours" ? value : hours;
    const newMinutes = unit === "minutes" ? value : minutes;
    const newSeconds = unit === "seconds" ? value : seconds;

    UpdateTimer(newHours, newMinutes, newSeconds);
  }

  function HandleInputOnBlur(unit) {
    if (unit === "hours") {
      const formatted = String(hours || "0").padStart(2, "0");
      setHours(formatted);
      UpdateTimer(formatted, minutes, seconds);
    } else if (unit === "minutes") {
      const formatted = String(minutes || "0").padStart(2, "0");
      setMinutes(formatted);
      UpdateTimer(hours, formatted, seconds);
    } else if (unit === "seconds") {
      const formatted = String(seconds || "0").padStart(2, "0");
      setSeconds(formatted);
      UpdateTimer(hours, minutes, formatted);
    }
  }

  return (
    <article className="timerbody">
      {isRunning ? (
        <div id="timer-display" className="timer-fields">
          <span className="time-strings">
            {String(Math.floor(remainingMS / 3600000)).padStart(2, "0")}
          </span>
          <span className="timer-colon">:</span>
          <span className="time-strings">
            {String(Math.floor((remainingMS % 3600000) / 60000)).padStart(
              2,
              "0",
            )}
          </span>
          <span className="timer-colon">:</span>
          <span className="time-strings">
            {String(Math.floor((remainingMS % 60000) / 1000)).padStart(2, "0")}
          </span>
        </div>
      ) : (
        <div id="time-inputs" className="timer-fields">
          <input
            type="text"
            maxLength={2}
            value={hours}
            onChange={(e) => HandleInputOnChange(e, "hours")}
            onBlur={() => HandleInputOnBlur("hours")}
          />
          <span className="timer-colon">:</span>
          <input
            type="text"
            maxLength={2}
            value={minutes}
            onChange={(e) => HandleInputOnChange(e, "minutes")}
            onBlur={() => HandleInputOnBlur("minutes")}
          />
          <span className="timer-colon">:</span>
          <input
            type="text"
            maxLength={2}
            value={seconds}
            onChange={(e) => HandleInputOnChange(e, "seconds")}
            onBlur={() => HandleInputOnBlur("seconds")}
          />
        </div>
      )}

      <button
        className={isRunning ? "pause-button" : "play-button"}
        onClick={ToggleTimer}
      >
        {isRunning ? "⏸" : "▶"}
      </button>
      <button className="reset-button" onClick={ResetTimer}>
        ↺
      </button>
    </article>
  );
}

/*TODO: Add notes dropdown/toggle to bottom of each timer card,
        Also add Edit Timer button to modify name and delete timer */
function TimerCard() {
  const [foldCount, setFoldCount] = useState(0);
  const increment = () => setFoldCount((foldCount) => foldCount + 1);
  const decrement = () =>
    setFoldCount((foldCount) => (foldCount > 0 ? foldCount - 1 : 0));

  return (
    <article className="timercard">
      <div className="timerheader">
        <input type="text" placeholder="Enter timer name" />
        Stretch & Folds: {foldCount}
        <DecrementFoldsButton onClick={decrement} />
        <IncrementFoldsButton onClick={increment} />
      </div>
      <Timer />
    </article>
  );
}

function TimerList({ timerList }) {
  return (
    <div className="timerlist">
      {timerList.map((id) => (
        <TimerCard key={id} />
      ))}
    </div>
  );
}

function AddTimerButton({ onClick }) {
  return (
    <button className="addtimerbutton" onClick={onClick}>
      +
    </button>
  );
}

/*change ids to be generated with randomUUID*/
function MainContainer() {
  const [showTimers, setShowTimers] = useState(false);
  const [timerList, setTimerList] = useState([]);

  const appendTimer = () => {
    setShowTimers(showTimers === false ? !showTimers : showTimers);
    const newId = timerList.length + 1;
    setTimerList([...timerList, newId]);
  };

  return (
    <div className="maincontainer">
      <AddTimerButton onClick={appendTimer} />
      {showTimers && <TimerList timerList={timerList} />}
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <MainContainer />
    </>
  );
}

export default App;
