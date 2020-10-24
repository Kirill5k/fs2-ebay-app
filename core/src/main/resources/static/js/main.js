const from = new Date().toISOString().substring(0, 10) + "T00:00:00Z"

const reject = err => Promise.reject(new Error(err))

const displayStats = stats => {
    const videoGamesStats = document.getElementById("video-games");
    videoGamesStats.querySelectorAll(".badge")[0].innerHTML = stats.total;
    videoGamesStats.querySelectorAll(".badge")[1].innerHTML = stats.unrecognized.total;
    videoGamesStats.querySelectorAll(".badge")[2].innerHTML = stats.profitable.total;
}

const setLastUpdatedTime = lastGame => {
    const dateString = lastGame[0].listingDetails.datePosted;
    const date = new Date(dateString);
    const videoGamesStats = document.getElementById("video-games");
    videoGamesStats.querySelector(".card-footer").innerHTML = `Last updated at ${date.toLocaleTimeString()}`;
}

fetch(`/api/video-games/summary?from=${from}`)
    .then(res => res.status === 200 ? res.json() : reject(`error getting video games stats: ${res.status}`))
    .then(displayStats)
    .catch(err => console.error(err));

fetch('/api/video-games?limit=1')
    .then(res => res.status === 200 ? res.json() : reject(`error getting video game: ${res.status}`))
    .then(setLastUpdatedTime)
    .catch(err => console.error(err));