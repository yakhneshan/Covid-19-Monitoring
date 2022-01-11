import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { firebase } from './src/firebase/config'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen, Settings, Profile, DataHistory } from './src/screens'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (
      <></>
    )
  }

  function HomeTabs(){
    return(
      <Tab.Navigator initialRouteName = "Home">
        <>
          <Tab.Screen name="Home"
          options={{
                    tabBarIcon: ({focused}) => (
                        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('./assets/home.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? '#FFFFFF' : '#FFFFFF',
                                }}
                            />
                        </View>   
                    ),
                }}
          >
            {props => <HomeScreen {...props} extraData={user} />}
          </Tab.Screen>
          <Tab.Screen name="Data History"
          options={{
                    tabBarIcon: ({focused}) => (
                        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('./assets/history.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? '#FFFFFF' : '#FFFFFF',
                                }}
                            />
                        </View>   
                    ),
                }} 
          >
            {props => <DataHistory {...props} extraData={user} />}
          </Tab.Screen>
          <Tab.Screen name="Profile"
          options={{
                    tabBarIcon: ({focused}) => (
                        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('./assets/profile.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? '#FFFFFF' : '#FFFFFF',
                                }}
                            />
                        </View>   
                    ),
                }}
          >
            {props => <Profile {...props} extraData={user} />}
          </Tab.Screen>
          <Tab.Screen name="Settings"
          options={{
                    tabBarIcon: ({focused}) => (
                        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('./assets/settings.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? '#FFFFFF' : '#FFFFFF',
                                }}
                            />
                        </View>   
                    ),
                }}
          >
            {props => <Settings {...props} extraData={user} />}
          </Tab.Screen>
          </>
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        { user ? (
          <>
          <Stack.Screen name="COVID-19 Monitoring" options={{headerLeft: () => null}}>
            {
              props => <HomeTabs {...props} extraData={user} />
            }
          </Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerLeft: () => null}}/>
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
