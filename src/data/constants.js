export const categories = [
    { name: "General Knowledge", id: 9 }, { name: "Entertainment: Books", id: 10 },
    { name: "Entertainment: Film", id: 11 }, { name: "Entertainment: Music", id: 12 },
    { name: "Science & Nature", id: 17 }, { name: "Science: Computers", id: 18 },
    { name: "Sports", id: 21 }, { name: "Geography", id: 22 },
    { name: "History", id: 23 }, { name: "Animals", id: 27 }
];

export const difficulties = [
    { name: "Easy", value: "easy" },
    { name: "Medium", value: "medium" },
    { name: "Hard", value: "hard" },
];

export function decodeHtmlEntities(str) {
    if (!str) return "";
    const entities = {
        "&amp;": "&", "&quot;": '"', "&#039;": "'", "&apos;": "'",
        "&lt;": "<", "&gt;": ">", "&eacute;": "é", "&Eacute;": "É",
    };
    return str.replace(/&amp;|&quot;|&#039;|&apos;|&lt;|&gt;|&eacute;|&Eacute;/g,
        (match) => entities[match] || match);
}