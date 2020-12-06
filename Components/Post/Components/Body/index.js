import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { memo, useEffect, useRef, useState } from "react";
import { View, Image, TouchableWithoutFeedback, Animated } from "react-native";
import { styles } from "./style";

const Body = ({ image, id, handleLike }) => {
  const [lastTap, setLastTap] = useState(null);
  const [doubleTap, seDoubleTap] = useState(false);

  const anim = useRef(new Animated.Value(0.5)).current;

  const bounce = Animated.spring(anim, {
    toValue: 1,
    useNativeDriver: true,
    tension:80,
    friction:5
  });

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      bounce.start();
      if (image.liked) {
        null;
      } else {
        handleLike(id, true);
      }
      setLastTap(null);
      seDoubleTap(true);
      setTimeout(() => {
        seDoubleTap(false);
      }, 800);
    } else {
      setLastTap(now);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.container}>
        {doubleTap ? (
          <Animated.View
            style={[
              styles.heart,
              {
                transform: [
                  { translateX: -30 },
                  { translateY: -30 },
                  { scale: anim },
                ],
              },
            ]}
          >
            <FontAwesomeIcon
              icon={faHeart}
              style={{ color: "white" }}
              size={60}
            />
          </Animated.View>
        ) : null}
        <Image source={{ uri: image.image }} style={styles.image} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(Body);
