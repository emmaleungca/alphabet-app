import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [stage, setStage] = useState<"setup" | "game">("setup");
  const [players, setPlayers] = useState(2);
  const [letter, setLetter] = useState("A");
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [scores, setScores] = useState<number[]>(Array(8).fill(0));
  const [playerNames, setPlayerNames] = useState<string[]>(Array(8).fill(""));

  // Load saved data on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await SecureStore.getItemAsync('alphabetGameData');
        console.log('Loading data:', savedData);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setStage(parsed.stage || "setup");
          setPlayers(parsed.players || 2);
          setLetter(parsed.letter || "A");
          setCurrentPlayer(parsed.currentPlayer || 0);
          setGuesses(parsed.guesses || []);
          setScores(parsed.scores || Array(8).fill(0));
          setPlayerNames(parsed.playerNames || Array(8).fill(""));
          console.log('Data loaded successfully');
        } else {
          console.log('No saved data found');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save data whenever state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const dataToSave = {
          stage,
          players,
          letter,
          currentPlayer,
          guesses,
          scores,
          playerNames,
        };
        const dataString = JSON.stringify(dataToSave);
        await SecureStore.setItemAsync('alphabetGameData', dataString);
        console.log('Data saved:', dataString);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [stage, players, letter, currentPlayer, guesses, scores, playerNames]);

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
    setPlayerNames(Array(8).fill(""));
    setCurrentPlayer(0);
    setInput("");
  };

  const getPlayerName = (playerIndex: number) => {
    return playerNames[playerIndex]?.trim() || `Player ${playerIndex + 1}`;
  };

  if (stage === "setup") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: "center", marginBottom: 30 }}>
              <Ionicons name="game-controller" size={60} color="#007AFF" />
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#000000",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Alphabet Game
              </Text>
            </View>

            <View style={{ marginBottom: 30 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#000000",
                  marginBottom: 15,
                }}
              >
                Number of Players
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setPlayers(n)}
                    style={{
                      width: 50,
                      height: 50,
                      margin: 5,
                      borderRadius: 25,
                      backgroundColor: players === n ? "#007AFF" : "#F2F2F7",
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: players === n ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 40 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#000000",
                  marginBottom: 15,
                }}
              >
                Choose Starting Letter
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                  <TouchableOpacity
                    key={l}
                    onPress={() => setLetter(l)}
                    style={{
                      width: 40,
                      height: 40,
                      margin: 4,
                      borderRadius: 20,
                      backgroundColor: letter === l ? "#007AFF" : "#F2F2F7",
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: letter === l ? "#FFFFFF" : "#000000",
                      }}
                    >
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 40 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#000000",
                  marginBottom: 15,
                }}
              >
                Player Names
              </Text>
              {Array.from({ length: players }).map((_, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#000000",
                      marginBottom: 5,
                    }}
                  >
                    {getPlayerName(i)}
                  </Text>
                  <TextInput
                    value={playerNames[i] || ""}
                    onChangeText={(text) => {
                      const newNames = [...playerNames];
                      newNames[i] = text;
                      setPlayerNames(newNames);
                    }}
                    placeholder={`Enter name for Player ${i + 1}`}
                    style={{
                      borderWidth: 1,
                      borderColor: "#8E8E93",
                      padding: 12,
                      borderRadius: 8,
                      fontSize: 16,
                      color: "#000000",
                      backgroundColor: "#FFFFFF",
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setStage("game")}
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 18,
                borderRadius: 12,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Start Game
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ======================
  // GAME SCREEN
  // ======================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Ionicons name="game-controller" size={40} color="#007AFF" />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#000000",
                marginTop: 5,
                textAlign: "center",
              }}
            >
              Alphabet Game
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 15,
              paddingHorizontal: 10,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="text" size={20} color="#007AFF" />
              <Text style={{ fontSize: 16, color: "#000000", marginTop: 2 }}>
                Letter: {letter}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Ionicons name="people" size={20} color="#007AFF" />
              <Text style={{ fontSize: 16, color: "#000000", marginTop: 2 }}>
                Players: {players}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={resetGame}
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: "#F2F2F7",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Ionicons name="refresh" size={16} color="#000000" />
            <Text style={{ color: "#000000", marginLeft: 5, fontWeight: "500" }}>
              New Game
            </Text>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: "#F2F2F7",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#000000",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Turn for {getPlayerName(currentPlayer)}
            </Text>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={`Enter a word starting with ${letter}`}
              style={{
                borderWidth: 1,
                borderColor: "#8E8E93",
                padding: 15,
                borderRadius: 10,
                fontSize: 16,
                color: "#000000",
                backgroundColor: "#FFFFFF",
                marginBottom: 15,
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={submitGuess}
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Submit Guess
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scores */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#000000",
                marginBottom: 10,
              }}
            >
              Player Scores
            </Text>
            {Array.from({ length: players }).map((_, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                  marginBottom: 5,
                  backgroundColor: "#F2F2F7",
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Text style={{ fontSize: 16, color: "#000000" }}>
                  {getPlayerName(i)}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#007AFF" }}>
                  {scores[i]} points
                </Text>
              </View>
            ))}
          </View>

          {/* Guess History */}
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#000000",
                marginBottom: 10,
              }}
            >
              All Guesses ({guesses.length})
            </Text>
            {guesses.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  padding: 20,
                  backgroundColor: "#F9F9F9",
                  borderRadius: 8,
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#8E8E93" />
                <Text style={{ marginTop: 5, color: "#8E8E93" }}>
                  No guesses yet
                </Text>
              </View>
            ) : (
              guesses.map((g, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    marginBottom: 5,
                    borderRadius: 8,
                    backgroundColor: g.valid ? "#D1F2EB" : "#FADBD8",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <Ionicons
                    name={g.valid ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={g.valid ? "#34C759" : "#FF3B30"}
                  />
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontSize: 16,
                      color: "#000000",
                    }}
                  >
                    {getPlayerName(g.player)}: {g.word}
                    {g.duplicate ? " (duplicate)" : ""}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}