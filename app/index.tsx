import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Guess = {
  word: string;
  player: number;
  valid: boolean;
  duplicate: boolean;
};

export default function Index() {
  const [stage, setStage] = useState<"setup" | "game">("setup");
  const [players, setPlayers] = useState(2);
  const [letter, setLetter] = useState("A");
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [scores, setScores] = useState<number[]>(Array(8).fill(0));

  const submitGuess = () => {
    const guess = input.trim().toLowerCase();
    if (!guess) return;

    let valid = true;

    // Rule 1: must start with selected letter
    if (!guess.startsWith(letter.toLowerCase())) {
      valid = false;
    }

    // Rule 2: must not be duplicate
    const duplicate = guesses.find((g) => g.word === guess);
    if (duplicate) {
      valid = false;
    }

    const newGuess: Guess = {
      word: guess,
      player: currentPlayer,
      valid,
      duplicate: !!duplicate,
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    // Update score
    if (valid) {
      const newScores = [...scores];
      newScores[currentPlayer] += 1;
      setScores(newScores);
    }

    // Next turn
    setInput("");
    setCurrentPlayer((currentPlayer + 1) % players);
  };

  const resetGame = () => {
    setStage("setup");
    setGuesses([]);
    setScores(Array(8).fill(0));
    setCurrentPlayer(0);
    setInput("");
  };

  // ======================
  // SETUP SCREEN
  // ======================
  if (stage === "setup") {
    return (
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>
          Alphabet Game
        </Text>

        <Text style={{ marginTop: 20, fontWeight: "600" }}>
          Number of Players
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setPlayers(n)}
              style={{
                padding: 12,
                margin: 5,
                borderRadius: 8,
                backgroundColor: players === n ? "black" : "#e5e5e5",
              }}
            >
              <Text style={{ color: players === n ? "white" : "black" }}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ marginTop: 20, fontWeight: "600" }}>
          Choose Starting Letter
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLetter(l)}
              style={{
                padding: 10,
                margin: 5,
                borderRadius: 8,
                backgroundColor: letter === l ? "black" : "#e5e5e5",
              }}
            >
              <Text style={{ color: letter === l ? "white" : "black" }}>
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setStage("game")}
          style={{
            marginTop: 30,
            padding: 16,
            borderRadius: 10,
            backgroundColor: "black",
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Start Game
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ======================
  // GAME SCREEN
  // ======================
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Alphabet Game
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "space-between",
        }}
      >
        <Text>Letter: {letter}</Text>
        <Text>Players: {players}</Text>
      </View>

      <TouchableOpacity
        onPress={resetGame}
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 8,
          backgroundColor: "#ddd",
          alignSelf: "flex-start",
        }}
      >
        <Text>New Game</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Player {currentPlayer + 1}'s Turn
      </Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder={`Enter word starting with "${letter}"`}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
        }}
      />

      <TouchableOpacity
        onPress={submitGuess}
        style={{
          marginTop: 10,
          padding: 16,
          borderRadius: 10,
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Submit Guess
        </Text>
      </TouchableOpacity>

      {/* Scores */}
      <Text style={{ marginTop: 20, fontWeight: "600" }}>
        Player Scores
      </Text>

      {Array.from({ length: players }).map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            marginTop: 5,
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          <Text>Player {i + 1}</Text>
          <Text>{scores[i]} points</Text>
        </View>
      ))}

      {/* Guess History */}
      <Text style={{ marginTop: 20, fontWeight: "600" }}>
        All Guesses ({guesses.length})
      </Text>

      {guesses.length === 0 ? (
        <Text style={{ marginTop: 10, color: "#777" }}>
          No guesses yet
        </Text>
      ) : (
        guesses.map((g, i) => (
          <View
            key={i}
            style={{
              marginTop: 5,
              padding: 10,
              borderRadius: 8,
              backgroundColor: g.valid ? "#e6ffed" : "#ffe6e6",
            }}
          >
            <Text>
              Player {g.player + 1}: {g.word}{" "}
              {g.valid ? "✅" : "❌"}
              {g.duplicate ? " (duplicate)" : ""}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}