// import { Text, View, Button } from "react-native";
// import { supabase } from "@/lib/supabase";
// import { useState } from "react";

// export default function Index() {
//   const [plus, setPlus] = useState(0);
//   const [minus, setMinus] = useState(0);
//   const [liveCount, setLiveCount] = useState(0);

//   function increment() {
//     setPlus(plus + 1);
//     sub();
//   }

//   function decrement() {
//     setMinus(minus + 1);
//     sub();
//   }

//   function sub() {
//     setLiveCount(plus - minus);

//     if (liveCount < 0) {
//       setLiveCount(0);
//     }
//   }
  
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Welcome to CLICR!!.</Text>
//       <Text>Hello blabl</Text>
//       <Button title="+" onPress={increment}/>
//       <Button title="-" onPress={decrement}/>
//       <Text>Live Count: {liveCount}</Text>
      
//     </View>
//   );
// }

import { useState, useRef } from "react";
import { View, Text, Button } from "react-native";

export default function Index() {
  const [plus, setPlus] = useState(0);
  const [minus, setMinus] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendUpdate = (currentCount: number) => {
    fetch("http://192.168.1.152:8080/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venue: "test venue", value: currentCount })
    });
  };

  const updateCount = (newPlus: number, newMinus: number) => {
    const newCount = Math.max(0, newPlus - newMinus); // fixes your negative check too
    setLiveCount(newCount);

    // clear previous timer if button pressed again before it fires
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // only fires if no button pressed for 1.5 seconds
    debounceTimer.current = setTimeout(() => {
      sendUpdate(newCount);
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
    </View>
  );
}
