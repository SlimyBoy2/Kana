const hiragana = {
    a: { a: "あ", i: "い", u: "う", e: "え", o: "お", },
    ka: { ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ", },
    sa: { sa: "さ", shi: "し", su: "す", se: "せ", so: "そ", },
    ta: { ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と", },
    na: { na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の", },
    ha: { ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ", },
    ma: { ma: "ま", mi: "み", mu: "む", me: "め", mo: "も", },
    ya: { ya: "や", yu: "ゆ", yo: "よ", },
    ra: { ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ", },
    wa: { wa: "わ", wo: "を", },
    n: { n: "ん", },
};

const katakana = {
    A: { A: "ア", I: "イ", U: "ウ", E: "エ", O: "オ", },
    KA: { KA: "カ", KI: "キ", KU: "ク", KE: "ケ", KO: "コ", },
    SA: { SA: "サ", SHI: "シ", SU: "ス", SE: "セ", SO: "ソ", },
    TA: { TA: "タ", CHI: "チ", TSU: "ツ", TE: "テ", TO: "ト", },
    NA: { NA: "ナ", NI: "ニ", NU: "ヌ", NE: "ネ", NO: "ノ", },
    HA: { HA: "ハ", HI: "ヒ", FU: "フ", HE: "ヘ", HO: "ホ", },
    MA: { MA: "マ", MI: "ミ", MU: "ム", ME: "メ", MO: "モ", },
    YA: { YA: "ヤ", YU: "ユ", YO: "ヨ", },
    RA: { RA: "ラ", RI: "リ", RU: "ル", RE: "レ", RO: "ロ", },
    WA: { WA: "ワ", WO: "ヲ", },
    N: { N: "ン", },
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
    if (currentList[id]) return removeFromList(id);
    const kanaList = id == id.toLowerCase() ? hiragana : katakana;
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

    const goodKana = isValidInput(input);
    if (!goodKana) return alert("Le son donné n'est pas valide");

    console.log(goodKana);
    alert(`La réponse était: ${current[0]}\nLe son ${input} correspond à ${goodKana}`);
    wrong++;

    start();
}

function isValidInput(input) {

    // C'est pas ouf mais ça fonctionne
    const category = (() => {
        const char = input.charAt(0).toLowerCase();

        if (input.length == 1) return char == "n" ? "n" : "a";

        if (char == "c") return "ta";
        if (char == "f") return "ha";

        return `${char}a`;

    })()[current[0] == current[0].toLowerCase() ? "toLowerCase" : "toUpperCase"]();

    return currentList[category]?.[input];
}

function getRandomKana() {
    const list = [];

    for (const [, listOfKana] of Object.entries(currentList)) {
        for (const kana of Object.entries(listOfKana)) {
            list.push(kana);
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
        if (element.checked) {
            list[id] = (id == id.toLowerCase() ? hiragana : katakana)[id];
            if (!checked) checked = true;
        }
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

function setItem(i = 1) {
    if (i == 5) return;
    try {
        localStorage.setItem("list", JSON.stringify(currentList));
    } catch (error) {
        localStorage.clear();
        setItem(i++);
    }
}

function checkAllBoxes() {
    const boxes = document.getElementsByClassName("box");

    for (const box of boxes) {
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