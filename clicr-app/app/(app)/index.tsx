import { View, Button } from "react-native";
import { router } from "expo-router";

const venues = ["test venue", "test venue2", "test venue3"];

export default function Index() {
  const goToVenue = (venue: string) => {
    router.push({ pathname: "/(app)/events" as any, params: { venue } });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {venues.map((venue) => (
        <Button key={venue} title={venue} onPress={() => goToVenue(venue)} />
      ))}
    </View>
  );
}
