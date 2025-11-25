import FadeInImage from "@/components/FadeInImage";
import { supabase } from "@/lib/supabaseClient";
import React, { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

type Item = {
  番号: number;
  メーカー: string;
  商品名: string;
  画像URL: string;
};

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [isDecided, setDecided] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateResult = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const fetchRandomMold = async () => {
    setErrorMessage("");
    const { count, error: countError } = await supabase
      .from("Silicone mold")
      .select("*", { count: "exact", head: true });

    if (countError) {
      setErrorMessage(countError.message);
      return;
    }

    if (!count || count === 0) {
      setErrorMessage("データがありません。");
      return;
    }

    const randomIndex = Math.floor(Math.random() * count);
    const { data, error } = await supabase
      .from("Silicone mold")
      .select("*")
      .range(randomIndex, randomIndex);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    if (data && data.length > 0) {
      setItems([data[0]]);
      setImageVersion((v) => v + 1);
    }
  };
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>シリコンモールドセレクター</Text>
        {items.length > 0 && items[0].画像URL ? (
          <FadeInImage
            source={{ uri: items[0].画像URL }}
            style={styles.image}
            duration={1500}
            version={imageVersion}
          />
        ) : (
          <View style={styles.noImageBox}>
            {errorMessage !== "" && (
              <Text style={{ color: "red", marginTop: 10 }}>
                {errorMessage}
              </Text>
            )}
            <Text style={styles.noImageText}>画像が表示されます。</Text>
          </View>
        )}

        <Button
          mode="contained"
          onPress={() => {
            animateResult(() => {
              setDecided(true);
              fetchRandomMold();
            });
          }}
          style={styles.okButton}
        >
          {isDecided ? "変更する" : "OK"}
        </Button>
        <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
          {items.map((item, index) => (
            <Card key={index} style={styles.resultCard}>
              <Text style={styles.resultText}>
                {item.メーカー}の{item.商品名}シリコンモールドを使う。
              </Text>
            </Card>
          ))}
        </Animated.View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    padding: 20,
    borderRadius: 25,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  okButton: {
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 5,
  },
  resultCard: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 20,
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
  },
  image: {
    width: 220,
    height: 180,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  noImageBox: {
    width: 180,
    height: 180,
    borderRadius: 15,
    borderBlockColor: "#EEE",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  noImageText: {
    color: "#888",
  },
});
