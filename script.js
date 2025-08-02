const apiKey = "2f286c1df321d399a57b975ea3848251";

// Function to get emoji icon based on weather condition
function getIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️"
  };
  return icons[condition] || "🌡️";
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherBox = document.getElementById("weatherResult");
  const outfitBox = document.getElementById("outfitSuggestion");

  if (!city) {
    alert("Please enter a city name.");
    weatherBox.classList.add("hidden");
    outfitBox.classList.add("hidden");
    return;
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found. Please try again.");
      weatherBox.classList.add("hidden");
      outfitBox.classList.add("hidden");
      return;
    }

    const condition = data.weather[0].main;
    const temp = data.main.temp;
    const location = data.name;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const icon = getIcon(condition);

    weatherBox.innerHTML = `
      <h3>🌍 ${location}</h3>
      <p><strong>Condition:</strong> ${icon} ${condition}</p>
      <p><strong>Temperature:</strong> ${temp.toFixed(2)}°C</p>
      <p><strong>Time:</strong> ${timeString}</p>
    `;

    let good = [], bad = [];

    if (condition === "Clear") {
      good = ["T-shirt", "Shorts", "Sunglasses", "Cap"];
      bad = ["Woolen clothes", "Jackets"];
    } else if (condition === "Clouds") {
      good = ["Light shirt", "Jeans", "Sneakers", "Layered clothing"];
      bad = ["Woolen clothes", "Heavy jackets"];
    } else if (condition === "Rain") {
      good = ["Raincoat", "Waterproof shoes", "Umbrella"];
      bad = ["Sandals", "Cotton wear"];
    } else if (condition === "Snow") {
      good = ["Woolen jacket", "Boots", "Gloves", "Thermals"];
      bad = ["Light clothing"];
    } else if (condition === "Thunderstorm") {
      good = ["Waterproof coat", "Sturdy shoes"];
      bad = ["Light shoes", "Umbrella"];
    } else {
      good = ["Comfortable clothing", "Sneakers"];
      bad = ["Extremes (too heavy or too light)"];
    }

    outfitBox.innerHTML = `
      <h3>✅ Wear:</h3>
      <ul class="outfit-list">
        ${good.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <h3>❌ Avoid:</h3>
      <ul class="outfit-list bad">
        ${bad.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `;

    // Store latest suggestion for sharing
    window.latestSuggestion = `
🌦 SkyStyle Suggestion

🌍 ${location}

Condition: ${icon} ${condition}

Temperature: ${temp.toFixed(2)}°C

Time: ${timeString}

✅ Wear:
${good.join("\n")}

❌ Avoid:
${bad.join("\n")}
    `.trim();

    weatherBox.classList.remove("hidden");
    outfitBox.classList.remove("hidden");

  } catch (error) {
    alert("Error fetching weather data.");
    console.error(error);
    weatherBox.classList.add("hidden");
    outfitBox.classList.add("hidden");
  }
}

// Share button function
function shareSuggestion() {
  if (!window.latestSuggestion) {
    alert("Please fetch the weather first.");
    return;
  }

  const shareData = {
    title: "SkyStyle Suggestion",
    text: window.latestSuggestion
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log("Shared successfully!"))
      .catch((error) => alert("Sharing cancelled or failed."));
  } else {
    alert("Sharing not supported on this device. Please copy manually.");
  }
}
