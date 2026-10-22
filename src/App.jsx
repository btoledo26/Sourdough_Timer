import { useState } from "react";
import "./App.css";

function Header() {
  return <div className="header">Sourdough Timer</div>;
}

function IncrementFoldsButton({ count, onClick }) {
  return <button onClick={onClick}>+</button>;
}

function DecrementFoldsButton({ count, onClick }) {
  return <button onClick={onClick}>-</button>;
}

function TimerFace() {
  return null;
}

function PlayPauseButton() {
  return null;
}

function ResetTimerButton() {
  return null;
}

function TimerControls() {
  return null;
}

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
        <IncrementFoldsButton foldCount={foldCount} onClick={increment} />
        <DecrementFoldsButton foldCount={foldCount} onClick={decrement} />
      </div>
      <div className="timerbody">
        <TimerFace />
        <TimerControls />
      </div>
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
