// ========================================
// 词语搭配练习网站
// JSON files:
// dapeiciyu/1.json
// dapeiciyu/2.json
// ...
// dapeiciyu/36.json
// ========================================

const MAX_CHAPTERS = 36;

const chapterSelect = document.getElementById("chapterSelect");
const tableBody = document.getElementById("tableBody");


// ========================================
// Initialize
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    createChapterOptions();

    chapterSelect.addEventListener("change", () => {
        const chapter = chapterSelect.value;

        if (chapter) {
            loadChapter(chapter);
        } else {
            showMessage("请选择一个章节");
        }
    });

    // Load Chapter 1 automatically
    chapterSelect.value = "1";
    loadChapter("1");
});


// ========================================
// Create Chapter Dropdown
// ========================================

function createChapterOptions() {

    for (let i = 1; i <= MAX_CHAPTERS; i++) {

        const option = document.createElement("option");

        option.value = i;
        option.textContent = `Chapter ${i}`;

        chapterSelect.appendChild(option);
    }
}


// ========================================
// Load JSON Chapter
// ========================================

async function loadChapter(chapterNumber) {

    showMessage("正在加载...");

    const filePath = `dapeiciyu/${chapterNumber}.json`;

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(
                `无法找到 ${filePath}`
            );
        }

        const data = await response.json();

        if (!data.words || !Array.isArray(data.words)) {
            throw new Error(
                "JSON 文件格式不正确：找不到 words 数组。"
            );
        }

        displayWords(data.words);

    } catch (error) {

        console.error(error);

        showMessage(
            `Chapter ${chapterNumber} 加载失败。<br>
             请检查文件：<strong>${filePath}</strong>`
        );
    }
}


// ========================================
// Display Words
// ========================================

function displayWords(words) {

    tableBody.innerHTML = "";

    if (words.length === 0) {

        showMessage("这个章节没有词语。");

        return;
    }

    words.forEach((word, index) => {

        const row = document.createElement("tr");

        // ----------------------------
        // Number
        // ----------------------------

        const numberCell = document.createElement("td");

        numberCell.textContent = index + 1;

        numberCell.style.textAlign = "center";


        // ----------------------------
        // Chinese
        // ----------------------------

        const chineseCell = document.createElement("td");

        chineseCell.textContent =
            word.chinese || "";


        // ----------------------------
        // Pinyin
        // ----------------------------

        const pinyinCell = document.createElement("td");

        pinyinCell.textContent =
            word.pinyin || "";


        // ----------------------------
        // English
        // ----------------------------

        const englishCell = document.createElement("td");

        englishCell.textContent =
            word.english || "";


        // ----------------------------
        // Sample Sentences
        // ----------------------------

        const sentenceCell = document.createElement("td");

        displaySampleSentences(
            sentenceCell,
            word.sample_sentences
        );


        // ----------------------------
        // Add cells to row
        // ----------------------------

        row.appendChild(numberCell);
        row.appendChild(chineseCell);
        row.appendChild(pinyinCell);
        row.appendChild(englishCell);
        row.appendChild(sentenceCell);

        tableBody.appendChild(row);
    });
}


// ========================================
// Display Sample Sentences
// ========================================

function displaySampleSentences(cell, sentences) {

    if (!sentences) {
        cell.textContent = "";
        return;
    }


    // If sample_sentences is an array
    if (Array.isArray(sentences)) {

        sentences.forEach((sentence, index) => {

            const sentenceDiv =
                document.createElement("div");

            sentenceDiv.textContent = sentence;

            if (index > 0) {
                sentenceDiv.style.marginTop = "8px";
            }

            cell.appendChild(sentenceDiv);
        });

        return;
    }


    // If sample_sentences is a single string
    cell.textContent = sentences;
}


// ========================================
// Show Message
// ========================================

function showMessage(message) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="empty-message">
                ${message}
            </td>
        </tr>
    `;
}
