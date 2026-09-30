// ========================================
// 词语搭配练习网站
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

    // Automatically load Chapter 1
    chapterSelect.value = "1";
    loadChapter("1");
});


// ========================================
// Create Chapter Options
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
// Load Chapter JSON
// ========================================

async function loadChapter(chapterNumber) {

    showMessage("正在加载...");

    const filePath = `dapeiciyu/${chapterNumber}.json`;

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(
                `无法找到文件：${filePath}`
            );
        }

        const data = await response.json();

        // New JSON structure
        if (
            !data.categories ||
            !Array.isArray(data.categories)
        ) {

            throw new Error(
                "JSON 格式错误：找不到 categories 数组。"
            );
        }

        displayCategories(data.categories);

    } catch (error) {

        console.error(error);

        showMessage(
            `Chapter ${chapterNumber} 加载失败。<br><br>
             请检查文件：<strong>${filePath}</strong><br><br>
             ${escapeHTML(error.message)}`
        );
    }
}


// ========================================
// Display All Categories
// ========================================

function displayCategories(categories) {

    tableBody.innerHTML = "";

    if (categories.length === 0) {

        showMessage("这个章节没有词语搭配。");

        return;
    }

    categories.forEach((category) => {

        createCategorySection(category);

    });
}


// ========================================
// Create One Main Word Category
// ========================================

function createCategorySection(category) {

    // ------------------------------------
    // Category Header
    // ------------------------------------

    const categoryRow = document.createElement("tr");

    categoryRow.className = "category-row";


    const categoryCell = document.createElement("td");

    categoryCell.colSpan = 5;

    categoryCell.className = "category-title";


    // Main word
    const mainWord = document.createElement("span");

    mainWord.className = "main-word";

    mainWord.textContent =
        category.main_word || "";


    // Pinyin
    const mainPinyin = document.createElement("span");

    mainPinyin.className = "main-pinyin";

    if (category.pinyin) {

        mainPinyin.textContent =
            ` ${category.pinyin}`;

    }


    // English
    const mainEnglish = document.createElement("span");

    mainEnglish.className = "main-english";

    if (category.english) {

        mainEnglish.textContent =
            ` — ${category.english}`;

    }


    categoryCell.appendChild(mainWord);
    categoryCell.appendChild(mainPinyin);
    categoryCell.appendChild(mainEnglish);

    categoryRow.appendChild(categoryCell);

    tableBody.appendChild(categoryRow);


    // ------------------------------------
    // Words inside this category
    // ------------------------------------

    if (
        !category.words ||
        !Array.isArray(category.words)
    ) {

        return;
    }


    category.words.forEach((word, index) => {

        createWordRow(word, index);

    });
}


// ========================================
// Create Word Row
// ========================================

function createWordRow(word, index) {

    const row = document.createElement("tr");


    // ------------------------------------
    // Number
    // ------------------------------------

    const numberCell = document.createElement("td");

    numberCell.textContent = index + 1;

    numberCell.className = "number-column";


    // ------------------------------------
    // Chinese
    // ------------------------------------

    const chineseCell = document.createElement("td");

    chineseCell.textContent =
        word.chinese || "";


    // ------------------------------------
    // Pinyin
    // ------------------------------------

    const pinyinCell = document.createElement("td");

    pinyinCell.textContent =
        word.pinyin || "";


    // ------------------------------------
    // English
    // ------------------------------------

    const englishCell = document.createElement("td");

    englishCell.textContent =
        word.english || "";


    // ------------------------------------
    // Sample Sentences
    // ------------------------------------

    const sentenceCell = document.createElement("td");

    displaySampleSentences(
        sentenceCell,
        word.sample_sentences
    );


    // ------------------------------------
    // Add cells
    // ------------------------------------

    row.appendChild(numberCell);
    row.appendChild(chineseCell);
    row.appendChild(pinyinCell);
    row.appendChild(englishCell);
    row.appendChild(sentenceCell);

    tableBody.appendChild(row);
}


// ========================================
// Display Sample Sentences
// ========================================

function displaySampleSentences(cell, sentences) {

    if (!sentences) {
        return;
    }


    // Multiple sentences
    if (Array.isArray(sentences)) {

        sentences.forEach((sentence, index) => {

            const sentenceDiv =
                document.createElement("div");

            sentenceDiv.className =
                "sample-sentence";

            sentenceDiv.textContent =
                sentence;

            if (index > 0) {

                sentenceDiv.style.marginTop =
                    "8px";
            }

            cell.appendChild(sentenceDiv);
        });

        return;
    }


    // Single sentence
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


// ========================================
// Escape HTML
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
