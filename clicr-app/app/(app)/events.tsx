import { useState, useRef, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function Index() {
  const { venue } = useLocalSearchParams<{ venue: string }>();
  const [peopleIn, setPeopleIn] = useState(0);
  const [peopleOut, setPeopleOut] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
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

  function increment() {
    ws.current?.send(JSON.stringify({ action: "increment" }));
  }

  function decrement() {
    ws.current?.send(JSON.stringify({ action: "decrement" }));
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
