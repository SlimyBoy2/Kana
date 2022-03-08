const hiragana = {
    a: { a: "あ", i: "い", u: "う", e: "え", o: "お" },
    ka: { ka: [["ka", "か"], ["ga", "が"]], ki: [["ki", "き"], ["gi", "ぎ"]], ku: [["ku", "く"], ["gu", "ぐ"]], ke: [["ke", "け"], ["ge", "げ"]], ko: [["ko", "こ"], ["go", "ご"]] },
    sa: { sa: [["sa", "さ"], ["za", "ざ"]], shi: [["shi", "し"], ["ji", "じ"]], su: [["su", "す"], ["zu", "ず"]], se: [["se", "せ"], ["ze", "ぜ"]], so: [["so", "そ"], ["zo", "ぞ"]] },
    ta: { ta: [["ta", "た"], ["da", "だ"]], chi: [["chi", "ち"], ["ji", "ぢ"]], tsu: [["tsu", "つ"], ["zu", "づ"]], te: [["te", "て"], ["de", "で"]], to: [["to", "と"], ["do", "ど"]] },
    na: { na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の" },
    ha: { ha: [["ha", "は"], ["ba", "ば"], ["pa", "ぱ"]], hi: [["hi", "ひ"], ["bi", "び"], ["pi", "ぴ"]], fu: [["fu", "ふ"], ["bu", "ぶ"], ["pu", "ぷ"]], he: [["he", "へ"], ["be", "べ"], ["pe", "ぺ"]], ho: [["ho", "ほ"], ["bo", "ぼ"], ["po", "ぽ"]] },
    ma: { ma: "ま", mi: "み", mu: "む", me: "め", mo: "も" },
    ya: { ya: "や", yu: "ゆ", yo: "よ" },
    ra: { ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ" },
    wa: { wa: "わ", wo: "を" },
    n: { n: "ん" },
};

const katakana = {
    A: { A: "ア", I: "イ", U: "ウ", E: "エ", O: "オ" },
    KA: { KA: [["KA", "カ"], ["GA", "ガ"]], KI: [["KI", "キ"], ["GI", "ギ"]], KU: [["KU", "ク"], ["GU", "グ"]], KE: [["KE", "ケ"], ["GE", "ゲ"]], KO: [["KO", "コ"], ["GO", "ゴ"]] },
    SA: { SA: [["SA", "サ"], ["ZA", "ザ"],], SHI: [["SHI", "シ"], ["JI", "ジ"],], SU: [["SU", "ス"], ["ZU", "ズ"],], SE: [["SE", "セ"], ["ZE", "ゼ"],], SO: [["SO", "ソ"], ["ZO", "ゾ"],] },
    TA: { TA: [["TA", "タ"], ["DA", "ダ"]], CHI: [["CHI", "チ"], ["JI", "ヂ"]], TSU: [["TSU", "ツ"], ["JU", "ヅ"]], TE: [["TE", "テ"], ["DE", "デ"]], TO: [["TO", "ト"], ["DO", "ド"]] },
    NA: { NA: "ナ", NI: "ニ", NU: "ヌ", NE: "ネ", NO: "ノ" },
    HA: { HA: [["HA", "ハ"], ["BA", "バ"], ["PA", "パ"]], HI: [["HI", "ヒ"], ["BI", "ビ"], ["PI", "ピ"]], FU: [["FU", "フ"], ["BU", "ブ"], ["PU", "プ"]], HE: [["HE", "ヘ"], ["BE", "ベ"], ["PE", "ペ"]], HO: [["HO", "ホ"], ["BO", "ボ"], ["PO", "ポ"]] },
    MA: { MA: "マ", MI: "ミ", MU: "ム", ME: "メ", MO: "モ" },
    YA: { YA: "ヤ", YU: "ユ", YO: "ヨ" },
    RA: { RA: "ラ", RI: "リ", RU: "ル", RE: "レ", RO: "ロ" },
    WA: { WA: "ワ", WO: "ヲ" },
    N: { N: "ン" },
};

let right = 0;
let wrong = 0;

let last;
let current;

let currentList = (() => {
    const list = JSON.parse(localStorage.getItem("list"));
    if (!list || typeof list != "object") return {};
    return list;
})();

let useAccents = JSON.parse(localStorage.getItem("accents")) ?? false;

checkAllBoxes();

start();

function start() {

    checkStart();

    current = getRandomKana();
    console.log(current);
    document.getElementsByClassName("kana")[0].textContent = current[1];
    document.getElementsByClassName("score")[0].textContent = `🟢 ${right} | ${wrong} 🔴`;
    document.getElementById("input").value = "";
}

function onButtonClick(box) {
    const id = box.id;

    if (id == "Accents") {
        useAccents = !useAccents;
        setItem(2);
        return;
    }

    if (currentList[id]) return removeFromList(id);
    const kanaList = getKanaList(id);

    addToList(id, kanaList[id]);
}

function onSubmit() {

    const input = (() => {
        const rawInput = document.getElementById("input").value;
        if (!rawInput || typeof rawInput != "string") return null;

        // Si c'est un hiragana, on met son input en minuscule, sinon en majuscule
        if (current[0] == current[0].toLowerCase()) return rawInput.toLowerCase();
        return rawInput.toUpperCase();
    })();

    if (!input) return;

    if (input == current[0]) {
        right++;
        return start();
    }

    const goodKanas = isValidInput(input);
    if (!goodKanas) return alert("Le son donné n'est pas valide");

    alert(`La réponse était: ${current[0]}\nLe son ${input} correspond à ${goodKanas.join(" | ")}`);
    wrong++;

    start();
}

function isValidInput(input) {

    const kanaList = getKanaList(input);

    const goodKanas = [];

    // Check toutes les entrées de la liste et donner les kana valides pour le son donné

    for (const [, listOfKana] of Object.entries(kanaList)) {
        for (const kana of Object.entries(listOfKana)) {

            if (typeof kana[1] == "string") {
                if (kana[0] == input) goodKanas.push(kana[1]);
                continue;
            }

            for (const kanaWithAccent of kana[1]) {
                if (kanaWithAccent[0] == input) goodKanas.push(kanaWithAccent[1]);
            }
        }
    }

    if (!goodKanas.length) return null;

    return goodKanas;
}

function getRandomKana() {
    const list = [];

    for (const [, listOfKana] of Object.entries(currentList)) {
        for (const kana of Object.entries(listOfKana)) {


            if (typeof kana[1] == "string") {
                list.push(kana);
                continue;
            }

            // Ne pas mettre les accents s'ils ne sont pas cochés
            if (!useAccents) {
                list.push(kana[1][0]);
                continue;
            }

            // [["ka", "か"], ["ga", "が"]]

            for (const kanaWithAccent of kana[1]) {
                list.push(kanaWithAccent);
            }
        }
    }

    const num = getRandomNumber(list.length);
    const data = list[num]; // ["a", "あ"]
    return data;
}

function getRandomNumber(len) {
    let num = Math.floor(Math.random() * len);

    // Check if len > 1 because of ん
    if (num == last && len > 1) return getRandomNumber(len);
    last = num;
    return num;
}

function checkStart() {
    const boxes = document.getElementsByClassName("box");
    const list = {};
    let checked = false;

    for (let i = 0; i < boxes.length; i++) {
        const element = boxes[i];
        const id = element.id;

        if (!element.checked || id == "Accents") continue;

        list[id] = getKanaList(id)[id];
        if (!checked) checked = true;
    }

    currentList = list;

    if (!checked) {
        boxes[0].checked = true;
        return addToList("a", hiragana.a);
    }

    if (localStorage.getItem("list") != JSON.stringify(currentList)) setItem();
}

function addToList(id, kana) {
    currentList[id] = kana;
    setItem();
}

function removeFromList(id) {
    delete currentList[id];
    setItem();
}

/**
 * tout - les deux
 * 1 - list
 * 2 - accents
 */
function setItem(type = 0) {
    try {
        if (type == 0 || type == 1) localStorage.setItem("list", JSON.stringify(currentList));
        if (type == 0 || type == 2) localStorage.setItem("accents", useAccents);
    } catch (error) {
        localStorage.clear();
        alert("Impossible de sauvegarder");
    }
}

function checkAllBoxes() {
    const boxes = document.getElementsByClassName("box");

    for (const box of boxes) {

        if (box.id == "Accents") {
            box.checked = useAccents;
            continue;
        }

        box.checked = !!currentList[box.id];
    }
}

function reset() {
    localStorage.clear();
    currentList = {};
    right = 0;
    wrong = 0;
    checkAllBoxes();
    start();
}

function getKanaList(sound) {
    return sound == sound.toLowerCase() ? hiragana : katakana;
}