import { useState, useRef, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function Index() {
  const { venue } = useLocalSearchParams<{ venue: string }>();
  const [plus, setPlus] = useState(0);
  const [minus, setMinus] = useState(0);
  const [peopleIn, setPeopleIn] = useState(0);
  const [peopleOut, setPeopleOut] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.1.152:8080/ws/${venue}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLiveCount(data.count);
      setPeopleIn(data.entered);
      setPeopleOut(data.exited);
    }

    return () => ws.current?.close();
  }, [venue]);

//   const sendUpdate = (currentPlus: number, currentMinus: number) => {
//     fetch(`http://192.168.1.152:8080/update`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ venue: venue, entered: currentPlus, exited: currentMinus })
//     });
//   };

//   const updateCount = (currentPlus: number, currentMinus: number) => {
//     // clear previous timer if button pressed again before it fires
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);

//     // only fires if no button pressed for 1.5 seconds
//     debounceTimer.current = setTimeout(() => {
//       sendUpdate(currentPlus, currentMinus);
//       setPlus(0);
//       setMinus(0);
//     }, 1500);
//   };

  function increment() {
    // const newPlus = plus + 1;
    // setPlus(newPlus);
    ws.current?.send(JSON.stringify({ action: "increment" }));
    // updateCount(newPlus, minus);
  }

  function decrement() {
    // const newMinus = minus + 1;
    // setMinus(newMinus);
    ws.current?.send(JSON.stringify({ action: "decrement" }));

    // updateCount(plus, newMinus);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to CLICR!!</Text>
      <Text>Current Venue: {venue}</Text>
      <Button title="+" onPress={increment} />
      <Button title="-" onPress={decrement} />
      <Text>Live Count: {liveCount}</Text>
      <Text>People Entered: {peopleIn}</Text>
      <Text>People Exited: {peopleOut}</Text>
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}
