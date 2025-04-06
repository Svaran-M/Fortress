import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ImageBackground } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.appName}>Fortress</Text>
            <TouchableOpacity style={styles.aboutButton} onPress={() => navigation.navigate("AboutUs")}>
              <Text style={styles.aboutButtonText}>About Us</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/2431/2431970.png" }} style={styles.logo} />
            </View>
            <Text style={styles.title}>Welcome to Fortress</Text>
            <Text style={styles.subtitle}>
              Your personal cybersecurity assistant. Protecting your digital life with advanced security technology.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={[styles.buttonText, styles.registerButtonText]}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuresPreview}>
            <Text style={styles.featuresTitle}>Your all-in-one security solution</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🔒</Text>
                </View>
                <Text style={styles.featureText}>Real-time threat monitoring</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🤖</Text>
                </View>
                <Text style={styles.featureText}>AI-powered security assistant</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🏠</Text>
                </View>
                <Text style={styles.featureText}>Smart home security scans</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>📱</Text>
                </View>
                <Text style={styles.featureText}>Security breach alerts</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
  },
  aboutButton: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  aboutButtonText: {
    color: "#FFD700",
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  logo: {
    width: 70,
    height: 70,
    tintColor: "#FFD700",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.5)",
    shadowColor: "transparent",
  },
  registerButtonText: {
    color: "#FFD700",
  },
  featuresPreview: {
    paddingBottom: 40,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  featureIconText: {
    fontSize: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    color: "#CCCCCC",
    fontWeight: "500",
  },
})

