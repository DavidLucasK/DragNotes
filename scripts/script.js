let color = document.getElementById('color');
let createBtn = document.getElementById('createBtn');
let list = document.getElementById('list');

//Carrega as notas salvas do localStorage quando abre o site
window.onload = () => {
    loadNotes();
};

// Função para salvar as notas no localStorage
function saveNotes() {
    // Starta um array de notas
    let notes = [];
    document.querySelectorAll('.note').forEach(note => {
        //Cada nota tem os seguintes valores a serem salvos no localStorage em um JSON
        let noteData = {
            content: note.querySelector('textarea').value,  // Salva o conteúdo do textarea
            borderColor: note.style.borderColor,
            left: note.style.left,
            top: note.style.top
        };
        // Salva os dados das notas nessa variavel de noteData que é salva.
        notes.push(noteData);
    });
    // Finalmente cria o item no localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Função para carregar as notas do localStorage
function loadNotes() {
    // Faz o parse do JSON que está no localStorage
    let notes = JSON.parse(localStorage.getItem('notes'));
    // Se houver alguma nota
    if (notes) {
        // Pra cada nota ele cria um elemento div com as mesmas exatas infos do localStorage
        notes.forEach(noteData => {
            let newNote = document.createElement('div');
            newNote.classList.add('note');
            newNote.innerHTML = 
            `<img src="./assets/Logo.png" alt="Logo" class="logo">
            <span class="close">x</span>
            <textarea 
            placeholder="Escreva aqui..."
            rows="10" cols="30">${noteData.content}</textarea>
            `;
            newNote.style.borderColor = noteData.borderColor;
            newNote.style.left = noteData.left;
            newNote.style.top = noteData.top;
            list.appendChild(newNote);
        });
    }
}

// Botão de + cria uma nova div da classe note
createBtn.onclick = () => {
    let newNote = document.createElement('div');
    newNote.classList.add('note');
    newNote.innerHTML = 
    `<img src="./assets/Logo.png" alt="Logo" class="logo">
    <span class="close">x</span>
    <textarea 
    placeholder="Escreva aqui..."
    rows="10" cols="30"></textarea>
    `;
    newNote.style.borderColor = color.value;
    list.appendChild(newNote);
    saveNotes(); // Salva as notas sempre que uma nova é criada
}

// Evento para remover a nota ao clicar no botão de fechar
document.addEventListener('click', (event) => {
    if(event.target.classList.contains('close')) {
        event.target.parentNode.remove();
        saveNotes(); // Salva as notas sempre que uma é removida
    }
});

// Variável para identificar na tela aonde está o cursor
let cursor = {
    x: null,
    y: null,
};

// Variável para identificar na tela aonde está a nota
let note = {
    dom: null,
    x: null,
    y: null,
};

// Evento quando o usuário clica na nota mas não solta o mouse
document.addEventListener('mousedown', (event) => {
    if(event.target.classList.contains('note')) {
        cursor = {
            x: event.clientX,
            y: event.clientY
        };
        note = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        };

        // Move a nota para o início da lista, fazendo ela ficar na frente das outras
        list.removeChild(note.dom); // Remove a nota da lista
        list.appendChild(note.dom); // Insere a nota na lista novamente fazendo com que fique na frente
    }
});

// Evento quando o usuário arrasta a nota clicada
document.addEventListener('mousemove', (event) => {
    if(note.dom == null) return;

    let cursorAtual = {
        x: event.clientX,
        y: event.clientY
    };

    let distancia = {
        x: cursorAtual.x - cursor.x,
        y: cursorAtual.y - cursor.y,
    };

    note.dom.style.left = (note.x + distancia.x) + 'px';
    note.dom.style.top = (note.y + distancia.y) + 'px';
    note.dom.style.cursor = 'grab';
});

// Evento de quando o usuário não está segurando mais o clique
document.addEventListener('mouseup', () => {
    if(note.dom == null) return;
    note.dom.style.cursor = 'auto';
    saveNotes(); // Salva as notas após mover
    note.dom = null;
});
