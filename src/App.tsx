import "./App.css";
import AutoComplete from "./components/AutoComplete";
import { mockData } from "./data/mockData";

function App() {
  return (
    <div className="App">
      <AutoComplete apiUrl="https://pokeapi.co/api/v2/pokemon" />
    </div>
  );
}

export default App;
