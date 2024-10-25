import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#24c38b",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
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
  stepLittleText: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#24c38b",
    width: '90%',
    alignItems: 'flex-start'
  },
  stepSubtitle: {
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  stepDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
    marginBottom: 15,
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
  cardConfirm: {
    marginLeft: 10,
    padding: 18,
    paddingTop: 10,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    borderColor: '#f5f5f5',
    borderWidth: 5,
    width: '95%',
    shadowRadius: 15,
    shadowOpacity: 1,
    elevation: 2,
    backgroundColor: 'white',
  }
});
