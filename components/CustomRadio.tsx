import React from "react";

import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
type Props = {
  value?: string;
  status: "checked" | "unchecked";
  onPress: (e: GestureResponderEvent) => void;
  size?: number;
  color?: string;
  uncheckedColor?: string;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
};
export default function CustomRadio({
  status,
  onPress,
  size = 18,
  color = "#7b61ff",
  uncheckedColor = "#bdbdbd",
  label,
  labelStyle,
  containerStyle,
}: Props) {
  const innerSize = Math.max(4, Math.floor(size * 0.55));
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, containerStyle]}
      accessibilityRole="radio"
      accessibilityState={{ selected: status === "checked" }}
    >
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: status === "checked" ? color : uncheckedColor,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {status === "checked" && (
          <View
            style={{
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: color,
            }}
          />
        )}
      </View>
      {label ? (
        <Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  outer: {},
  label: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
});
