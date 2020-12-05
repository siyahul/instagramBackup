import React, { memo } from "react";
import { View } from "react-native";
import Header from "./Components/Header";
import Body from "./Components/Body";
import Footer from "./Components/Footer";
import { styles } from "./style";

const Post = ({post,handleLike,index}) => {
  
  return (
    <View style={styles.container}>
      <Header uri={post?.user?.photoUrl} name={post?.user?.userName}/>
      <Body image={post} id={index} handleLike={handleLike}/>
      <Footer post={post} id={index} handleLike={handleLike}/>
    </View>
  );
};

export default memo(Post);
