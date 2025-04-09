// Populate countries and cities dynamically
function populateCountries() {
    const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Poland']; // Added more countries
    const countrySelect = document.getElementById('countrySelect');
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  
    // Add event listener to populate cities based on country
    countrySelect.addEventListener('change', populateCities);
}

  
  function populateCities() {
    const country = document.getElementById('countrySelect').value;
    const cities = getCitiesForCountry(country);
    const citySelect = document.getElementById('citySelect');
    citySelect.innerHTML = '';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
  
  // Dummy function to return cities based on selected country
function getCitiesForCountry(country) {
    const cityMap = {
      'USA': ['New York', 'Los Angeles', 'Chicago'],
      'Canada': ['Toronto', 'Vancouver', 'Montreal'],
      'UK': ['London', 'Manchester', 'Birmingham'],
      'Germany': ['Berlin', 'Munich', 'Hamburg'],
      'France': ['Paris', 'Lyon', 'Marseille'],
      'Italy': ['Rome', 'Milan', 'Florence'],
      'Spain': ['Madrid', 'Barcelona', 'Seville'],
      'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague'],
      'Sweden': ['Stockholm', 'Gothenburg', 'Malmo'],
      'Poland': ['Warsaw', 'Krakow', 'Wroclaw']
    };
    return cityMap[country] || [];
}

  // Fetch weather data
  document.getElementById('weatherBtn').addEventListener('click', function() {
    const city = document.getElementById('citySelect').value;
    if (!city) return alert('Please select a city!');
    
    // Call the weather API and display results
    fetchWeatherData(city);
  });
  
  // Geolocation Weather
  document.getElementById('geolocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherDataByCoordinates(lat, lon);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
  
  // Fetch weather data using city
  function fetchWeatherData(city) {
    const apiKey = '4284c9e5caf7fc1317b4af603c11d0d1'; // Replace with your OpenWeatherMap API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        displayWeather(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }
  
  // Fetch weather data using geolocation
  function fetchWeatherDataByCoordinates(lat, lon) {
    const apiKey = '4284c9e5caf7fc1317b4af603c11d0d1'; // Replace with your OpenWeatherMap API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        displayWeather(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }
  
  // Display weather data
  function displayWeather(data) {
    const weatherResults = document.getElementById('weatherResults');
    weatherResults.innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
      <p>${data.weather[0].description}</p>
      <p>🌡 ${Math.round(data.main.temp)}°C</p>
    `;
    const recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = `<p>💡 ${getRecommendation(data.weather[0].main)}</p>`;
  }
  
// Get activity recommendation based on weather and temperature
function getRecommendation(weather, temperature, timeOfDay) {
    console.log(`Weather: ${weather}, Temperature: ${temperature}, Time of Day: ${timeOfDay}`);

    let activity = "";

    // General recommendation based on weather condition
    switch (weather) {
        case 'Clear':
            activity = "Perfect day for outdoor activities! 🏞️";
            break;
        case 'Rain':
            activity = "A cozy day for indoor activities! ☔";
            break;
        case 'Thunderstorm':
            activity = "Stay safe indoors during the storm! ⚡";
            break;
        case 'Snow':
            activity = "Great day for skiing or building a snowman! ❄️";
            break;
        case 'Drizzle':
            activity = "Light rain, perfect for a relaxing walk with an umbrella! 🌧️";
            break;
        case 'Clouds':
            activity = "Great day for a walk outside! 🌥️";
            break;
        default:
            activity = "Check the weather for the best activity options! 🧐";
    }

    // Adjust recommendation based on temperature
    if (temperature <= 5) {
        activity = "It's quite cold outside! A warm drink and a blanket might be a good idea. 🧣☕";
    } else if (temperature > 5 && temperature <= 15) {
        activity += " It's a bit chilly, so dress warmly if you go outside! 🧥";
    } else if (temperature > 15 && temperature <= 30) {
        activity += " The weather is mild, perfect for a nice walk or outdoor sports. 🌞";
    } else if (temperature > 30) {
        activity += " It's hot! Stay cool with some indoor activities or by the pool. 🏖️";
    }

    // Time of day consideration
    if (timeOfDay === 'evening') {
        activity += " How about watching a movie or reading a book to wind down? 🎬📚";
    } else if (timeOfDay === 'morning') {
        activity += " A perfect time for a morning jog or coffee outside. ☕🏃‍♂️";
    }

    return activity;
}

// Example function to fetch weather data and update the recommendation
function fetchWeatherData(city) {
    const apiKey = '4284c9e5caf7fc1317b4af603c11d0d1'; // Replace with your OpenWeatherMap API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const weather = data.weather[0].main; // Weather condition (e.g., 'Clear', 'Rain')
            const temperature = data.main.temp; // Temperature in Celsius
            const timeOfDay = getTimeOfDay(); // Function to determine whether it's 'morning' or 'evening'

            const recommendation = getRecommendation(weather, temperature, timeOfDay);
            displayWeather(data, recommendation);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to determine the time of day
function getTimeOfDay() {
    const hours = new Date().getHours();
    if (hours < 12) {
        return 'morning';
    } else if (hours >= 12 && hours < 18) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}

// Function to display the weather and recommendation
function displayWeather(data, recommendation) {
    const weatherResults = document.getElementById('weatherResults');
    weatherResults.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p>${data.weather[0].description}</p>
        <p>🌡 ${Math.round(data.main.temp)}°C</p>
    `;
    const recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = `<p>💡 ${recommendation}</p>`;
}


  // Handle task addition
  document.getElementById('addTaskBtn').addEventListener('click', function() {
    const planDate = document.getElementById('planDate').value;
    const planText = document.getElementById('planText').value;
    const taskCategory = document.getElementById('taskCategory').value;
  
    if (!planText || !planDate) {
      return alert('Please fill out all fields!');
    }
  
    const task = {
      date: planDate,
      text: planText,
      category: taskCategory,
    };
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    renderTasks();
  });
  
  // Render tasks
  function renderTasks() {
    const planList = document.getElementById('planList');
    planList.innerHTML = '';
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.classList.add('task-entry');
      li.innerHTML = `
        <h4>${task.date}</h4>
        <p>${task.text}</p>
        <p class="task-category">${task.category}</p>
        <button class="delete-task" onclick="deleteTask('${task.text}')">Delete 🗑️</button>
      `;
      planList.appendChild(li);
    });
  }
  
  // Delete task
  function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    renderTasks();
  }
  
  // Filter tasks by category
  function filterTasks() {
    const filterValue = document.getElementById('categoryFilter').value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => !filterValue || task.category === filterValue);
    
    renderFilteredTasks(filteredTasks);
  }
  
  // Render filtered tasks
  function renderFilteredTasks(tasks) {
    const planList = document.getElementById('planList');
    planList.innerHTML = '';
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.classList.add('task-entry');
      li.innerHTML = `
        <h4>${task.date}</h4>
        <p>${task.text}</p>
        <p class="task-category">${task.category}</p>
        <button class="delete-task" onclick="deleteTask('${task.text}')">Delete 🗑️</button>
      `;
      planList.appendChild(li);
    });
  }
  








  
  // Initialize
  populateCountries();
  renderTasks();
  