import './App.css';
import Game from './components/Game';

function App() {
  const settings = {
    cries: true,
    hardMode: false,
    oneTry: false,
    quiz: false
  }

  return (
    <div className="App">
      <Game settings={settings} />
    </div>
  );
}

export default App;
