import React, { useEffect, useRef } from "react";
import { Animated, ImageProps, ImageURISource } from "react-native";

type Props = {
  source: ImageURISource;
  style?: any;
  duration?: number;
  version?: number | string;
  animate?: boolean;
} & ImageProps;

export default function FadeInImage({
  source,
  style,
  duration = 1000,
  version,
  animate = true,
  ...rest
}: Props) {
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const animRef = useRef<any>(null);

  const handleOnLoad = () => {
    if (!animate) return;
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
    if (animate) {
      opacity.setValue(0);
    } else {
      opacity.setValue(1);
    }
  }, [source?.uri, version, animate]);
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
