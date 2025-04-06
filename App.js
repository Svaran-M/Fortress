
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"

import { UserProvider } from "./context/UserContext"
import { AuthProvider } from "./context/AuthContext"


import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import DashboardScreen from "./screens/DashboardScreen"
import AccountsScreen from "./screens/AccountsScreen"
import BlockchainSecurityScreen from "./screens/BlockchainSecurityScreen"
import RoamAlertScreen from "./screens/RoamAlertScreen"
import ChatbotScreen from "./screens/ChatbotScreen"
import AboutUsScreen from "./screens/AboutUsScreen"
import KeywordSearchScreen from "./screens/KeywordSearchScreen"
import TempEmailScreen from "./screens/TempEmailScreen"
import NetworkScannerScreen from "./screens/NetworkScannerScreen"

const Stack = createNativeStackNavigator()

const ScreenNames = {
  Home: "Home",
  Login: "Login",
  Register: "Register",
  Dashboard: "Dashboard",
  Accounts: "Accounts",
  BlockchainSecurity: "BlockchainSecurity",
  SmartHomeSecurity: "SmartHomeSecurity",
  NetworkScanner: "NetworkScanner",
  RoamAlert: "RoamAlert",
  Chatbot: "Chatbot",
  AboutUs: "AboutUs",
  KeywordSearch: "KeywordSearch",
  TempEmail: "TempEmail",
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName={ScreenNames.Home}
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name={ScreenNames.Home} component={HomeScreen} />
            <Stack.Screen name={ScreenNames.Login} component={LoginScreen} />
            <Stack.Screen name={ScreenNames.Register} component={RegisterScreen} />
            <Stack.Screen
              name={ScreenNames.Dashboard}
              component={DashboardScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name={ScreenNames.Accounts} component={AccountsScreen} />
            <Stack.Screen name={ScreenNames.BlockchainSecurity} component={BlockchainSecurityScreen} />

            <Stack.Screen name={ScreenNames.NetworkScanner} component={NetworkScannerScreen} />

            <Stack.Screen name={ScreenNames.RoamAlert} component={RoamAlertScreen} />
            <Stack.Screen name={ScreenNames.Chatbot} component={ChatbotScreen} />
            <Stack.Screen name={ScreenNames.AboutUs} component={AboutUsScreen} />
            <Stack.Screen name={ScreenNames.KeywordSearch} component={KeywordSearchScreen} />
            <Stack.Screen name={ScreenNames.TempEmail} component={TempEmailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  )
}

