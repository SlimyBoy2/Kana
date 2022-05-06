const hiragana = {
    a: { a: [["a", "あ"]], i: [["i", "い"]], u: [["u", "う"]], e: [["e", "え"]], o: [["o", "お"]] },
    ka: { ka: [["ka", "か"], ["ga", "が"]], ki: [["ki", "き"], ["gi", "ぎ"]], ku: [["ku", "く"], ["gu", "ぐ"]], ke: [["ke", "け"], ["ge", "げ"]], ko: [["ko", "こ"], ["go", "ご"]] },
    sa: { sa: [["sa", "さ"], ["za", "ざ"]], shi: [["shi", "し"], ["ji", "じ"]], su: [["su", "す"], ["zu", "ず"]], se: [["se", "せ"], ["ze", "ぜ"]], so: [["so", "そ"], ["zo", "ぞ"]] },
    ta: { ta: [["ta", "た"], ["da", "だ"]], chi: [["chi", "ち"], ["ji", "ぢ"]], tsu: [["tsu", "つ"], ["zu", "づ"]], te: [["te", "て"], ["de", "で"]], to: [["to", "と"], ["do", "ど"]] },
    na: { na: [["na", "な"]], ni: [["ni", "に"]], nu: [["nu", "ぬ"]], ne: [["ne", "ね"]], no: [["no", "の"]] },
    ha: { ha: [["ha", "は"], ["ba", "ば"], ["pa", "ぱ"]], hi: [["hi", "ひ"], ["bi", "び"], ["pi", "ぴ"]], fu: [["fu", "ふ"], ["bu", "ぶ"], ["pu", "ぷ"]], he: [["he", "へ"], ["be", "べ"], ["pe", "ぺ"]], ho: [["ho", "ほ"], ["bo", "ぼ"], ["po", "ぽ"]] },
    ma: { ma: [["ma", "ま"]], mi: [["mi", "み"]], mu: [["mu", "む"]], me: [["me", "め"]], mo: [["mo", "も"]] },
    ya: { ya: [["ya", "や"]], yu: [["yu", "ゆ"]], yo: [["yo", "よ"]] },
    ra: { ra: [["ra", "ら"]], ri: [["ri", "り"]], ru: [["ru", "る"]], re: [["re", "れ"]], ro: [["ro", "ろ"]] },
    wa: { wa: [["wa", "わ"]], wo: [["wo", "を"]] },
    n: { n: [["n", "ん"]] },
};

const katakana = {
    A: { A: [["A", "ア"]], I: [["I", "イ"]], U: [["U", "ウ"]], E: [["E", "エ"]], O: [["O", "オ"]] },
    KA: { KA: [["KA", "カ"], ["GA", "ガ"]], KI: [["KI", "キ"], ["GI", "ギ"]], KU: [["KU", "ク"], ["GU", "グ"]], KE: [["KE", "ケ"], ["GE", "ゲ"]], KO: [["KO", "コ"], ["GO", "ゴ"]] },
    SA: { SA: [["SA", "サ"], ["ZA", "ザ"],], SHI: [["SHI", "シ"], ["JI", "ジ"],], SU: [["SU", "ス"], ["ZU", "ズ"],], SE: [["SE", "セ"], ["ZE", "ゼ"],], SO: [["SO", "ソ"], ["ZO", "ゾ"],] },
    TA: { TA: [["TA", "タ"], ["DA", "ダ"]], CHI: [["CHI", "チ"], ["JI", "ヂ"]], TSU: [["TSU", "ツ"], ["JU", "ヅ"]], TE: [["TE", "テ"], ["DE", "デ"]], TO: [["TO", "ト"], ["DO", "ド"]] },
    NA: { NA: [["NA", "ナ"]], NI: [["NI", "ニ"]], NU: [["NU", "ヌ"]], NE: [["NE", "ネ"]], NO: [["NO", "ノ"]] },
    HA: { HA: [["HA", "ハ"], ["BA", "バ"], ["PA", "パ"]], HI: [["HI", "ヒ"], ["BI", "ビ"], ["PI", "ピ"]], FU: [["FU", "フ"], ["BU", "ブ"], ["PU", "プ"]], HE: [["HE", "ヘ"], ["BE", "ベ"], ["PE", "ペ"]], HO: [["HO", "ホ"], ["BO", "ボ"], ["PO", "ポ"]] },
    MA: { MA: [["MA", "マ"]], MI: [["MI", "ミ"]], MU: [["MU", "ム"]], ME: [["ME", "メ"]], MO: [["MO", "モ"]] },
    YA: { YA: [["YA", "ヤ"]], YU: [["YU", "ユ"]], YO: [["YO", "ヨ"]] },
    RA: { RA: [["RA", "ラ"]], RI: [["RI", "リ"]], RU: [["RU", "ル"]], RE: [["RE", "レ"]], RO: [["RO", "ロ"]] },
    WA: { WA: [["WA", "ワ"]], WO: [["WO", "ヲ"]] },
    N: { N: [["N", "ン"]] },
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
    const { id } = box;

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
    if (!goodKanas.length) return alert("Le son donné n'est pas valide");

    alert(`La réponse était: ${current[0]}\nLe son ${input} correspond à ${goodKanas.join(" | ")}`);
    wrong++;

    start();
}

function isValidInput(input) {

    const defaultKanaList = getKanaList(input);
    const goodKanas = [];

    for (const [, listOfSounds] of Object.entries(defaultKanaList)) {
        for (const [, kanaList] of Object.entries(listOfSounds)) {
            for (const kana of kanaList) {
                if (kana[0] == input) goodKanas.push(kana[1]);
            }
        }
    }

    return goodKanas;
}

function getRandomKana() {
    const list = [];

    for (const [, listOfSounds] of Object.entries(currentList)) {
        for (const [, kanaList] of Object.entries(listOfSounds)) {

            // Ne pas mettre les accents s'ils ne sont pas cochés
            if (!useAccents) {
                list.push(kanaList[0]);
                continue;
            }

            for (const kana of kanaList) {
                list.push(kana);
            }
        }
    }

    const num = getRandomNumber(list.length);
    const data = list[num]; // ["a", "あ"]
    return data;
}

function getRandomNumber(len) {
    let num = Math.floor(Math.random() * len);

    // Si seulement ん est coché num sera toujours last
    if (num == last && len > 1) return getRandomNumber(len);
    last = num;
    return num;
}

function checkStart() {
    const boxes = document.getElementsByClassName("box");
    const list = {};

    for (let i = 0; i < boxes.length; i++) {
        const element = boxes[i];
        const { id, checked } = element;

        if (id == "Accents") {
            useAccents = checked;
            continue;
        }

        if (!checked) {
            if (currentList[id]) removeFromList(id);
            continue;
        }

        list[id] = getKanaList(id)[id];
        if (!currentList[id]) addToList(id, list[id]);
    }

    if (!Object.keys(list).length) {
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
 * 0 - les deux
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

/**
 * 0 - normal check
 * 1 - uncheck all
 * 2 - check all
 */
function checkAllBoxes(action = 0) {
    const boxes = document.getElementsByClassName("box");

    for (const box of boxes) {
        if (action == 1) {
            box.checked = false;
            continue;
        }

        if (action == 2) {
            box.checked = true;
            continue;
        }

        if (box.id == "Accents") {
            box.checked = useAccents;
            continue;
        }

        box.checked = !!currentList[box.id];
    }
}

function triggerAction() {
    const action = prompt(`Quelle action voulez-vous faire ?

0 - Reset le score
1 - Décocher tout les kana
2 - Cocher tout les kana
3 - Reset complet
`, "3");

    if (action == "0") {
        right = 0;
        wrong = 0;
        return start();
    }

    if (action == "1") {
        checkAllBoxes(1);
        return start();
    }

    if (action == "2") {
        checkAllBoxes(2);
        return start();
    }

    if (action == "3") {
        return reset();
    }

}

function reset() {
    const doReset = confirm("Êtes-vous sûr de vouloir réinitialiser ?");
    if (!doReset) return;

    localStorage.clear();
    right = 0;
    wrong = 0;
    checkAllBoxes(1);
    start();
}

function getKanaList(sound) {
    return sound == sound.toLowerCase() ? hiragana : katakana;
}