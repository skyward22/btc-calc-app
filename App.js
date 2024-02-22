import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

export default function App() {
  const [currentInput, setCurrentInput] = useState("");
  const [currentResult, setCurrentResult] = useState("");
  const [lastPressed, setLastPressed] = useState("");

  // Function to get the maximum number of decimal places + 1 for safety
  const getMaxDecimalPlacesPlusOne = (input) => {
    return (
      input
        .split(/[\+\-\*\/]/) // Split by operators
        .reduce((max, curr) => {
          const decimalPlaces = (curr.split(".")[1] || "").length;
          return Math.max(max, decimalPlaces);
        }, 0) + 1
    ); // Add 1 for safety net
  };

  const handlePress = (value, type) => {
    switch (type) {
      case "number":
      case "operator":
        if (lastPressed === "equal") {
          setCurrentResult("");
          setCurrentInput(value === "operator" ? currentResult + value : value);
        } else {
          setCurrentInput(currentInput + value);
        }
        break;
      case "equal":
        try {
          const evalResult = eval(currentInput);
          const maxDecimalPlacesPlusOne =
            getMaxDecimalPlacesPlusOne(currentInput);
          const roundedResult = +evalResult.toFixed(maxDecimalPlacesPlusOne);
          setCurrentResult(roundedResult.toString());
          setCurrentInput("");
        } catch (error) {
          setCurrentInput("");
          setCurrentResult("Error");
        }
        break;
      case "clear":
        setCurrentInput("");
        setCurrentResult("");
        break;
      default:
        break;
    }
    setLastPressed(type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.resultDisplay}>
        <Text style={styles.resultText}>
          {lastPressed === "equal" && currentResult
            ? `BTC: ${currentResult}`
            : currentResult}
        </Text>
      </View>
      <View style={styles.calculationDisplay}>
        <Text style={styles.calculationText}>{currentInput}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {[
          "clear",
          "/",
          "*",
          "-",
          "1",
          "2",
          "3",
          "+",
          "4",
          "5",
          "6",
          ".",
          "7",
          "8",
          "9",
          "0",
          "=",
        ].map((button) => (
          <TouchableOpacity
            key={button}
            style={[
              styles.button,
              {
                backgroundColor: ["#", "=", "clear"].includes(button)
                  ? "#f7931a"
                  : "#34495e",
              },
            ]}
            onPress={() =>
              handlePress(
                button,
                isNaN(button) || button === "."
                  ? button === "="
                    ? "equal"
                    : button === "clear"
                    ? "clear"
                    : "operator"
                  : "number"
              )
            }
          >
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  resultDisplay: {
    flex: 1,
    backgroundColor: "#34495e",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  calculationDisplay: {
    flex: 1,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  resultText: {
    color: "#fff",
    fontSize: 32,
  },
  calculationText: {
    color: "#fff",
    fontSize: 24,
  },
  buttonContainer: {
    flex: 7,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    minWidth: "24%",
    minHeight: "18%",
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ecf0f1",
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
  },
});
