import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {},
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 10,
  },
  profileInfos: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
  infoTextFoot: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
  },
  ProfileBio: {
    paddingLeft: 20,
  },
  btnContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 5,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 14,
  },
});

export default styles;
