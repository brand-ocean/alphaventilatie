
window.onload = function () {
  var url = new URL(window.location.href);

  var conditions = [
    "WTW+Ventilatiekanalen+reinigen",
    "WTW+Groot+onderhoud",
    "MV+Premium+pakket",
    "MV+Vervangen+en+reinigen",
    "MV+Box+vervangen",
    "MV+Groot+onderhoud",
    "MW+Ventilatiekanalen+reinigen"
  ];

  if (conditions.some((condition) => url.search.includes(condition))) {
    var button = document.querySelector('a[data-form="next-btn"]');
    if (button) {
      button.click();
    }
  }

  // New code to get everything after the '=' sign
  if (url.search.includes("=")) {
    var afterEqualSign = url.search.split("=")[1];
    var textElement = document.querySelector('[data-input="pakket_keuze"]');
    if (textElement) {
      textElement.textContent = decodeURIComponent(
        afterEqualSign.replace(/\+/g, " ")
      );
    }
  }
};

  // Section 1: Implementing Smooth Scroll to Top 
  const buttons = Array.from(
    document.querySelectorAll('[data-form="next-btn"], [scroll-up="true"]')
  );

  buttons.forEach((button) =>
    button.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    )
  );

// Section 2: Show/Hide Extra Phone Field Based on Checkbox Selection
const extraPhoneField = document.getElementById("2etelefoonnummer");
const tel2Check = document.getElementById("tel2check");

// Initially hide the extra phone field
extraPhoneField.style.display = "none";

// Add event listener to the checkbox
tel2Check.addEventListener("change", () => {
    // If checkbox is checked, show the extra phone field, else hide it
    extraPhoneField.style.display = tel2Check.checked ? "block" : "none";
});

// Section 3: Postcode Lookup with Fetch API

const apiKey = "5fc62e9e-78b3-4d27-bfa6-6d12ed8bf8ee";
const BASE_URL = "https://postcode.tech/api/v1/postcode/full";

// DOM element selection
const inputPostcode = document.querySelector("#postcode");
const huisnummerInput = document.querySelector("#huisnummer");
const adresInput = document.querySelector("#adres");
const addressDisplay = document.querySelector("[data-input='adres']");

// Placeholder capture
const defaultAdresPlaceholder = adresInput.placeholder;

// Limit function execution
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    setAdresPlaceholder("Searching..."); // Show loading message
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Postcode validation
const isValidPostcode = (postcode) => /^[0-9]{4}[a-zA-Z]{2}$/.test(postcode);

// Placeholder setup
const setAdresPlaceholder = (text) => (adresInput.placeholder = text);

// Reset address input
const resetAdresInput = () => (adresInput.value = "");

// Update the address display
const updateAddressDisplay = (address) => {
  addressDisplay.innerText = address;
};

// Data fetch function
const fetchData = async () => {
  const inputPostcodeValue = inputPostcode.value;
  const huisnummerValue = huisnummerInput.value;

  // Input validations
  if (!inputPostcodeValue || !huisnummerValue) {
    resetAdresInput();
    if (!inputPostcodeValue) setAdresPlaceholder("Enter your postcode");
    if (!huisnummerValue) setAdresPlaceholder("Enter your house number");
    return;
  }

  // Fetch request
  try {
    const response = await fetch(
      `${BASE_URL}?postcode=${inputPostcodeValue}&number=${huisnummerValue}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    // Throw error for non-OK responses
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    // Extracting address data
    const { street, number, postcode, city } = await response.json();
    const addressText = `${street} ${number}, ${postcode}, ${city}`;

    // Setting up and triggering address field
    adresInput.value = addressText;
    setAdresPlaceholder("");
    adresInput.dispatchEvent(new Event("input"));

    // Update the address display
    updateAddressDisplay(addressText);
  } catch (error) {
    // Error handling
    console.error("Error fetching data:", error);
    resetAdresInput();
    setAdresPlaceholder("Address not found. Please enter manually.");
    adresInput.readOnly = false;
  }
};

// Postcode input event listener
inputPostcode.addEventListener("input", async () => {
  const inputPostcodeValue = inputPostcode.value;
  if (!isValidPostcode(inputPostcodeValue)) {
    setAdresPlaceholder("Please enter the postcode in the following format: 1111AA");
    resetAdresInput();
  } else {
    setAdresPlaceholder("");
    huisnummerInput.value = "";
    await fetchData();
  }
});

// House number input event listener
huisnummerInput.addEventListener("input", debounce(fetchData, 500));

// Postcode focus event listener
inputPostcode.addEventListener("focus", () =>
  setAdresPlaceholder(defaultAdresPlaceholder)
);

// Section 4: Dropdown Change Event Handling

// Select the dropdown and the input field by their IDs
const dropdownMenu = document.querySelector("#wtw-unit-locatie");
const inputField = document.querySelector("#wtw-unit-anders");

// Define the event handler for the dropdown change
const handleDropdownChange = () => {
  if (dropdownMenu.value === "Anders") {
    // If the selected option is "Anders", show the input field
    inputField.style.display = "block";
  } else {
    // Otherwise, hide the input field and clear the input value
    inputField.style.display = "none";
    inputField.value = "";
  }
};

// Attach the event handler to the dropdown's change event
dropdownMenu.addEventListener("change", handleDropdownChange);

// Hide the input field on page load
inputField.style.display = "none";

// Section 5: Wireless Control Selection

// Select the dropdown and the input field by their IDs
const wirelessControl = document.querySelector("#draadloze-bediening");
const wirelessControlQuantity = document.querySelector("#draadloze-bediening-aantal");

// Define the event handler for the dropdown change
const handleWirelessControlChange = () => {
  if (wirelessControl.value === "Ja") {
    // If the selected option is "Ja", show the input field
    wirelessControlQuantity.style.display = "block";
  } else {
    // Otherwise, hide the input field and clear its value
    wirelessControlQuantity.style.display = "none";
    wirelessControlQuantity.value = "";
  }
};

// Attach the event handler to the dropdown's change event
wirelessControl.addEventListener("change", handleWirelessControlChange);

// Hide the input field on page load
wirelessControlQuantity.style.display = "none";


// Section 6: Delivery Time Calculation Based on Checked Boxes

// Select the checkbox container, message elements, and lottie container
const checkboxContainer = document.querySelector(".checkbox-container");
const messageElements = document.querySelectorAll(".message, [data-show='levertijd']");
const lottieContainer = document.querySelector("#lottie-container");

// Save the original message text
const originalMessage = messageElements[0].textContent;
// Initialize the delivery time state
let isOneWeek = originalMessage === "Maximale wachttijd: 1 week";
// Count the number of checked boxes
let numChecked = checkboxContainer.querySelectorAll(":checked").length;

// Define the delivery time calculation function
function calculateDeliveryTime(numChecked) {
  if (numChecked >= 5) return "1 week";
  if (numChecked >= 3) return "2 weken";
  if (numChecked > 0) return "3 weken";
  return null;
}

// Define the message update function
function updateMessage(deliveryTime) {
  const messageText = deliveryTime
    ? `Maximale wachttijd: ${deliveryTime}`
    : originalMessage;
  messageElements.forEach((element) => (element.textContent = messageText));
}

// Add a change event listener to the checkbox container
checkboxContainer.addEventListener("change", function (event) {
  numChecked += event.target.checked ? 1 : -1;
  const deliveryTime = calculateDeliveryTime(numChecked);
  const isDeliveryTimeOneWeek = deliveryTime === "1 week";

  updateMessage(deliveryTime);

  if (isDeliveryTimeOneWeek !== isOneWeek) {
    lottieContainer.click();
    isOneWeek = isDeliveryTimeOneWeek;
  }
});
