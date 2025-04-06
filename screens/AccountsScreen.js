"use client"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../context/AuthContext"

export default function AccountsScreen({ navigation }) {
  const {
    googleUser,
    facebookUser,
    isLoadingGoogle,
    isLoadingFacebook,
    connectGoogle,
    connectFacebook,
    disconnectGoogle,
    disconnectFacebook,
  } = useAuth()

  
  const handleGoogleToggle = async () => {
    if (googleUser) {
      Alert.alert("Disconnect Google", "Are you sure you want to disconnect your Google account?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          onPress: disconnectGoogle,
          style: "destructive",
        },
      ])
    } else {
      await connectGoogle()
    }
  }

 
  const handleFacebookToggle = async () => {
    if (facebookUser) {
      Alert.alert("Disconnect Facebook", "Are you sure you want to disconnect your Facebook account?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          onPress: disconnectFacebook,
          style: "destructive",
        },
      ])
    } else {
      await connectFacebook()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>Fortress</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Connected Accounts</Text>
            <Text style={styles.subtitle}>Connect your social accounts to enhance your experience</Text>
          </View>

          
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#111111" }]}>
                <Text style={[styles.accountIconText, { color: "#FFD700" }]}>G</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Google</Text>
                <Text style={styles.accountStatus}>
                  {isLoadingGoogle
                    ? "Loading..."
                    : googleUser
                      ? `Connected as ${googleUser.email || googleUser.name}`
                      : "Not connected"}
                </Text>
              </View>
            </View>
            {isLoadingGoogle ? (
              <ActivityIndicator size="small" color="#FFD700" />
            ) : (
              <Switch
                trackColor={{ false: "#333333", true: "rgba(255, 215, 0, 0.3)" }}
                thumbColor={googleUser ? "#FFD700" : "#666666"}
                onValueChange={handleGoogleToggle}
                value={!!googleUser}
              />
            )}
          </View>

        
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#111111" }]}>
                <Text style={[styles.accountIconText, { color: "#FFD700" }]}>f</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Facebook</Text>
                <Text style={styles.accountStatus}>
                  {isLoadingFacebook
                    ? "Loading..."
                    : facebookUser
                      ? `Connected as ${facebookUser.email || facebookUser.name}`
                      : "Not connected"}
                </Text>
              </View>
            </View>
            {isLoadingFacebook ? (
              <ActivityIndicator size="small" color="#FFD700" />
            ) : (
              <Switch
                trackColor={{ false: "#333333", true: "rgba(255, 215, 0, 0.3)" }}
                thumbColor={facebookUser ? "#FFD700" : "#666666"}
                onValueChange={handleFacebookToggle}
                value={!!facebookUser}
              />
            )}
          </View>

          
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#111111" }]}>
                <Text style={[styles.accountIconText, { color: "#FFD700" }]}>t</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Twitter</Text>
                <Text style={styles.accountStatus}>Not connected</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#333333", true: "rgba(255, 215, 0, 0.3)" }}
              thumbColor={"#666666"}
              onValueChange={() => Alert.alert("Coming Soon", "Twitter integration will be available soon!")}
              value={false}
            />
          </View>

          
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#111111" }]}>
                <Text style={[styles.accountIconText, { color: "#FFD700" }]}>in</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Instagram</Text>
                <Text style={styles.accountStatus}>Not connected</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#333333", true: "rgba(255, 215, 0, 0.3)" }}
              thumbColor={"#666666"}
              onValueChange={() => Alert.alert("Coming Soon", "Instagram integration will be available soon!")}
              value={false}
            />
          </View>

       
          {(googleUser || facebookUser) && (
            <View style={styles.connectedAccountsSection}>
              <Text style={styles.sectionTitle}>Connected Account Details</Text>

              {googleUser && (
                <View style={styles.accountDetailCard}>
                  <Text style={styles.accountDetailTitle}>Google Account</Text>
                  <View style={styles.accountDetailRow}>
                    <Text style={styles.accountDetailLabel}>Name:</Text>
                    <Text style={styles.accountDetailValue}>{googleUser.name}</Text>
                  </View>
                  <View style={styles.accountDetailRow}>
                    <Text style={styles.accountDetailLabel}>Email:</Text>
                    <Text style={styles.accountDetailValue}>{googleUser.email}</Text>
                  </View>
                  {googleUser.picture && (
                    <Image
                      source={{ uri: googleUser.picture }}
                      style={[styles.accountAvatar, { borderColor: "#FFD700" }]}
                    />
                  )}
                </View>
              )}

              {facebookUser && (
                <View style={styles.accountDetailCard}>
                  <Text style={styles.accountDetailTitle}>Facebook Account</Text>
                  <View style={styles.accountDetailRow}>
                    <Text style={styles.accountDetailLabel}>Name:</Text>
                    <Text style={styles.accountDetailValue}>{facebookUser.name}</Text>
                  </View>
                  {facebookUser.email && (
                    <View style={styles.accountDetailRow}>
                      <Text style={styles.accountDetailLabel}>Email:</Text>
                      <Text style={styles.accountDetailValue}>{facebookUser.email}</Text>
                    </View>
                  )}
                  {facebookUser.picture?.data?.url && (
                    <Image
                      source={{ uri: facebookUser.picture.data.url }}
                      style={[styles.accountAvatar, { borderColor: "#FFD700" }]}
                    />
                  )}
                </View>
              )}
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why connect accounts?</Text>
            <Text style={styles.infoText}>
              Connecting your social accounts allows for easier login, sharing content, and a more personalized
              experience across our platform.
            </Text>
            <Text style={styles.infoText}>
              We value your privacy and will never post to your accounts without your permission.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  backButton: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleContainer: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 22,
  },
  accountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#333333",
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  accountIconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  accountDetails: {
    justifyContent: "center",
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 4,
  },
  accountStatus: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  connectedAccountsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 15,
  },
  accountDetailCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#333333",
  },
  accountDetailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 12,
  },
  accountDetailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  accountDetailLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    width: 60,
  },
  accountDetailValue: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
  },
  accountAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
    alignSelf: "center",
    borderWidth: 2,
  },
  infoSection: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
    marginBottom: 8,
  },
})

