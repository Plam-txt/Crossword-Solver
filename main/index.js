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
    
    // FIX 1: target.value is required here so .split('') works
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

    findsameletters(lettersArray[0], 0);
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

// Attach event listeners correctly (NO parentheses)
setButton.addEventListener("click", setRowSize);
startButton.addEventListener("click", solveCrossword);