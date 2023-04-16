import './App.css';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import { Route, Routes } from 'react-router-dom'

function App() {
  const settings = {
    cries: true, // if true, cries will play on getting a question correct; else they do not play and the player can immediately proceed
    hardMode: false, // if true, button choices replaced with a textbox
    oneTry: false, // if true, the game will go on until the player gets an answer wrong (NOT IMPLEMENTED)
    quiz: false // if true, there will be a set number of questions. Only after the game is over will the player know what they got right. (NOT IMPLEMENTED)
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route exact path="/game" element={<Game settings={settings} />} />
      </Routes>
    </div>
  );
}

export default App;
