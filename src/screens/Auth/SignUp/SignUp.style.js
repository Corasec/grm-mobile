import { Dimensions } from 'react-native';

const { width  } = Dimensions.get("screen");

export default {
  containerView: {
    flex: 1,

    backgroundColor: "white",
  },
  loginScreenContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 130,
    marginBottom: 30,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
  },
  errorText: {
    color: "red",
    paddingLeft: 15,
    marginBottom: 10,
  },
  modalContainerStyle: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    flex: 0.5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  successModal: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  loginFormTextInput: {
    borderRadius: 20,
    backgroundColor: "white",
    fontSize: 14,
    color: "#707070",
    // overflow: "hidden",
    // height: 43,
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "#eaeaea",
    // backgroundColor: "#fafafa",
    // paddingLeft: 10,
    // marginLeft: 15,
    // marginRight: 15,
    // marginTop: 5,
    // marginBottom: 5,
    // fontFamily: "Poppins",
    // fontSize: 12,
    // fontWeight: "normal",
    // fontStyle: "normal",
    // lineHeight: 18,
    // letterSpacing: 0,
    // textAlign: "left",
    // color: "#dedede"
  },
  loginButton: {
    alignSelf: "center",
    width: width - 60,
    height: 47,
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    backgroundColor: "#dedede",
  },
  textHint: {
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#707070",
  },
  hintContainer: {
    alignItems: "center",
  },
  formContainer: {
    // alignItems: 'center',
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: "transparent",
  },
};
