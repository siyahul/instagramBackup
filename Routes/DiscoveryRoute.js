import { useLazyQuery } from "@apollo/client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import Discovery from "../Components/Discovery";
import { useSearch } from "../Providers/SearchProvider";
import { SEARCH_QUERY } from "../queries";
import Search from "../Screens/Search";

const Stack = createStackNavigator();
const DiscoveryRoute = () => {
  const navigation = useNavigation();
  const [state, setState] = useSearch();
  const userInfo = useSelector((state) => state.userSignIn.userInfo);
  const [searchUsers, { loading }] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: ({ searchUsers }) => {
      const users = searchUsers.filter((user) => user.id !== userInfo.id);
      console.log(userInfo);
      const userFollowed = users.map((user) => {
        const isFollowing = userInfo?.followings?.find(
          (following) => user.id === following
        )
          ? true
          : false;
        return { ...user, isFollowing };
      });
      setState({
        type: "search",
        payload: userFollowed,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    setState({ type: "loading", payload: loading });
  }, [loading]);

  const search = useCallback((text) => {
    if (text !== "") {
      searchUsers({ variables: { keyWord: text } });
    } else {
      setState({
        type: "search",
        payload: [],
      });
    }
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Discovery"
        component={Discovery}
        options={{
          headerTitle: () => (
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Search")}
            >
              <View style={styles.headerTitle}>
                <FontAwesomeIcon icon={faSearch} size={20} />
                <Text style={styles.headerTitleText}>Search</Text>
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          animationEnabled: false,
          headerTitle: () => (
            <TextInput
              autoFocus={true}
              placeholder="Search"
              style={styles.searchInput}
              onChangeText={search}
              selectionColor={"lightgray"}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default DiscoveryRoute;

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: "row",
    paddingLeft: 8,
    alignItems: "center",
  },
  headerTitleText: {
    color: "gray",
    fontSize: 22,
    marginLeft: 10,
  },
  searchInput: {
    fontSize: 20,
  },
});
