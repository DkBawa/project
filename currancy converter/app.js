const BASE_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");



// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

// Fetch and update exchange rate
const updateExchangeRate = async () => {
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    const rate = data.rates[toCurr.value];
    if (!rate) {
      throw new Error(`Exchange rate not available for ${toCurr.value}`);
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Failed to fetch exchange rate. Please try again.";
  }
};

// Update flag based on selected currency
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  if (countryCode) {
    const img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    img.alt = `${currCode} flag`;
  }
};

// Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
