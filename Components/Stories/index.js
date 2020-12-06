import React, { memo } from "react";
import { View, FlatList } from "react-native";
import Story from "../Story";
import { styles } from "./styles";
import { useSelector } from "react-redux";
const Stories = () => {
  const {data} = useSelector((state) => state.stories);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => String(index)}
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <Story
              name={item?.user?.name}
              url={item?.user?.photoUrl}
              index={index}
              id={item?.user?.id}
              visited={item?.visited}
            />
          );
        }}
      />
    </View>
  );
};

export default memo(Stories);
