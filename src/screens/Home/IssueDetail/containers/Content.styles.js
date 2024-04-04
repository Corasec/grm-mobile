import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
    fontWeight: "bold",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  container: {
    marginTop: 23,
    width: "100%",
    height: 90,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    padding: 17,
  },
  infoContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    // marginHorizontal: 23,
    padding: 5,
  },
  collapsibleTrigger: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  collapsibleContent: {
    borderRadius: 10,
    padding: 14,
    marginTop: 5,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f7f7f7",
  },
  collapsibleTextArea: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  subtitle: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    fontSize: 13,
    marginVertical: 5,
    marginBottom: 5,
  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    fontSize: 12,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  stepText: {
    marginVertical: 5,
    fontSize: 29,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#24c38b",
  },
  stepSubtitle: {
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  stepDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  stepNote: {
    fontFamily: "Poppins_400Regular",
    marginVertical: 5,
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  radioLabel: {
    fontFamily: "Poppins_400Regular",
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  grmInput: {
    // height: 40,
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    letterSpacing: 0,
    // textAlign: "left",
    color: "#707070",
  },

  // dropdown
  dropdownWrapper: {
    marginHorizontal: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  dropdownLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  dropdownContainer: {
    borderColor: "#dedede",
    elevation: 3,
  },
  dropdownStyle: {
    borderColor: "#dedede",
    elevation: 3,
  },
});
