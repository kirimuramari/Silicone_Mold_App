import CustomRadio from "@/components/CustomRadio";
import FadeInImage from "@/components/FadeInImage";
import { supabase } from "@/lib/supabaseClient";
import React, { useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, List, RadioButton, Text } from "react-native-paper";

type Item = {
  番号: number;
  メーカー: string;
  商品名: string;
  画像URL: string;
  種類: string;
};

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [isDecided, setDecided] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [expanded, setExpanded] = useState(false);

  const radioLabel = { fontSize: 8, paddingVertical: 0 };

  const [moldTypeFilter, setMoldTypeFilter] = useState({
    shaker: "none",
    dual: "none",
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const prevUrl = useRef<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const updateImage = (url: string) => {
    prevUrl.current = imageUrl;
    setImageUrl(url);
  };

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

    //全件取得
    const { data, error } = await supabase.from("Silicone mold").select("*");

    if (error) {
      setErrorMessage(error.message);
      return;
    }
    if (!data || data.length === 0) {
      setErrorMessage("データがありません");
      return;
    }
    // 種類キーと実際の文字列の対応表
    const TYPE_MAP: Record<string, string> = {
      shaker: "シェイカー",
      dual: "2液性レジン",
    };

    //フィルター関数（fetchRandomMold の中で定義）
    const filterByType = (item: Item, typeMode: any) => {
      const itemType = item.種類 || "EMPTY";

      const onlySelected = Object.entries(typeMode)
        .filter(([_, mode]) => mode === "only")
        .map(([key]) => TYPE_MAP[key]);

      const excludeSelected = Object.entries(typeMode)
        .filter(([_, mode]) => mode === "exclude")
        .map(([key]) => TYPE_MAP[key]);

      if (onlySelected.length === 1) {
        return itemType === onlySelected[0];
      }
      if (onlySelected.length >= 2) {
        return onlySelected.includes(itemType);
      }
      for (const ex of excludeSelected) {
        if (itemType === ex) {
          return false;
        }
      }
      return true;
    };
    //フィルター実行
    const filtered = data.filter((item: Item) =>
      filterByType(item, moldTypeFilter)
    );

    if (filtered.length === 0) {
      setErrorMessage("条件に合うデータがありません。");
      return;
    }
    //ランダム1件
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selected = filtered[randomIndex];

    //結果反映
    setItems([selected]);
    setImageVersion((v) => v + 1);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>シリコンモールドセレクター</Text>
          {items.length > 0 && items[0].画像URL ? (
            <FadeInImage
              source={{ uri: items[0].画像URL }}
              style={styles.image}
              animate={prevUrl.current !== imageUrl}
            />
          ) : (
            <View style={styles.noImageBox}>
              {errorMessage !== "" && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
              <Text style={styles.noImageText}>画像が表示されます。</Text>
            </View>
          )}
          <List.Section>
            <List.Accordion
              title="検索オプション"
              titleStyle={{ color: "#555", fontSize: 12 }}
              style={styles.searchOptionButton}
              expanded={expanded}
              onPress={() => setExpanded(!expanded)}
            >
              <View style={styles.optionRowContainer}>
                <View style={styles.optionColumn}>
                  <List.Subheader style={styles.ListSubheaderText}>
                    シェイカーモールド
                  </List.Subheader>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setMoldTypeFilter((prev) => ({
                        ...prev,
                        shaker: value,
                      }))
                    }
                    value={moldTypeFilter.shaker}
                  >
                    <CustomRadio
                      status={
                        moldTypeFilter.shaker === "only"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() =>
                        setMoldTypeFilter((prev) => ({
                          ...prev,
                          shaker: "only",
                        }))
                      }
                      color="#7b61ff"
                      uncheckedColor="#aaa"
                      size={10}
                      label="シェイカーモールドのみ"
                      labelStyle={radioLabel}
                    />
                    <CustomRadio
                      status={
                        moldTypeFilter.shaker === "exclude"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() =>
                        setMoldTypeFilter((prev) => ({
                          ...prev,
                          shaker: "exclude",
                        }))
                      }
                      color="#7b61ff"
                      uncheckedColor="#aaa"
                      size={10}
                      label="除外"
                      labelStyle={radioLabel}
                    />
                    <CustomRadio
                      status={
                        moldTypeFilter.shaker === "none"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() =>
                        setMoldTypeFilter((prev) => ({
                          ...prev,
                          shaker: "none",
                        }))
                      }
                      color="#7b61ff"
                      uncheckedColor="#aaa"
                      size={10}
                      label="指定なし"
                      labelStyle={radioLabel}
                    />
                  </RadioButton.Group>
                </View>

                <View style={styles.optionColumn}>
                  <List.Subheader style={styles.ListSubheaderText}>
                    2液性レジンモールド
                  </List.Subheader>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setMoldTypeFilter((prev) => ({
                        ...prev,
                        dual: value,
                      }))
                    }
                    value={moldTypeFilter.dual}
                  >
                    <CustomRadio
                      status={
                        moldTypeFilter.dual === "only" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setMoldTypeFilter((prev) => ({ ...prev, dual: "only" }))
                      }
                      color="#7b61ff"
                      uncheckedColor="#aaa"
                      size={10}
                      label="2液性レジンモールドのみ"
                      labelStyle={radioLabel}
                    />
                    <CustomRadio
                      status={
                        moldTypeFilter.dual === "exclude"
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() =>
                        setMoldTypeFilter((prev) => ({
                          ...prev,
                          dual: "exclude",
                        }))
                      }
                      color="#7b61ff"
                      uncheckedColor="#aaa"
                      size={10}
                      label="除外"
                      labelStyle={radioLabel}
                    />
                    <CustomRadio
                      status={
                        moldTypeFilter.dual === "none" ? "checked" : "unchecked"
                      }
                      onPress={() =>
                        setMoldTypeFilter((prev) => ({ ...prev, dual: "none" }))
                      }
                      color="#7b61ff"
                      uncheckedColor="#aaa"
                      size={10}
                      label="指定なし"
                      labelStyle={radioLabel}
                    />
                  </RadioButton.Group>
                </View>
              </View>
            </List.Accordion>
          </List.Section>

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
    </ScrollView>
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
  errorText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginTop: 5,
  },
  noImageText: {
    color: "#888",
  },

  searchOptionButton: {
    backgroundColor: "#fff",
    marginTop: 5,
    padding: 0,
    paddingVertical: 0,
  },

  ListSubheaderText: {
    fontSize: 12,
    color: "#555",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  radioLabel: {
    fontSize: 10,
    color: "#555",
  },
  optionRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    gap: 20,
  },
  optionColumn: {
    flex: 1,
  },
});
