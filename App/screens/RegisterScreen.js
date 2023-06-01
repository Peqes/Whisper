
import {Button, Dimensions, StyleSheet, Text, View, Image, SafeAreaView, Platform, StatusBar, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import React from 'react'

import colors from '../config/colors';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.wrapper}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
                REJESTRACJA
            </Text>
        </View>
        <View style={styles.formContainer}>

        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.lightblue,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
    },
    headerContainer:{
        alignItems:'center',
        flex:1,
        maxHeight:'10%',
        marginTop:'10%'
    },
    headerText:{
        color:colors.violet,
        fontSize:50,
    
    },
    formContainer:{
        flex:2,
    }
})
