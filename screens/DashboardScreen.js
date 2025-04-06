
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"


const NETWORK_SCANNER_SCREEN_NAME = "NetworkScanner"

export default function DashboardScreen({ route, navigation }) {

  const { email, name } = route.params || { email: "User", name: "" }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>Fortress</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome{name ? ", " + name : ""}!</Text>
            
            {email !== "User" && <Text style={styles.welcomeEmail}>{email}</Text>}
            <Text style={styles.welcomeMessage}>Explore the security features below to protect your digital life.</Text>
          </View>

          <View style={styles.securityFeaturesSection}>
            <Text style={styles.sectionTitle}>Security Features</Text>

          
            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("BlockchainSecurity")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 215, 0, 0.15)" }]}>
                  <Text style={[styles.featureIconText, { color: "#FFD700" }]}>🔐</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Blockchain & Online Security</Text>
                <Text style={styles.featureDescription}>
                  Monitor your digital footprint and see which sites have access to your data
                </Text>
              </View>
            </TouchableOpacity>

           
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate(NETWORK_SCANNER_SCREEN_NAME)}
            >
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 215, 0, 0.15)" }]}>
                  <Text style={[styles.featureIconText, { color: "#FFD700" }]}>📡</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Network Scanner</Text>
                <Text style={styles.featureDescription}>
                  Scan your local network for devices and potential anomalies
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("RoamAlert")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 215, 0, 0.15)" }]}>
                  <Text style={[styles.featureIconText, { color: "#FFD700" }]}>📞</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Security Alert System</Text>
                <Text style={styles.featureDescription}>
                  Receive automated calls and alerts for critical security breaches
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("Chatbot")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 215, 0, 0.15)" }]}>
                  <Text style={[styles.featureIconText, { color: "#FFD700" }]}>🤖</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Security Assistant</Text>
                <Text style={styles.featureDescription}>
                  Chat with our AI assistant for personalized security advice
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("KeywordSearch")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 215, 0, 0.15)" }]}>
                  <Text style={[styles.featureIconText, { color: "#FFD700" }]}>🔍</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Keyword Security Scanner</Text>
                <Text style={styles.featureDescription}>Check if your keywords have been exposed in data breaches</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("TempEmail")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 215, 0, 0.15)" }]}>
                  <Text style={[styles.featureIconText, { color: "#FFD700" }]}>📧</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Temporary Email</Text>
                <Text style={styles.featureDescription}>
                  Generate disposable email addresses to protect your privacy
                </Text>
              </View>
            </TouchableOpacity>
          </View>

         
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Notifications</Text>
            </View>
          </View>

         
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Logged In</Text>
                <Text style={styles.activityTime}>Just now</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.accountsButton} onPress={() => navigation.navigate("Accounts")}>
            <Text style={styles.accountsButtonText}>Manage Connected Accounts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 25,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: "#FFD700",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  welcomeEmail: {
    fontSize: 16,
    color: "#D4AF37",
    marginBottom: 15,
    fontWeight: "500",
  },
  welcomeMessage: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
  },
  securityFeaturesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    borderLeftWidth: 2,
    borderLeftColor: "#D4AF37",
  },
  featureIconContainer: {
    marginRight: 15,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  featureIconText: {
    fontSize: 22,
  },
  featureContent: {
    flex: 1,
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: "#CCCCCC",
    fontWeight: "500",
  },
  activitySection: {
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#111111",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 13,
    color: "#999999",
  },
  accountsButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  accountsButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 40,
    backgroundColor: "#111111",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  logoutButtonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
})

