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
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = () => {
      const remainingTime = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMS(remainingTime);

      if (remainingTime === 0) {
        setIsRunning(false);

        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.error("Mobile audio playback blocked:", err);
          });
        }
      }
    };

    const intervalId = setInterval(updateTimer, 250); //checks the countdown every 250ms
    updateTimer(); //immediate call to update timer as it starts

    return () => clearInterval(intervalId);
  }, [isRunning]);

  function StartTimer() {
    SetUpAlarmSound();

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

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function UpdateTimer(newHours, newMinutes, newSeconds) {
    if (isRunning) return;

    const durationMS =
      (Number(newHours) * 3600 + Number(newMinutes) * 60 + Number(newSeconds)) *
      1000;

    setRemainingMS(durationMS);
    initialEndTimeRef.current = durationMS;
  }

  function SetUpAlarmSound() {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/AlarmSound.wav");
    }

    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      })
      .catch((err) => console.log("Failed to set up audio:", err));
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

function DeleteTimerButton({ id, onDelete }) {
  return (
    <>
      <button className="delete-timer-button" onClick={() => onDelete(id)}>
        &times;
      </button>
    </>
  );
}

function TimerCard({ id, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [foldCount, setFoldCount] = useState(0);
  const increment = () => setFoldCount((foldCount) => foldCount + 1);
  const decrement = () =>
    setFoldCount((foldCount) => (foldCount > 0 ? foldCount - 1 : 0));

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <article className="timercard">
      <div className="edit-timer-div">
        <button
          className={`edit-timer-button ${isEditing ? "editing" : ""}`}
          onClick={toggleEditing}
        >
          ✐
        </button>
      </div>

      <div className="timer-content">
        <div className="timerheader">
          <div className={isEditing ? "delete-visible" : "delete-hidden"}>
            <DeleteTimerButton id={id} onDelete={onDelete}></DeleteTimerButton>
          </div>
          <input type="text" placeholder="Timer Name" readOnly={!isEditing} />
          <div className="stretchCounter">
            Stretch & Folds: <span className="fold-count">{foldCount}</span>
            <DecrementFoldsButton onClick={decrement} />
            <IncrementFoldsButton onClick={increment} />
          </div>
        </div>
        <Timer />
      </div>
    </article>
  );
}

function TimerList({ timerList, onDelete }) {
  return (
    timerList.length > 0 && (
      <div className="timerlist">
        {timerList.map((id) => (
          <TimerCard key={id} id={id} onDelete={onDelete} />
        ))}
      </div>
    )
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
  const [timerList, setTimerList] = useState([]);

  const appendTimer = () => {
    const newId = crypto.randomUUID();
    setTimerList((prevTimers) => [...prevTimers, newId]);
  };

  const deleteTimer = (id) => {
    setTimerList((prevTimers) =>
      prevTimers.filter((timerId) => timerId !== id),
    );
  };

  return (
    <div className="maincontainer">
      <AddTimerButton onClick={appendTimer} />
      <TimerList timerList={timerList} onDelete={deleteTimer} />
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
