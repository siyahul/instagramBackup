import React, { useEffect, useState, useRef, memo } from "react";
import { View, Animated } from "react-native";

const ProgressBar = ({render,render2}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  
  const progress = Animated.timing(anim, {
    toValue: anim2,
    duration: 5000,
    useNativeDriver: true,
  })
  useEffect(() => {
    progress.start();
    
  }, [render,render2]);

  useEffect(() => {
    anim.setValue(-width);
    anim2.setValue(0);
  }, [width,render,render2]);

  return (
    <View
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
      }}
      style={{
        height: 2,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 2,
        overflow: "hidden",
        flex: 1,
        elevation:5,
        marginHorizontal: 2,
      }}
    >
      <Animated.View
        style={{
          height: 2,
          width:'100%',
          backgroundColor: "rgba(255,255,255,1)",
          borderRadius: 2,
          position: "absolute",
          top: 0,
          left: 0,
          transform: [{ translateX: anim }],
        }}
      />
    </View>
  );
};

export default memo(ProgressBar);
