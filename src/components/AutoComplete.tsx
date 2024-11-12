import React, { useState, useEffect, useCallback } from "react";
import "./AutoComplete.css";

interface AutoCompleteProps {
  apiUrl: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ apiUrl }) => {
  const [query, setQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [firstThreeMatches, setFirstThreeMatches] = useState<any[]>([]);

  const filterData = useCallback(
    async (query: string) => {
      if (!query) {
        setFilteredData([]);
        setFirstThreeMatches([]);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiUrl}?limit=50&offset=0`);
        const data = await response.json();

        const results = data.results.filter((pokemon: { name: string }) =>
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(results);

        const firstThree = results
          .filter((pokemon: { name: string }) =>
            pokemon.name
              .toLowerCase()
              .startsWith(query.toLowerCase().slice(0, 3))
          )
          .slice(0, 3);

        setFirstThreeMatches(firstThree);
      } catch (error) {
        setError("Error fetching Pokémon data");
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterData(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filterData]);

  const highlightText = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ fontWeight: "bold", color: "red" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getPokemonImage = async (pokemonName: string) => {
    try {
      const response = await fetch(`${apiUrl}/${pokemonName}`);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      setError("Error fetching Pokémon image");
    }
  };

  const handleSelectPokemon = (pokemonName: string) => {
    getPokemonImage(pokemonName);
    setQuery(pokemonName);
    setFilteredData([]);
  };

  return (
    <div className="autocomplete-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "900px",
          height: "auto",
        }}
      >
        {/* Sección de primeras 3 coincidencias */}
        <div
          style={{
            height: "300px",
            width: "900px",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {firstThreeMatches.length > 0 && (
            <div className="three-matches">
              <h3>Top 3 Matches:</h3>
              <div className="matches-container">
                {firstThreeMatches.map((item, index) => (
                  <div
                    key={index}
                    className="match-item"
                    style={{
                      width: "300px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column-reverse",
                    }}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                        item.url.split("/").slice(-2, -1)[0]
                      }.png`}
                      alt={item.name}
                      className="pokemon-mini-img"
                    />
                    <p>{highlightText(item.name)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sección de campo de búsqueda */}
        <div
          style={{
            height: "200px",
            width: "900px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
            position: "relative",
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Pokémon..."
            className="autocomplete-input"
          />
          {isLoading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}

          <ul className="autocomplete-list">
            {filteredData.map((item, index) => (
              <li
                key={index}
                className="autocomplete-item"
                onClick={() => handleSelectPokemon(item.name)}
              >
                {highlightText(item.name)}
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de imagen del Pokémon seleccionado */}
        <div
          style={{
            height: "auto",
            width: "900px",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {selectedPokemon && (
            <div className="pokemon-image">
              <h2>{selectedPokemon.name}</h2>
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="pokemon-img"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoComplete;
