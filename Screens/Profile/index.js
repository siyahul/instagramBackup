import React from 'react'
import { Button, SafeAreaView, Text } from 'react-native'
import { userSignOut } from '../../Redux/Actions/userActions'
import { styles } from './style'
import {useDispatch} from 'react-redux'

const Profile = () => {
    const dispatch = useDispatch()
    const logout = () =>{
        dispatch(userSignOut())
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text>Profile</Text>
            <Button onPress={logout} title="Logout"/>
        </SafeAreaView>
    )
}

export default Profile
