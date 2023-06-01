import React,  {  useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View,Dimensions, Image, Alert, TouchableOpacity, StatusBar,Button } from 'react-native';
import {Camera} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';

export default function TakePictureScreen(){
    const navigation = useNavigation();
    let cameraRef = useRef();
    const [hasCameraPerm, SetHasCameraPerm] = useState();
    const [hasMediaLibraryPerm, SetHasMediaLibraryPerm] = useState();
    const [photo, SetPhoto] = useState();

    useEffect(()=>{
        (async () =>{
            const cameraPerm = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPerm = await MediaLibrary.requestPermissionsAsync();
            SetHasCameraPerm(cameraPerm.status == "granted")
            SetHasMediaLibraryPerm(mediaLibraryPerm.status == "granted")
        })();
    },[])

    const TextPerm = ()=>{
        if(hasCameraPerm === undefined){
            return <Text>Prośba o dostęp do kamery</Text>
        }
        else if(!hasCameraPerm){
            return <Text>Dostęp do kamery nie został przyznany. Nadaj uprawnienia w ustawieniach telefonu, aby aplikacja miała dostęp do kamery.</Text>
        }
    }
   

    let takePicture = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif:false
        };
        
        let newPhoto = await cameraRef.current.takePictureAsync(options);
        SetPhoto(newPhoto);
    };

    if(photo){
        let savePhoto = () =>{
            MediaLibrary.saveToLibraryAsync(photo.uri).then(()=>{
                console.log(photo.uri);
                SetPhoto(undefined);
                let photoUri = photo.uri;
                navigation.navigate("LoadImageScreen", {photoUri});
            })
        };

        return(
            <View style={styles.wrapper}>
                <TextPerm/>
                <Image style={styles.img} source={{uri: "data:image/jpg;base64," + photo.base64}}/>
                {hasMediaLibraryPerm ? 
                <TouchableOpacity style={[styles.buttonBottom]} onPress={savePhoto}>
                    <Text style={styles.buttonBottomText}>Zapisz</Text>
                </TouchableOpacity> : undefined}
                <TouchableOpacity style={styles.buttonBottom} onPress={()=>SetPhoto(undefined)}>
                    <Text style={styles.buttonBottomText}>Odrzuć</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return(
        <Camera style={styles.cameraWrapper} ref={cameraRef}> 
            <TouchableOpacity style={styles.buttonTakePicture} onPress={takePicture}>
                <Image style={styles.cameraIcon} source={require('../assets/icons/Icon_Camera.png')}/>
            </TouchableOpacity>
        </Camera>
       

    );

}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        paddingTop: StatusBar.currentHeight,
        flexDirection:'column'
    },
    cameraWrapper:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonTakePicture:{
        backgroundColor:colors.white,
        alignSelf:'flex-end',
        marginRight:10,
        padding:10,
        borderRadius:30,
        borderWidth:2,
        borderColor:colors.violet
    },
    img:{
        alignSelf:'stretch',
        flex:1
    },
    cameraIcon:{
        width:50,
        height:50
    },
    buttonBottom:{
        paddingVertical:10,
        backgroundColor:colors.violet,
        width:'100%',
        borderBottomColor:colors.white,
        borderBottomWidth:2,
        borderTopColor:colors.white,
        borderTopWidth:2
        
    },
    buttonBottomText:{
        fontSize:18,
        textAlign:'center',
        color:colors.whitetext
    }
    
});