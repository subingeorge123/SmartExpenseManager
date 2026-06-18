import axios from "axios";

const BACKEND_API = "https://your-backend-api.com/expenses";

const IMAGE_API =
  "http://image-compression-api.us-east-1.elasticbeanstalk.com/compress";

const CURRENCY_API_KEY = "fca_live_6RKtxc6pn8PBWAs4Q08Sc1qnGTAIjEmQVkw1gsIy";
const CURRENCY_API_URL = "https://api.freecurrencyapi.com/v1/latest";
const TRAVEL_API_URL =
  "https://p0qyqh56t8.execute-api.us-east-1.amazonaws.com/dev/plan-trip";

export const compressImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    console.log("Sending request with file:", file.name);

    const response = await fetch(IMAGE_API, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Compression failed");
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("JSON response:", data);
      return {
        compressedImageUrl: data.image || data.url,
        filename: data.filename,
        blob: null,
      };
    } else {
      const blob = await response.blob();
      console.log("Received blob:", blob);

      const compressedImageUrl = URL.createObjectURL(blob);
      console.log("Created blob URL:", compressedImageUrl);

      return {
        compressedImageUrl,
        blob,
        filename: file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg",
      };
    }
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export const convertToEuro = async (amount, fromCurrency) => {
  try {
    const response = await axios.get(CURRENCY_API_URL, {
      params: {
        apikey: CURRENCY_API_KEY,
        base_currency: "EUR",
        currencies: fromCurrency,
      },
    });

    console.log("Currency API Response:", response.data);
    const rate = response.data.data[fromCurrency];

    if (!rate) {
      throw new Error(`Currency ${fromCurrency} not found`);
    }

    const convertedAmount = (parseFloat(amount) / rate).toFixed(2);

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount,
      convertedCurrency: "EUR",
      exchangeRate: rate,
      timestamp: new Date().toISOString(),
      apiSource: "FreeCurrencyAPI",
    };
  } catch (error) {
    console.error("Currency conversion error:", error);

    const fallbackRates = {
      USD: 1.09,
      GBP: 0.85,
      INR: 89.5,
      JPY: 158.5,
      CAD: 1.45,
      AUD: 1.62,
      CHF: 0.96,
      CNY: 7.85,
      EUR: 1.0,
    };

    const rate = fallbackRates[fromCurrency] || 1.0;
    const convertedAmount = (parseFloat(amount) / rate).toFixed(2);

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount,
      convertedCurrency: "EUR",
      exchangeRate: rate,
      timestamp: new Date().toISOString(),
      note: "Used fallback rate - API unavailable",
      apiSource: "Fallback",
    };
  }
};

export const getAvailableCurrencies = async () => {
  try {
    const response = await axios.get(CURRENCY_API_URL, {
      params: {
        apikey: CURRENCY_API_KEY,
        base_currency: "EUR",
      },
    });

    const currencies = Object.keys(response.data.data).map((code) => ({
      code,
      name: getCurrencyName(code),
    }));

    return currencies.sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return [
      { code: "EUR", name: "Euro" },
      { code: "USD", name: "US Dollar" },
      { code: "GBP", name: "British Pound" },
      { code: "INR", name: "Indian Rupee" },
      { code: "JPY", name: "Japanese Yen" },
      { code: "CAD", name: "Canadian Dollar" },
      { code: "AUD", name: "Australian Dollar" },
      { code: "CHF", name: "Swiss Franc" },
      { code: "CNY", name: "Chinese Yuan" },
      { code: "NZD", name: "New Zealand Dollar" },
    ];
  }
};

const getCurrencyName = (code) => {
  const currencyNames = {
    EUR: "Euro",
    USD: "US Dollar",
    GBP: "British Pound",
    INR: "Indian Rupee",
    JPY: "Japanese Yen",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    NZD: "New Zealand Dollar",
    BGN: "Bulgarian Lev",
    BRL: "Brazilian Real",
    CZK: "Czech Koruna",
    DKK: "Danish Krone",
    HKD: "Hong Kong Dollar",
    HRK: "Croatian Kuna",
    HUF: "Hungarian Forint",
    IDR: "Indonesian Rupiah",
    ILS: "Israeli New Shekel",
    ISK: "Icelandic Króna",
    KRW: "South Korean Won",
    MXN: "Mexican Peso",
    MYR: "Malaysian Ringgit",
    NOK: "Norwegian Krone",
    PHP: "Philippine Peso",
    PLN: "Polish Złoty",
    RON: "Romanian Leu",
    RUB: "Russian Ruble",
    SEK: "Swedish Krona",
    SGD: "Singapore Dollar",
    THB: "Thai Baht",
    TRY: "Turkish Lira",
    ZAR: "South African Rand",
  };

  return currencyNames[code] || code;
};

export const getLocation = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    const { city, region, country_name, country_code, latitude, longitude } =
      response.data;

    return {
      coordinates: { latitude, longitude },
      city: city || region,
      country: country_name,
      countryCode: country_code,
      formatted: `${city || region}, ${country_name}`,
      timestamp: new Date().toISOString(),
      method: "ip",
    };
  } catch (error) {
    console.error("IP location fetch error:", error);
    return {
      formatted: "Location unavailable",
      method: "error",
    };
  }
};

export const submitExpense = async (data) => {
  try {
    let imageData = data.image;

    if (data.imageBlob) {
      imageData = await blobToBase64(data.imageBlob);
    }

    const payload = {
      ...data,
      image: imageData,
      submittedAt: new Date().toISOString(),
    };

    const response = await axios.post(BACKEND_API, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
      message: "Expense submitted successfully!",
    };
  } catch (error) {
    console.error("Submit error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to submit expense",
    );
  }
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const testCurrencyConversion = async () => {
  try {
    // Test with USD to EUR
    const result = await convertToEuro(100, "USD");
    console.log("Test conversion (100 USD to EUR):", result);
    return result;
  } catch (error) {
    console.error("Test failed:", error);
  }
};

export const submitExpenseData = async (data) => {
  try {
    const res = await fetch(
      "http://expense-manager-api.us-east-1.elasticbeanstalk.com/submit-expense",
      {
        method: "POST",
        body: data,
      },
    );

    return res.json();
  } catch (error) {
    console.error("Travel API error:", error);
    throw error;
  }
};

export const getExpenses = async () => {
  const res = await fetch(
    "http://expense-manager-api.us-east-1.elasticbeanstalk.com/expenses",
  );
  return res.json();
};

export const deleteExpense = async (id) => {
  const res = await fetch(
    `http://expense-manager-api.us-east-1.elasticbeanstalk.com/expense/${id}`,
    {
      method: "DELETE",
    },
  );
  return res.json();
};

export const planTrip = async (tripData) => {
  try {
    const res = await fetch(
      "http://expense-manager-api.us-east-1.elasticbeanstalk.com/plan-trip",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      },
    );

    return res.json();
  } catch (error) {
    console.error("Travel API error:", error);
    throw error;
  }
};
export const generateChart = async (chartData) => {
  try {
    const res = await fetch(
      "http://expense-manager-api.us-east-1.elasticbeanstalk.com/generate-chart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartData),
      },
    );

    return res.json();
  } catch (error) {
    console.error("Chart API error:", error);
    throw error;
  }
};
