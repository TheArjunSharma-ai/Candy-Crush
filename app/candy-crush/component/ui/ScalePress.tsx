import { ViewStyle, Animated, TouchableOpacity } from "react-native";
import { useSound } from "../../SoundContext";

interface ScalePressProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScalePress: React.FC<ScalePressProps> = ({
  onPress,
  children,
  style,
}) => {
  // Implementation of ScalePress component
  const scaleValue = new Animated.Value(1);
  const { playSound } = useSound();

  const onPressIn = () => {
    playSound("ui");
    Animated.spring(scaleValue, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      style={{ ...style }}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleValue }], width: "100%" }}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
export default ScalePress;
