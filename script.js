const puzzleTable = document.getElementById("puzzle");
const wordElement = document.getElementById("word");
const letterMenu = document.getElementById("letters");

for (let c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ?") {
    if (!letterMenu.children.length || letterMenu.children[letterMenu.children.length - 1].children.length === 6)
        letterMenu.appendChild(document.createElement("tr"));
    let cell = document.createElement("td");
    cell.appendChild(document.createTextNode(c));
    cell.setAttribute("letter", c);
    letterMenu.children[letterMenu.children.length - 1].appendChild(cell);
}

const KEYWORDS = "LOK TLAK TA BE LOLO GRIVA".split(" ");

let puzzle;

let currentPath;
let effectCell;
let wildcards;

let undoStack = [];

function saveState() {
    undoStack.push(JSON.parse(JSON.stringify(puzzle)));
}

function endMove() {
    currentPath = [];
    effectCell = null;
    wildcards = [];
}

function undo() {
    if (!undoStack.length) return;
    puzzle = undoStack.pop();
    currentPath = [];
    effectCell = null;
    wildcards = [];
    puzzle.forEach((cell, index) => {
        let elem = getCellElement(index);
        if (cell.black) elem.classList.add("blacked");
        else elem.classList.remove("blacked");
        elem.classList.remove("selected");
        elem.innerText = cell.char;
    });
    updateGraphics();
}

function restart() {
    while (undoStack.length) undo();
}

function changeSelection(offset) {
    const puzzleSelect = document.getElementById("puzzle-select");
    let options = [...puzzleSelect.querySelectorAll("option")].filter(x => !x.disabled);
    let index = options.map((x, i) => [x, i]).find(([x, i]) => x.selected)[1];
    let newOption = options[index + offset];
    if (!newOption) return;
    puzzleSelect.value = newOption.value;
}

function loadPuzzle() {
    undoStack = [];
    endMove();
    while (puzzleTable.firstChild) puzzleTable.removeChild(puzzleTable.firstChild);
    let minRow = Math.min(...puzzle.map(x => x.row));
    let minCol = Math.min(...puzzle.map(x => x.col));
    for (let i = 0; i < puzzle.length; i++) {
        let cell = puzzle[i];
        let row = cell.row - minRow;
        let col = cell.col - minCol;
        while (puzzleTable.children.length <= row) {
            let newRow = document.createElement("tr");
            newRow.appendChild(document.createElement("td"));
            puzzleTable.appendChild(newRow);
        }
        let rowElement = puzzleTable.children[row];
        while (rowElement.children.length <= col) rowElement.appendChild(document.createElement("td"));
        let cellElement = rowElement.children[col];
        cellElement.classList.add("cell");
        if (cell.black) cellElement.classList.add("blacked");
        cellElement.appendChild(document.createTextNode(cell.char));
        cellElement.setAttribute("index", i);
    }
    setUpPuzzleTableEventListeners();
    updateGraphics();
}

function loadFromString(s) {
    puzzle = [];
    let lines = s.replaceAll("\r", "").split("\n");
    for (let r = 0; r < lines.length; r++) {
        for (let c = 0; c < lines[r].length; c++) {
            let char = lines[r][c].toUpperCase();
            if (char === " ") continue;
            if (char === "#") {
                puzzle.push({row: r, col: c, char: " ", black: true});
                continue;
            }
            if (char === ".") char = " ";
            puzzle.push({row: r, col: c, char});
        }
    }
    loadPuzzle();
}

function setKeywordText(keyword) {
    while (wordElement.firstChild) wordElement.removeChild(wordElement.firstChild);
    for (let part of keyword.matchAll(/[^X]+|X+/g)) {
        let chars = part[0];
        if (chars[0] === "X") {
            let span = document.createElement("span");
            span.classList.add("x");
            span.appendChild(document.createTextNode(chars));
            wordElement.appendChild(span);
        } else {
            wordElement.appendChild(document.createTextNode(chars));
        }
    }
}

function updateGraphics() {
    let keyword = getKeyword(currentPath);
    setKeywordText(keyword || " ");
    wordElement.classList.remove("valid");
    letterMenu.classList.add("hidden");
    if (isValidKeywordPath(currentPath)) {
        wordElement.classList.add("valid");
        if (["BE", "EB"].includes(getKeyword(currentPath).replaceAll("X", "")) && effectCell !== null)
            letterMenu.classList.remove("hidden");
        if (["GRIVA", "AVIRG"].includes(getKeyword(currentPath).replaceAll("X", ""))) {
            puzzle.forEach((c, i) => blackOutCell(i));
            endMove();
        }
    }
    if (currentPath.length && wildcards.length < currentPath.filter(x => puzzle[x].char === "?").length)
        letterMenu.classList.remove("hidden");
    puzzleTable.classList.remove("solved");
    if (isSolved())
        puzzleTable.classList.add("solved");
}

let isMouseDown = false;
function onMouseDown(e) {
    if (typeof (window.ontouchstart) !== "undefined" && e.type === "mousedown") return;
    isMouseDown = true;
    if (e.target.classList.contains("cell")) selectCell(e.target);
}
function onMouseUp(e) {
    isMouseDown = false;
}
function onMouseMove(e) {
    if (typeof (window.ontouchstart) !== "undefined" && e.type === "mousemove") return;
    if (isMouseDown) selectCell(e.target);
}
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("touchstart", onMouseDown);
document.addEventListener("mouseup", onMouseUp);
document.addEventListener("touchend", onMouseUp);
function setUpPuzzleTableEventListeners() {
    puzzleTable.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("mousemove", onMouseMove);
    });
}

document.querySelectorAll("button").forEach(btn => {
    let oldClick = btn.onclick;
    btn.ontouchstart = btn.onclick = e => {
        if (typeof (window.ontouchstart) !== "undefined" && e.type === "click") return;
        oldClick(e);
    }
});

function selectCell(cell) {
    if (currentPath.length && wildcards.length < currentPath.filter(x => puzzle[x].char === "?").length) return;
    let index = +cell.getAttribute("index");
    if (!puzzle[index].black && !currentPath.length) saveState();
    if (isValidKeywordPath(currentPath)) {
        doKeywordEffect(index);
        return;
    }
    if (puzzle[index].black) return;
    if (currentPath.length && currentPath.at(-1) === index) return;
    currentPath.push(index);
    cell.classList.add("selected");
    if (puzzleTable.querySelector(".current")) puzzleTable.querySelector(".current").classList.remove("current");
    cell.classList.add("current");
    updateGraphics();
    if (isValidKeywordPath(currentPath)) currentPath.forEach(c => {
        let char = puzzle[c].char;
        if (char === "?") char = wildcards[puzzle.filter(x => x.char === "?").indexOf(puzzle[c])];
        if (char === "X") getCellElement(c).classList.remove("selected");
        else blackOutCell(c);
    });
}

function doKeywordEffect(cell) {
    let keyword = getKeyword(currentPath).replaceAll("X", "");
    if (!KEYWORDS.includes(keyword)) keyword = keyword.split("").toReversed().join("");
    switch (keyword) {
        case "LOK":
            if (blackOutCell(cell)) endMove();
            break;
        case "TLAK":
            if (!puzzle[cell].black) {
                if (effectCell === null) {
                    effectCell = cell;
                    getCellElement(cell).classList.add("selected");
                } else if (!areAdjacent(effectCell, cell)) {
                    getCellElement(effectCell).classList.remove("selected");
                    effectCell = cell;
                    getCellElement(cell).classList.add("selected");
                } else {
                    if (blackOutCell(cell, effectCell)) endMove();
                }
            }
            break;
        case "TA":
            if (blackOutCell(cell)) {
                let char = puzzle[cell].char;
                if (char !== "?" || puzzle.every(c => c.black)) {
                    puzzle.forEach((c, i) => {
                        if (c.black) return;
                        if (c.char !== char) return;
                        blackOutCell(i);
                    });
                    endMove();
                } else {
                    effectCell = true;
                }
            } else if (effectCell) {
                endMove();
            }
            break;
        case "BE":
            if (puzzle[cell].char === " ") {
                if (effectCell !== null)
                    getCellElement(effectCell).classList.remove("selected");
                effectCell = cell;
                getCellElement(cell).classList.add("selected");
            }
            break;
        case "LOLO":
            if (blackOutCell(cell)) {
                for (let i = 0; i < puzzle.length; i++) {
                    if (puzzle[i].row + puzzle[i].col === puzzle[cell].row + puzzle[cell].col)
                        blackOutCell(i);
                }
                endMove();
            }
            break;
        case "GRIVA":
            break;
    }
    updateGraphics();
}

letterMenu.querySelectorAll("td").forEach(letter => {
    let listener = e => {
        if (typeof (window.ontouchstart) !== "undefined" && e.type === "mousedown") return;
        if (["BE", "EB"].includes(getKeyword(currentPath).replaceAll("X", "")) && effectCell !== null) {
            getCellElement(effectCell).innerText = puzzle[effectCell].char = e.target.getAttribute("letter");
            getCellElement(effectCell).classList.remove("selected");
            endMove();
            updateGraphics();
        } else if (currentPath.length && wildcards.length < currentPath.filter(x => puzzle[x].char === "?").length) {
            wildcards.push(e.target.getAttribute("letter"));
            if (isValidKeywordPath(currentPath)) {
                let wildcardIndex = 0;
                currentPath.forEach(c => {
                    let char = puzzle[c].char;
                    if (char === "?") {
                        char = wildcards[wildcardIndex];
                        wildcardIndex++;
                    }
                    if (char === "X") getCellElement(c).classList.remove("selected");
                    else blackOutCell(c);
                });
            }
            updateGraphics();
        }
    };
    letter.addEventListener("mousedown", listener);
    letter.addEventListener("touchstart", listener);
});

function getKeyword(path) {
    let chars = path.map(x => puzzle[x].char);
    let wildcardIndex = 0;
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === "?") {
            chars[i] = wildcards[wildcardIndex] ?? "?";
            wildcardIndex++;
        }
    }
    return chars.join("");
}

function isValidPath(path) {
    if (path.some(x => puzzle[x].char === "")) return false;
    if (path.length <= 1) return true;
    let currentDirection = getDirectionBetween(path[0], path[1]);
    for (let i = 0; i < path.length - 1; i++) {
        let from = path[i];
        let to = path[i + 1];
        if (!isValidMovement(from, to, currentDirection)) return false;
        currentDirection = getDirectionBetween(from, to);
    }
    return true;
}

function isValidMovement(from, to, currentDirection) {
    if (!areAdjacent(from, to)) return false;
    let direction = getDirectionBetween(from, to);
    if (currentDirection.every((x, i) => x === -direction[i])) return false;
    if (puzzle[from].char !== "X" &&
        !(puzzle[from].char === "?" && wildcards[puzzle.filter(x => x.char === "?").indexOf(puzzle[from])] === "X") &&
        currentDirection.some((x, i) => x !== direction[i])) return false;
    return true;
}

function areAdjacent(cell1, cell2) {
    if (cell1 === cell2) return false;
    let {row: r1, col: c1} = puzzle[cell1];
    let {row: r2, col: c2} = puzzle[cell2];
    if (r1 !== r2 && c1 !== c2) return false;
    let rMin = Math.min(r1, r2);
    let rMax = Math.max(r1, r2);
    let cMin = Math.min(c1, c2);
    let cMax = Math.max(c1, c2);
    if (puzzle.some((cell, index) => index !== cell1 && index !== cell2 &&
                                     rMin <= cell.row && cell.row <= rMax &&
                                     cMin <= cell.col && cell.col <= cMax &&
                                     !cell.black)) return false;
    return true;
}

function getDirectionBetween(from, to) {
    let {row: fromRow, col: fromCol} = puzzle[from];
    let {row: toRow, col: toCol} = puzzle[to];
    if (toRow < fromRow) return [-1, 0];
    if (toRow > fromRow) return [1, 0];
    if (toCol < fromCol) return [0, -1];
    if (toCol > fromCol) return [0, 1];
}

function isValidKeyword(keyword) {
    let realKeyword = keyword.replaceAll("X", "");
    return KEYWORDS.includes(realKeyword) || KEYWORDS.includes(realKeyword.split("").toReversed().join(""));
}

function isValidKeywordPath(path) {
    return isValidPath(path) && isValidKeyword(getKeyword(path));
}

function getCellElement(cell) {
    return puzzleTable.querySelector(".cell[index='" + cell + "']");
}

function blackOutCell(...cells) {
    if (cells.some(cell => puzzle[cell].black)) return false;
    cells.forEach(cell => {
        puzzle[cell].black = true;
        getCellElement(cell).classList.add("blacked");
        getCellElement(cell).classList.remove("selected");
    });
    return true;
}

function isSolved() {
    return puzzle.every(x => x.black) && !currentPath.length;
}

function loadPuzzleSelect() {
    loadFromString(PUZZLE_SELECT[document.getElementById("puzzle-select").value]);
}

function copyLink() {
    let link = location.href.split("?")[0] + "?" + btoa(document.getElementById("custom").value).replaceAll("/", "_").replaceAll("+", "-").replaceAll("=", "");
    navigator.clipboard.writeText(link);
}

if (location.href.indexOf("?") > -1) {
    let base64 = location.href.split("?")[1].replaceAll("_", "/").replace("-", "+");
    while (base64.length % 4) base64 += "=";
    loadFromString(atob(base64));
}