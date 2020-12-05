import React, { useEffect, useState,memo } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions,//To find device dimensions
} from "react-native";

import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";


import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePicture from "../ProfilePicture";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "react-native-gesture-handler";

import { useDispatch, useSelector } from "react-redux";
import { storyVisited } from "../../Redux/Actions/storyActions";
import ProgressBar from "../ProgressBar";

const UserStory = ({ navigation }) => {
  //redux thinks
  const { data } = useSelector((state) => state.stories);
  const dispatch = useDispatch();

  //to take params from route of react navigation
  const route = useRoute();

  //states
    //interval Time for storing time of component mounts and activeTime is for seting time after delay to compare
    const [intervalTime, setIntervalTime] = useState(Date.now());
    const [activeTime, setActiveTime] = useState(Date.now());

    //user stories means which story active now
    const [userStories, setUserStories] = useState();

    //index of active story in array of stories
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);
    
  // current story variable declared to find current story from array of stories from redux state and store it
  const currentStory = data.find(
    (storyData) => storyData.user.id === route.params.userId
  );

  //useEffecsts
    //when params of the route changes run set current story to a state
    //and also changes the redux state to this story has viwed by the user
    useEffect(() => {
      setUserStories(currentStory);
      const currentUserIndex = data.indexOf(currentStory);
      const newStory = [...data];
      newStory[currentUserIndex].visited = true;
      dispatch(storyVisited(newStory));
    }, [route.params]);

    //if params of route or index of active story changes starts a timer to compare times
    //and also clean the timer when component unmounts like componentWilUnmount

    useEffect(() => {
        setActiveTime(Date.now());
        const timeOut = setTimeout(() => {
          setIntervalTime(Date.now());
        }, 5000);
      return ()=>{
        clearTimeout(timeOut);
      };
    }, [activeStoryIndex, route.params]);

    //when intervalTime is updated and if compared values are ok then calls the function next story
    useEffect(() => {
      if (intervalTime > activeTime + 5000) {
        nextStory();
      }
    }, [intervalTime]);

    //when activeStoryIndex updated if there is no user stories the do nothing and exit
    //if when activeStoryIndex is less than 0 set it to 0 the exits
    //if when activeStoryIndex is greater than or equal to the length of stories of a user set the index of last story
    useEffect(() => {
        if (!userStories) {
          return;
        }
        if (activeStoryIndex < 0) {
          setActiveStoryIndex(0);
          return;
        }
        if (activeStoryIndex >= userStories?.stories?.length) {
          setActiveStoryIndex(userStories.stories.length - 1);
          return;
        }
    }, [activeStoryIndex]);
  
  //this function executes change the current story to the nextone if there is else goBack from story component
  function nextStory() {

    //if active story index is greater than or equal to the length of stories of user
    //then change story to the stories of next user else change to next story of same user
    if (activeStoryIndex >= userStories.stories.length - 1) {
      const indexOfNextUser =
        data.indexOf(userStories) + 1 >= data.length
          ? data.length - 1
          : data.indexOf(userStories) + 1;

      const nextUserId = data[indexOfNextUser].user.id;

      if (nextUserId !== userStories.user.id) {
        async function next() {
          await navigation.setParams({ userId: nextUserId });
          setActiveStoryIndex(1);
          setActiveStoryIndex(0);
        }
        return next();
      } else {
        return navigation.goBack();
      }
    } else setActiveStoryIndex(activeStoryIndex + 1);
  }

  //this function executes current story to previous story of the user if there is no story of current user
  //then go back to the stories of previus user
  function prevStory(){
    if (activeStoryIndex <= 0) {

      //finds index of previous user
      const indexOfPrevUser =
        data.indexOf(userStories) - 1 < 0 ? 0 : data.indexOf(userStories) - 1;

      //finds the id of previous user with index and from story data from redux state
      const prevUserId = data[indexOfPrevUser].user.id;

      //this async function changes the params to previous user's id and set index to the last story of the user
      async function prev() {
        await navigation.setParams({ userId: prevUserId });
        const prevStoryData = await data.find(
          (storyData) => storyData.user.id === prevUserId
        );
        await setActiveStoryIndex(0);
        await setActiveStoryIndex(prevStoryData.stories.length - 1);
      }
      //calls prev function to go back to previous user's story
      return prev();
    } else {
      //just reduce index of active story by 1
      return setActiveStoryIndex(activeStoryIndex - 1)
    }
  }

  const handlePress = (event) => {
    const xAxis = event.nativeEvent.pageX;
    //const yAxis = event.nativeEvent.pageY;
    if (xAxis > Dimensions.get("window").width / 2) {
      nextStory();
    } else {
      prevStory();
    }
  };

  //if there is no story return the compnent with a blank view i will change to loading screen
  if (!userStories) {
    return <SafeAreaView style={styles.container} />;
  }

  //active story set to a variable because want to reassign whe component rerenders
  //if it is in a state the story won't renders smoothly
  const activeStory = userStories.stories[activeStoryIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: activeStory?.imageUri }}
            imageStyle={{ borderRadius: 10 }}
            style={styles.image}
          >
            <View style={styles.timer}>
              {userStories.stories.map((story, index) => {
                return (
                  <React.Fragment key={index}>
                    {index === activeStoryIndex ? (
                      <ProgressBar
                        render={activeStoryIndex}
                        render2={route.params.userId}
                      />
                    ) : index < activeStoryIndex ? (
                      <View style={styles.timerItems} />
                    ) : (
                      <View style={styles.timerNextItems} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
            <View style={styles.head}>
              <View style={styles.userInfo}>
                <ProfilePicture
                  uri={userStories?.user?.photoUrl}
                  size={"medium"}
                  visited={true}
                />
                <Text style={styles.name}>{userStories?.user?.name}</Text>
                <Text style={styles.timeInfo}>{activeStory?.postedAt}</Text>
              </View>
              <View style={styles.userInfo}>
                <FontAwesomeIcon icon={faEllipsisV} size={16} color={"white"} />
              </View>
            </View>
          </ImageBackground>
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Send Message"
              placeholderTextColor="white"
            />
            <Ionicons name="ios-paper-plane" size={30} color="white" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default memo(UserStory);
