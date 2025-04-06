"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
  FlatList,
  Animated,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import * as Speech from "expo-speech"
import { Mic, MicOff } from "lucide-react-native"
import { triggerScan, getLatestSummary, getSummaries } from "../services/network-scan-api"

const formatTimestamp = (timestampStr) => {
  if (!timestampStr) return "N/A"
  try {
    const date = new Date(timestampStr)
    if (isNaN(date.getTime())) return "Invalid Date"
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  } catch (e) {
    console.error("Error formatting timestamp:", e)
    return "Invalid Date"
  }
}

export default function NetworkScannerScreen({ navigation }) {

  const [latestSummary, setLatestSummary] = useState("No summary available yet.")
  const [historicalSummaries, setHistoricalSummaries] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)


  const [isListening, setIsListening] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState("")
  const pulseAnim = useRef(new Animated.Value(1)).current

  const isMounted = useRef(true)
  const refreshTimeout = useRef(null)


  useEffect(() => {
    isMounted.current = true
    fetchData()

    return () => {
      isMounted.current = false
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current)
      }
      if (isListening) {
        stopListening()
      }
    }
  }, [])

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [isListening])

  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      if (!isMounted.current) return
      console.log("Fetching scanner data...")
      setIsLoading(!isManualRefresh && historicalSummaries.length === 0)
      setError(null)

      try {
        const [latestSummResponse, histSummResponse] = await Promise.all([getLatestSummary(), getSummaries()])

        if (isMounted.current) {
          setLatestSummary(latestSummResponse?.latest_summary || "Failed to load summary.")
          setHistoricalSummaries(histSummResponse?.summaries || [])
        }
      } catch (err) {
        console.error("Error fetching scanner data:", err)
        if (isMounted.current) {
          setError(`Failed to load data: ${err.message}`)
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false)
          setRefreshing(false)
        }
      }
    },
    [historicalSummaries.length],
  )

  const handleScanNow = useCallback(async () => {
    if (!isMounted.current) return
    setIsScanning(true)
    setError(null)
    setLatestSummary("Scan requested...")
    setVoiceMessage("Starting network scan...")

    Speech.speak("Starting network scan. This may take a few minutes.")

    try {
      const response = await triggerScan()
      if (isMounted.current) {
        const message = response.detail || "Scan is running in the background."
        Alert.alert("Scan Started", message)
        setVoiceMessage(message)

        if (refreshTimeout.current) clearTimeout(refreshTimeout.current)
        refreshTimeout.current = setTimeout(() => {
          console.log("Refreshing data after scan trigger delay...")
          fetchData(true)
        }, 20000)
      }
    } catch (err) {
      console.error("Error triggering scan:", err)
      if (isMounted.current) {
        const displayError = `Failed to start scan: ${err.message}`
        setError(displayError)
        setVoiceMessage("Scan failed to start")
        Speech.speak("I couldn't start the scan. Please check your connection.")
        Alert.alert("Scan Error", displayError)
        setLatestSummary("Scan failed to start.")
      }
    } finally {
      if (isMounted.current) {
        setIsScanning(false)
      }
    }
  }, [fetchData])

  const handleGetSummary = useCallback(async () => {
    setVoiceMessage("Fetching latest summary...")
    Speech.speak("Getting the latest network summary.")

    try {
      const response = await getLatestSummary()
      if (isMounted.current) {
        const summary = response?.latest_summary || "No summary available."
        setLatestSummary(summary)
        setVoiceMessage("Summary retrieved")

        const speakableSummary = summary.length > 150 ? summary.substring(0, 150) + "... That's the summary." : summary
        Speech.speak(speakableSummary)
      }
    } catch (err) {
      console.error("Error getting summary:", err)
      if (isMounted.current) {
        const displayError = `Failed to get summary: ${err.message}`
        setError(displayError)
        setVoiceMessage("Couldn't retrieve summary")
        Speech.speak("I couldn't retrieve the summary. Please check your connection.")
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)
    setVoiceMessage("Listening for commands...")
    Speech.speak("Listening for commands. Try saying 'scan now' or 'what's new'")


    setTimeout(() => {
      const simulatedCommands = ["scan now", "what's new", "show summary"]
      const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)]
      handleVoiceCommand(randomCommand)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
    setVoiceMessage("")
  }

  const handleVoiceCommand = (command) => {
    if (!command) return

    setVoiceMessage(`Command recognized: "${command}"`)
    const cmd = command.toLowerCase()

    if (cmd.includes("scan") || cmd.includes("scan now")) {
      setVoiceMessage("Starting scan...")
      handleScanNow()
    } else if (cmd.includes("what's new") || cmd.includes("show summary")) {
      setVoiceMessage("Fetching summary...")
      handleGetSummary()
    } else {
      const unknownMsg = "I didn't understand that. Try 'scan now' or 'what's new'."
      setVoiceMessage(unknownMsg)
      Speech.speak(unknownMsg)
    }

    setIsListening(false)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData(true)
  }, [fetchData])


  const renderSummaryItem = ({ item }) => (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryTimestamp}>{formatTimestamp(item.timestamp)}</Text>
      <Text style={styles.summaryText}>{item.summary}</Text>
    </View>
  )


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.appName}>Network Scanner</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
        
          <TouchableOpacity style={styles.voiceCommandButton} onPress={toggleListening} activeOpacity={0.7}>
            <Animated.View
              style={[
                styles.voiceIndicator,
                isListening && styles.voiceIndicatorActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {isListening ? <Mic color="#000" size={24} /> : <MicOff color="#000" size={24} />}
            </Animated.View>
            <Text style={styles.voiceCommandText}>{isListening ? "Listening..." : "Voice Commands"}</Text>
          </TouchableOpacity>

          
          {voiceMessage ? (
            <View style={styles.voiceMessageContainer}>
              <Text style={styles.voiceMessageText}>{voiceMessage}</Text>
            </View>
          ) : null}

        
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScanNow}
            disabled={isScanning}
            activeOpacity={0.7}
          >
            {isScanning ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.scanButtonText}>Scanning...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.scanButtonText}>Scan Network Now</Text>
              </View>
            )}
          </TouchableOpacity>
          {isScanning && <Text style={styles.infoText}>Scans can take several minutes and run in the background.</Text>}

         
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Latest Scan Summary</Text>
            {isLoading && !latestSummary.includes("Scan requested") ? (
              <ActivityIndicator size="small" color="#FFD700" style={{ marginVertical: 10 }} />
            ) : (
              <Text style={styles.latestSummaryText}>{latestSummary}</Text>
            )}
            <Text style={styles.infoText}>Pull down to refresh summaries.</Text>
          </View>

          
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Scan History</Text>
            {isLoading && historicalSummaries.length === 0 ? (
              <ActivityIndicator size="small" color="#FFD700" style={{ marginVertical: 10 }} />
            ) : historicalSummaries.length === 0 ? (
              <Text style={styles.infoText}>No historical summaries found.</Text>
            ) : (
              <FlatList
                data={historicalSummaries}
                renderItem={renderSummaryItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>

        
          <View style={[styles.sectionCard, styles.infoCard]}>
            <Text style={styles.sectionTitle}>About Network Scanning</Text>
            <Text style={styles.infoCardText}>
              This tool scans your local network to identify connected devices and open ports. Anomalies highlight new
              devices or services appearing since the last scan.
            </Text>
            <Text style={styles.infoCardText}>
              Note: Scanning may require appropriate permissions and can take time depending on network size. Ensure you
              have permission to scan the network.
            </Text>
            <Text style={styles.infoCardText}>
              <Text style={styles.boldText}>Voice Commands:</Text> Try saying "scan now" or "what's new" when the voice
              assistant is active.
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
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  appName: {
    fontSize: 22,
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


  voiceCommandButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  voiceIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  voiceIndicatorActive: {
    backgroundColor: "#FFD700",
  },
  voiceCommandText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
  voiceMessageContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 2,
    borderLeftColor: "#FFD700",
  },
  voiceMessageText: {
    color: "#FFD700",
    fontSize: 14,
    fontStyle: "italic",
  },

  scanButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 5,
    elevation: 3,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  scanButtonDisabled: {
    backgroundColor: "rgba(255, 215, 0, 0.5)",
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 12,
    color: "rgba(255, 215, 0, 0.7)",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  errorContainer: {
    backgroundColor: "rgba(220, 20, 60, 0.15)",
    borderRadius: 8,
    padding: 12,
    marginVertical: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#DC143C",
  },
  errorText: {
    color: "#FFC0CB",
    fontSize: 14,
  },
  sectionCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingBottom: 10,
  },
  latestSummaryText: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 22,
    marginBottom: 10,
  },
  summaryItem: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#D4AF37",
  },
  summaryTimestamp: {
    fontSize: 12,
    color: "#D4AF37",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 19,
  },
  infoCard: {
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#333333",
  },
  infoCardText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#FFD700",
  },
})

