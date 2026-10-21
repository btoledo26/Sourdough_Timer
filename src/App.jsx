import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function Header() {
  return <div className="header">Sourdough Timer</div>;
}

function Timer() {
  return (
    <article className="timer">
      <>beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</>
    </article>
  );
}

function TimerList() {
  return (
    <article className="timerlist">
      <Timer />
      <Timer />
      <Timer />
    </article>
  );
}

function AddTimerButton() {
  return (
    <>
      <button className="addtimerbutton">+</button>
    </>
  );
}

function MainContainer() {
  return (
    <div className="maincontainer">
      <AddTimerButton />
      <TimerList />
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
