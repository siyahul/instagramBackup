import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Message from "../Screens/Message";
import HomeStack from "./HomeRoute";
import AddPostStack from "./AddPostStack";
import { UploadProvider } from "../Providers/UploadProvider";
import DiscoveryRoute from "./DiscoveryRoute";
import { SearchProvider } from "../Providers/SearchProvider";
import ProfileRoute from "./ProfileRoute";
import ProfilePicture from "../Components/ProfilePicture";
import { useSelector } from "react-redux";
import {
  faHeart as faHeartOut,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart,
  faHome as faHomeSolid,
  faPlusSquare as faPlusSquareSolid,
  faSearch as faSearchSolid,
} from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import { ProfileProvider } from "../Providers/ProfileProvider";

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

const ProfileContextWrapper = () => {
  return (
    <ProfileProvider>
      <ProfileRoute />
    </ProfileProvider>
  );
};

const MemorizedUploadProviderWrapper = React.memo(UploadProviderWrapper);
const MemorizedSearchContextWrapper = React.memo(SearchContextWrapper);
const MemorizedProfileCOntextWrapper = React.memo(ProfileContextWrapper);

const Tab = createBottomTabNavigator();
const BottomHomeNavigator = () => {
  const { userInfo } = useSelector((state) => state.userSignIn);
  const profileUri = userInfo?.photoUrl? userInfo?.photoUrl : ""
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          if (route.name === "Profile") {
            return (
              <ProfilePicture
                uri={profileUri}
                size="small"
                visited={!focused}
              />
            );
          } else if (route.name === "Home") {
            return <Ionicons name={"ios-home"} size={size + 2} color={color} />;
          } else if (route.name === "Notification") {
            return (
              <FontAwesomeIcon
                icon={!focused ? faHeartOut : faHeart}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Add") {
            return (
              <FontAwesomeIcon
                icon={focused ? faPlusSquareSolid : faPlusSquare}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "DiscoveryScreen") {
            return (
              <FontAwesomeIcon icon={faSearchSolid} size={size} color={color} />
            );
          }
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
      <Tab.Screen name="Profile" component={MemorizedProfileCOntextWrapper} />
    </Tab.Navigator>
  );
};

export default BottomHomeNavigator;
