const BASE_URL = "https://drift.durieux.me";
const requestService = new RequestService();

class ApiService {

    //return an array with all the available sites
    getSites() {
        const url = `${BASE_URL}/api/websites`;
        return requestService.getRequest(url)
    }

    getTimes() {
        const url = `${BASE_URL}/api/times`;
        return requestService.getRequest(url)

    }

    getMenu(type) {
        return type == "views" ? viewsMenu : sitesMenu;
    }

    getData(type) {
        const url = `${BASE_URL}/api/sites`;
        return requestService.getRequest(url)
    }

    getSiteScreenshot(site, time, size) {
        return `${BASE_URL}/api/time/${time}/${site}/screenshot.png?&width=${size}&format=jpg`
    }

    getSiteGraph(site, time, size) {
        return `${BASE_URL}/api/time/${time}/${site}/graph.png?&width=${size}&format=jpg`
    }

    getSiteCoverage(site, time, size) {
        return `${BASE_URL}/api/time/${time}/${site}/coverage.png?&width=${size}&format=jpg`
    }

    getSiteNetwork(site, time, size) {
        return `${BASE_URL}/api/time/${time}/${site}/network.png?&width=${size}&format=jpg`
    }

    getSiteProfile(site, time, size) {
        return `${BASE_URL}/api/time/${time}/${site}/profile.png?&width=${size}&format=jpg`
    }

}




const dataTest = {
    value: 0,
    children: [
        {
            name: "bing",
            state: 1,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.bing.png",

        },
        {
            name: "duckduckgo",
            state: 0,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.duckduckgo.png",

        },
        {
            name: "google",
            state: 0,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.google.png",

        },
        {
            name: "qwant",
            state: 0,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.qwant.png",

        },
        {
            name: "spotify",
            state: 1,
            value: 90,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.spotify.png",

        },
        {
            name: "wikipedia",
            state: 0,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.wikipedia.png",

        },
        {
            name: "yahoo",
            state: 0,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.yahoo.png",

        },
        {
            name: "kiddle",
            state: 0,
            value: 1.25,
            image: "https://drift.durieux.me/api/time/1619197200000/google/graph.png?width=300",
            logo: "logo.kiddle.png",

        },
    ]
}
const viewsMenu = [{
    name: "Intro",
    state: 1,
},
{
    name: "Screenshot",
    state: 0,
},
{
    name: "Graph",
    state: 0,
},
{
    name: "Coverage",
    state: 0
},
{
    name: "Network",
    state: 0
},
{
    name: "Profile",
    state: 0
}
]

const sitesMenu = [{
    name: "Intro",
    state: 1,
},
{
    name: "Bing",
    state: 0,
},
{
    name: "Duckduckgo",
    state: 0,
},
{
    name: "Google",
    state: 0
},
{
    name: "Kiddle",
    state: 0
},
{
    name: "Qwant",
    state: 0
},
{
    name: "Spotify",
    state: 0
},
{
    name: "Wikipedia",
    state: 0
},
{
    name: "Yahoo",
    state: 0
}
]