let wordList = [];
let targetWord = "";
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let prvniSlovoHry = "";

let prihlasenyUzivatel = null; 

const ulozenaData = localStorage.getItem('wordleUser');
if (ulozenaData) {
    prihlasenyUzivatel = JSON.parse(ulozenaData);

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('show-profile-btn').classList.remove('hidden');
}

async function loadWords() {
    try {
        const response = await fetch('words.json');
        if (!response.ok) throw new Error(`Chyba: ${response.status}`);
        const data = await response.json();
        wordList = data.map(slovo => slovo.toUpperCase()); 
        console.log("Slovník načten. Počet slov:", wordList.length);
        init(); 
    } catch (error) {
        console.error("Chyba:", error);
        showMessage("Chyba při stahování slovníku.", true);
    }
}

function init() {
    targetWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentRow = 0;
    currentTile = 0;
    isGameOver = false;
    prvniSlovoHry = "";
    
    const msgBox = document.getElementById('message');
    if (msgBox) {
        msgBox.innerText = "";
        msgBox.classList.remove('show');
    }
    
    buildBoard();
    buildKeyboard();
}

function buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; 
    for (let r = 0; r < 6; r++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.id = `row-${r}`;
        for (let c = 0; c < 5; c++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `tile-${r}-${c}`;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function buildKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const layout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    layout.forEach(row => {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('key-row');
        row.forEach(key => {
            let keyBtn = document.createElement('button');
            keyBtn.classList.add('key');
            if (key === 'ENTER' || key === 'BACKSPACE') keyBtn.classList.add('large');
            
            if (key === 'BACKSPACE') {
                keyBtn.innerHTML = '&#x232B;'; 
            } else {
                keyBtn.innerText = key;
            }

            keyBtn.setAttribute('data-key', key); 
            keyBtn.onclick = () => handleInput(key);
            rowDiv.appendChild(keyBtn);
        });
        keyboard.appendChild(rowDiv);
    });
}

function showMessage(msg, permanent = false) {
    const msgBox = document.getElementById('message');
    if (!msgBox) return;
    
    msgBox.innerText = msg;
    msgBox.classList.add('show');
    if (!permanent) {
        setTimeout(() => { 
            if(!isGameOver) {
                msgBox.innerText = ""; 
                msgBox.classList.remove('show');
            }
        }, 2000);
    }
}

function handleInput(key) {
    if (isGameOver) return;

    if (key === 'BACKSPACE') {
        if (currentTile > 0) {
            currentTile--;
            const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
            tile.innerText = '';
            tile.classList.remove('filled');
        }
    } else if (key === 'ENTER') {
        if (currentTile === 5) {
            checkGuess();
        } else {
            showMessage("Slovo musí mít 5 písmen.");
        }
    } else if (/^[A-Z]$/.test(key)) { 
        if (currentTile < 5) {
            const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
            tile.innerText = key;
            tile.classList.add('filled');
            currentTile++;
        }
    }
}

function checkGuess() {
    let guess = "";
    for (let i = 0; i < 5; i++) {
        guess += document.getElementById(`tile-${currentRow}-${i}`).innerText;
    }

    if (!wordList.includes(guess)) {
        showMessage("Slovo není ve slovníku!");
        return; 
    }

    if (currentRow === 0) {
        prvniSlovoHry = guess;
    }

    let targetLetters = targetWord.split("");
    let statuses = ["absent", "absent", "absent", "absent", "absent"];

    for (let i = 0; i < 5; i++) {
        if (guess[i] === targetLetters[i]) {
            statuses[i] = "correct";
            targetLetters[i] = null; 
        }
    }

    for (let i = 0; i < 5; i++) {
        if (statuses[i] !== "correct" && targetLetters.includes(guess[i])) {
            statuses[i] = "present";
            targetLetters[targetLetters.indexOf(guess[i])] = null;
        }
    }

    for (let i = 0; i < 5; i++) {
        let tile = document.getElementById(`tile-${currentRow}-${i}`);
        setTimeout(() => {
            tile.classList.remove('filled');
            tile.classList.add(statuses[i]);
            updateKeyboardColor(guess[i], statuses[i]);
        }, i * 150); 
    }

        setTimeout(() => {
        if (guess === targetWord) {
            showMessage("Gratulace! Uhodl jsi slovo.", true);
            isGameOver = true;
            
            ulozVysledekHry("vyhra", prvniSlovoHry, currentRow + 1); 
            
        } else {
            currentRow++;
            currentTile = 0;
            if (currentRow === 6) {
                showMessage(`Konec hry! Hledané slovo bylo: ${targetWord}`, true);
                isGameOver = true;
                
                ulozVysledekHry("prohra", prvniSlovoHry, 6); 
            }
        }
    }, 5 * 150 + 100);
}

function updateKeyboardColor(letter, status) {
    let keyBtn = document.querySelector(`.key[data-key="${letter}"]`);
    if (!keyBtn) return;

    if (status === "correct") {
        keyBtn.classList.remove("present", "absent");
        keyBtn.classList.add("correct");
    } else if (status === "present" && !keyBtn.classList.contains("correct")) {
        keyBtn.classList.remove("absent");
        keyBtn.classList.add("present");
    } else if (status === "absent" && !keyBtn.classList.contains("correct") && !keyBtn.classList.contains("present")) {
        keyBtn.classList.add("absent");
    }
}

document.addEventListener('keydown', (e) => {
    let key = e.key.toUpperCase();
    if (key === 'BACKSPACE' || key === 'ENTER' || /^[A-Z]$/.test(key)) {
        handleInput(key);
    }
});
document.getElementById('new-word-btn').addEventListener('click', init);

document.getElementById('register-btn').addEventListener('click', async () => {
    const jmeno = document.getElementById('username').value.trim();
    const heslo = document.getElementById('password').value.trim();
    const authMessage = document.getElementById('auth-message');

    if (!jmeno || !heslo) {
        authMessage.style.color = "red";
        authMessage.innerText = "Vyplň jméno i heslo!";
        return;
    }

    try {
        const response = await fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jmeno: jmeno, heslo: heslo })
        });
        const data = await response.json();

        if (data.status === "success") {
            authMessage.style.color = "green";
            authMessage.innerText = "Registrace úspěšná! Nyní se přihlas.";
            document.getElementById('password').value = "";
        } else {
            authMessage.style.color = "red";
            authMessage.innerText = data.message; 
        }
    } catch (error) {
        authMessage.style.color = "red";
        authMessage.innerText = "Chyba při komunikaci se serverem.";
    }
});

document.getElementById('login-btn').addEventListener('click', async () => {
    const jmeno = document.getElementById('username').value.trim();
    const heslo = document.getElementById('password').value.trim();
    const authMessage = document.getElementById('auth-message');

    if (!jmeno || !heslo) {
        authMessage.style.color = "red";
        authMessage.innerText = "Vyplň jméno i heslo!";
        return;
    }

    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jmeno: jmeno, heslo: heslo })
        });
        const data = await response.json();

        if (data.status === "success") {
            authMessage.style.color = "green";
            authMessage.innerText = "Přihlášení úspěšné!";
            prihlasenyUzivatel = data.user;

            localStorage.setItem('wordleUser', JSON.stringify(prihlasenyUzivatel))
            document.getElementById('show-profile-btn').classList.remove('hidden');
            document.getElementById('auth-screen').classList.add('hidden');

            document.getElementById('show-profile-btn').style.display = 'block';
            
        } else {
            authMessage.style.color = "red";
            authMessage.innerText = data.message;
        }
    } catch (error) {
        authMessage.style.color = "red";
        authMessage.innerText = "Chyba při komunikaci se serverem.";
    }
});

async function ulozVysledekHry(vysledek, prvniSlovo, pocetPokusu) {
    if (!prihlasenyUzivatel) return; 

    try {
        const response = await fetch('update_stats.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                jmeno: prihlasenyUzivatel.jmeno, 
                vysledek: vysledek,
                prvni_slovo: prvniSlovo,
                pocet_pokusu: pocetPokusu
            })
        });

        const data = await response.json();
        if (data.status === "success") {
            prihlasenyUzivatel.odehrane_hry = data.stats.odehrane_hry;
            prihlasenyUzivatel.vyhry = data.stats.vyhry;
            prihlasenyUzivatel.prohry = data.stats.prohry;
            prihlasenyUzivatel.celkove_body = data.stats.celkove_body;

            localStorage.setItem('wordleUser', JSON.stringify(prihlasenyUzivatel));
        }
    } catch (error) {
        console.error("Chyba při ukládání statistik:", error);
    }
}

let isLoginMode = true;

document.getElementById('auth-toggle-text').addEventListener('click', () => {
    isLoginMode = !isLoginMode; 
    
    const confirmInput = document.getElementById('password-confirm');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const toggleText = document.getElementById('auth-toggle-text');
    const authMessage = document.getElementById('auth-message');

    authMessage.innerText = "";

    if (isLoginMode) {

        confirmInput.classList.add('hidden');
        registerBtn.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        toggleText.innerText = 'Nemáš účet? Zaregistruj se.';
    } else {

        confirmInput.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        toggleText.innerText = 'Už máš účet? Přihlas se.';
    }
});

document.getElementById('show-profile-btn').addEventListener('click', () => {
    if (!prihlasenyUzivatel) {
        console.error("Chyba: Nikdo není přihlášen, profil nelze otevřít.");
        return; 
    }

    let hry = parseInt(prihlasenyUzivatel.odehrane_hry) || 0;
    let vyhry = parseInt(prihlasenyUzivatel.vyhry) || 0;
    let prohry = parseInt(prihlasenyUzivatel.prohry) || 0;
    let rate = hry > 0 ? ((vyhry / hry) * 100).toFixed(1) : 0;

    document.getElementById('prof-jmeno').innerText = prihlasenyUzivatel.jmeno || "Neznámý";
    document.getElementById('prof-hry').innerText = hry;
    document.getElementById('prof-vyhry').innerText = vyhry;
    document.getElementById('prof-prohry').innerText = prohry;
    document.getElementById('prof-rate').innerText = rate + "%";

    document.getElementById('profile-screen').classList.remove('hidden');
});

document.getElementById('close-profile-btn').addEventListener('click', () => {
    document.getElementById('profile-screen').classList.add('hidden');
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('wordleUser'); 
    prihlasenyUzivatel = null;
    
    document.getElementById('profile-screen').classList.add('hidden');
    document.getElementById('show-profile-btn').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    
    document.getElementById('password').value = "";
    
    const confirmInput = document.getElementById('password-confirm');
    if (confirmInput) confirmInput.value = "";
    
    document.getElementById('auth-message').innerText = "";
});

document.getElementById('close-profile-btn').addEventListener('click', () => {
});

loadWords();