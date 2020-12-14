import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      marginHorizontal: 16,
    },
    logo: {
      width: "100%",
      height: 50,
      resizeMode: "contain",
      marginBottom: 10,
    },
    input: {
      width: "100%",
      padding: 10,
      backgroundColor: "#ddd",
      borderRadius: 5,
      marginBottom:10,
    },
    signUpPrompt:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      margin:10,
    },
    link:{
      color:"dodgerblue",
      textDecorationLine:'underline',
    },error:{
      width:'100%',
      alignItems: "center",
      justifyContent: "center"
    },errorText:{
      color:"red",
      fontSize:14,
    }
  });