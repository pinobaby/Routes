import { Dimensions, Pressable, StyleSheet, View, Text, TouchableHighlight } from 'react-native'
import React, { useRef } from 'react'
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import MapStyle from '../../theme/MapStyle.json';

const HomePageScreen = () => {

    const API_KEY = 'YOUR_API_KEY';
    const { width, height } = Dimensions.get('window');
    const mapView = useRef(null);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [hasDestination, setHasDestination] = useState(false);
    const searchRef = React.createRef()

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            if (!hasDestination) { // Si no se ha ingresado un destino, establece la ubicación del usuario como origen
                setOrigin({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        })();
    }, [hasDestination]);


    return (
        <>
            <View style={styles.container}>

                <MapView
                    style={{ flex: 1, width: '100%' }}
                    ref={mapView}
                    customMapStyle={MapStyle}
                    initialRegion={{
                        latitude: origin ? origin.latitude : mapView.current ? mapView.current.latitude : 0,
                        longitude: origin ? origin.longitude : mapView.current ? mapView.current.longitude : 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    region={{
                        latitude: origin ? origin.latitude : 0,
                        longitude: origin ? origin.longitude : 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {origin && (
                        <Marker
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 50,
                                borderColor: 'black',
                                borderWidth: 2,
                                backgroundColor: 'white'
                            }}
                            coordinate={origin}
                            title="Tu Ubicación"
                            pinColor="red"
                            image={require('../../../assets/custom-marker.png')}
                            onPress={() => {
                                (mapView.current as unknown as MapView).animateToRegion({
                                    latitude: origin.latitude,
                                    longitude: origin.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                })
                            }}
                        />
                    )}



                    {destination && (
                        <Marker
                            coordinate={destination}
                            pinColor="blue"
                            title="Ubicación Seleccionada"
                            image={require('../../../assets/custom-marker.png')}
                            onPress={() => {
                                (mapView.current as unknown as MapView).animateToRegion({
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                })
                            }}
                        />
                    )}


                    {destination && (
                        <MapViewDirections
                            apikey={API_KEY}
                            origin={origin}
                            destination={destination}
                            strokeWidth={3}
                            strokeColor="black"
                            optimizeWaypoints
                            onReady={result => {
                                if (mapView.current) {
                                    (mapView.current as MapView).fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: width / 20,
                                            bottom: height / 20,
                                            left: width / 20,
                                            top: height / 20,
                                        },
                                    });
                                }
                            }}
                        />
                    )}
                </MapView>

                <View style={styles.searchContainer}>

                    <GooglePlacesAutocomplete
                        placeholder=" Ingrese su Destino"
                        minLength={3}
                        currentLocation={true}
                        currentLocationLabel='Current location'
                        debounce={500}
                        textInputProps={{
                            clearButtonMode: 'always',
                            autoCorrect: true,
                            autoCapitalize: 'none',
                            returnKeyType: 'search',
                            placeholderTextColor: 'black',
                        }}
                        ref={searchRef}
                        onPress={(data, details = null) => {
                            (searchRef.current as GooglePlacesAutocompleteRef).setAddressText('');
                            if (details) {
                                setDestination({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                })
                            }
                        }}
                        query={{
                            key: API_KEY,
                            language: 'en',
                        }}
                        listViewDisplayed="auto"
                        fetchDetails
                        styles={{
                            textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                            },
                            textInput: {
                                marginLeft: 0,
                                marginRight: 0,
                                height: 38,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },

                        }}
                    />
                    <Pressable
                        style={styles.mapButton}

                        onPress={() => {
                            setDestination(null);
                            (mapView.current as unknown as MapView).animateToRegion({
                                latitude: origin.latitude,
                                longitude: origin.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            })        
                        }}
                    >
                    </Pressable>
                </View>
            </View>
        </>
    )
}


export default HomePageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheeContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    searchContainer: {
        marginTop: 30,
        position: 'absolute',
        top: 10,
        width: '100%',
        padding: 10,
    },
    map: {
        flex: 1,
        zIndex: 0,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    mapButton: {
        position: 'absolute',
        bottom: -700,
        right: 10,
        backgroundColor: 'black',
        borderColor: 'white',
        borderWidth: 1,
        padding: 20,
        borderRadius: 20,
    },
    mapIcon: {
        width: 20,
        height: 20,
    },
});


