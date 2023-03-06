const BOARD_SIZE = 10;
const NUM_MINES = 10;

const board = document.getElementById("board");
const cells = [];

// Create the board
for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => revealCell(i));
    cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        cell.classList.toggle("flagged");
    });
    board.appendChild(cell);
    cells.push({
        element: cell,
        isMine: false,
        isRevealed: false,
        numSurroundingMines: 0,
    });
}

// Place the mines
for (let i = 0; i < NUM_MINES; i++) {
    let index;
    do {
        index = Math.floor(Math.random() * cells.length);
    } while (cells[index].isMine);
    cells[index].isMine = true;
}

// Calculate the number of surrounding mines for each cell
for (let i = 0; i < cells.length; i++) {
    const adjacentCellIndexes = [];
    if (i % BOARD_SIZE !== 0) {
        adjacentCellIndexes.push(i - 1); // Left
        adjacentCellIndexes.push(i - BOARD_SIZE - 1); // Upper Left
        adjacentCellIndexes.push(i + BOARD_SIZE - 1); // Lower Left
    }
    if (i % BOARD_SIZE !== BOARD_SIZE - 1) {
        adjacentCellIndexes.push(i + 1); // Right
        adjacentCellIndexes.push(i - BOARD_SIZE + 1); // Upper Right
        adjacentCellIndexes.push(i + BOARD_SIZE + 1); // Lower Right
    }
    adjacentCellIndexes.push(i - BOARD_SIZE); // Up
    adjacentCellIndexes.push(i + BOARD_SIZE); // Down
    cells[i].numSurroundingMines = adjacentCellIndexes.filter(
        (index) => cells[index] && cells[index].isMine
    ).length;
}

// Reveals a cell
function revealCell(index) {
    const cell = cells[index];
    if (cell.isRevealed) {
        return;
    }
    if (cell.isMine) {
        cell.element.classList.add("mine");
        alert("Game over!");
        return;
    }
    cell.isRevealed = true;

    // Reveal surrounding cells recursively if there are no surrounding mines
    if (cell.numSurroundingMines === 0) {
        revealSurroundingCells(index);
    }

    // Update the cell's appearance
    cell.element.classList.add("revealed");
    if (cell.numSurroundingMines > 0) {
        cell.element.textContent = cell.numSurroundingMines;
    }

    // Check if the game is won
    const numUnrevealedCells = cells.filter((cell) => !cell.isRevealed).length;
    if (numUnrevealedCells === NUM_MINES) {
        alert("You win!");
    }
}

// Reveals all surrounding cells recursively
function revealSurroundingCells(index) {
    const adjacentCellIndexes = [];
    if (index % BOARD_SIZE !== 0) {
        adjacentCellIndexes.push(index - 1); // Left
        adjacentCellIndexes.push(index - BOARD_SIZE - 1); // Upper Left
        adjacentCellIndexes.push(index + BOARD_SIZE - 1); // Lower Left
    }
    if (index % BOARD_SIZE !== BOARD_SIZE - 1) {
        adjacentCellIndexes.push(index + 1); // Right
        adjacentCellIndexes.push(index - BOARD_SIZE + 1); // Upper Right
        adjacentCellIndexes.push(index + BOARD_SIZE + 1); // Lower Right
    }
    adjacentCellIndexes.push(index - BOARD_SIZE); // Up
    adjacentCellIndexes.push(index + BOARD_SIZE); // Down
    adjacentCellIndexes.forEach((adjacentIndex) => {
        if (adjacentIndex >= 0 && adjacentIndex < cells.length) {
            const adjacentCell = cells[adjacentIndex];
            if (!adjacentCell.isRevealed && !adjacentCell.isMine) {
                revealCell(adjacentIndex);
            }
        }
    });
}
