import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex:1,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent:"flex-start",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
    backgroundColor: "#000",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  name: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: "white",
    marginHorizontal: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15,
  },
  timeInfo: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "lightgray",
    marginHorizontal: 10,
  },
  messageContainer:{
    flexDirection: "row",
    margin:10,
    alignItems: "center",
  },
  textInput:{
    borderRadius:30,
    borderWidth:1,
    borderColor: "white",
    padding:6,
    fontSize:16,
    color:'white',
    width:"100%",
    flex:1,
    marginRight:10,
  },
  timer:{
    width:"100%",
    height:2,
    color:'white',
    flexDirection: "row",
    paddingTop:10,
    paddingHorizontal:10,
  },
  timerItems:{
    height: 2,
      backgroundColor: "rgba(255,255,255,1)",
      borderRadius: 2,
      overflow: "hidden",
      flex: 1,
      marginHorizontal: 2,
      elevation:5,
  },
  timerNextItems:{
      height: 2,
      backgroundColor: "rgba(255,255,255,0.7)",
      borderRadius: 2,
      overflow: "hidden",
      flex: 1,
      marginHorizontal: 2,
      elevation:5,
  }
});

export default styles;
