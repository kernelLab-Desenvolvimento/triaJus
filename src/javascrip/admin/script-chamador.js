const RSS_FEEDS = [
    'https://g1.globo.com/rss/g1/politica/',
    'https://g1.globo.com/rss/g1/mundo/',
];

let allNews = [];
let currentIndex = 0;

async function loadNews() {
    let items = [];

    for (const feed of RSS_FEEDS) {
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`
        const res = await fetch(url);
        const data = await res.json();
        if (data.items) {
            items.push(...data.items.slice(0, 5).map(i => ({
                title: i.title,
                img: i.thumbnail || i.enclosure?.link || ''
            })));
        }
    }

    allNews = items;
}

function showNext() {
    if (!allNews.length) return;
    const news = allNews[currentIndex % allNews.length];
    currentIndex++;

    const ticker = document.getElementById('ticker-title');
    const img = document.getElementById('ticker-img');

    ticker.textContent = news.title;
    if (news.img) {
        img.src = news.img;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }

    // reinicia animação
    ticker.style.animation = 'none';
    ticker.offsetHeight; // reflow
    ticker.style.animation = 'ticker 20s linear';
}

setInterval(loadNews, 10 * 60 * 1000);
setInterval(showNext, 21000); // troca notícia a cada 21s
loadNews().then(showNext);