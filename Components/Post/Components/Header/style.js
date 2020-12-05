import { StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems: "center",
        justifyContent:"space-around",
        padding:10,
    },
    name:{
        flex:1, 
        padding:10,
        fontWeight:"900",
        color:"#3c3c3c",
        fontFamily:"Roboto-Bold",
    }
})