// https://stackoverflow.com/questions/64699477/react-native-what-is-the-best-practice-to-use-global-variables-throughout-your

let expendituretype = {};

export default {

  setExpenditureType(_expType) {
    console.log("setExpenditureType");
    expendituretype = _expType;
  },
  getExpenditureType() {
    console.log("getExpenditureType");
    return expendituretype;
  }
};