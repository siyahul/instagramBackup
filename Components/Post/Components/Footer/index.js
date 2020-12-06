import {
  faComment,
  faHeart as faHeartfls,
  faPaperPlane,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { memo, useEffect, useRef, useState } from "react";
import { View, Text, TouchableWithoutFeedback, Animated } from "react-native";
import { styles } from "./style";

const Footer = ({ post, handleLike, id }) => {
  const [postedOn, setPostedOn] = useState("1 min ago");
  const likes = String(post?.likes.length);

  const handleLikes = () => {
    handleLike(id, post.liked ? false : true);
  };

  useEffect(() => {
    const postedBefore = postedSince();
    setPostedOn(postedBefore);
  }, [post]);

  function postedSince() {
    const created_date = new Date(post?.createdAt);
    const time = Math.round((new Date() - created_date) / 1000 / 60);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date =
      monthNames[created_date.getMonth()] +
      " " +
      created_date.getDate() +
      " " +
      created_date.getFullYear();

    if ((time > 1 && time < 60) || time < 1) {
      return time + " min ago";
    } else if (time > 60 && time < 60 * 2) {
      return Math.floor(time / 60) + " hour ago";
    } else if (time > 60 * 2 && time / 60 < 24) {
      return Math.floor(time / 60) + " hours ago";
    } else if (time / 60 > 24 && (time / 60) * 24 < 2) {
      return "Posted Yesterday";
    } else if (time < 1) {
      return "1 min ago";
    } else {
      return date;
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        <View style={styles.socialIcons}>
          <View>
            <TouchableWithoutFeedback onPress={handleLikes}>
              {post?.liked ? (
                <View
                  style={[styles.socialIcon]}
                >
                  <FontAwesomeIcon icon={faHeart} color={"red"} size={24} />
                </View>
              ) : (
                <View style={[styles.socialIcon]}>
                  <FontAwesomeIcon
                    icon={faHeartfls}
                    color={"black"}
                    size={24}
                  />
                </View>
              )}
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.socialIcon}>
            <FontAwesomeIcon icon={faComment} size={24} />
          </View>
          <View style={styles.socialIcon}>
            <FontAwesomeIcon icon={faPaperPlane} size={24} />
          </View>
        </View>
        <View style={styles.saveIcon}>
          <FontAwesomeIcon icon={faBookmark} size={24} color={"gray"} />
        </View>
      </View>

      <Text style={styles.likes}>{likes} Likes</Text>
      <View style={styles.caption}>
        <Text style={styles.captionUser}>{post?.user.userName + " "}</Text>
        <Text>{post?.caption}</Text>
      </View>
      <Text style={styles.time}>{postedOn}</Text>
    </View>
  );
};

export default memo(Footer);
