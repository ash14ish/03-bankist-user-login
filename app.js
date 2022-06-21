"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Ashish Sharma Mamgain",

  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],

  interestRate: 1.2, // %

  pin: 1111,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-05-06T12:01:20.894Z",
    "2022-06-08T18:49:59.371Z",
  ],

  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Richard Daniels Samuels",

  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],

  interestRate: 1.5,

  pin: 2222,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2022-06-19T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],

  currency: "USD",

  locale: "en-US",
};

const account3 = {
  owner: "Anish Kumar Saini",

  movements: [200, -200, 340, -300, -20, 50, 400, -460],

  interestRate: 0.7,

  pin: 3333,

  movementsDates: [
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],

  currency: "INR",

  locale: "en-US",
};

const account4 = {
  owner: "Jagdeep Singh Bajwa",

  movements: [430, 1000, 700, 50, 90],

  interestRate: 1,

  pin: 4444,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
  ],

  currency: "INR",

  locale: "hi-IN",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnLogOut = document.querySelector(".log-out");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const overlay = document.querySelector(".overlay");
const modalWindow = document.querySelector(".modal");
const modalCloseButton = document.querySelector(".close-modal");
const modalMessage = document.querySelector(".message");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

//Functions

// formatted date

let formtDate = function (date, acc) {
  let noOfDays = Math.trunc(
    Math.abs(new Date() - date) / (1000 * 60 * 24 * 60)
  );
  if (noOfDays === 0) return "today";
  if (noOfDays === 1) return "yesterday";
  if (noOfDays <= 7) return `${noOfDays} days ago`;
  return new Intl.DateTimeFormat(acc.locale).format(date);
};

// formatted currencies and numbers

let formtNumb = function (value, acc) {
  return new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(value);
};

// display movements

const dispMov = function (acc, sort = false) {
  // sorting function

  let sortedMovs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.textContent = "";
  sortedMovs.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    // adding date

    let dispDate = formtDate(new Date(acc.movementsDates[i]), acc);

    let foNu = formtNumb(mov.toFixed(2), acc);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${
      type === `deposit` ? "dep" : "wdl"
    }</div>
      <div class="movements__date">${dispDate}
      </div>
    <div class="movements__value">${foNu}</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// total balance

const dispBal = acc => {
  let balance = acc.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = formtNumb(balance.toFixed(2), acc);
  acc.balance = balance;
};

// Summary

const dispSumm = function (acc) {
  let sumIN = acc.movements
    .filter(curr => curr > 0)
    .reduce((acc, curr) => acc + curr);

  labelSumIn.textContent = formtNumb(sumIN.toFixed(2), acc);

  let sumOUT = Math.abs(
    acc.movements.filter(curr => curr < 0).reduce((acc, curr) => acc + curr),
    0
  );

  labelSumOut.textContent = formtNumb(sumOUT.toFixed(2), acc);

  let sumINTEREST = acc.movements
    .filter(curr => curr > 0)
    .map(curr => (curr * acc.interestRate) / 100)
    .filter(curr => curr >= 1)
    .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = formtNumb(sumINTEREST.toFixed(2), acc);
};

// Adding Usernames to objects array

let addingUserName = function (acc) {
  acc.forEach(
    curr =>
      (curr.userName = curr.owner
        .toLowerCase()
        .split(" ")
        .map(mov => mov[0])
        .join(""))
  );
};

addingUserName(accounts);

// Update UI

const updateUI = function (acc) {
  // display movements
  dispMov(acc);

  // display balance
  dispBal(acc);

  // display summary
  dispSumm(acc);
};

// timer

let currAcc, timer;

let logOutTimer = function () {
  let time = 600;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = "0";
    }
    time--;
  };
  let timer = setInterval(tick, 1000);
  return timer;
};

// modal message

let modalToggleHandler = (message = "") => {
  modalMessage.textContent = message;
  modalWindow.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};

// Event Handlers

// 1) LogIn

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  inputClosePin.value = inputCloseUsername.value = "";
  inputLoginUsername.blur();

  currAcc = accounts.find(curr => curr.userName === inputLoginUsername.value);

  if (!currAcc) {
    modalToggleHandler("User doesn't exist");
  }

  if (currAcc && currAcc.pin !== +inputLoginPin.value) {
    modalToggleHandler("Incorrect Password");
  }

  if (currAcc?.pin === +inputLoginPin.value) {
    // hide the login details

    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // display welcome message and UI

    labelWelcome.textContent = `Welcome ${currAcc.owner.split(" ")[0]}`;
    containerApp.style.opacity = "100";

    // countdown timer

    if (timer) clearInterval(timer);
    timer = logOutTimer();

    updateUI(currAcc);

    // adding date
    let date = new Date();
    let options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",

      weekday: "short",
      hour: "numeric",
      hourCycle: "h24",
      minute: "numeric",
      second: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currAcc.locale,
      options
    ).format(date);
  }
});

// 2) Transfers

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  let reciever = accounts.find(rec => rec.userName === inputTransferTo.value);

  let transferAmount = +inputTransferAmount.value;

  // hide the transfer details
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferTo.blur();

  if (
    transferAmount > 0 &&
    reciever &&
    currAcc.balance >= transferAmount &&
    reciever?.userName !== currAcc.userName
  ) {
    modalToggleHandler("Transfer Succesful ✔");
    modalMessage.style.color = "#66c873";
    currAcc.movements.push(-transferAmount);
    reciever.movements.push(transferAmount);
    currAcc.movementsDates.push(new Date());
    reciever.movementsDates.push(new Date());
    updateUI(currAcc);
  } else {
    modalToggleHandler("Transfer Failed ❌");
    modalMessage.style.color = "#f5465d";
  }

  // Reset timer
  clearInterval(timer);
  timer = logOutTimer();
});

// 3) Loan

btnLoan.addEventListener("click", function (e) {
  let loan = +inputLoanAmount.value;
  e.preventDefault();
  if (loan > 0 && currAcc.movements.some(mov => mov > 0 && mov >= 0.1 * loan)) {
    currAcc.movements.push(loan);
    currAcc.movementsDates.push(new Date());
    setTimeout(() => {
      updateUI(currAcc);
      modalToggleHandler("Loan Approved ✔");
      modalMessage.style.color = "#66c873";
    }, 1000);
  } else {
    setTimeout(() => {
      updateUI(currAcc);
      modalToggleHandler("Loan Disapproved ❌");
      modalMessage.style.color = "#f5465d";
    }, 1000);
  }

  // Reset timer
  clearInterval(timer);
  timer = logOutTimer();
  inputLoanAmount.value = "";
});

// 4) Close Account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let delAcc = accounts.find(
    curr => curr.userName === inputCloseUsername.value
  );

  if (currAcc?.pin === +inputClosePin.value) {
    accounts.splice(
      accounts.findIndex(curr => curr === delAcc),
      1
    );
    // Hide UI
    containerApp.style.opacity = "0";

    modalToggleHandler("Account Deleted ❌");
    modalMessage.style.color = "#f5465d";
  } else {
    modalToggleHandler("Wrong Credentials ❌");
    modalMessage.style.color = "#f5465d";
  }
});

// 5) Sorting

let sorting = false;
btnSort.addEventListener("click", function () {
  dispMov(currAcc, !sorting);
  sorting = !sorting;
});

// 6) logout

btnLogOut.addEventListener("click", function () {
  labelWelcome.textContent = "Log in to get started";
  containerApp.style.opacity = "0";
  document.body.scrollIntoView({ behavior: "smooth" });
});

// 7) Modal Close

modalCloseButton.addEventListener("click", modalToggleHandler);

overlay.addEventListener("click", modalToggleHandler);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") modalToggleHandler();
});
