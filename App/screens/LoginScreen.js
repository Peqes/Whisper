import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, TextInput, TouchableHighlight, ScrollView, Dimensions, Alert} from 'react-native';
import colors from '../config/colors';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';



export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');
    useEffect(() => {
        const checkUser = auth.onAuthStateChanged(user =>{
            if(user){
                navigation.navigate("MainScreen")
            }
        })
        return checkUser
    },[])
    const SignUp = () =>{
        auth.createUserWithEmailAndPassword(email, password).catch(error => {
            switch(error.code){
                case 'auth/email-already-in-use':
                    Alert.alert('Wystąpił błąd','Konto z podanym adresem email już istnieje')
                    break;
                case 'auth/invalid-email':
                    Alert.alert('Wystąpił błąd','Nieprawidłowy format adresu email')
                    break;
                case 'auth/weak-password':
                    Alert.alert('Wystąpił błąd','Nieprawidłowy format hasła. Musi mieć przynajmniej 6 znaków.')
                    break;   
                default:
                    Alert.alert(error.message)
            }
        });
    }

    const SignIn = () =>{
        auth.signInWithEmailAndPassword(email, password).then(userCredentials=>{
            const user = userCredentials.user;

        }).catch(error => {
            console.log(error.message)
            switch(error.code){
                case 'auth/user-not-found':
                    Alert.alert('Wystąpił błąd','Podane dane są nieprawidłowe')
                    break;
                case 'auth/invalid-email':
                    Alert.alert('Wystąpił błąd','Nieprawidłowy format adresu email')
                    break;
                case 'auth/wrong-password':
                    Alert.alert('Wystąpił błąd','Podane dane są nieprawidłowe.')
                    break;
                case 'auth/too-many-requests':
                    Alert.alert('Wystąpił błąd','Za dużo prób, spróbuj ponownie później.')
                    break;  
                    
                default:
                    Alert.alert(error.message)
            }
        });
    }
    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={{
                height:Dimensions.get('window').height
             }}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    LOGOWANIE
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='Email'
                        value={email}
                        onChangeText={text=>SetEmail(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Hasło'
                        value={password}
                        onChangeText={text=>SetPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.buttonLogin} onPress={SignIn}>
                        <Text style={styles.buttonLoginText}>Zaloguj</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.buttonRegister} onPress={SignUp}>
                        <Text style={styles.buttonRegisterText}>Zarejestruj</Text>
                    </TouchableHighlight>
                </View>
            </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.lightblue,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    },
    headerContainer:{
        marginTop:10,
        alignItems:'center',
        flex:1,
        backgroundColor:colors.navyblue,
        borderBottomColor:colors.navyblue,
        borderBottomWidth:3,
        borderTopColor:colors.navyblue,
        borderTopWidth:3,
        justifyContent:'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 4},
        shadowRadius:50,
        elevation:10
    },
    headerText:{
        color:colors.whitetext,
        fontSize:42,
        textShadowColor:'black',
        textShadowOffset:{width: 0, height: 0},
        textShadowRadius:4
    
    },
    content:{
        flex:9,
        justifyContent:'center',
        alignItems:'center',
    },
    inputContainer:{
        width:'80%'
    },
    input:{
        backgroundColor:colors.white,
        padding:15,
        marginTop:20,
        borderRadius:30,
        textAlign:'center',
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 4,
    },
    buttonContainer:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:50
    },
    buttonLogin:{
        paddingVertical:15,
        paddingHorizontal:10,
        borderRadius:10,
        width:'100%',
        alignItems:'center',
        backgroundColor:colors.violet,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 5,
       
    },
    buttonLoginText:{
        color:colors.whitetext,
        fontWeight:'bold',
        fontSize:20
    },
    buttonRegister:{
        marginTop:50,
        padding:10,
        borderRadius:10,
        width:'80%',
        alignItems:'center',
        backgroundColor:colors.white,
        borderWidth:2,
        borderColor:colors.violet,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 4,
    },
    buttonRegisterText:{
        color:colors.violet,
        fontWeight:'bold'
        
    },
})
