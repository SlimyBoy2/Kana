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
    WA: { WA: "ワ", WI: "ヰ", WE: "ヱ", WO: "ヲ", },
    N: { N: "ン", },
};

const currentList = {};

let right = 0;
let wrong = 0;

let last;
let current;

function start() {

    checkStart();

    current = getRandomKana();
    console.log(current);
    document.getElementsByClassName("kana")[0].textContent = current[1];
    document.getElementsByClassName("score")[0].textContent = `🟢 ${right} | ${wrong} 🔴`;
    document.getElementById("input").value = "";
}

start();

function onButtonClick(cb) {
    const id = cb.id;
    if (currentList[id]) return delete currentList[id];
    const kanaList = id == id.toLowerCase() ? hiragana : katakana;
    currentList[id] = kanaList[id];
}

function onSubmit() {
    const input = document.getElementById("input").value;
    if (!input) return; // No input was given

    if (input == current[0]) right++;
    else {
        // TODO: Check if the input was a real one or if it was a typo
        alert(`La réponse était: ${current[0]}`);
        wrong++;
    }

    start();
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
    for (let i = 0; i < boxes.length; i++) {
        const element = boxes[i];
        if (element.checked) return;
    }

    boxes[0].checked = true;
    currentList.a = hiragana.a;
}