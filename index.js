document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const runtime = document.getElementById("runtime");
    const showtime = document.getElementById("showtime");
    const availableTickets = document.getElementById("available-tickets");
    const poster = document.getElementById("poster");
    const buyTicketBtn = document.getElementById("buy-ticket");

    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(movies => {
            movies.forEach(movie => addMovieToList(movie));
            displayMovieDetails(movies[0]);
        });

    function addMovieToList(movie) {
        const li = document.createElement("li");
        li.textContent = movie.title;``
        li.dataset.id = movie.id;
        li.classList.add("film", "item");
        li.addEventListener("click", () => displayMovieDetails(movie));
        filmsList.appendChild(li);
    }

    function displayMovieDetails(movie) {
        title.textContent = movie.title;
        description.textContent = movie.description;
        runtime.textContent = `Runtime: ${movie.runtime} minutes`;
        showtime.textContent = `Showtime: ${movie.showtime}`;
        availableTickets.textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;
        poster.src = movie.poster;

        buyTicketBtn.disabled = movie.capacity - movie.tickets_sold === 0;
        buyTicketBtn.textContent = movie.capacity - movie.tickets_sold === 0 ? "Sold Out" : "Buy Ticket";
    }

    buyTicketBtn.addEventListener("click", () => {
        const movieId = document.querySelector(".film.item.selected")?.dataset.id;
        if (!movieId) return;

        fetch(`http://localhost:3000/films${movieId}`)
            .then(response => response.json())
            .then(movie => {
                if (movie.tickets_sold < movie.capacity) {
                    const updatedTicketsSold = movie.tickets_sold + 1;
                    fetch(`http://localhost:3000/films${movieId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tickets_sold: updatedTicketsSold })
                    })
                    .then(() => {
                        availableTickets.textContent = `Available Tickets: ${movie.capacity - updatedTicketsSold}`;
                        if (updatedTicketsSold >= movie.capacity) {
                            buyTicketBtn.textContent = "Sold Out";
                            buyTicketBtn.disabled = true;
                        }
                    });
                }
            });
    });
});
