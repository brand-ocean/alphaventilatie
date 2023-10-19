document.addEventListener("DOMContentLoaded", function() {

  // Function to handle logic for MV radio buttons
  function handleMVRadioButtons(name) {
    const radioButtonsMV = document.querySelectorAll(`input[type="radio"][name="${name}"][price]`);
    const priceDisplayMV = document.querySelector('[data-field="pakketprijs"]');

    // Set the initial price for MV based on the checked radio button
    radioButtonsMV.forEach(function(radioButton) {
      if (radioButton.checked) {
        const selectedPrice = radioButton.getAttribute('price');
        priceDisplayMV.textContent = selectedPrice;
      }
    });

    // Add an event listener to the radio buttons for MV
    radioButtonsMV.forEach(function(radioButton) {
      radioButton.addEventListener("change", function() {
        const selectedPrice = this.getAttribute('price');
        priceDisplayMV.textContent = selectedPrice;
      });
    });
  }

  // Handle the radio buttons for both names
  handleMVRadioButtons("pakket_mv-vervangen");
  handleMVRadioButtons("pakket_mv-onderhoud");
  handleMVRadioButtons("pakket_wtw-onderhoud");

  const radioButtonsGarantie = document.querySelectorAll('input[type="radio"][name="pakket_garantie"][price]');
  const priceDisplayGarantie = document.querySelector('[data-field="garantieprijs"]');

  // Add an event listener to the radio buttons for "pakket_garantie"
  radioButtonsGarantie.forEach(function(radioButton) {
    radioButton.addEventListener("change", function() {
      const selectedPrice = this.getAttribute('price');
      priceDisplayGarantie.textContent = selectedPrice;
    });
  });

  const wirelessInput = document.querySelector('[data-input="wireless"]');
  const priceDisplayWireless = document.querySelector('[data-field="wireless"]');

  wirelessInput.addEventListener("input", function() {
    const inputValue = parseInt(wirelessInput.value, 10);
    
    if (!isNaN(inputValue)) {
      const calculatedPrice = inputValue * 70;
      priceDisplayWireless.textContent = '€' + calculatedPrice;
    } else {
      priceDisplayWireless.textContent = '';
    }
  });
});



const checkboxContainer = document.querySelector(".checkbox-container");
const messageElements = document.querySelectorAll(".message, [data-show='levertijd']");
const lottieContainer = document.querySelector("#lottie-container");

const originalMessage = messageElements[0].textContent;
let isOneWeek = originalMessage === "Maximale wachttijd: 1 week";
let numChecked = checkboxContainer.querySelectorAll(":checked").length;

function calculateDeliveryTime(numChecked) {
  if (numChecked >= 5) return "1 week";
  if (numChecked >= 3) return "2 weken";
  if (numChecked > 0) return "3 weken";
  return null;
}

function updateMessage(deliveryTime) {
  const messageText = deliveryTime ? `Maximale wachttijd: ${deliveryTime}` : originalMessage;
  messageElements.forEach((element) => (element.textContent = messageText));
}

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

const tel2Check = document.getElementById("tel2check");
const partnerWrapper = document.getElementById("telefoon-partner-wrapper");

if (partnerWrapper) {
  partnerWrapper.classList.add("hide");
  tel2Check.addEventListener("change", () => {
    partnerWrapper.classList.toggle("hide", !tel2Check.checked);
  });
}

const apiKey = "5fc62e9e-78b3-4d27-bfa6-6d12ed8bf8ee";
const BASE_URL = "https://postcode.tech/api/v1/postcode/full";

const inputPostcode = document.querySelector("#postcode");
const huisnummerInput = document.querySelector("#huisnummer");
const adresInput = document.querySelector("#adres");
const addressDisplay = document.querySelector("[data-input='adres']");
const defaultAdresPlaceholder = adresInput.placeholder;

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    setAdresPlaceholder("Zoeken...");
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const isValidPostcode = (postcode) => /^[0-9]{4}[a-zA-Z]{2}$/.test(postcode);
const setAdresPlaceholder = (text) => (adresInput.placeholder = text);
const resetAdresInput = () => (adresInput.value = "");
const updateAddressDisplay = (address) => (addressDisplay.innerText = address);

const getAddress = async (postcode, number) => {
  const response = await fetch(`${BASE_URL}?postcode=${postcode}&number=${number}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) throw new Error(`HTTP error ${response.status}`);

  return response.json();
};

const fetchData = async () => {
  const inputPostcodeValue = inputPostcode.value;
  const huisnummerValue = huisnummerInput.value;

  const baseNumberMatch = huisnummerValue.match(/^(\d+)/);
  const baseNumber = baseNumberMatch ? baseNumberMatch[0] : null;

  const addition = huisnummerValue.replace(baseNumber, '').trim();

  if (!inputPostcodeValue || !baseNumber) {
    resetAdresInput();
    setAdresPlaceholder(!inputPostcodeValue ? "Vul je postcode in" : "Vul je huisnummer in");
    return;
  }

  try {
    const { street, number, postcode, city } = await getAddress(inputPostcodeValue, baseNumber);
    
    const fullNumber = addition ? `${number}${addition}` : number;
    const addressText = `${street} ${fullNumber}, ${postcode}, ${city}`;

    adresInput.value = addressText;
    setAdresPlaceholder("");
    adresInput.dispatchEvent(new Event("input"));
    updateAddressDisplay(addressText);
  } catch (error) {
    console.error("Error fetching data:", error);
    resetAdresInput();
    setAdresPlaceholder("Adres niet gevonden. Voer handmatig in.");
    adresInput.readOnly = false;
  }
};

inputPostcode.addEventListener("input", async () => {
  const inputPostcodeValue = inputPostcode.value;

  if (!isValidPostcode(inputPostcodeValue)) {
    setAdresPlaceholder("Vul je postcode op de volgende manier in: 1111AA");
    resetAdresInput();
  } else {
    setAdresPlaceholder("");
    huisnummerInput.value = "";
    await fetchData();
  }
});

huisnummerInput.addEventListener("input", debounce(fetchData, 500));
inputPostcode.addEventListener("focus", () =>
  setAdresPlaceholder(defaultAdresPlaceholder)
);

const handleDropdownChange = (dropdown, inputField, targetValue) => {
  if (dropdown.value === targetValue) {
    inputField.classList.remove("hide");
  } else {
    inputField.classList.add("hide");
    inputField.value = "";
  }
};

const dropdownMenu = document.querySelector("#wtw-unit-locatie");
const inputField = document.querySelector("#wtw-unit-anders");
const wirelessControl = document.querySelector("#draadloze-bediening");
const wirelessControlQuantity = document.querySelector("#draadloze-bediening-aantal");

dropdownMenu.addEventListener("change", () =>
  handleDropdownChange(dropdownMenu, inputField, "Anders")
);
wirelessControl.addEventListener("change", () =>
  handleDropdownChange(wirelessControl, wirelessControlQuantity, "Ja")
);

inputField.classList.add("hide");
wirelessControlQuantity.classList.add("hide");


const buttons = Array.from(
  document.querySelectorAll('[data-form="next-btn"], [scroll-up="true"]')
);

buttons.forEach((button) =>
  button.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  )
);
