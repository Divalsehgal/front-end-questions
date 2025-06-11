const tableBody = document.querySelector("tbody");
const url = "https://swapi.dev/api/planets/1/"; // This is unused in the current version

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const cachedResponse = async (url) => {
    const cached = localStorage.getItem(url);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
            return data;
        }
    }

    const res = await fetch(url);
    const data = await res.json();
    localStorage.setItem(url, JSON.stringify({ timestamp: Date.now(), data }));
    return data;
};


const fetchStarWarsData = async () => {
    const res = await fetch("https://swapi.dev/api/people");
    const result = await res.json();
    const finalResult = result.results || [];

    if (finalResult.length > 0) {
        // Fetch films for each person
        const filmPromises = finalResult.map(async (f) =>
            // Promise.all(f.films.map((ff) => fetch(ff).then((res) => res.json())))
            Promise.all(f.films.map((ff) => cachedResponse(ff)))
        );

        const filmResult = await Promise.all(filmPromises); // Wait for all film data

        finalResult.forEach((item, index) => {
            // Create a table row for each person
            const tr = document.createElement("tr");

            // Create a cell for the person's name
            const tdName = document.createElement("td");
            tdName.textContent = `${item.name}`;
            tr.appendChild(tdName);

            // Create a cell for the films related to this person
            const tdFilms = document.createElement("td");
            const films = filmResult[index];

            films.forEach((film) => {
                const span = document.createElement("span");
                span.textContent = `${film.title},`; // Display film title
                tdFilms.appendChild(span);
            });

            // Append the films cell to the row
            tr.appendChild(tdFilms);

            // Append the row to the table body
            tableBody.appendChild(tr);
        });
    }
};

fetchStarWarsData();
