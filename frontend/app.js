const API_URL = "http://localhost:3000/api/notes";
let editId = null;
let selectedColor = "#ffeb3b";

// afficher notes
async function chargerNotes() {
    const res = await fetch(API_URL);
    const notes = await res.json();

    const mur = document.getElementById("mur");
    mur.innerHTML = "";

    notes.forEach(n => {
        mur.innerHTML += `
      <div class="post-it" style="background:${n.color || '#ffeb3b'}">
        <button class="delete-btn" onclick="supprimerNote(${n.id})">X</button>

        <div class="author">Votre nom : ${n.auteur}</div>
        <div class="content">Note : ${n.message}</div>

        <small>
            Date création : 
            ${n.date_creation
                ? new Date(n.date_creation).toLocaleString()
                : ""}
        </small>

        <button class="update_button" onclick='remplirForm(${n.id}, ${JSON.stringify(n.message)}, ${JSON.stringify(n.auteur)}, "${n.color}")'>
          Edit
        </button>
      </div>
    `;
    });
}

function remplirForm(id, message, auteur, color) {
    document.getElementById("auteur").value = auteur;
    document.getElementById("message").value = message;

    editId = id;
    selectedColor = color;

    document.getElementById("btnSubmit").innerText = "✏️ Modifier";
}

// ajouter note
async function ajouterNote() {
    const auteurInput = document.getElementById("auteur");
    const messageInput = document.getElementById("message");

    const auteur = auteurInput.value;
    const message = messageInput.value;

    if (!auteur || !message) {
        alert("champs obligatoires");
        return;
    }
    const color = selectedColor;

    if (editId !== null) {
        // update
        await fetch(`${API_URL}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, color })
        });
    } else {
        // create
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ auteur, message, color })
        });
    }

    // clear form
    auteurInput.value = "";
    messageInput.value = "";

    chargerNotes();
}

// delete
async function supprimerNote(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    chargerNotes();
}
// update
async function modifierNote(id) {
    const newMessage = prompt("Modifier le message:");

    if (!newMessage) return;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newMessage })
    });

    chargerNotes();
}

// select color


function selectColor(color) {
    selectedColor = color;

    document.querySelectorAll(".color-circle").forEach(c => {
        c.classList.remove("active");
    });

    event.target.classList.add("active");
}
chargerNotes();