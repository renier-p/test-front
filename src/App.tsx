import "./App.css";
import AutoComplete from "./components/AutoComplete";

function App() {
  return (
    <div className="App">
      <AutoComplete apiUrl="https://pokeapi.co/api/v2/pokemon" />
    </div>
  );
}

export default App;
