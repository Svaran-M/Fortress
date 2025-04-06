"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  ImageBackground,
  RefreshControl,
  Clipboard,
  Platform,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { generateTempEmail, fetchMessages } from "../services/mail-tm-api"

export default function TempEmailScreen({ navigation }) {
  const [tempEmail, setTempEmail] = useState(null)
  const [token, setToken] = useState(null)
  const [expiresAt, setExpiresAt] = useState(null)
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const pollingInterval = useRef(null)
  const isMounted = useRef(true)


  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [])

  const fetchAndUpdateMessages = useCallback(async (currentToken, indicateLoading = false) => {
    if (!currentToken || !isMounted.current) return
    if (indicateLoading && isMounted.current) {
      setIsLoadingMessages(true)
      setError(null)
    }

    try {
      const newMessages = await fetchMessages(currentToken)
      if (isMounted.current) {
        setMessages(newMessages)
        setError(null)
      }
    } catch (err) {
      console.error("[fetchAndUpdateMessages] Error:", err)
      if (isMounted.current) {
        const errorMessage = err.message || "Failed to fetch messages."
        if (
          errorMessage.includes("401") ||
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("invalid or expired token")
        ) {
          setError("Session expired or invalid. Please generate a new email.")
          setToken(null)
          setTempEmail(null)
          setExpiresAt(null)
          setMessages([])
          if (pollingInterval.current) clearInterval(pollingInterval.current)
          Alert.alert("Session Expired", "Please generate a new temporary email.")
        } else {
          if (errorMessage.toLowerCase().includes("network request failed")) {
            setError(
              "Network Error: Could not connect to the server. Please verify backend is running, check IP/Port, Firewall, and HTTP settings.",
            )
          } else {
            setError(`Error fetching inbox: ${errorMessage}`)
          }
        }
      }
    } finally {
      if (isMounted.current) {
        if (indicateLoading) setIsLoadingMessages(false)
        setRefreshing(false)
      }
    }
  }, [])

  const startPolling = useCallback(
    (currentToken) => {
      if (!currentToken) return
      if (pollingInterval.current) clearInterval(pollingInterval.current)
      fetchAndUpdateMessages(currentToken, true)
      pollingInterval.current = setInterval(() => {
        fetchAndUpdateMessages(currentToken, false)
      }, 15000)
    },
    [fetchAndUpdateMessages],
  )

  const handleGenerateEmail = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    setMessages([])
    setTempEmail(null)
    setToken(null)
    setExpiresAt(null)
    if (pollingInterval.current) clearInterval(pollingInterval.current)

    try {
      const result = await generateTempEmail()
      if (isMounted.current) {
        setTempEmail(result.email)
        setToken(result.token)
        setExpiresAt(result.expiresAt)
        startPolling(result.token)
      }
    } catch (err) {
      console.error("[handleGenerateEmail] Error:", err)
      let displayError = `Failed to generate email: ${err.message || "Please check connection and try again."}`
      if (err.message && err.message.toLowerCase().includes("network request failed")) {
        displayError =
          "Network Error: Could not connect to the server. Please verify backend is running, check IP/Port, Firewall, and HTTP settings."
      }
      if (isMounted.current) {
        setError(displayError)
        Alert.alert("Generation Error", displayError)
      }
    } finally {
      if (isMounted.current) setIsGenerating(false)
    }
  }, [startPolling])

  const onRefresh = useCallback(() => {
    if (!token) {
      setRefreshing(false)
      return
    }
    setRefreshing(true)
    fetchAndUpdateMessages(token, false)
  }, [token, fetchAndUpdateMessages])

  const copyToClipboard = useCallback(() => {
    if (tempEmail) {
      const textToCopy = tempEmail
      if (Platform.OS === "web" && navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => Alert.alert("Copied", "Email address copied!"))
          .catch((err) => {
            console.error("Web copy failed: ", err)
            Alert.alert("Error", "Could not copy.")
          })
      } else if (Clipboard && Clipboard.setString) {
        Clipboard.setString(textToCopy)
        Alert.alert("Copied", "Email address copied!")
      } else {
        console.warn("Clipboard API not available.")
        Alert.alert("Error", "Clipboard not available.")
      }
    }
  }, [tempEmail])

  const formatExpirationTime = useCallback(() => {
    if (!expiresAt) return "N/A"
    const expiryDate = new Date(expiresAt)
    if (isNaN(expiryDate.getTime())) return "Invalid Date"
    return expiryDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }, [expiresAt])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.appName}>Fortress</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFD700"
                colors={["#FFD700", "#fff"]}
              />
            }
          >
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Temporary Email</Text>
                <Text style={styles.subtitle}>Generate a disposable email address for privacy.</Text>
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                onPress={handleGenerateEmail}
                disabled={isGenerating}
                activeOpacity={0.7}
              >
                {isGenerating ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator size="small" color="#000000" style={{ marginRight: 8 }} />
                    <Text style={styles.generateButtonText}>Generating...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.generateButtonText}>Generate New Email</Text>
                  </View>
                )}
              </TouchableOpacity>


              {tempEmail && (
                <View style={styles.emailCard}>
                  <Text style={styles.emailCardTitle}>Your Temporary Email</Text>
                  <TouchableOpacity onPress={copyToClipboard} activeOpacity={0.7}>
                    <Text style={styles.emailAddress}>{tempEmail}</Text>
                  </TouchableOpacity>
                  <View style={styles.emailInfoRow}>
                    <Text style={styles.emailInfoText}>Expires around: {formatExpirationTime()}</Text>
                    <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                      <Text style={styles.copyButtonText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Inbox Section */}
              {tempEmail && (
                <View style={styles.inboxSection}>
                  <View style={styles.inboxHeader}>
                    <Text style={styles.inboxTitle}>Inbox</Text>
                    {isLoadingMessages && !refreshing && <ActivityIndicator size="small" color="#FFD700" />}
                  </View>
                  <View style={styles.messagesListContainer}>
                    {isLoadingMessages && messages.length === 0 && (
                      <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 40, marginBottom: 20 }} />
                    )}
                    {!isLoadingMessages && messages.length === 0 ? (
                      <View style={styles.emptyInbox}>
                        <Text style={styles.emptyInboxText}>No messages yet. Pull down to refresh.</Text>
                      </View>
                    ) : (
                      messages.map((message) => (
                        <View key={message.id || message.subject + Math.random()} style={styles.messageItem}>
                          <View style={styles.messageHeader}>
                            <Text style={styles.messageSender} numberOfLines={1}>
                              {message.sender}
                            </Text>
                            {!message.read && <View style={styles.unreadIndicator} />}
                          </View>
                          <Text style={styles.messageSubject} numberOfLines={1}>
                            {message.subject}
                          </Text>
                          {message.intro && (
                            <Text style={styles.messageIntro} numberOfLines={2}>
                              {message.intro}
                            </Text>
                          )}
                        </View>
                      ))
                    )}
                  </View>
                  <Text style={styles.pollingInfo}>Inbox updates automatically. Pull down to refresh.</Text>
                </View>
              )}

              {/* Informational Card */}
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>How It Works</Text>
                <Text style={styles.infoCardText}>
                  Use temporary emails for sign-ups without revealing your personal address. Emails expire after about 1
                  hour.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: "rgba(229, 57, 53, 0.15)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
  },
  errorText: {
    color: "#FBCDCB",
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  generateButtonDisabled: {
    backgroundColor: "rgba(255, 215, 0, 0.5)",
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  emailCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333333",
  },
  emailCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 12,
  },
  emailAddress: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "600",
    marginBottom: 15,
    padding: 12,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  emailInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailInfoText: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  copyButton: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyButtonText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "500",
  },
  inboxSection: {
    backgroundColor: "#111111",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333333",
    flexShrink: 1,
  },
  inboxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  inboxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  messagesListContainer: {
    minHeight: 100,
    maxHeight: 400,
  },
  emptyInbox: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyInboxText: {
    color: "#CCCCCC",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  messageItem: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#FFD700",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
    flexShrink: 1,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFD700",
    marginLeft: 10,
  },
  messageSubject: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: "500",
  },
  messageIntro: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  pollingInfo: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
    paddingBottom: 10,
  },
  infoCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
    marginBottom: 10,
  },
})

