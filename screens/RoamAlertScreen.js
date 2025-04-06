"use client"

import { useState, useEffect } from "react"
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch, Modal, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"

// Mock data for alert history
const mockAlertHistory = [
  {
    id: "alert-1",
    type: "Suspicious Login",
    date: "2024-07-20T14:30:00",
    severity: "High",
    device: "Unknown Device",
    status: "Unresolved",
    message: "A login attempt from an unrecognized device was detected.",
  },
  {
    id: "alert-2",
    type: "Data Breach",
    date: "2024-07-19T09:15:00",
    severity: "Medium",
    device: "Website Account",
    status: "Resolved",
    message: "Your password was found in a recent data breach.",
  },
  {
    id: "alert-3",
    type: "Phishing Attempt",
    date: "2024-07-18T18:45:00",
    severity: "Low",
    device: "Email Account",
    status: "Resolved",
    message: "A phishing email was detected in your inbox.",
  },
]

export default function RoamAlertScreen({ navigation }) {
  const [isAlertsEnabled, setIsAlertsEnabled] = useState(true)
  const [isCallEnabled, setIsCallEnabled] = useState(true)
  const [alertHistory, setAlertHistory] = useState(mockAlertHistory)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [simulatingCall, setSimulatingCall] = useState(false)

  useEffect(() => {
    setTimeout(() => {

    }, 1000)
  }, [])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "#E53935"
      case "Medium":
        return "#FFA000"
      case "Low":
        return "#43A047"
      default:
        return "#757575"
    }
  }

  const handleTestAlert = (severity) => {
    // Simulate receiving a new alert
    const newAlert = {
      id: `test-alert-${Date.now()}`,
      type: "Test Alert",
      date: new Date().toISOString(),
      severity: severity,
      device: "Test Device",
      status: "Unresolved",
      message: `This is a test alert with ${severity} severity.`,
    }

    setAlertHistory([newAlert, ...alertHistory])
  }

  const handleSimulateCall = () => {
    setSimulatingCall(true)
    Alert.alert("Simulating Call", "Simulating an automated call for the alert...")

    setTimeout(() => {
      setSimulatingCall(false)
      Alert.alert("Call Ended", "The simulated automated call has ended.")
    }, 5000)
  }

  const handleResolveAlert = (alertId) => {
    setAlertHistory(alertHistory.map((alert) => (alert.id === alertId ? { ...alert, status: "Resolved" } : alert)))
    setSelectedAlert(null) // Close the modal
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
            <Text style={styles.title}>Security Alert System</Text>
            <Text style={styles.subtitle}>Receive automated calls and alerts for critical security breaches</Text>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusCardTitle}>System Status</Text>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isAlertsEnabled ? "#43A047" : "#E53935" }]} />
              <Text style={styles.statusText}>Alerts: {isAlertsEnabled ? "Enabled" : "Disabled"}</Text>
            </View>
            <Text style={styles.statusDescription}>
              Stay informed about potential security threats with real-time alerts.
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>Enable Alerts</Text>
                <Text style={styles.settingDescription}>Receive push notifications for security breaches.</Text>
              </View>
              <Switch
                trackColor={{ false: "#333333", true: "rgba(255, 215, 0, 0.3)" }}
                thumbColor={isAlertsEnabled ? "#FFD700" : "#666666"}
                onValueChange={setIsAlertsEnabled}
                value={isAlertsEnabled}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>Enable Automated Calls</Text>
                <Text style={styles.settingDescription}>Receive automated phone calls for high-severity alerts.</Text>
              </View>
              <Switch
                trackColor={{ false: "#333333", true: "rgba(255, 215, 0, 0.3)" }}
                thumbColor={isCallEnabled ? "#FFD700" : "#666666"}
                onValueChange={setIsCallEnabled}
                value={isCallEnabled}
              />
            </View>
          </View>

          <View style={styles.testButtonsContainer}>
            <TouchableOpacity
              style={[styles.testButton, styles.callButton(simulatingCall)]}
              onPress={handleSimulateCall}
              disabled={simulatingCall}
            >
              <Text style={styles.testButtonText}>Simulate Automated Call</Text>
            </TouchableOpacity>
            {simulatingCall && (
              <View style={styles.callIndicator}>
                <Text style={styles.callIndicatorText}>Simulating Call...</Text>
              </View>
            )}
            <TouchableOpacity style={styles.testButton} onPress={() => handleTestAlert("High")}>
              <Text style={styles.testButtonText}>Generate Test Alert (High)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.testButton} onPress={() => handleTestAlert("Medium")}>
              <Text style={styles.testButtonText}>Generate Test Alert (Medium)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.testButton} onPress={() => handleTestAlert("Low")}>
              <Text style={styles.testButtonText}>Generate Test Alert (Low)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Alert History</Text>
            {alertHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>No alerts in history.</Text>
              </View>
            ) : (
              alertHistory.map((alert) => (
                <TouchableOpacity
                  key={alert.id}
                  style={styles.alertHistoryItem}
                  onPress={() => setSelectedAlert(alert)}
                >
                  <View style={styles.alertHistoryHeader}>
                    <View style={styles.alertHistoryInfo}>
                      <Text style={styles.alertHistoryType}>{alert.type}</Text>
                      <Text style={styles.alertHistoryDate}>{new Date(alert.date).toLocaleString()}</Text>
                    </View>
                    <View
                      style={[
                        styles.severityBadge,
                        {
                          backgroundColor: getSeverityColor(alert.severity) + "20",
                          borderColor: getSeverityColor(alert.severity),
                        },
                      ]}
                    >
                      <Text style={[styles.severityText, { color: getSeverityColor(alert.severity) }]}>
                        {alert.severity}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.alertHistoryDetails}>
                    <Text style={styles.alertHistoryDevice}>Device: {alert.device}</Text>
                    <Text style={styles.alertHistoryStatus}>Status: {alert.status}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.integrationInfoCard}>
            <Text style={styles.integrationInfoTitle}>Powered by Twilio</Text>
            <Text style={styles.integrationInfoText}>
              Our automated call system is integrated with Twilio to provide reliable and secure communication.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Alert Details Modal */}
      <Modal visible={!!selectedAlert} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            {selectedAlert && (
              <>
                <View style={styles.alertHeader}>
                  <View style={[styles.alertIcon, { backgroundColor: "rgba(229, 57, 53, 0.1)" }]}>
                    <Text style={styles.alertIconText}>🚨</Text>
                  </View>
                  <View style={styles.alertTitleContainer}>
                    <Text style={styles.alertTitle}>{selectedAlert.type}</Text>
                    <Text style={styles.alertSubtitle}>{new Date(selectedAlert.date).toLocaleString()}</Text>
                  </View>
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{selectedAlert.message}</Text>
                  <Text style={styles.alertInfo}>Device: {selectedAlert.device}</Text>
                  <Text style={styles.alertInfo}>Severity: {selectedAlert.severity}</Text>
                  <Text style={styles.alertInfo}>Status: {selectedAlert.status}</Text>
                </View>
                <View style={styles.alertActions}>
                  <TouchableOpacity
                    style={[styles.alertButton, styles.alertPrimaryButton]}
                    onPress={() => handleResolveAlert(selectedAlert.id)}
                  >
                    <Text style={styles.alertPrimaryButtonText}>Resolve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.alertButton, styles.alertSecondaryButton]}
                    onPress={() => setSelectedAlert(null)}
                  >
                    <Text style={styles.alertSecondaryButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.alertFooter}>
                  <Text style={styles.alertFooterText}>
                    Fortress Security Alert System - Protecting Your Digital Life
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

