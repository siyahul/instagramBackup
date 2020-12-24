import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Message from "../Screens/Message";
import HomeStack from "./HomeRoute";
import Ionicons from "react-native-vector-icons/Ionicons";
import Profile from "../Screens/Profile";
import AddPostStack from "./AddPostStack";
import { UploadProvider } from "../Providers/UploadProvider";
import DiscoveryRoute from "./DiscoveryRoute";
import { SearchProvider } from "../Providers/SearchProvider";

const UploadProviderWrapper = () => {
  return (
    <UploadProvider>
      <AddPostStack />
    </UploadProvider>
  );
};

const SearchContextWrapper = () => {
  return (
    <SearchProvider>
      <DiscoveryRoute />
    </SearchProvider>
  );
};

const MemorizedUploadProviderWrapper = React.memo(UploadProviderWrapper);
const MemorizedSearchContextWrapper = React.memo(SearchContextWrapper);

const Tab = createBottomTabNavigator();
const BottomHomeNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "ios-home";
          } else if (route.name === "DiscoveryScreen") {
            iconName = "ios-search";
          } else if (route.name === "Add") {
            iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
          } else if (route.name === "Notification") {
            iconName = focused
              ? "ios-notifications"
              : "ios-notifications-outline";
          } else if (route.name === "Profile") {
            iconName = "ios-person";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "gray",
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      {/* all others screens beyond this line needs to devolop */}
      <Tab.Screen
        name="DiscoveryScreen"
        component={MemorizedSearchContextWrapper}
      />
      <Tab.Screen
        name="Add"
        component={MemorizedUploadProviderWrapper}
        options={{
          tabBarVisible: false,
          tabBarVisibilityAnimationConfig: {
            hide: { animation: "timing", config: { duration: 100 } },
          },
        }}
      />
      <Tab.Screen name="Notification" component={Message} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomHomeNavigator;
