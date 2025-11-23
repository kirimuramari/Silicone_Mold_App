import React, { useEffect, useRef } from "react";
import { Animated, ImageProps, ImageURISource } from "react-native";

type Props = {
  source: ImageURISource;
  style?: any;
  duration?: number;
  version?: number | string;
} & ImageProps;

export default function FadeInImage({
  source,
  style,
  duration = 1500,
  version,
  ...rest
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const animRef = useRef<any>(null);

  const handleOnLoad = () => {
    if (animRef.current && animRef.current.stop) {
      animRef.current.stop();
    }
    opacity.setValue(0);
    animRef.current = Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });
    animRef.current.start();
  };

  useEffect(() => {
    opacity.setValue(0);
  }, [source?.uri, version]);
  return (
    <Animated.Image
      {...rest}
      source={source}
      style={[style, { opacity }]}
      onLoad={handleOnLoad}
      onLoadEnd={handleOnLoad}
    />
  );
}
