// ===============================
// Languages
// ===============================

const languages = {
auto:"Auto Detect",
en:"English",
ur:"Urdu",
hi:"Hindi",
ar:"Arabic",
fr:"French",
de:"German",
es:"Spanish",
it:"Italian",
pt:"Portuguese",
ru:"Russian",
tr:"Turkish",
ja:"Japanese",
ko:"Korean",
zh:"Chinese",
nl:"Dutch",
pl:"Polish",
sv:"Swedish",
da:"Danish",
fi:"Finnish",
no:"Norwegian",
th:"Thai",
vi:"Vietnamese",
id:"Indonesian",
ms:"Malay",
bn:"Bengali",
ta:"Tamil",
te:"Telugu",
gu:"Gujarati",
pa:"Punjabi",
fa:"Persian",
uk:"Ukrainian",
cs:"Czech",
el:"Greek",
ro:"Romanian",
hu:"Hungarian",
sk:"Slovak",
bg:"Bulgarian",
hr:"Croatian",
sr:"Serbian",
sl:"Slovenian",
et:"Estonian",
lv:"Latvian",
lt:"Lithuanian"
};

// ===============================
// Elements
// ===============================

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const swapBtn = document.getElementById("swapBtn");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const historyList = document.getElementById("historyList");

// ===============================
// Load Languages
// ===============================

for(const code in languages){
const option1 = document.createElement("option");
option1.value = code;
option1.textContent = languages[code];
sourceLang.appendChild(option1);

if(code !== "auto"){
const option2 = document.createElement("option");
option2.value = code;
option2.textContent = languages[code];
targetLang.appendChild(option2);
}
}

targetLang.value = "ur";

// ===============================
// Translate (MyMemory API - Free)
// ===============================

translateBtn.addEventListener("click", translateText);

async function translateText(){

const text = inputText.value.trim();

if(!text){
alert("Enter text first");
return;
}

translateBtn.innerText = "Translating...";

try{
const source = sourceLang.value === "auto" ? "en" : sourceLang.value;
const target = targetLang.value;
const langPair = `${source}|${target}`;

const response = await fetch(
"https://translateasad.asadansari121149.workers.dev",
{
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    q: text,
    source: sourceLang.value === "auto" ? "auto" : sourceLang.value,
    target: targetLang.value,
    format: "text"
  })
}
);

const data = await response.json();
outputText.value = data.translatedText;

const data = await response.json();

if(data.responseStatus === 200){
outputText.value = data.responseData.translatedText;
saveHistory(text, outputText.value);
}else{
alert("Translation error. Try again.");
}

}
catch(error){
alert("Translation service unavailable");
console.error(error);
}

translateBtn.innerText = "Translate";
}

// ===============================
// Copy
// ===============================

copyBtn.addEventListener("click", () => {
navigator.clipboard.writeText(outputText.value);
alert("Copied");
});

// ===============================
// Download
// ===============================

downloadBtn.addEventListener("click", () => {
const blob = new Blob([outputText.value], { type: "text/plain" });
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "translation.txt";
a.click();
});

// ===============================
// Dark Mode
// ===============================

darkModeBtn.addEventListener("click", () => {
document.body.classList.toggle("dark-mode");
localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

if(localStorage.getItem("theme") === "dark"){
document.body.classList.add("dark-mode");
}

// ===============================
// Swap Languages
// ===============================

swapBtn.addEventListener("click", () => {
let temp = sourceLang.value;
sourceLang.value = targetLang.value;
targetLang.value = temp;

let tempText = inputText.value;
inputText.value = outputText.value;
outputText.value = tempText;
});

// ===============================
// History
// ===============================

function saveHistory(original, translated){
const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
history.unshift({
original,
translated,
date: new Date().toLocaleString()
});
localStorage.setItem("translationHistory", JSON.stringify(history));
loadHistory();
}

function loadHistory(){
const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
historyList.innerHTML = "";

history.slice(0,20).forEach(item => {
const div = document.createElement("div");
div.className = "history-item";
div.innerHTML = `
<b>Original:</b> ${item.original}<br><br>
<b>Translated:</b> ${item.translated}<br><br>
<small>${item.date}</small>
`;
historyList.appendChild(div);
});
}

loadHistory();
