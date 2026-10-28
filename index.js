///     button     ///
let startButton = document.getElementById("solveButton");
let setButton = document.getElementById("setRowButton");

///     valuable     ///
let target = document.getElementById("target");

///     output     ///
let outputfield1 = document.getElementById("output");

// Make crosswordMatrix global so other functions can access it
let crosswordMatrix = [];

function setRowSize() {
    let rowInputVal = document.getElementById("rowInput").value.trim();
    let rowsize = rowInputVal === "" ? 5 : Number(rowInputVal);
    
    if (isNaN(rowsize) || rowsize <= 0 || !Number.isInteger(rowsize) || rowsize > 100) {
        if(rowsize > 100) {
            alert("row out of bounds (1-100)");
        } else if(rowsize <= 0) {
            alert("can't produce negative rows");
        } else if(!Number.isInteger(rowsize)) {
            alert("row must be an integer");
        } else {
            alert("contain unknown bugs");
        } 
        return;            
    }
    
    let container = document.getElementById("crosswordContainer");
    container.innerHTML = '';
    
    // Generate the specified number of rows using your exact styling
    for (let i = 1; i <= rowsize; i++) {
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Enter letter in row ${i} a,b,c,d,e`; 
        
        // Exact styling from your original HTML input
        input.style.width = "500px";
        input.style.textAlign = "center";
        input.style.border = "1px solid #ccc";
        input.style.display = "block";
        input.style.marginBottom = "10px";
        
        container.appendChild(input);
    }
}

function solveCrossword() {
    let container = document.getElementById("crosswordContainer");
    let inputs = container.getElementsByTagName("input");
    let targetVal = target.value ? target.value.trim() : "";
    let lettersArray = targetVal.split('');
    // Reset and fill the global crosswordMatrix
    crosswordMatrix = [];
    for (let i = 0; i < inputs.length; i++) {
        let rowText = inputs[i].value;
        let rowArray = rowText.split(',').map(item => item.trim()).filter(item => item !== '');
        crosswordMatrix.push(rowArray);
    }

    ///     output zone     ///
    let output = '<p>';
    output += '[' + crosswordMatrix.map(row => row.join(',') + ']').join('<br> [');
    output += '</p>';
    output += '<br>';
    
    output += targetVal === "" ? 
        '<p>Target: null</p>' : 
        '<p>Target: "' + targetVal + '"</p>';
    output += '<br>';        

    outputfield1.innerHTML = output;

    if (targetVal.length > 0) {
        solveFullWord(targetVal);
    }
}

function solveFullWord(targetWord) {
    if (!targetWord || targetWord.length === 0) return;
    //Find all positions of the FIRST letter of your target word
    let startPositions = findsameletters(targetWord, 0); 
    let output;
    console.log(`Found ${startPositions.length} starting positions for the first letter '${targetWord[0]}':`, startPositions);
    //If your word has more than 1 letter, check the surroundings of each start position
    if (targetWord.length > 1) {
        let secondLetter = targetWord[1];
        // Loop through every place the first letter was found
        startPositions.forEach(start => {
            console.log(`--- Checking around start position row ${start.row}, col ${start.col} for '${secondLetter}' ---`);
            // Pass x (col) and y (row) into your surrounding check function
            let nextLetterMatches = checking_surrounding_letters(start.col, start.row, secondLetter);          
            console.log(`Found next letter matches:`, nextLetterMatches);
        });
    }
}

function findsameletters(targetletter, pos) {
    if (!targetletter || !targetletter[pos]) return null;
    
    let targetletterLower = targetletter[pos].toLowerCase();
    let crosswordMatrix_ = crosswordMatrix.map(row => row.map(cell => cell.toLowerCase()));
    let match_pos = [];

    for (let i = 0; i < crosswordMatrix_.length; i++) {
        for (let j = 0; j < crosswordMatrix_[i].length; j++) {
            if (crosswordMatrix_[i][j] === targetletterLower) {
                console.log(`Found letter '${targetletterLower}' at row ${i}, column ${j}`);
                match_pos.push({ row: i, col: j });
            }
        }
    }    
    return match_pos;
}

function checking_surrounding_letters(x, y, targetLetter) {
    let targetLetterLower = targetLetter.toLowerCase();
    let crosswordMatrix_ = crosswordMatrix.map(row => row.map(cell => cell.toLowerCase()));
    let matches = [];
    // The 9-box loop: dx and dy go from -1, 0, to 1
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            let neighborRow = y + dy;
            let neighborCol = x + dx;
            let rowExists = neighborRow >= 0 && neighborRow < crosswordMatrix_.length;
            let colExists = rowExists && neighborCol >= 0 && neighborCol < crosswordMatrix_[neighborRow].length;
            if (rowExists && colExists) {
                let neighborCell = crosswordMatrix_[neighborRow][neighborCol];
                // Check if this neighbor matches our target letter
                if (neighborCell === targetLetterLower) {
                    console.log(`Found neighbor '${targetLetterLower}' at row ${neighborRow}, col ${neighborCol}`);
                    matches.push ? 
                        matches.push({ row: neighborRow, col: neighborCol, direction: {dy, dx} }) : 
                        matches.push({ row: neighborRow, col: neighborCol });
                }
            }
        }
    }
    return matches;
}    

// Attach event listeners correctly (NO parentheses)
setButton.addEventListener("click", setRowSize);
startButton.addEventListener("click", solveCrossword);