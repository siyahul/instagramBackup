import {Animated, Easing } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import React,{ useEffect, useState } from "react";

const Loading = ({color}) => {
    const anim = useState(new Animated.Value(0))[0];
    const spin = useState(anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    }))[0];
  
    useEffect(() => {
      Animated.loop(
        Animated.timing(
          anim,
          {
           toValue: 1,
           duration: 1000,
           easing:Easing.linear,
           useNativeDriver: true
          }
        )
       ).start();
    },[])
  
    return (
      <Animated.View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          transform: [{ rotate: spin }],
        }}
      >
        <FontAwesomeIcon color={color} icon={faSpinner} size={22} />
      </Animated.View>
    );
  };
  export default Loading;