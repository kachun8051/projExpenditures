// https://stackoverflow.com/questions/64699477/react-native-what-is-the-best-practice-to-use-global-variables-throughout-your

// global variable stored in-transit when entry has been added, updated or deleted
let expendituretype = null;
let expenditure = null;

export default {

  setExpenditureType(_expType) {
    console.log("setExpenditureType");
    expendituretype = _expType;
  },
  getExpenditureType() {
    console.log("getExpenditureType");
    return expendituretype;
  },
  setExpenditure(_exp) {
    console.log("setExpenditure");
    expenditure = _exp;
  },
  getExpenditure() {
    console.log("getExpenditure");
    return expenditure;
  }  
};