import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image, Linking } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function AboutUsScreen({ navigation }) {
  const teamMembers = [
    {
      id: 1,
      name: "Shiv Davay",
      role: "CEO & Security Architect",
      bio: "Security expert with a passion for building intuitive, secure systems that protect user data without compromising on experience.",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQHhB9Bhs1K-ag/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1728959089424?e=1747267200&v=beta&t=jOWL3oDXTIOfdixCGOQytTF8LrsDHJyN6hMs7BuyM0Y", // Placeholder - replace with actual image
      linkedin: "https://www.linkedin.com/in/shiv-davay-80a505287/",
      github: "https://github.com/",
    },
    {
      id: 2,
      name: "Parthiv Maddipatla",
      role: "CTO & Backend Developer",
      bio: "Specializes in secure infrastructure and backend development with expertise in blockchain technologies and API integrations.",
      image:
        "https://mail.google.com/mail/u/0?ui=2&ik=28d05d10a8&attid=0.1&permmsgid=msg-f:1826107020363239343&th=1957a2a8ee990faf&view=fimg&fur=ip&permmsgid=msg-f:1826107020363239343&sz=s0-l75-ft&attbid=ANGjdJ9TQvdT785HJVuyqm-ov9_EAI3t6Qthn1V8Tl2K-g7bHaMBCvSf_Tti868M6lXKTjLH2kaIXXtcgtb61_tlE6tY-VuG5ELsELvvfYxaSDDzdIiff-gHfNjguwM&disp=emb&realattid=ii_1957a2a5198baf686ec1&zw", // Placeholder - replace with actual image
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/",
    },
    {
      id: 3,
      name: "Svaran Medavarapu",
      role: "Lead Frontend Developer",
      bio: "UI/UX specialist focusing on creating intuitive interfaces that make complex security concepts accessible to everyone.",
      image:
        "https://mail.google.com/mail/u/0?ui=2&ik=28d05d10a8&attid=0.1&permmsgid=msg-f:1826107107549011616&th=1957a2bd3b465ea0&view=fimg&fur=ip&permmsgid=msg-f:1826107107549011616&sz=s0-l75-ft&attbid=ANGjdJ81sRE3TNS_D10f7OJmhZmSS_qQi3LcNafwhLV15bcBPSZzibv-fwOh1AF2yZAQgsNtpxX5jlD_xTtH1OA0tQ2JG6p4k8xlGQZLEcJwJ4nMGsTT1ah42X-RwG4&disp=emb&realattid=ii_1957a2b936e94d74be41&zw", // Placeholder - replace with actual image
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/",
    },
    {
      id: 4,
      name: "Aarnav Bujjamella",
      role: "AI & ML Specialist",
      bio: "Developing cutting-edge AI models to enhance security threat detection and provide intelligent responses to emerging threats.",
      image:
        "", 
      linkedin: "",
      github: "https://github.com/",
    },
  ]

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
            <Text style={styles.title}>Our Team</Text>
            <Text style={styles.subtitle}>Meet the security experts behind Fortress</Text>
          </View>

          <View style={styles.ourStorySection}>
            <Text style={styles.sectionTitle}>Our Story</Text>
            <Text style={styles.storyText}>
              Fortress was founded with a simple but powerful mission: to make advanced cybersecurity accessible to
              everyone. In an increasingly connected world, we believe that robust security shouldn't be a luxury - it
              should be the standard.
            </Text>
            <Text style={styles.storyText}>
              Our team combines expertise in cybersecurity, artificial intelligence, and user experience design to
              create solutions that protect what matters most without getting in the way of your digital life.
            </Text>
          </View>

          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>The Team</Text>

            {teamMembers.map((member) => (
              <View key={member.id} style={styles.teamMemberCard}>
                <View style={styles.teamMemberHeader}>
                  <Image source={{ uri: member.image }} style={styles.teamMemberImage} />
                  <View style={styles.teamMemberInfo}>
                    <Text style={styles.teamMemberName}>{member.name}</Text>
                    <Text style={styles.teamMemberRole}>{member.role}</Text>

                    <View style={styles.socialLinks}>
                      <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(member.linkedin)}>
                        <Text style={styles.socialButtonText}>LinkedIn</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(member.github)}>
                        <Text style={styles.socialButtonText}>GitHub</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text style={styles.teamMemberBio}>{member.bio}</Text>
              </View>
            ))}
          </View>

          <View style={styles.missionSection}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              At Fortress, we're committed to creating a safer digital world through innovative security solutions that
              protect users without compromising on experience. We believe security should be invisible yet powerful -
              working hard in the background so you don't have to worry.
            </Text>
            <View style={styles.valuesList}>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Make security accessible to everyone</Text>
              </View>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Stay ahead of emerging threats</Text>
              </View>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Prioritize user privacy</Text>
              </View>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Create security tools people actually want to use</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>Email: team@fortress.com</Text>
              <Text style={styles.contactText}>Support: support@fortress.com</Text>
              <Text style={styles.contactText}>Location: Ashburn, VA</Text>
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL("mailto:team@fortress.com")}>
              <Text style={styles.contactButtonText}>Get in Touch</Text>
            </TouchableOpacity>
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
    paddingTop: 60,
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
    paddingBottom: 40,
  },
  titleContainer: {
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 15,
  },
  ourStorySection: {
    marginBottom: 30,
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  storyText: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
    marginBottom: 15,
  },
  teamSection: {
    marginBottom: 30,
  },
  teamMemberCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#FFD700",
    borderWidth: 1,
    borderColor: "#333333",
  },
  teamMemberHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  teamMemberImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
    backgroundColor: "#0A0A0A",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  teamMemberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  teamMemberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  teamMemberRole: {
    fontSize: 14,
    color: "#D4AF37",
    marginBottom: 10,
  },
  socialLinks: {
    flexDirection: "row",
  },
  socialButton: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  socialButtonText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "500",
  },
  teamMemberBio: {
    fontSize: 15,
    color: "#CCCCCC",
    lineHeight: 22,
  },
  missionSection: {
    marginBottom: 30,
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  missionText: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
    marginBottom: 20,
  },
  valuesList: {
    marginTop: 10,
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  valueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    marginRight: 12,
  },
  valueText: {
    fontSize: 15,
    color: "#CCCCCC",
  },
  contactSection: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactText: {
    fontSize: 15,
    color: "#CCCCCC",
    marginBottom: 8,
  },
  contactButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
})

