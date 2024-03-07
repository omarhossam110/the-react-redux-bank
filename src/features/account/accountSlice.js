import { createSlice } from "@reduxjs/toolkit";


// 1- initial state
const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers:{
    deposit(state, action){
     state.balance = state.balance + action.payload;
     state.isLoading = false;
    },

    withdraw(state, action){
       state.balance -= action.payload;
     },

    requestLoan:{
    prepare(amount, prepare){
      return{
        payload: { amount, prepare }
      }
    },
    reducer(state, action){
      if(state.loan > 0) return;
     
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = state.balance + action.payload.amount;
    }},

   payLoan(state){
     state.balance -= state.loan;
     state.loan = 0 ;
     state.loanPurpose= '';
   },
   convertingCurrency(state){
    state.isLoading = true;
   },
  }
})

// console.log(accountSlice);

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

// async not in react toolkit way ()
export function deposit(amount, currency) {
  if(currency === "USD") return { type: "account/deposit", payload: amount };

  return async function(dispatch, getState) {
    dispatch({type:"account/convertingCurrency"})
    // API call
  const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);
  const data = await res.json();
  console.log(data);
  const converted = data.rates.USD;

    // return action
    dispatch({type: "account/deposit", payload: converted });
  };
}

export default accountSlice.reducer;


/*

// 2- reducer function
export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };

    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };

    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertingCurrency":
      return{
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
}

// 3- action creators 
export function deposit(amount, currency) {
  if(currency === "USD") return { type: "account/deposit", payload: amount };

  return async function(dispatch, getState) {
    dispatch({type:"account/convertingCurrency"})
    // API call
  const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);
  const data = await res.json();
  console.log(data);
  const converted = data.rates.USD;

    // return action
    dispatch({type: "account/deposit", payload: converted });
  };
}

export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount: amount, purpose: purpose },
  };
}

export function payLoan() {
  return { type: "account/payLoan" };
}


*/
