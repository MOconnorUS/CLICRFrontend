import { useState, useRef, useEffect } from "react";
import { View, Text, Button } from "react-native";

export default function Index() {
  const [plus, setPlus] = useState(0);
  const [minus, setMinus] = useState(0);
  const [peopleIn, setPeopleIn] = useState(0);
  const [peopleOut, setPeopleOut] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.152:8080/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveCount(data.count);
      setPeopleIn(data.entered);
      setPeopleOut(data.exited);
    }

    return () => ws.close();
  }, []);

  const sendUpdate = (currentPlus: number, currentMinus: number) => {
    fetch("http://192.168.1.152:8080/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venue: "test venue", entered: currentPlus, exited: currentMinus })
    });


    // setPlus(0);
    // setMinus(0);
  };

  const updateCount = (currentPlus: number, currentMinus: number) => {
    // clear previous timer if button pressed again before it fires
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // only fires if no button pressed for 1.5 seconds
    debounceTimer.current = setTimeout(() => {
      sendUpdate(currentPlus, currentMinus);
      setPlus(0);
      setMinus(0);
    }, 1500);
  };

  function increment() {
    const newPlus = plus + 1;
    setPlus(newPlus);
    updateCount(newPlus, minus);
  }

  function decrement() {
    const newMinus = minus + 1;
    setMinus(newMinus);
    updateCount(plus, newMinus);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to CLICR!!</Text>
      <Button title="+" onPress={increment} />
      <Button title="-" onPress={decrement} />
      <Text>Live Count: {liveCount}</Text>
      <Text>People Entered: {peopleIn}</Text>
      <Text>People Exited: {peopleOut}</Text>
    </View>
  );
}
