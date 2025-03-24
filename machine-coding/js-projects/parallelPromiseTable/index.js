const tableBody = document.querySelector("tbody");

async function fetchData() {
    const res = await fetch("https://swapi.dev/api/people");
    const result = await res.json();

    const response = result.results;

    // Collect film URLs
    let filmsUrls = response.map((item) => item.films);

    let vehiclesUrl = response.map((item) => item.vehicles)

    // Step 1: Fetch all films (response objects)
    const filmsPromises = filmsUrls.map((filmList) =>
        Promise.all(filmList.map((url) => fetch(url)))
    );

    const vehiclesPromises = vehiclesUrl.map((vehicleList) => Promise.all(vehicleList.map((url) => fetch(url))))

    // Step 2: Convert responses to JSON
    const filmsData = await Promise.all(
        filmsPromises.map(async (filmPromise) => {
            const responses = await filmPromise; // Wait for fetch promises
            return Promise.all(responses.map(res => res.json())); // Convert responses to JSON
        })
    );

    const vehiclesData = await Promise.all(vehiclesPromises.map(async (promise) => {
        const responses = await promise
        return Promise.all(responses.map(res => res.json()));
    }))

    console.log(filmsData, vehiclesData)

    // Append data to table
    response.forEach((data, index) => {
        const tr = document.createElement("tr");

        // Character name
        const tdName = document.createElement("td");
        tdName.innerHTML = data.name;
        tr.appendChild(tdName);

        // Film names
        const tdFilms = document.createElement("td");
        tdFilms.innerHTML = filmsData[index].map((film) => film.title).join(", ");
        tr.appendChild(tdFilms);

        const tdVehicles = document.createElement("td");
        tdVehicles.innerHTML = vehiclesData[index].map((vehicle) => vehicle.name).join(", ");
        tr.appendChild(tdVehicles);

        tableBody.appendChild(tr);
    });
}

fetchData();
