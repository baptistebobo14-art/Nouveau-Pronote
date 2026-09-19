/*==========================================================
MonPronote Ultimate V3
SCRIPT.JS
BLOC 1 - FONDATION
==========================================================*/

//==========================================================
// APPLICATION
//==========================================================

const APP = {
    name: "MonPronote Ultimate",
    version: "3.0"
};

//==========================================================
// DONNÉES
//==========================================================

const DB = {

    students: [],
    notes: [],
    averages: [],
    bulletins: [],
    bulletinAppreciations: [],
    timetable: [],
    competences: [],
    vie: [],
    travaux: [],
    travauxStatuts: [],
    cahier: [],
    homework: [],
    absences: [],
    sanctions: [],
    rewards: [],
    quests: [],
    events: [],
    teachers: [],
    subjects: [],
    courses:[],
    classes: [],
    users: [

{
    id: 1,
    role: "prof",
    username: "prof",
    password: "prof123",
    name: "Professeur"
}

],

};

//==========================================================
// ÉTAT DE L'APPLICATION
//==========================================================

const STATE = {

    page: "dashboard",
    selectedStudent: null,
    selectedTrimester: 1,

    // 🔎 Filtres de la page Notes
    notesStudentFilter: "",
    notesTrimesterFilter: ""

};

//==========================================================
// ÉLÉMENTS HTML
//==========================================================

const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const menuButtons = document.querySelectorAll(".menu-btn");

//==========================================================
// INFORMATIONS DES PAGES
//==========================================================

const PAGES = {

dashboard:{
title:"Accueil",
subtitle:"Vue d'ensemble"
},

eleves:{
title:"Élèves",
subtitle:"Gestion des élèves"
},

notes:{
title:"Notes",
subtitle:"Espace Notes"
},

moyennes:{
title:"Moyennes",
subtitle:"Espace Moyennes"
},

bulletin:{
    title:"Bulletins",
    subtitle:"Bulletins scolaires"
},

cahier:{
    title:"Cahier de textes",
    subtitle:"Cours et devoirs"
},

vie:{
title:"Vie scolaire",
subtitle:"Absences • Retards • Sanctions"
},

a_faire:{
    title:"Travail à faire",
    subtitle:"Devoirs à réaliser"
},

parametres:{
title:"Paramètres",
subtitle:"Configuration"

}

};

const SUPABASE_URL = "https://dizertsuirtrqxvuapfu.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_0t9WNi96r7B_flVssFKqxw_eYjeQ9ed";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY

);

async function loadBulletinAppreciations(){

    const { data, error } = await supabaseClient
        .from("bulletin_appreciations")
        .select("*");

    if(error){
        console.error("Erreur chargement appréciations bulletin :", error);
        return;
    }

    DB.bulletinAppreciations = data || [];

    if(STATE.page === "bulletin"){
        const div = document.getElementById("bulletinContent");

        if(div){
            div.innerHTML = renderBulletin();
        }
    }
}

//==========================================================
// INITIALISATION
//==========================================================

document.addEventListener("DOMContentLoaded",initApp);

function initApp(){

initMenu();

showPage("dashboard");

loadStudents();
loadVie();
loadNotes();
loadBulletinAppreciations();
loadCahier();
loadTravauxStatuts();
loadTravaux();

isLogged = false;

currentUser = null;

document
.getElementById("loginOverlay")
.classList.remove("hidden");

}

//==========================================================
// MENU
//==========================================================

function initMenu(){

menuButtons.forEach(button=>{

button.addEventListener("click",()=>{

showPage(button.dataset.page);

});

});

}

//==========================================================
// CHANGER DE PAGE
//==========================================================

function showPage(page){

    console.log("PAGE DEMANDÉE :", page);
    console.log("PAGES DISPONIBLES :", Object.keys(PAGES));

    STATE.page=page;

menuButtons.forEach(button=>{

button.classList.toggle(

"active",

button.dataset.page===page

);

});

pageTitle.textContent=PAGES[page].title;
pageSubtitle.textContent=PAGES[page].subtitle;

render();

}

//==========================================================
// MOTEUR D'AFFICHAGE
//==========================================================

function render(){

switch(STATE.page){

case "dashboard":
content.innerHTML = dashboardPage();
break;

case "eleves":
content.innerHTML = elevesPage();
break;

case "notes":
content.innerHTML = notesPage();
break;

case "moyennes":
content.innerHTML = moyennesPage();
break;

case "bulletin":
content.innerHTML = bulletinPage();
break;

case "cahier":
content.innerHTML = cahierPage();
break;

case "a_faire":
content.innerHTML = travauxPage();
break;

case "emploi":
content.innerHTML = emploiPage();
break;

case "competences":
content.innerHTML = competencesPage();
break;

case "vie":
content.innerHTML = viePage();
break;

case "travaux":
content.innerHTML = travauxPage();
break;

case "recompenses":
content.innerHTML = recompensesPage();
break;

case "quetes":
content.innerHTML = quetesPage();
break;

case "events":
content.innerHTML = eventsPage();
break;

case "parametres":
content.innerHTML = parametresPage();
break;

default:
content.innerHTML="<div class='card'><h2>Erreur</h2></div>";

}

}

//==========================================================
// ACCUEIL V3
//==========================================================

function dashboardPage(){

return `

<div class="dashboard-grid">

<div class="dashboard-card">
<h2>📅 Emploi du temps du jour</h2>
<p>Aucun cours aujourd'hui.</p>
</div>

<div class="dashboard-card">
<h2>📝 Dernières notes</h2>
<p>

${dashboardLastNotes()}

</p>
</div>

<div class="dashboard-card">
<h2>📚 Travail à faire</h2>
<p>${dashboardLastWorks()}</p>
</div>

<div class="dashboard-card">
<h2>📊 Moyenne générale</h2>
<h1>

${dashboardAverage()}

</h1>
</div>

<div class="dashboard-card">
<h2>⚠️ Vie scolaire</h2>
<p>${dashboardVie()}</p>
</div>

<div class="dashboard-card">
<h2>🏆 Récompenses</h2>
<p>${dashboardRewards()}</p>
</div>

<div class="dashboard-card">
<h2>🎯 Quêtes</h2>
<p>Aucune quête active.</p>
</div>

<div class="dashboard-card">
<h2>🎉 Évènements spéciaux</h2>
<p>${dashboardEvents()}</p>
</div>

</div>

<div class="dashboard-stats">

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>👨‍🎓 Élèves</h3>

<h1>${DB.students.length}</h1>

</div>

<div class="dashboard-card">

<h3>📝 Notes</h3>

<h1>${DB.notes.length}</h1>

</div>

<div class="dashboard-card">

<h3>📚 Travaux</h3>

<h1>${DB.travaux.length}</h1>

</div>

<div class="dashboard-card">

<h3>🏆 Récompenses</h3>

<h1>${DB.rewards.length}</h1>

</div>

<div class="dashboard-card">

<h3>🎯 Quêtes</h3>

<h1>${DB.quests.length}</h1>

</div>

<div class="dashboard-card">

<h3>🎉 Évènements</h3>

<h1>${DB.events.length}</h1>

</div>

</div>

<div class="activity-card">

<h2>🕒 Activité récente</h2>

${renderRecentActivity()}

</div>

`;

}

//==========================================================
// ÉLÈVES V3
//==========================================================

function elevesPage(){

return `

<div class="cards">

<div class="card">

<h2>➕ Ajouter un élève</h2>

<input id="studentLastname" placeholder="Nom">

<br><br>

<input id="studentFirstname" placeholder="Prénom">

<br><br>

<input id="studentClass" placeholder="Classe">

<br><br>

<button onclick="addStudent()">

Ajouter l'élève

</button>

</div>

<div class="card">

<h2>👨‍🎓 Liste des élèves</h2>

<div id="studentsList">

${renderStudents()}

</div>

</div>

</div>

`;

}

async function addStudent(){

if(!requireProf()) return;

const lastname = document.getElementById("studentLastname").value.trim();
const firstname = document.getElementById("studentFirstname").value.trim();
const classe = document.getElementById("studentClass").value.trim();

if(lastname==="" || firstname===""){
    alert("Nom et prénom obligatoires.");
    return;
}

const username = prompt(
    "Identifiant de connexion :",
    (firstname + "." + lastname)
        .toLowerCase()
        .replaceAll(" ", "")
);

if(username === null) return;

const password = prompt(
    "Mot de passe :",
    "123456"
);

if(password === null) return;

if(username.trim() === "" || password.trim() === ""){

    alert("L'identifiant et le mot de passe sont obligatoires.");

    return;

}

const student = {

    lastname,
    firstname,
    classe,

    username: username.trim(),

    password: password.trim()

};

const { error } = await supabaseClient
.from("students")
.insert([student]);

if(error){

console.error(error);
alert("Erreur Supabase : "+error.message);
return;

}

await loadStudents();

}

function renderStudents(){

if(DB.students.length===0){
return "<p>Aucun élève enregistré.</p>";
}

return DB.students.map(student=>`

<div class="student-card">

<div
style="flex:1;cursor:pointer;"
onclick="openStudent(${student.id})">

<strong>${student.lastname}</strong>

${student.firstname}

<br>

🏫 ${student.classe}

</div>

<div>

<button class="edit-btn" onclick="event.stopPropagation()">✏️</button>

<button class="delete-btn"
onclick="event.stopPropagation();deleteStudent(${student.id})">

🗑️

</button>

<button onclick="changeStudentPassword(${student.id})">

🔑 Mot de passe

</button>

</div>

</div>

`).join("");

}

//==========================================================
// FICHE ÉLÈVE
//==========================================================

let openedStudent=null;
let currentUser = null;
let isLogged = false;

//==========================================================
// PERMISSIONS
//==========================================================

function isProf(){
    return currentUser?.role === "prof";
}

function isEleve(){
    return currentUser?.role === "eleve";
}

function getConnectedStudentId(){

    if(!isEleve()) return null;

    return Number(
        currentUser.studentId ||
        currentUser.student_id
    );
}

function canEdit(){
    return isProf();
}

function canViewStudent(studentId){

    if(isProf()) return true;

    if(isEleve()){
        return Number(studentId) === getConnectedStudentId();
    }

    return false;
}

function requireProf(){

    if(!isProf()){

        alert("🔒 Cette action est réservée au professeur.");

        return false;
    }

    return true;
}

//==========================================================
// 🔒 FILTRE DES DONNÉES POUR UN ÉLÈVE
//==========================================================

function applyStudentDataScope(){

    if(isProf()){
        return;
    }

    if(!isEleve()){
        return;
    }

    const studentId = getConnectedStudentId();

    if(!studentId){
        return;
    }

    DB.students = DB.students.filter(
        s => Number(s.id) === Number(studentId)
    );

    DB.notes = DB.notes.filter(
        note => Number(note.studentId) === Number(studentId)
    );

    DB.competences = DB.competences.filter(
        comp => Number(comp.studentId) === Number(studentId)
    );

    DB.vie = DB.vie.filter(
        event => Number(event.studentId) === Number(studentId)
    );

    DB.rewards = DB.rewards.filter(
        reward => Number(reward.studentId) === Number(studentId)
    );

    DB.quests = DB.quests.filter(
        quest => Number(quest.studentId) === Number(studentId)
    );

    DB.travauxStatuts = DB.travauxStatuts.filter(
        statut => Number(statut.student_id) === Number(studentId)
    );

    DB.bulletinAppreciations =
        DB.bulletinAppreciations.filter(
            appreciation =>
                Number(appreciation.student_id) === Number(studentId)
        );

}

function openStudent(id){

openedStudent=DB.students.find(s=>s.id===id);

if(!openedStudent) return;

content.innerHTML=studentProfilePage();

}

function studentProfilePage(){

const s=openedStudent;

return `

<div class="card">

<button onclick="showPage('eleves')">

⬅ Retour

</button>

<br><br>

<div style="text-align:center;">

<div
style="
width:150px;
height:150px;
border-radius:50%;
background:#2563eb;
margin:auto;
display:flex;
justify-content:center;
align-items:center;
font-size:55px;
color:white;
font-weight:700;
">

${s.photo
?
`<img src="${s.photo}" style="width:150px;height:150px;border-radius:50%;object-fit:cover;">`
:
"👨‍🎓"
}

<br>

<button onclick="changeStudentPhoto()">

📸 Changer la photo

</button>

<br><br>

</div>

<br>

<h2>

${s.firstname} ${s.lastname}

</h2>

</div>

<br>

<p><strong>Classe :</strong> ${s.classe||"-"}</p>

<p><strong>Groupe :</strong> ${s.group||"-"}</p>

<p><strong>Date de naissance :</strong> ${s.birth||"-"}</p>

<p><strong>Mail :</strong> ${s.mail||"-"}</p>

<p><strong>Téléphone :</strong> ${s.phone||"-"}</p>

<p><strong>Adresse :</strong> ${s.address||"-"}</p>

<hr style="margin:25px 0">

<p><strong>🆔 Identifiant :</strong> ${s.identifier||"-"}</p>

<p><strong>🚻 Sexe :</strong> ${s.gender||"-"}</p>

<p><strong>👨 Responsable légal :</strong> ${s.parentName||"-"}</p>

<p><strong>📞 Téléphone responsable :</strong> ${s.parentPhone||"-"}</p>

<p><strong>📧 Mail responsable :</strong> ${s.parentMail||"-"}</p>

<p><strong>🍽 Régime :</strong> ${s.diet||"-"}</p>

<p><strong>🚌 Transport :</strong> ${s.transport||"-"}</p>

<p><strong>📝 Observations :</strong></p>

<div class="card" style="margin-top:10px;background:#f8fafc;">

${s.observations||"Aucune observation."}

</div>

<br>

<button onclick="editStudentProfile(openedStudent.id)">

✏ Modifier les informations

</button>

</div>

`;

}

//==========================================================
// MODIFICATION FICHE ÉLÈVE
//==========================================================

async function editStudentProfile(id){

if(!requireProf()) return;

const s=DB.students.find(student=>student.id===id);

if(!s) return;

const lastname=prompt("Nom :",s.lastname);
if(lastname===null) return;

const firstname=prompt("Prénom :",s.firstname);
if(firstname===null) return;

const classe=prompt("Classe :",s.classe);
if(classe===null) return;

const group=prompt("Groupe :",s.group||"");
if(group===null) return;

const birth=prompt("Date de naissance :",s.birth||"");
if(birth===null) return;

const mail=prompt("Mail :",s.mail||"");
if(mail===null) return;

const phone=prompt("Téléphone :",s.phone||"");
if(phone===null) return;

const address=prompt("Adresse :",s.address||"");
if(address===null) return;

s.lastname=lastname;
s.firstname=firstname;
s.classe=classe;
s.group=group;
s.birth=birth;
s.mail=mail;
s.phone=phone;
s.address=address;

const { error } = await supabaseClient
.from("students")
.update({

lastname: s.lastname,
firstname: s.firstname,
classe: s.classe,
username: s.username || "",
password: s.password || ""

})
.eq("id", s.id);

if(error){

console.error(error);
alert("Erreur Supabase : " + error.message);
return;

}

await loadStudents();

openStudent(id);

}

//==========================================================
// PHOTO ÉLÈVE
//==========================================================

function changeStudentPhoto(){

const url=prompt("Lien de la photo :");

if(url===null) return;

openedStudent.photo=url.trim();

openStudent(openedStudent.id);

}

/*==================================================
MODULE NOTES
BASE DE DONNÉES
==================================================*/

DB.notes = [];

/*==================================================
LISTES PRONOTE
==================================================*/

const NOTE_SUBJECTS = [

"Cours annulé ⚠️",
"Prof. absent ⚠️",
"Vie Scolaire ⚠️",
"Cours maintenu/REMPLACEMENT 🔵",
"Matière Non Désignée",
"Devoirs Faits 📚",
"Mathématiques 🟰",
"Français 🇫🇷",
"Histoire-Géographie 🌍",
"EMC ⚖️",
"SVT 🧬",
"Physique-Chimie 🧪",
"Technologie 💻",
"Anglais 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
"Espagnol 🇪🇸",
"Arts Plastiques 🎨",
"Éducation Musicale 🎶",
"Sport ⚽🏉"

];

const NOTE_TRIMESTERS = [

"Trimestre 1",
"Trimestre 2",
"Trimestre 3",
"Trimestre 4",
"Trimestre 5"

];

const NOTE_TYPES = [

"Contrôle 📝",
"Évaluation 🎯",
"Interrogation 📝",
"Oral 🗣️",
"Projet 💡🧠",
"Devoir Maison 🏡",
"Exposé"

];

const NOTE_SCALES = [

5,
10,
15,
20,
25,
30,
35,
40,
45,
50,
55,
60,
65,
70,
75,
80,
85,
90,
95,
100,
125,
150,
175,
200,
225,
250,
275,
300,
325,
350,
375,
400,
425,
450,
475,
500,
525,
550,
575,
600,
625,
650,
675,
700,
725,
750,
775,
800,
825,
850

];

const NOTE_COEFS = [

0,
0.1,
0.25,
0.5,
0.75,
1,
1.25,
1.5,
1.75,
2,
2.25,
2.5,
2.75,
3,
3.25,
3.5,
3.75,
4,
4.25,
4.5,
4.75,
5

];

const COMPETENCE_LEVELS = [
"🟢 Très bonne maîtrise",
"🔵 Maîtrise satisfaisante",
"🟠 Maîtrise fragile",
"🔴 Maîtrise insuffisante"

];

const VIE_TYPES = [

"⚠️ Absence",

"⏰ Retard",

"🚫 Exclusion",

"📝 Observation",

"📚 Punition",

"❗ Avertissement"

];

const CLASSES = [

"6A","6B","6C","6D","6E",

"5A","5B","5C","5D","5E",

"4A","4B","4C","4D","4E",

"3A","3B","3C","3D","3E"

];

const REWARD_TYPES = [

"🏆 Félicitations",

"👏 Encouragements",

"💯 Compliments",

"⭐ Excellent travail",

"📚 Investissement",

"🤝 Esprit d'équipe",

"🙌 Participation",

"📈 Progression remarquable",

"🎖 Assiduité",

"😊 Comportement exemplaire",

"❤️ Aide aux autres",

"✔ Respect"

];

const REWARD_LEVELS = [

"🥉 Bronze",

"🥈 Argent",

"🥇 Or",

"💎 Diamant",

"👑 Exceptionnel"

];

const QUEST_LEVELS = [

"🟢 Facile",

"🔵 Moyen",

"🟠 Difficile",

"🔴 Expert",

"⚫ Légendaire"

];

const QUEST_REWARDS = [

"🏆 Badge",

"⭐ XP",

"🎁 Bonus",

"🥇 Médaille",

"💎 Trophée",

"👑 Récompense spéciale"

];

const EVENT_TYPES = [

"🎄 Noël",

"🎃 Halloween",

"🎆 Fête de fin d'année",

"📝 Contrôle commun",

"🏫 Portes ouvertes",

"🎉 Journée spéciale",

"🎉 Semaine spéciale",

"📢 Réunion"

];

const EVENT_PUBLIC = [

"Toute l'école",

"6e",

"5e",

"4e",

"3e",

"Une classe",

"Professeurs",

"Personnel"

];

const EVENT_COLORS = [

"🔵 Bleu",

"🟢 Vert",

"🟠 Orange",

"🔴 Rouge",

"🟣 Violet",

"🟡 Jaune",

"⚫ Gris"

];

const SETTINGS={

schoolName:"MonPronote Ultimate",

city:"Argelès-sur-Mer",

academy:"Académie de Montpellier",

schoolYear:"2026-2027",

theme:"Clair",

primary:"#2563eb",

secondary:"#16a34a",

enableRewards:true,

enableQuests:true,

enableCompetences:true,

enableAverages:true,

enableNotifications:true

};

const EDT_DAYS=[

"Lundi",

"Mardi",

"Mercredi",

"Jeudi",

"Vendredi",

"Samedi",

"Dimanche"

];

const EDT_HOURS=[

"07:00-07:30",

"07:30-08:00",

"08:00-08:30",

"08:30-09:00",

"09:00-09:30",

"09:30-10:00",

"10:00-10:30",

"10:30-11:00",

"11:00-11:30",

"11:30-12:00",

"12:00-12:30",

"12:30-13:00",

"13:00-13:30",

"13:30-14:00",

"14:00-14:30",

"14:30-15:00",

"15:00-15:30",

"15:30-16:00",

"16:00-16:30",

"16:30-17:00",

"17:00-17:30",

"17:30-18:00",

"18:00-18:30",

"18:30-19:00",

"19:00-19:30",

"19:30-20:00",

"20:00-20:30",

"20:30-21:00",

"21:00-21:30",

"21:30-22:00",

"22:00-22:30",

"22:30-23:00",

"23:00-23:30"

];

const SUBJECT_COLORS={

"Mathématiques":"#3b82f6",

"Français":"#ef4444",

"Histoire-Géographie":"#f59e0b",

"SVT":"#16a34a",

"Physique-Chimie":"#8b5cf6",

"Anglais":"#06b6d4",

"Espagnol":"#ec4899",

"EMC":"#6b7280",

"Technologie":"#0f766e",

"Arts Plastiques":"#d97706",

"Musique":"#7c3aed",

"EPS":"#22c55e"

};

/*==================================================
PAGE NOTES
==================================================*/

function notesPage(){

    return `

    <div class="notes-layout">

        <!-- AJOUT D'UNE NOTE -->
        <div class="notes-left">

            <h3>➕ Ajouter une note</h3>

            <label>Choisir un élève</label>

            <select id="noteStudent">

                ${DB.students.map(student => `

                    <option value="${student.id}">
                        ${student.lastname} ${student.firstname}
                    </option>

                `).join("")}

            </select>

            <br><br>

            <label>Titre de l'évaluation</label>

            <input
                id="noteTitle"
                placeholder="Ex : Contrôle Chapitre 5"
            >

            <br><br>

            <label>Choisir la matière</label>

            <select id="noteSubject">

                ${NOTE_SUBJECTS.map(subject => `

                    <option>${subject}</option>

                `).join("")}

            </select>

            <br><br>

            <label>Choisir un trimestre</label>

            <select id="noteTrimester">

                ${NOTE_TRIMESTERS.map(trimester => `

                    <option>${trimester}</option>

                `).join("")}

            </select>

            <br><br>

            <label>Choisir le type</label>

            <select id="noteType">

                ${NOTE_TYPES.map(type => `

                    <option>${type}</option>

                `).join("")}

            </select>

            <br><br>

            <label>Note</label>

            <input
                id="noteValue"
                type="number"
                min="0"
            >

            <br><br>

            <label>Barème</label>

            <select id="noteScale">

                ${NOTE_SCALES.map(scale => `

                    <option>${scale}</option>

                `).join("")}

            </select>

            <br><br>

            <label>Coefficient</label>

            <select id="noteCoef">

                ${NOTE_COEFS.map(coef => `

                    <option>${coef}</option>

                `).join("")}

            </select>

            <br><br>

            <button onclick="addNote()">
                ➕ Ajouter la note
            </button>

        </div>


        <!-- FILTRES -->
        <div class="notes-right">

            <h3>🔎 Affichage des notes</h3>

            ${
                isProf()
                ?
                `

                <label>👨‍🎓 Élèves</label>

                <select
                    id="filterStudent"
                    onchange="refreshNotesTable()"
                >

                    <option value="" ${STATE.notesStudentFilter === "" ? "selected" : ""}>
    Tous les élèves
</option>

                    ${DB.students.map(student => `

                        <option value="${student.id}" ${String(STATE.notesStudentFilter) === String(student.id) ? "selected" : ""}>
    ${student.lastname} ${student.firstname}
</option>

                    `).join("")}

                </select>

                `
                :
                `

                <div style="
                    padding:12px;
                    background:#f8fafc;
                    border-radius:12px;
                    font-weight:600;
                ">
                    👨‍🎓 Mes notes
                </div>

                `
            }

            <br><br>

            <label>📅 Trimestre</label>

            <select
                id="filterTrimester"
                onchange="refreshNotesTable()"
            >

                <option value="" ${STATE.notesTrimesterFilter === "" ? "selected" : ""}>
    Tous les trimestres
</option>

                ${NOTE_TRIMESTERS.map(trimester => `

                    <option value="${trimester}" ${String(STATE.notesTrimesterFilter) === String(trimester) ? "selected" : ""}>
    ${trimester}
</option>

                `).join("")}

            </select>

            <br><br>

            <button onclick="refreshNotesTable()">
                🔄 Actualiser
            </button>

        </div>

    </div>


    <!-- NOTES ENREGISTRÉES -->
    <div class="card">

        <h3>📋 Notes enregistrées</h3>

        <div id="notesTableBody">

            ${renderNotes()}

        </div>

    </div>

    `;

}

/*==================================================
TABLEAU DES NOTES
==================================================*/

function renderNotes(list = DB.notes){

    if(isEleve()){

        const studentId =
            Number(getConnectedStudentId());

        list = list.filter(note =>
            Number(note.studentId) === studentId
        );

    }


    if(!list || list.length === 0){

        return `
            <p style="
                padding:15px;
                color:#777;
                font-weight:600;
            ">
                Aucune note à afficher.
            </p>
        `;

    }


    const grouped = {};


    list.forEach(note => {

        const subject =
            note.subject || "Matière non désignée";


        if(!grouped[subject]){

            grouped[subject] = [];

        }


        grouped[subject].push(note);

    });


    return Object.keys(grouped)
        .sort()
        .map(subject => {

            const notes =
                grouped[subject];


            return `

                <div class="notes-subject-block">

                    <div class="notes-subject-title">
                        📚 ${subject}
                    </div>

                    <div class="notes-subject-list">

                        ${notes.map(note => {

                            const value =
                                parseFloat(note.value);

                            const outof =
                                parseFloat(note.outof);


                            let displayNote =
                                note.value || "—";


                            if(
                                !isNaN(value) &&
                                !isNaN(outof) &&
                                outof > 0
                            ){

                                displayNote =
                                    `${value}/${outof}`;

                            }


                            return `

                                <div
                                    class="note-card"
                                    onclick="showNoteDetail(${note.id})"
                                >

                                    <div class="note-card-main">

                                        <div class="note-card-title">

                                            ${
                                                note.title ||
                                                "Évaluation sans titre"
                                            }

                                        </div>


                                        <div class="note-card-info">

                                            ${
                                                note.type ||
                                                "Évaluation"
                                            }

                                            ${
                                                note.trimester
                                                ?
                                                " • Trimestre " +
                                                note.trimester
                                                :
                                                ""
                                            }

                                        </div>

                                    </div>


                                    <div class="note-card-value">

                                        ${displayNote}

                                    </div>


                                    ${
                                        isProf()
                                        ?
                                        `

                                        <div class="note-buttons">

                                            <button
                                                class="edit-btn"
                                                onclick="
                                                    event.stopPropagation();
                                                    editNote(${note.id});
                                                "
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                class="delete-btn"
                                                onclick="
                                                    event.stopPropagation();
                                                    deleteNote(${note.id});
                                                "
                                            >
                                                🗑️
                                            </button>

                                        </div>

                                        `
                                        :
                                        ""
                                    }

                                </div>

                            `;

                        }).join("")}

                    </div>

                </div>

            `;

        })
        .join("");

}

function refreshNotesTable(){

        const studentFilter =
        document.getElementById("filterStudent")?.value || "";

    const trimesterFilter =
        document.getElementById("filterTrimester")?.value || "";

    // 🔎 Mémoriser les filtres
    STATE.notesStudentFilter = studentFilter;
    STATE.notesTrimesterFilter = trimesterFilter;

    let filteredNotes =
        [...DB.notes];


    // 👨‍🎓 Élève connecté
    if(isEleve()){

        const studentId =
            Number(getConnectedStudentId());

        filteredNotes =
            filteredNotes.filter(note =>
                Number(note.studentId) === studentId
            );

    }


    // 👨‍🏫 Filtre élève du professeur
    if(
        isProf() &&
        studentFilter !== ""
    ){

        filteredNotes =
            filteredNotes.filter(note =>
                Number(note.studentId) ===
                Number(studentFilter)
            );

    }


    // 📅 Filtre trimestre
    if(trimesterFilter !== ""){

        const trimesterNumber =
            trimesterFilter.match(/\d+/)?.[0];


        filteredNotes =
            filteredNotes.filter(note =>
                String(note.trimester) ===
                String(trimesterNumber)
            );

    }


    const container =
        document.getElementById("notesTableBody");


    if(!container){
        return;
    }


    container.innerHTML =
        renderNotes(filteredNotes);

}

/*==================================================
AJOUT D'UNE NOTE
==================================================*/

async function addNote(){

    if(!requireProf()) return;

const studentId = Number(document.getElementById("noteStudent").value);

const title = document.getElementById("noteTitle").value.trim();

const subject = document.getElementById("noteSubject").value;

const trimesterText = document.getElementById("noteTrimester").value;

const trimesterMatch = trimesterText.match(/\d+/);

const trimester = trimesterMatch
    ? Number(trimesterMatch[0])
    : null;

const type = document.getElementById("noteType").value;

const value = document
.getElementById("noteValue")
.value
.trim()
.replace(",",".");

const scale = Number(document.getElementById("noteScale").value);

const coef = Number(document.getElementById("noteCoef").value);

if(title===""){

alert("Le titre de l'évaluation est obligatoire.");

return;

}

const specialValues = ["ABS","N.NOT","N.RD"];

if(
isNaN(parseFloat(value)) &&
!specialValues.includes(value.toUpperCase())
){

alert("Veuillez saisir une note.");

return;

}

    // 🔎 Mémoriser les filtres actuels avant de recharger la page
    STATE.notesStudentFilter =
        document.getElementById("filterStudent")?.value || "";

    STATE.notesTrimesterFilter =
        document.getElementById("filterTrimester")?.value || "";

const note = {

studentId,

subject,

value: value.toUpperCase(),

outof: scale,

coefficient: coef,

date: new Date().toLocaleDateString("fr-FR"),

trimester: trimester,

commentary: title,

type: type

};

const { error } = await supabaseClient
.from("notes")
.insert([note]);

if(error){

console.error(error);

alert("Erreur Supabase : " + error.message);

return;

}

const selectedStudentFilter =
    document.getElementById("filterStudent")?.value || "";

const selectedTrimesterFilter =
    document.getElementById("filterTrimester")?.value || "";

await loadNotes();

showPage("notes");

const studentFilter =
    document.getElementById("filterStudent");

const trimesterFilter =
    document.getElementById("filterTrimester");

if(studentFilter){
    studentFilter.value = selectedStudentFilter;
}

if(trimesterFilter){
    trimesterFilter.value = selectedTrimesterFilter;
}

refreshNotesTable();

showToast("✅ Note ajoutée avec succès.");

}

function showToast(message){

alert(message);

}

/*==================================================
MODIFIER UNE NOTE
==================================================*/

async function editNote(id){

    const note = DB.notes.find(n => n.id === id);

    if(!note) return;

    const title = prompt(
        "Titre de l'évaluation :",
        note.title || ""
    );

    if(title === null) return;


    const valueInput = prompt(
        "Note :",
        note.value ?? ""
    );

    if(valueInput === null) return;


    const coefInput = prompt(
        "Coefficient :",
        note.coefficient ?? ""
    );

    if(coefInput === null) return;


    const valueText = valueInput
        .trim()
        .replace(",", ".");

    const specialValues = [
        "ABS",
        "N.NOT",
        "N.RD"
    ];

    if(
        isNaN(parseFloat(valueText)) &&
        !specialValues.includes(valueText.toUpperCase())
    ){

        alert(
            "Note invalide.\n\n" +
            "Tu peux mettre une note comme 14,5 ou :\n" +
            "ABS\nN.Not\nN.Rd"
        );

        return;

    }


    const coefficient = Number(
        coefInput.replace(",", ".")
    );

    if(isNaN(coefficient)){

        alert("Coefficient invalide.");

        return;

    }


    const value = specialValues.includes(
        valueText.toUpperCase()
    )
        ? valueText.toUpperCase()
        : Number(valueText);


    const { error } = await supabaseClient

        .from("notes")

        .update({

            commentary: title,

            value: value,

            coefficient: coefficient

        })

        .eq("id", id);


    if(error){

        console.error(error);

        alert(
            "Erreur Supabase : " +
            error.message
        );

        return;

    }


    await loadNotes();

    showPage("notes");

    showToast("✏️ Note modifiée.");

}

/*==================================================
SUPPRIMER UNE NOTE
==================================================*/

async function deleteNote(id){

    if(!requireProf()) return;

    if(!confirm("Supprimer cette note ?")) return;

    const { error } = await supabaseClient
        .from("notes")
        .delete()
        .eq("id", id);

    if(error){

        console.error(error);

        alert(
            "Erreur Supabase : " +
            error.message
        );

        return;

    }

    await loadNotes();

    showPage("notes");

    showToast("🗑️ Note supprimée.");

}

/*==================================================
CALCUL DES MOYENNES
==================================================*/

function calculateStudentAverage(studentId, trimester = ""){

    const notes = DB.notes.filter(note => {

        if(Number(note.studentId) !== Number(studentId)){
            return false;
        }

        if(trimester !== ""){

            const noteTrimester =
                String(note.trimester)
                    .replace("Trimestre ", "");

            const selectedTrimester =
                String(trimester)
                    .replace("Trimestre ", "");

            if(noteTrimester !== selectedTrimester){
                return false;
            }

        }

        return !isNaN(
            parseFloat(
                String(note.value)
                    .replace(",", ".")
            )
        );

    });

    if(notes.length === 0){
        return "-";
    }

    let total = 0;
    let totalCoef = 0;

    notes.forEach(note => {

        const value =
            parseFloat(
                String(note.value)
                    .replace(",", ".")
            );

        const scale =
            Number(note.outof) || 20;

        const coef =
            Number(note.coefficient) || 1;

        const value20 =
            (value / scale) * 20;

        total += value20 * coef;

        totalCoef += coef;

    });

    if(totalCoef === 0){
        return "-";
    }

    return (total / totalCoef).toFixed(2);
}

function getNoteDisplay(note){

const value = Number(note.value);
const scale = Number(note.outof)||20;

if(scale===20){

return `
<div><strong>${value}/20</strong></div>
<div style="color:#16a34a;font-size:12px;margin-top:4px;">
✅ Déjà sur 20
</div>
`;

}

const value20=((value/scale)*20).toFixed(2);

return `
<div><strong>${value}/${scale}</strong></div>
<div style="color:#2563eb;font-size:12px;margin-top:4px;">
🔄 Ramené sur 20 : <strong>${value20}/20</strong>
</div>
`;

}

function calculateSubjectAverage(studentId, subject, trimester = ""){

    const notes = DB.notes.filter(note => {

        if(Number(note.studentId) !== Number(studentId)){
            return false;
        }

        if(note.subject !== subject){
            return false;
        }

        if(trimester !== ""){

            const noteTrimester =
                String(note.trimester)
                    .replace("Trimestre ", "")
                    .trim();

            const selectedTrimester =
                String(trimester)
                    .replace("Trimestre ", "")
                    .trim();

            if(noteTrimester !== selectedTrimester){
                return false;
            }

        }

        // ABS / N.Not / N.Rd ne comptent pas
        return !isNaN(
            parseFloat(
                String(note.value)
                    .replace(",", ".")
            )
        );

    });


    if(notes.length === 0){
        return "-";
    }


    let total = 0;
    let totalCoef = 0;


    notes.forEach(note => {

        const value =
            parseFloat(
                String(note.value)
                    .replace(",", ".")
            );

        const scale =
            Number(note.outof) || 20;

        const coef =
            Number(note.coefficient) || 1;


        const value20 =
            (value / scale) * 20;


        total += value20 * coef;

        totalCoef += coef;

    });


    if(totalCoef === 0){
        return "-";
    }


    return (total / totalCoef).toFixed(2);

}

/*==================================================
PAGE MOYENNES
==================================================*/

function moyennesPage(){

return `

<div class="cards">

<div class="card" style="width:320px;">

<h2>📊 Filtres</h2>

<label>Choisir un élève</label>

<select id="averageStudent" onchange="refreshAverages()">

${DB.students.map(student=>`

<option value="${student.id}">

${student.lastname} ${student.firstname}

</option>

`).join("")}

</select>

<br><br>

<label>Choisir un trimestre</label>

<select id="averageTrimester" onchange="refreshAverages()">

<option value="">Tous les trimestres</option>

${NOTE_TRIMESTERS.map(t=>`

<option>${t}</option>

`).join("")}

</select>

</div>

<div class="card" style="flex:1;">

<h2>📈 Moyennes</h2>

<div id="averageTable">

${renderAverageTable()}

</div>

</div>

</div>

`;

}

function renderAverageTable(){

    if(DB.students.length === 0){

        return "<p>Aucun élève.</p>";

    }


    const studentId = Number(
        document.getElementById("averageStudent")?.value ||
        DB.students[0].id
    );


    const trimester =
        document.getElementById("averageTrimester")?.value || "";


    const subjects = [
        ...new Set(

            DB.notes

                .filter(note =>
                    Number(note.studentId) === studentId
                )

                .filter(note => {

                    if(trimester === ""){
                        return true;
                    }

                    const noteTrimester =
                        String(note.trimester)
                            .replace("Trimestre ", "")
                            .trim();

                    const selectedTrimester =
                        String(trimester)
                            .replace("Trimestre ", "")
                            .trim();

                    return noteTrimester === selectedTrimester;

                })

                .map(note => note.subject)

        )
    ];


    if(subjects.length === 0){

        return "<p>Aucune note pour ce trimestre.</p>";

    }


    let html = `

        <table>

            <thead>

                <tr>

                    <th>Matière</th>

                    <th>Moyenne</th>

                </tr>

            </thead>

            <tbody>

    `;


    subjects.forEach(subject => {

        html += `

            <tr>

                <td>${subject}</td>

                <td>

                    ${calculateSubjectAverage(
                        studentId,
                        subject,
                        trimester
                    )}/20

                </td>

            </tr>

        `;

    });


    html += `

        <tr>

            <th>Moyenne générale</th>

            <th>

                ${calculateStudentAverage(
                    studentId,
                    trimester
                )}/20

            </th>

        </tr>

    `;


    html += `

            </tbody>

        </table>

    `;


    return html;

}

function refreshAverages(){

const div=document.getElementById("averageTable");

if(div){

div.innerHTML=renderAverageTable();

}

}

/*==================================================
PAGE BULLETIN
==================================================*/

function bulletinPage(){

return `

<div class="cards">

<div class="card" style="width:320px;">

<h2>📄 Bulletin</h2>

<label>Choisir un élève</label>

<select id="bulletinStudent" onchange="refreshBulletin()">

${DB.students.map(student=>`

<option value="${student.id}">

${student.lastname} ${student.firstname}

</option>

`).join("")}

</select>

<br><br>

<label>Choisir un trimestre</label>

<select id="bulletinTrimester" onchange="refreshBulletin()">

<option value="">Tous les trimestres</option>

${NOTE_TRIMESTERS.map(t=>`

<option>${t}</option>

`).join("")}

</select>

</div>

<div class="card" style="flex:1;">

<div id="bulletinContent">

${renderBulletin()}

</div>

</div>

</div>

`;

}

function getSubjectAppreciation(average){

    const note = parseFloat(
        String(average).replace(",", ".")
    );

    if(isNaN(note)){
        return "Aucune note exploitable.";
    }

    if(note >= 16){
        return "Excellent travail, très bonne maîtrise des notions.";
    }

    if(note >= 14){
        return "Très bon travail, ensemble sérieux et maîtrisé.";
    }

    if(note >= 12){
        return "Bon travail, les notions sont globalement maîtrisées.";
    }

    if(note >= 10){
        return "Travail satisfaisant, mais quelques points restent à consolider.";
    }

    if(note >= 8){
        return "Des difficultés persistent. Il faut poursuivre les efforts.";
    }

    return "Résultats fragiles. Un travail régulier est nécessaire.";
}

function getBulletinAppreciation(studentId, subject, trimester){

    const row = DB.bulletinAppreciations.find(a =>
        Number(a.student_id) === Number(studentId) &&
        String(a.trimester || "") === String(trimester || "") &&
        String(a.subject || "") === String(subject || "")
    );

    return row?.appreciation || "";
}


async function editBulletinAppreciation(studentId, subject, trimester){

    subject = decodeURIComponent(subject);
    trimester = decodeURIComponent(trimester);

    const current = getBulletinAppreciation(
        studentId,
        subject,
        trimester
    );

    const text = prompt(
        `📝 Appréciation pour ${subject} :`,
        current
    );

    if(text === null) return;

    const appreciation = text.trim();

    const { data, error } = await supabaseClient
        .from("bulletin_appreciations")
        .upsert(
            [{
                student_id: Number(studentId),
                trimester: trimester,
                subject: subject,
                appreciation: appreciation
            }],
            {
                onConflict: "student_id,trimester,subject"
            }
        )
        .select()
        .single();

    if(error){

        console.error(
            "Erreur sauvegarde appréciation :",
            error
        );

        alert("❌ Impossible de sauvegarder l'appréciation.");

        return;
    }

    const index = DB.bulletinAppreciations.findIndex(a =>
        Number(a.student_id) === Number(studentId) &&
        String(a.trimester || "") === String(trimester || "") &&
        String(a.subject || "") === String(subject || "")
    );

    if(index >= 0){

        DB.bulletinAppreciations[index] = data;

    }else{

        DB.bulletinAppreciations.push(data);
    }

    const div = document.getElementById("bulletinContent");

    if(div){
        div.innerHTML = renderBulletin();
    }
}


function getGeneralAppreciation(studentId, trimester){

    const row = DB.bulletinAppreciations.find(a =>
        Number(a.student_id) === Number(studentId) &&
        String(a.trimester || "") === String(trimester || "") &&
        String(a.subject || "") === ""
    );

    return row?.appreciation || "";
}


async function editGeneralAppreciation(studentId, trimester){

    trimester = decodeURIComponent(trimester);

    const current = getGeneralAppreciation(
        studentId,
        trimester
    );

    const text = prompt(
        "📝 Appréciation générale :",
        current
    );

    if(text === null) return;

    const appreciation = text.trim();

    const { data, error } = await supabaseClient
        .from("bulletin_appreciations")
        .upsert(
            [{
                student_id: Number(studentId),
                trimester: trimester,
                subject: "",
                appreciation: appreciation
            }],
            {
                onConflict: "student_id,trimester,subject"
            }
        )
        .select()
        .single();

    if(error){

        console.error(
            "Erreur sauvegarde appréciation générale :",
            error
        );

        alert("❌ Impossible de sauvegarder l'appréciation.");

        return;
    }

    const index = DB.bulletinAppreciations.findIndex(a =>
        Number(a.student_id) === Number(studentId) &&
        String(a.trimester || "") === String(trimester || "") &&
        String(a.subject || "") === ""
    );

    if(index >= 0){

        DB.bulletinAppreciations[index] = data;

    }else{

        DB.bulletinAppreciations.push(data);
    }

    const div = document.getElementById("bulletinContent");

    if(div){
        div.innerHTML = renderBulletin();
    }
}

function getGeneralAppreciation(studentId, trimester) {

    const key = `bulletin_general_appreciation_${studentId}_${trimester}`;

    return localStorage.getItem(key) || "";
}


function editGeneralAppreciation(studentId, trimester) {

     trimester = decodeURIComponent(trimester);    

     const current = getGeneralAppreciation(
        studentId,
        trimester
    );

    const text = prompt(
        "📝 Appréciation générale :",
        current
    );

    if (text === null) return;

    const key = `bulletin_general_appreciation_${studentId}_${trimester}`;

    localStorage.setItem(
        key,
        text.trim()
    );

    const div = document.getElementById("bulletinContent");

if(div){
    div.innerHTML = renderBulletin();
}
}

function renderBulletin(){

    if(DB.students.length===0){
        return "<p>Aucun élève.</p>";
    }

    const studentId=Number(
        document.getElementById("bulletinStudent")?.value ||
        DB.students[0].id
    );

    const trimester =
        document.getElementById("bulletinTrimester")?.value || "";

    const student=DB.students.find(s=>s.id===studentId);

    if(!student){
        return "<p>Élève introuvable.</p>";
    }

    const subjects=[...new Set(
        DB.notes
        .filter(n=>{
            if(Number(n.studentId)!==studentId){
                return false;
            }

            if(trimester!==""){
                const noteTrimester =
                    String(n.trimester)
                    .replace("Trimestre ","")
                    .trim();

                const selectedTrimester =
                    String(trimester)
                    .replace("Trimestre ","")
                    .trim();

                if(noteTrimester!==selectedTrimester){
                    return false;
                }
            }

            return true;
        })
        .map(n=>n.subject)
    )];

    let html=`

<div style="
    padding:20px;
    border-bottom:2px solid #e5e7eb;
    margin-bottom:20px;
">

    <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:15px;
        flex-wrap:wrap;
    ">

        <div>
            <h2 style="margin:0 0 6px 0;">
                📄 Bulletin scolaire
            </h2>

            <h3 style="margin:0;">
                ${student.firstname} ${student.lastname}
            </h3>

            <p style="margin:5px 0 0 0;">
                🏫 Classe : <strong>${student.classe}</strong>
            </p>
        </div>

        <div style="
            padding:10px 16px;
            border-radius:12px;
            background:#f3f4f6;
            text-align:center;
        ">

            <strong>
                ${trimester || "Année scolaire"}
            </strong>

        </div>

    </div>

</div>

<h3 style="margin-bottom:12px;">
    📊 Résultats scolaires
</h3>

<table style="
    width:100%;
    border-collapse:collapse;
">

    <thead>

        <tr>
            <th style="text-align:left;">Matière</th>
            <th>Moyenne</th>
            <th style="text-align:left;">Appréciation</th>
        </tr>

    </thead>

    <tbody>
`;

subjects.forEach(subject=>{

    html+=`

        <tr>

            <td>
                <strong>${subject}</strong>
            </td>

            <td style="text-align:center;">
                <strong>
                    ${calculateSubjectAverage(
                        studentId,
                        subject,
                        trimester
                    )}/20
                </strong>
            </td>

            <td>
    ${getBulletinAppreciation(
        studentId,
        subject,
        trimester
    ) || "Aucune appréciation renseignée."}

    <br>

    <button
        onclick="editBulletinAppreciation(
            ${studentId},
            '${encodeURIComponent(subject)}',
            '${encodeURIComponent(trimester)}'
        )"
    >
        ✏️ Modifier
    </button>
</td>

        </tr>

    `;

});

html+=`

    </tbody>

</table>

<br>

<div style="
    padding:18px;
    border-radius:14px;
    background:#f8fafc;
    border:1px solid #e5e7eb;
">

    <h3 style="margin-top:0;">
        ⭐ Moyenne générale
    </h3>

    <div style="
        font-size:28px;
        font-weight:bold;
        margin:8px 0 15px 0;
    ">

        ${calculateStudentAverage(
            studentId,
            trimester
        )}/20

    </div>

    <p style="margin-bottom:0;">

        <strong>📝 Appréciation générale :</strong><br>

        ${getGeneralAppreciation(
    studentId,
    trimester
) || "Aucune appréciation générale renseignée."}

<br>

<button
    onclick="editGeneralAppreciation(
        ${studentId},
        '${encodeURIComponent(trimester)}'
    )"
>
    ✏️ Modifier
</button>

    </p>

</div>

`;

    return html;
}

function refreshBulletin() {

    const div = document.getElementById("bulletinContent");

    if (div) {
        div.innerHTML = renderBulletin();
    }
}

function competencesPage(){

return `

<div class="cards">

<div class="card" style="width:340px;">

<h2>🎯 Nouvelle compétence</h2>

<label>Élève</label>

<select id="competenceStudent">

${DB.students.map(student=>`

<option value="${student.id}">

${student.lastname} ${student.firstname}

</option>

`).join("")}

</select>

<br><br>

<label>Matière</label>

<select id="competenceSubject">

${NOTE_SUBJECTS.map(subject=>`

<option>${subject}</option>

`).join("")}

</select>

<br><br>

<label>Trimestre</label>

<select id="competenceTrimester">

${NOTE_TRIMESTERS.map(trimester=>`

<option>${trimester}</option>

`).join("")}

</select>

<br><br>

<label>Titre</label>

<input
id="competenceTitle"
placeholder="Titre de la compétence">

<br><br>

<label>Niveau</label>

<select id="competenceLevel">

${COMPETENCE_LEVELS.map(level=>`

<option>${level}</option>

`).join("")}

</select>

<br><br>

<button onclick="addCompetence()">

Ajouter la compétence

</button>

</div>

<div class="card">

<h2>Compétences</h2>

<div id="competenceList">

${renderCompetences()}

</div>

</div>

</div>

`;

}

function addCompetence(){

DB.competences.push({

id:Date.now(),

studentId:Number(

document.getElementById("competenceStudent").value

),

subject:

document.getElementById("competenceSubject").value,

trimester:

document.getElementById("competenceTrimester").value,

title:

document.getElementById("competenceTitle").value,

level:

document.getElementById("competenceLevel").value

});

render();

}

function renderCompetences(){

if(DB.competences.length===0){

return "<p>Aucune compétence.</p>";

}

return DB.competences.map(comp=>{

const student=DB.students.find(

s=>s.id===comp.studentId

);

return `

<div class="note-card">

<div class="note-left">

<div class="note-subject">

${comp.subject}

</div>

<div>

${comp.title}

</div>

<div>

${student.firstname} ${student.lastname}

</div>

<div>

${comp.trimester}

</div>

</div>

<div class="note-right">

<div style="font-weight:700;">

${comp.level}

</div>

<div class="note-buttons">

<button
class="edit-btn"
onclick="editCompetence(${comp.id})">

✏️

</button>

<button
class="delete-btn"
onclick="deleteCompetence(${comp.id})">

🗑️

</button>

</div>

</div>

</div>

`;

}).join("");

}

function deleteCompetence(id){

DB.competences=

DB.competences.filter(c=>c.id!==id);

render();

}

function editCompetence(id){

const comp=DB.competences.find(c=>c.id===id);

if(!comp) return;

const subject=prompt("Matière :",comp.subject);
if(subject===null) return;

const title=prompt("Compétence :",comp.title);
if(title===null) return;

const level=prompt("Niveau :",comp.level);
if(level===null) return;

const trimester=prompt("Trimestre :",comp.trimester||"");
if(trimester===null) return;

comp.subject=subject;
comp.title=title;
comp.level=level;
comp.trimester=trimester;

render();

}

function viePage(){

    if(DB.students.length === 0){
        return `
            <div class="card">
                <h2>⚠️ Vie scolaire</h2>
                <p>Aucun élève enregistré.</p>
            </div>
        `;
    }

    if(!STATE.selectedStudent){
        STATE.selectedStudent = DB.students[0].id;
    }

    const studentId = Number(STATE.selectedStudent);

    const student = DB.students.find(
        s => Number(s.id) === studentId
    );

    const events = DB.vie.filter(
        event => Number(event.studentId) === studentId
    );

    const absences = events.filter(
        event => event.type.includes("Absence")
    ).length;

    const retards = events.filter(
        event => event.type.includes("Retard")
    ).length;

    const punitions = events.filter(
        event => event.type.includes("Punition")
    ).length;

    return `

    <!-- ========================= -->
    <!-- SÉLECTION ÉLÈVE -->
    <!-- ========================= -->

    <div class="card">

        <h2>👨‍🎓 Élève concerné</h2>

        <select
            id="vieStudent"
            onchange="
                STATE.selectedStudent = Number(this.value);
                render();
            "
            style="
                width:100%;
                padding:12px;
                font-size:15px;
                margin-top:10px;
            "
        >

            ${DB.students.map(s => `

                <option
                    value="${s.id}"
                    ${Number(s.id) === studentId ? "selected" : ""}
                >
                    ${s.lastname || ""} ${s.firstname || ""}
                </option>

            `).join("")}

        </select>

    </div>


    <!-- ========================= -->
    <!-- RÉSUMÉ -->
    <!-- ========================= -->

    <div class="dashboard-grid">

        <div class="dashboard-card">

            <h3>⚠️ Absences</h3>

            <h1>${absences}</h1>

        </div>


        <div class="dashboard-card">

            <h3>⏰ Retards</h3>

            <h1>${retards}</h1>

        </div>


        <div class="dashboard-card">

            <h3>📚 Punitions</h3>

            <h1>${punitions}</h1>

        </div>

    </div>


    <!-- ========================= -->
    <!-- CONTENU VIE SCOLAIRE -->
    <!-- ========================= -->

    <div class="cards">

        <div class="card">

            <h2>⚠️ Ajouter un évènement</h2>

            <label>Type</label>

            <select id="vieType">

                ${VIE_TYPES.map(type => `
                    <option>${type}</option>
                `).join("")}

            </select>

            <br><br>

            <label>Date</label>

            <input
                type="date"
                id="vieDate"
            >

            <br><br>

            <label>Motif</label>

            <input
                id="vieReason"
                placeholder="Motif"
            >

            <br><br>

            <label>Commentaire</label>

            <textarea
                id="vieComment"
                placeholder="Commentaire..."
            ></textarea>

            <br><br>

            <button onclick="addVieEvent()">
                ➕ Ajouter
            </button>

        </div>


        <div class="card">

            <h2>
                📋 Vie scolaire de
                ${student.firstname} ${student.lastname}
            </h2>

            <div id="vieList">

                ${renderVieEvents()}

            </div>

        </div>

    </div>

    `;
}

async function addVieEvent(){

if(!requireProf()) return;

    const studentId = Number(STATE.selectedStudent);
    const date = document.getElementById("vieDate")?.value || null;
    const type = document.getElementById("vieType")?.value || "";
    const reason = document.getElementById("vieReason")?.value || "";
    const comment = document.getElementById("vieComment")?.value || "";

    if(!studentId){
        alert("⚠️ Aucun élève sélectionné.");
        return;
    }

    if(!type){
        alert("⚠️ Choisis un type d'évènement.");
        return;
    }

    if(!date){
        alert("⚠️ Choisis une date.");
        return;
    }

    const { data, error } = await supabaseClient
        .from("vie_scolaire")
        .insert([{
            student_id: studentId,
            date: date,
            type: type,
            reason: reason,
            comment: comment
        }])
        .select()
        .single();

    if(error){

        console.error("Erreur ajout vie scolaire :", error);

        alert(
            "❌ Impossible d'enregistrer l'évènement.\n\n" +
            error.message
        );

        return;
    }

    // Ajout dans la mémoire locale
    DB.vie.unshift({
        ...data,
        studentId: data.student_id
    });

    render();

}

function renderVieEvents(){

    const studentId = Number(STATE.selectedStudent);

    const events = DB.vie.filter(
        event => Number(event.studentId) === studentId
    );

    if(events.length === 0){

        return `
            <p style="text-align:center;">
                📭 Aucun évènement pour cet élève.
            </p>
        `;

    }

    return events
        .sort((a,b) =>
            (b.date || "").localeCompare(a.date || "")
        )
        .map(event => `

            <div class="note-card">

                <div
                    class="note-title-clickable"
                    onclick="showVieDetail(${event.id})"
                >

                    ${event.type}

                </div>

                <div class="note-buttons">

                    <button
                        class="edit-btn"
                        onclick="event.stopPropagation(); editVieEvent(${event.id})"
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        onclick="event.stopPropagation(); deleteVieEvent(${event.id})"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `)
        .join("");

}

function showVieDetail(id){

    const event = DB.vie.find(
        e => Number(e.id) === Number(id)
    );

    if(!event){
        alert("Évènement introuvable.");
        return;
    }

    const student = DB.students.find(
        s => Number(s.id) === Number(event.studentId)
    );

    const studentName = student
        ? `${student.firstname} ${student.lastname}`
        : "Élève inconnu";

    const existing = document.getElementById("vieDetail");

    if(existing){
        existing.remove();
    }

    const detail = document.createElement("div");

    detail.id = "vieDetail";

    detail.className = "card";

    detail.style.marginTop = "15px";

    detail.innerHTML = `

        <h2>📋 Détails de l'évènement</h2>

        <p>
            👨‍🎓 <strong>Élève :</strong>
            ${studentName}
        </p>

        <p>
            ⚠️ <strong>Type :</strong>
            ${event.type || "—"}
        </p>

        <p>
            📅 <strong>Date :</strong>
            ${event.date || "—"}
        </p>

        <p>
            📝 <strong>Motif :</strong>
            ${event.reason || "Aucun motif"}
        </p>

        <p>
            💬 <strong>Commentaire :</strong>
            ${event.comment || "Aucun commentaire"}
        </p>

        <button
            onclick="document.getElementById('vieDetail')?.remove()"
        >
            ✖️ Fermer
        </button>

    `;

    const vieList =
        document.getElementById("vieList");

    if(vieList){

        vieList.parentElement.appendChild(detail);

    }

}

function editVieEvent(id){

alert("Modification disponible au bloc suivant.");

}

function travauxPage(){

return `

<div class="cards">

<div class="card" style="width:350px;">

<h2>📚 Nouveau travail</h2>

<label>Matière</label>

<select id="travailSubject">

${NOTE_SUBJECTS.map(s=>`
<option>${s}</option>
`).join("")}

</select>

<br><br>

<label>Titre</label>

<input id="travailTitle">

<br><br>

<label>Consigne</label>

<textarea id="travailDescription"></textarea>

<br><br>

<label>Date de publication</label>

<input type="date" id="travailPublish">

<br><br>

<label>Date de rendu</label>

<input type="date" id="travailDeadline">

<br><br>

<label>Ressource</label>

<input id="travailResource">

<br><br>

<button onclick="addTravail()">
Ajouter
</button>

</div>

<div class="card">

<label>👨‍🎓 Élève</label>

<select
    id="travailStudent"
    onchange="STATE.selectedStudent = Number(this.value); render();">

${DB.students.map(student => `
<option
    value="${student.id}"
    ${Number(STATE.selectedStudent) === Number(student.id) ? "selected" : ""}>
    ${student.lastname || ""} ${student.firstname || ""}
</option>
`).join("")}

</select>

<br><br>

<h2>Travaux à faire</h2>

<div>

${renderTravaux()}

</div>

</div>

</div>

`;

}

async function addTravail(){

if(!requireProf()) return;

    const subject =
        document.getElementById("travailSubject")?.value.trim();

    const title =
        document.getElementById("travailTitle")?.value.trim();

    const description =
        document.getElementById("travailDescription")?.value.trim();

    const publish =
    document.getElementById("travailPublish")?.value || null;

const deadline =
    document.getElementById("travailDeadline")?.value || null;

    const resource =
        document.getElementById("travailResource")?.value.trim();

    if(!subject || !title){

        alert("❌ La matière et le titre sont obligatoires.");

        return;
    }

    const { data, error } = await supabaseClient
        .from("travaux")
        .insert([{
            subject,
            title,
            description,
            publish,
            deadline,
            resource
        }])
        .select()
        .single();

    if(error){

        console.error("Erreur ajout travail :", error);

        alert(
            "❌ Impossible d'ajouter le travail.\n\n" +
            error.message
        );

        return;
    }

    DB.travaux.push(data);

    render();
}

function renderTravaux(){

    if(DB.travaux.length === 0){
        return "<p>Aucun travail.</p>";
    }

    const studentId = Number(
        document.getElementById("travailStudent")?.value ||
        STATE.selectedStudent ||
        DB.students[0]?.id
    );

    STATE.selectedStudent = studentId;

    return DB.travaux.map(work => {

        const statut = DB.travauxStatuts.find(
            s =>
                Number(s.travail_id) === Number(work.id) &&
                Number(s.student_id) === studentId
        );

        const termine = statut?.termine === true;

        return `

<div class="note-card">

<div class="note-left">

<div class="note-subject">
${work.subject}
</div>

<div>
<strong>${work.title}</strong>
</div>

<div>
📅 Publication : ${work.publish || "—"}
</div>

<div>
⏰ À rendre : ${work.deadline || "—"}
</div>

<div>
${work.description || ""}
</div>

<div>
📎 ${work.resource || "Aucune ressource"}
</div>

<br>

<button
onclick="toggleTravailTermine(${work.id})">

${termine
    ? "↩️ Marquer comme à faire"
    : "✅ Marquer comme terminé"}

</button>

${
    termine
    ? `<div style="margin-top:8px;font-weight:bold;">
        ✅ Travail terminé
       </div>`
    : ""
}

</div>

<div class="note-right">

<div class="note-buttons">

<button
class="edit-btn"
onclick="editWork(${work.id})">
✏️
</button>

<button
class="delete-btn"
onclick="deleteTravail(${work.id})">
🗑️
</button>

</div>

</div>

</div>

`;

    }).join("");
}

function renderTravaux(){

    if(DB.travaux.length === 0){
        return "<p>Aucun travail.</p>";
    }

    const studentId = Number(
        document.getElementById("travailStudent")?.value ||
        DB.students[0]?.id
    );

    return DB.travaux.map(work => {

        const statut = DB.travauxStatuts.find(
            s =>
                Number(s.travail_id) === Number(work.id) &&
                Number(s.student_id) === studentId
        );

        const termine = statut?.termine === true;

        let priorityIcon = "🟢";

        if(work.priority === "Importante"){
            priorityIcon = "🟠";
        }

        if(work.priority === "Urgente"){
            priorityIcon = "🔴";
        }

        return `
            <div class="travail-card">

                <div class="travail-left">

                    <div class="note-subject">
                        ${work.subject || "—"}
                    </div>

                    <div>
                        <strong>
                            ${work.title || "Sans titre"}
                        </strong>
                    </div>

                    <div>
                        🏫 ${work.classe || "—"}
                    </div>

                    <div>
                        📅 Publication :
                        ${work.publish || "—"}
                    </div>

                    <div>
                        ⏰ À rendre :
                        ${work.deadline || "—"}
                    </div>

                    <div>
                        ${priorityIcon}
                        Priorité :
                        ${work.priority || "Normale"}
                    </div>

                    ${
    work.description
    ? `
        <div class="travail-description">
            📖 ${work.description}
        </div>
    `
    : ""
}

                    <div>
                        📎 ${work.resource || "Aucune ressource"}
                    </div>

                    <br>

                    <button
                        onclick="toggleTravailTermine(${work.id})">

                        ${
                            termine
                            ? "↩️ Marquer comme à faire"
                            : "✅ Marquer comme terminé"
                        }

                    </button>

                    ${
                        termine
                        ? `
                            <div style="
                                margin-top:8px;
                                font-weight:bold;
                            ">
                                ✅ Travail terminé
                            </div>
                        `
                        : ""
                    }

                </div>

                <div class="travail-right">

                    <div class="note-buttons">

                        <button
                            class="edit-btn"
                            onclick="editWork(${work.id})">
                            ✏️
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteTravail(${work.id})">
                            🗑️
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}

async function toggleTravailTermine(travailId){

    const studentId = Number(
        document.getElementById("travailStudent")?.value ||
        STATE.selectedStudent ||
        DB.students[0]?.id
    );

    if(!studentId){

        alert("❌ Aucun élève sélectionné.");

        return;
    }

    STATE.selectedStudent = studentId;

    const statutActuel = DB.travauxStatuts.find(
        s =>
            Number(s.travail_id) === Number(travailId) &&
            Number(s.student_id) === studentId
    );

    const nouvelleValeur =
        !(statutActuel?.termine === true);


    if(statutActuel){

        const { error } = await supabaseClient
            .from("travaux_statuts")
            .update({
                termine: nouvelleValeur,
                updated_at: new Date().toISOString()
            })
            .eq("id", statutActuel.id);

        if(error){

            console.error("Erreur modification statut :", error);

            alert(
                "❌ Impossible de modifier le statut.\n\n" +
                error.message
            );

            return;
        }

        statutActuel.termine = nouvelleValeur;

    }else{

        const { data, error } = await supabaseClient
            .from("travaux_statuts")
            .upsert(
                [{
                    travail_id: travailId,
                    student_id: studentId,
                    termine: true,
                    updated_at: new Date().toISOString()
                }],
                {
                    onConflict: "travail_id,student_id"
                }
            )
            .select()
            .single();

        if(error){

            console.error("Erreur ajout statut :", error);

            alert(
                "❌ Impossible d'enregistrer le statut.\n\n" +
                error.message
            );

            return;
        }

        DB.travauxStatuts.push(data);
    }

    render();
}

async function deleteTravail(id){

if(!requireProf()) return;

    const confirmation = confirm(
        "⚠️ Voulez-vous vraiment supprimer ce travail ?"
    );

    if(!confirmation){
        return;
    }

    const { error } = await supabaseClient
        .from("travaux")
        .delete()
        .eq("id", id);

    if(error){
        console.error("Erreur suppression travail :", error);
        alert("❌ Impossible de supprimer le travail.");
        return;
    }

    DB.travaux = DB.travaux.filter(
        work => work.id !== id
    );

    render();
}

function editTravail(id){

if(!requireProf()) return;

    const travail = DB.travaux.find(
        work => work.id === id
    );

    if(!travail){
        alert("❌ Travail introuvable.");
        return;
    }

    console.log("Travail à modifier :", travail);

}

function recompensesPage(){

return `

<div class="cards">

<div class="card" style="width:360px;">

<h2>🏆 Nouvelle récompense</h2>

<label>Élève</label>

<select id="rewardStudent">

${DB.students.map(student=>`

<option value="${student.id}">

${student.lastname} ${student.firstname}

</option>

`).join("")}

</select>

<br><br>

<label>Type</label>

<select id="rewardType">

${REWARD_TYPES.map(type=>`

<option>${type}</option>

`).join("")}

</select>

<br><br>

<label>Titre</label>

<input id="rewardTitle">

<br><br>

<label>Description</label>

<textarea id="rewardDescription"></textarea>

<br><br>

<label>Date</label>

<input type="date" id="rewardDate">

<br><br>

<label>Niveau</label>

<select id="rewardLevel">

${REWARD_LEVELS.map(level=>`

<option>${level}</option>

`).join("")}

</select>

<br><br>

<button onclick="addReward()">

Ajouter

</button>

</div>

<div class="card">

<h2>Récompenses</h2>

${renderRewards()}

</div>

</div>

`;

}

function addReward(){

DB.rewards.push({

id:Date.now(),

studentId:Number(

document.getElementById("rewardStudent").value

),

type:

document.getElementById("rewardType").value,

title:

document.getElementById("rewardTitle").value,

description:

document.getElementById("rewardDescription").value,

date:

document.getElementById("rewardDate").value,

level:

document.getElementById("rewardLevel").value

});

render();

}

function renderRewards(){

if(DB.rewards.length===0){

return "<p>Aucune récompense.</p>";

}

return DB.rewards.map(reward=>{

const student=DB.students.find(

s=>s.id===reward.studentId

);

return `

<div class="note-card">

<div class="note-left">

<div class="note-subject">

${reward.type}

</div>

<div>

<strong>${reward.title}</strong>

</div>

<div>

👨‍🎓 ${student.firstname} ${student.lastname}

</div>

<div>

📅 ${reward.date}

</div>

<div>

${reward.description}

</div>

<div>

${reward.level}

</div>

</div>

<div class="note-right">

<div class="note-buttons">

<button

class="edit-btn"

onclick="editReward(${reward.id})">

✏️

</button>

<button

class="delete-btn"

onclick="deleteReward(${reward.id})">

🗑️

</button>

</div>

</div>

</div>

`;

}).join("");

}

function deleteReward(id){

DB.rewards=

DB.rewards.filter(

reward=>reward.id!==id

);

render();

}

function editReward(id){

alert("Modification disponible au prochain bloc.");

}

function quetesPage(){

return `

<div class="cards">

<div class="card" style="width:360px;">

<h2>🎯 Nouvelle quête</h2>

<label>Élève</label>

<select id="questStudent">

${DB.students.map(student=>`

<option value="${student.id}">

${student.lastname} ${student.firstname}

</option>

`).join("")}

</select>

<br><br>

<label>Nom de la quête</label>

<input id="questTitle">

<br><br>

<label>Matière</label>

<select id="questSubject">

${NOTE_SUBJECTS.map(subject=>`

<option>${subject}</option>

`).join("")}

</select>

<br><br>

<label>Difficulté</label>

<select id="questLevel">

${QUEST_LEVELS.map(level=>`

<option>${level}</option>

`).join("")}

</select>

<br><br>

<label>Récompense</label>

<select id="questReward">

${QUEST_REWARDS.map(reward=>`

<option>${reward}</option>

`).join("")}

</select>

<br><br>

<label>Date limite</label>

<input type="date" id="questDeadline">

<br><br>

<label>Description</label>

<textarea id="questDescription"></textarea>

<br><br>

<button onclick="addQuest()">

Créer la quête

</button>

</div>

<div class="card">

<h2>Quêtes</h2>

${renderQuests()}

</div>

</div>

`;

}

function addQuest(){

DB.quests.push({

id:Date.now(),

studentId:Number(

document.getElementById("questStudent").value

),

title:

document.getElementById("questTitle").value,

subject:

document.getElementById("questSubject").value,

level:

document.getElementById("questLevel").value,

reward:

document.getElementById("questReward").value,

deadline:

document.getElementById("questDeadline").value,

description:

document.getElementById("questDescription").value

});

render();

}

function renderQuests(){

if(DB.quests.length===0){

return "<p>Aucune quête.</p>";

}

return DB.quests.map(quest=>{

const student=DB.students.find(

s=>s.id===quest.studentId

);

return `

<div class="note-card">

<div class="note-left">

<div class="note-subject">

🎯 ${quest.title}

</div>

<div>

👨‍🎓 ${student.firstname} ${student.lastname}

</div>

<div>

📖 ${quest.subject}

</div>

<div>

${quest.level}

</div>

<div>

${quest.reward}

</div>

<div>

📅 ${quest.deadline}

</div>

<div>

${quest.description}

</div>

</div>

<div class="note-right">

<div class="note-buttons">

<button

class="edit-btn"

onclick="editQuest(${quest.id})">

✏️

</button>

<button

class="delete-btn"

onclick="deleteQuest(${quest.id})">

🗑️

</button>

</div>

</div>

</div>

`;

}).join("");

}

function deleteQuest(id){

DB.quests=

DB.quests.filter(

quest=>quest.id!==id

);

render();

}

function editQuest(id){

alert("Modification disponible au bloc suivant.");

}

function eventsPage(){

return `

<div class="cards">

<div class="card" style="width:360px;">

<h2>🎉 Nouvel évènement</h2>

<label>Type</label>

<select id="eventType">

${EVENT_TYPES.map(type=>`

<option>${type}</option>

`).join("")}

</select>

<br><br>

<label>Titre</label>

<input id="eventTitle">

<br><br>

<label>Date</label>

<input type="date" id="eventDate">

<br><br>

<label>Heure</label>

<input type="time" id="eventHour">

<br><br>

<label>Lieu</label>

<input id="eventPlace">

<br><br>

<label>Public concerné</label>

<select id="eventPublic">

${EVENT_PUBLIC.map(publicType=>`

<option>${publicType}</option>

`).join("")}

</select>

<br><br>

<label>Couleur</label>

<select id="eventColor">

${EVENT_COLORS.map(color=>`

<option>${color}</option>

`).join("")}

</select>

<br><br>

<label>Description</label>

<textarea id="eventDescription"></textarea>

<br><br>

<button onclick="addEvent()">

Ajouter l'évènement

</button>

</div>

<div class="card">

<h2>Évènements spéciaux</h2>

${renderEvents()}

</div>

</div>

`;

}

function addEvent(){

DB.events.push({

id:Date.now(),

type:

document.getElementById("eventType").value,

title:

document.getElementById("eventTitle").value,

date:

document.getElementById("eventDate").value,

hour:

document.getElementById("eventHour").value,

place:

document.getElementById("eventPlace").value,

public:

document.getElementById("eventPublic").value,

color:

document.getElementById("eventColor").value,

description:

document.getElementById("eventDescription").value

});

render();

}

function renderEvents(){

if(DB.events.length===0){

return "<p>Aucun évènement.</p>";

}

return DB.events.map(event=>`

<div class="note-card">

<div class="note-left">

<div class="note-subject">

${event.type}

</div>

<div>

<strong>${event.title}</strong>

</div>

<div>

📅 ${event.date}

</div>

<div>

🕒 ${event.hour}

</div>

<div>

📍 ${event.place}

</div>

<div>

👥 ${event.public}

</div>

<div>

${event.description}

</div>

<div>

${event.color}

</div>

</div>

<div class="note-right">

<div class="note-buttons">

<button

class="edit-btn"

onclick="editEvent(${event.id})">

✏️

</button>

<button

class="delete-btn"

onclick="deleteEvent(${event.id})">

🗑️

</button>

</div>

</div>

</div>

`).join("");

}

function deleteEvent(id){

DB.events =

DB.events.filter(

event=>event.id!==id

);

render();

}

function editEvent(id){

alert("Modification disponible au bloc suivant.");

}

function parametresPage(){

return`

<div class="cards">

<div class="card">

<h2>🏫 Établissement</h2>

<label>Nom</label>

<input id="setSchool"

value="${SETTINGS.schoolName}">

<br><br>

<label>Ville</label>

<input id="setCity"

value="${SETTINGS.city}">

<br><br>

<label>Académie</label>

<input id="setAcademy"

value="${SETTINGS.academy}">

<br><br>

<label>Année scolaire</label>

<input id="setYear"

value="${SETTINGS.schoolYear}">

</div>

<div class="card">

<h2>🎨 Apparence</h2>

<label>Thème</label>

<select id="setTheme">

<option ${SETTINGS.theme==="Clair"?"selected":""}>

Clair

</option>

<option ${SETTINGS.theme==="Sombre"?"selected":""}>

Sombre

</option>

</select>

<br><br>

<label>Couleur principale</label>

<input

type="color"

id="setPrimary"

value="${SETTINGS.primary}">

<br><br>

<label>Couleur secondaire</label>

<input

type="color"

id="setSecondary"

value="${SETTINGS.secondary}">

</div>

<div class="card">

<h2>⚙️ Modules</h2>

<label>

<input

type="checkbox"

id="rewardBox"

${SETTINGS.enableRewards?"checked":""}>

Récompenses

</label>

<br><br>

<label>

<input

type="checkbox"

id="questBox"

${SETTINGS.enableQuests?"checked":""}>

Quêtes

</label>

<br><br>

<label>

<input

type="checkbox"

id="competenceBox"

${SETTINGS.enableCompetences?"checked":""}>

Compétences

</label>

<br><br>

<label>

<input

type="checkbox"

id="averageBox"

${SETTINGS.enableAverages?"checked":""}>

Moyennes

</label>

</div>

<div class="card">

<h2>📊 Informations</h2>

<p>

👨‍🎓 Élèves :
<strong>${DB.students.length}</strong>

</p>

<p>

📝 Notes :
<strong>${DB.notes.length}</strong>

</p>

<p>

🎯 Compétences :
<strong>${DB.competences.length}</strong>

</p>

<p>

📚 Travaux :
<strong>${DB.travaux.length}</strong>

</p>

<p>

🏆 Récompenses :
<strong>${DB.rewards.length}</strong>

</p>

<p>

🎯 Quêtes :
<strong>${DB.quests.length}</strong>

</p>

<p>

🎉 Évènements :
<strong>${DB.events.length}</strong>

</p>

<br>

<button onclick="saveSettings()">

💾 Sauvegarder

</button>

</div>

</div>

`;

}

function saveSettings(){

SETTINGS.schoolName=

document.getElementById("setSchool").value;

SETTINGS.city=

document.getElementById("setCity").value;

SETTINGS.academy=

document.getElementById("setAcademy").value;

SETTINGS.schoolYear=

document.getElementById("setYear").value;

SETTINGS.theme=

document.getElementById("setTheme").value;

SETTINGS.primary=

document.getElementById("setPrimary").value;

SETTINGS.secondary=

document.getElementById("setSecondary").value;

SETTINGS.enableRewards=

document.getElementById("rewardBox").checked;

SETTINGS.enableQuests=

document.getElementById("questBox").checked;

SETTINGS.enableCompetences=

document.getElementById("competenceBox").checked;

SETTINGS.enableAverages=

document.getElementById("averageBox").checked;

alert("Paramètres sauvegardés.");

}

function buildPronoteGrid(){

let html="";

html+=`
<div class="emploi-grid">
`;

html+=`
<div class="head-hour"></div>
`;

EDT_DAYS.forEach((day)=>{

html+=`
<div class="head-day">
${day}
</div>
`;

});

EDT_HOURS.forEach((hour,hourIndex)=>{

html+=`
<div class="hour-cell">
${hour}
</div>
`;

EDT_DAYS.forEach((day,dayIndex)=>{

html+=`
<div
class="course-cell"
data-day="${dayIndex}"
data-hour="${hourIndex}"
onclick="createCourseFromCell(${dayIndex},${hourIndex})">
</div>
`;

});

});

html+=`
</div>
`;

return html;

}

//==========================================================
// 📚 GESTION DES SEMAINES DU CAHIER DE TEXTES
//==========================================================

function isValidCahierDate(value){

    if(!value){
        return false;
    }

    if(!/^\d{4}-\d{2}-\d{2}$/.test(value)){
        return false;
    }

    const date =
        new Date(value + "T12:00:00");

    return !isNaN(date.getTime());

}


function getMonday(dateString){

    if(!isValidCahierDate(dateString)){

        dateString =
            getTodayString();

    }


    const date =
        new Date(dateString + "T12:00:00");


    const day =
        date.getDay();


    const diff =
        day === 0
            ? -6
            : 1 - day;


    date.setDate(
        date.getDate() + diff
    );


    return date;

}


function formatDateISO(date){

    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

}


function getTodayString(){

    const today =
        new Date();


    return formatDateISO(today);

}


function getCurrentWeekMonday(){

    return getMonday(
        getTodayString()
    );

}


function getCurrentWeekKey(){

    return formatDateISO(
        getCurrentWeekMonday()
    );

}


function getCahierWeekDates(dateString){

    const monday =
        getMonday(dateString);


    const dates = [];


    for(let i = 0; i < 7; i++){

        const date =
            new Date(monday);


        date.setDate(
            monday.getDate() + i
        );


        dates.push(date);

    }


    return dates;

}


//==========================================================
// 📅 SEMAINE ACTUELLEMENT AFFICHÉE
//==========================================================

let cahierSelectedWeek =
    localStorage.getItem(
        "cahierSelectedWeek"
    );


// 🔒 Si la valeur enregistrée est invalide,
// on repart automatiquement sur la semaine actuelle.
if(!isValidCahierDate(cahierSelectedWeek)){

    cahierSelectedWeek =
        getCurrentWeekKey();

}


// On force toujours le lundi comme début de semaine.
cahierSelectedWeek =
    formatDateISO(
        getMonday(cahierSelectedWeek)
    );


localStorage.setItem(
    "cahierSelectedWeek",
    cahierSelectedWeek
);


//==========================================================
// ◀ ▶ CHANGER DE SEMAINE
//==========================================================

function changeCahierWeek(offset){

    const monday =
        getMonday(cahierSelectedWeek);


    monday.setDate(
        monday.getDate() +
        (offset * 7)
    );


    cahierSelectedWeek =
        formatDateISO(monday);


    localStorage.setItem(
        "cahierSelectedWeek",
        cahierSelectedWeek
    );


    render();

}


//==========================================================
// 📅 CHOISIR UNE SEMAINE
//==========================================================

function selectCahierWeek(value){

    if(!isValidCahierDate(value)){

        return;

    }


    cahierSelectedWeek =
        formatDateISO(
            getMonday(value)
        );


    localStorage.setItem(
        "cahierSelectedWeek",
        cahierSelectedWeek
    );


    render();

}

function formatCahierDate(date){

    if(!(date instanceof Date) || isNaN(date.getTime())){
        return "Date invalide";
    }

    const weekday =
        date.toLocaleDateString(
            "fr-FR",
            {
                weekday:"short"
            }
        );

    const day =
        date.getDate();

    const month =
        date.toLocaleDateString(
            "fr-FR",
            {
                month:"short"
            }
        );

    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day} ${month}`;

}

function cahierPage(){

    const selectedWeek =
    cahierSelectedWeek ||
    getCurrentWeekKey();


    const weekDates =
        getCahierWeekDates(selectedWeek);


    const monday = weekDates[0];
    const sunday = weekDates[6];


    const weekTitle =
        `Semaine du ${monday.getDate()} ${monday.toLocaleDateString("fr-FR",{month:"long"})}
        au ${sunday.getDate()} ${sunday.toLocaleDateString("fr-FR",{month:"long"})}
        ${sunday.getFullYear()}`;


    return `

    <div style="
        width:100%;
        max-width:100%;
    ">


        <!-- ========================= -->
        <!-- TITRE + SÉLECTEUR -->
        <!-- ========================= -->

        <div class="card" style="
            margin-bottom:20px;
            padding:20px;
        ">

            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:15px;
                flex-wrap:wrap;
            ">


                <button
                    type="button"
                    onclick="changeCahierWeek(-1)"
                    style="
                        font-size:18px;
                        padding:10px 16px;
                    "
                >
                    ◀
                </button>


                <div style="
                    flex:1;
                    min-width:180px;
                    text-align:center;
                ">

                    <div style="
                        font-size:21px;
                        font-weight:800;
                    ">
                        📚 Cahier de textes
                    </div>


                    <div style="
                        margin-top:5px;
                        color:#6b7280;
                    ">
                        ${weekTitle}
                    </div>

                </div>


                <button
                    type="button"
                    onclick="changeCahierWeek(1)"
                    style="
                        font-size:18px;
                        padding:10px 16px;
                    "
                >
                    ▶
                </button>


            </div>


            <!-- CHOIX DE LA SEMAINE -->

            <div style="
                margin-top:18px;
                text-align:center;
            ">

                <label style="
                    display:block;
                    font-weight:700;
                    margin-bottom:8px;
                ">
                    📅 Choisir quelle semaine ?
                </label>


                <input
                    type="date"
                    id="cahierWeek"
                    value="${selectedWeek}"
                    onchange="selectCahierWeek(this.value)"
                    style="
                        padding:10px 12px;
                        border:1px solid #d1d5db;
                        border-radius:10px;
                        font-size:15px;
                    "
                >

            </div>

        </div>



        <!-- ========================= -->
        <!-- CALENDRIER -->
        <!-- ========================= -->

        <div style="
            width:100%;
            overflow-x:auto;
            overflow-y:hidden;
            padding-bottom:12px;
        ">


            <div style="
                display:grid;
                grid-template-columns:repeat(7,220px);
                gap:12px;
                width:max-content;
            ">


                ${weekDates.map(date => {

                    const dateString =
                        `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;


                    const courses =
                        DB.cahier
                        .filter(cours => cours.date === dateString)
                        .sort((a,b) => a.id - b.id);


                    return `

                    <!-- ================= -->
                    <!-- COLONNE DU JOUR -->
                    <!-- ================= -->

                    <div style="
                        width:220px;
                        min-width:220px;
                        box-sizing:border-box;

                        background:#f8f9fb;

                        border:1px solid #dfe3e8;
                        border-radius:14px;

                        overflow:hidden;

                        min-height:360px;
                    ">


                        <!-- JOUR -->

                        <div style="
                            width:100%;
                            box-sizing:border-box;

                            padding:13px 8px;

                            background:#f1f3f6;

                            border-bottom:1px solid #dfe3e8;

                            text-align:center;
                        ">

                            <div style="
                                font-size:16px;
                                font-weight:800;
                            ">
                                ${formatCahierDate(date)}
                            </div>

                        </div>



                        <!-- COURS -->

                        <div style="
                            width:100%;
                            box-sizing:border-box;
                            padding:10px;
                        ">


                            ${
                                courses.length === 0

                                ?

                                `
                                <div style="
                                    text-align:center;
                                    color:#aaa;
                                    font-size:13px;
                                    padding:30px 5px;
                                ">
                                    Aucun cours
                                </div>
                                `

                                :

                                courses.map(cours => `

                                    <div
                                        role="button"
                                        tabindex="0"
                                        onclick="openCahierCours(${cours.id})"
                                        onkeydown="
                                            if(event.key==='Enter' || event.key===' '){
                                                event.preventDefault();
                                                openCahierCours(${cours.id});
                                            }
                                        "
                                        style="
                                            display:block;

                                            width:100%;
                                            max-width:100%;
                                            box-sizing:border-box;

                                            min-height:68px;

                                            margin-bottom:9px;

                                            padding:10px;

                                            background:#fff;

                                            border:1px solid #dfe3e8;
                                            border-left:4px solid #4f46e5;

                                            border-radius:9px;

                                            cursor:pointer;

                                            overflow:hidden;

                                            box-shadow:
                                                0 2px 6px rgba(0,0,0,.08);

                                            transition:
                                                transform .15s ease,
                                                box-shadow .15s ease;
                                        "
                                    >


                                        <div style="
                                            width:100%;

                                            font-size:14px;
                                            font-weight:800;

                                            white-space:nowrap;
                                            overflow:hidden;
                                            text-overflow:ellipsis;
                                        ">
                                            📚 ${cours.subject}
                                        </div>


                                        <div style="
                                            width:100%;

                                            margin-top:5px;

                                            color:#666;

                                            font-size:12px;

                                            white-space:nowrap;
                                            overflow:hidden;
                                            text-overflow:ellipsis;
                                        ">
                                            👨‍🏫 ${cours.teacher || "Professeur non renseigné"}
                                        </div>


                                    </div>

                                `).join("")

                            }


                        </div>

                    </div>

                    `;

                }).join("")}


            </div>

        </div>



        <!-- ========================= -->
        <!-- AJOUT D'UN COURS -->
        <!-- ========================= -->

        <div class="card" style="
            margin-top:20px;
        ">

            <h2>
                ➕ Ajouter un cours
            </h2>


            <label>Date</label>

            <input
                type="date"
                id="cahierDate"
            >


            <br><br>


            <label>Matière</label>

            <select id="cahierSubject">

                ${NOTE_SUBJECTS.map(subject => `
                    <option>${subject}</option>
                `).join("")}

            </select>


            <br><br>


            <label>Professeur</label>

            <input
                id="cahierTeacher"
                placeholder="Nom du professeur"
            >


            <br><br>


            <label>Contenu du cours</label>

            <textarea
                id="cahierContent"
                placeholder="Ex : Fractions : comparaison et opérations"
            ></textarea>


            <br><br>


            <label>Ressource</label>

            <input
                id="cahierResource"
                placeholder="Lien ou ressource (facultatif)"
            >


            <br><br>


            <button
                type="button"
                onclick="addCahierCours()"
            >
                ➕ Ajouter le cours
            </button>


        </div>


    </div>

    `;
}

async function addCahierCours(){

if(!requireProf()) return;

    const date = document.getElementById("cahierDate").value;
    const subject = document.getElementById("cahierSubject").value;
    const teacher = document.getElementById("cahierTeacher").value;
    const content = document.getElementById("cahierContent").value;
    const resource = document.getElementById("cahierResource").value;

    if(!date || !content){

        alert("⚠️ Merci de renseigner la date et le contenu du cours.");

        return;
    }

    const { data, error } = await supabaseClient
        .from("cahier_textes")
        .insert([{
            date: date,
            subject: subject,
            teacher: teacher,
            content: content,
            resource: resource
        }])
        .select()
        .single();

    if(error){

        console.error("Erreur Cahier de textes :", error);

        alert(
            "❌ Impossible d'enregistrer le cours.\n\n" +
            error.message
        );

        return;
    }

    DB.cahier.push({
        ...data
    });

    render();

}

async function loadCahier(){

    const { data, error } = await supabaseClient
        .from("cahier_textes")
        .select("*")
        .order("date", { ascending: true });

    if(error){

        console.error(
            "Erreur chargement Cahier de textes :",
            error
        );

        return;
    }

    DB.cahier = data || [];

    render();

}

function renderCahier(){

    if(DB.cahier.length === 0){

        return `
            <div style="
                text-align:center;
                padding:40px 20px;
                color:#888;
            ">
                📭 Aucun cours enregistré.
            </div>
        `;

    }


    const input = document.getElementById("cahierWeek");

    const selectedDate =
        input && input.value
        ? input.value
        : new Date().toISOString().slice(0,10);


    const weekDates = getCahierWeekDates(selectedDate);


    return `

    <div style="
        width:100%;
        overflow-x:auto;
        overflow-y:hidden;
        padding-bottom:10px;
    ">

        <div style="
            display:grid;
            grid-template-columns:repeat(7, 220px);
            gap:12px;
            width:max-content;
        ">


            ${weekDates.map(date => {

                const dateString =
                    `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;


                const courses = DB.cahier
                    .filter(cours => cours.date === dateString)
                    .sort((a,b) => a.id - b.id);


                return `

                <div style="
                    width:220px;
                    min-width:220px;
                    box-sizing:border-box;
                    background:#f8f9fb;
                    border:1px solid #ddd;
                    border-radius:14px;
                    overflow:hidden;
                ">


                    <!-- JOUR -->

                    <div style="
                        min-height:65px;
                        box-sizing:border-box;
                        padding:12px 8px;
                        background:#f1f3f6;
                        border-bottom:1px solid #ddd;
                        text-align:center;
                    ">

                        <div style="
                            font-size:16px;
                            font-weight:800;
                        ">
                            ${formatCahierDate(date)}
                        </div>

                    </div>


                    <!-- COURS -->

                    <div style="
                        padding:10px;
                        box-sizing:border-box;
                        min-height:280px;
                    ">

                        ${
                            courses.length === 0

                            ?

                            `
                            <div style="
                                color:#aaa;
                                text-align:center;
                                padding:30px 5px;
                                font-size:13px;
                            ">
                                Aucun cours
                            </div>
                            `

                            :

                            courses.map(cours => `

                                <div
                                    onclick="openCahierCours(${cours.id})"
                                    style="
                                        width:100%;
                                        height:auto;
                                        min-height:68px;
                                        box-sizing:border-box;

                                        background:#fff;

                                        border:1px solid #ddd;
                                        border-left:4px solid #4f46e5;

                                        border-radius:9px;

                                        padding:10px;

                                        margin-bottom:9px;

                                        cursor:pointer;

                                        overflow:hidden;

                                        box-shadow:
                                            0 2px 6px rgba(0,0,0,0.08);

                                        transition:
                                            transform .15s ease,
                                            box-shadow .15s ease;
                                    "
                                >

                                    <div style="
                                        font-size:14px;
                                        font-weight:800;

                                        white-space:nowrap;
                                        overflow:hidden;
                                        text-overflow:ellipsis;
                                    ">
                                        📚 ${cours.subject}
                                    </div>


                                    <div style="
                                        margin-top:5px;

                                        color:#666;
                                        font-size:12px;

                                        white-space:nowrap;
                                        overflow:hidden;
                                        text-overflow:ellipsis;
                                    ">
                                        👨‍🏫 ${cours.teacher || "Professeur non renseigné"}
                                    </div>

                                </div>

                            `).join("")

                        }

                    </div>

                </div>

                `;

            }).join("")}


        </div>

    </div>

    `;

}

async function deleteCahierCours(id){

    if(!requireProf()) return;

    const confirmation = confirm(
        "⚠️ Voulez-vous vraiment supprimer ce cours définitivement ?"
    );

    if(!confirmation) return;

    const { error } = await supabaseClient
        .from("cahier_textes")
        .delete()
        .eq("id", id);

    if(error){

        console.error(
            "Erreur suppression Cahier de textes :",
            error
        );

        alert(
            "❌ Impossible de supprimer le cours.\n\n" +
            error.message
        );

        return;
    }

    DB.cahier =
        DB.cahier.filter(
            cours => Number(cours.id) !== Number(id)
        );

    render();

}

function emploiPage(){

return `

<div class="page-title">

📅 Emploi du temps

</div>

<br>

<div style="margin-bottom:20px;display:flex;gap:10px;">

<button onclick="showCourseModal()">

➕ Nouveau cours

</button>

</div>

<div style="position:relative;">

${buildPronoteGrid()}

<div class="courses-layer">

${renderCourses()}

</div>

</div>

`;

}

function buildPronoteGrid(){

let html="";

html+=`<div class="emploi-grid">`;

html+=`<div class="head-hour"></div>`;

EDT_DAYS.forEach(day=>{

html+=`

<div class="head-day">

${day}

</div>

`;

});

EDT_HOURS.forEach((hour,hourIndex)=>{

html+=`

<div class="hour-cell">

${hour}

</div>

`;

EDT_DAYS.forEach((day,dayIndex)=>{

html+=`

<div

class="course-cell"

onclick="createCourseFromCell(${dayIndex},${hourIndex+2})">

</div>

`;

});

});

html+=`</div>`;

return html;

}

function renderCourses(){

let html="";

DB.courses.forEach(course=>{

html+=`

<div
class="course-block-v2"

style="
background:${SUBJECT_COLORS[course.subject]||"#2563eb"};
grid-column:${course.day+2};
grid-row:${course.start}/${course.end};
"

onclick="editCourse(${course.id})"
>

<div class="course-title">

${course.subject}

</div>

<div>

👨‍🏫 ${course.teacher}

</div>

<div>

🚪 ${course.room}

</div>

<div>

👨‍🎓 ${course.className}

</div>

</div>

`;

});

return html;

}

function openCourseCreator(){

const subject = prompt("📖 Matière");
if(subject===null) return;

const teacher = prompt("👨‍🏫 Professeur");
if(teacher===null) return;

const room = prompt("🚪 Salle");
if(room===null) return;

const className = prompt("👨‍🎓 Classe");
if(className===null) return;

const day = Number(prompt(
"Jour :\n0=Lundi\n1=Mardi\n2=Mercredi\n3=Jeudi\n4=Vendredi\n5=Samedi\n6=Dimanche"
));

if(isNaN(day)) return;

const row = Number(prompt(
"Ligne horaire\n08h=1\n09h=2\n10h=3\n..."
));

if(isNaN(row)) return;

DB.courses.push({

id:Date.now(),

subject,

teacher,

room,

className,

day,

row

});

render();

}

function editCourse(id){

const course = DB.courses.find(c=>c.id===id);

if(!course) return;

if(confirm("Supprimer ce cours ?")){

DB.courses = DB.courses.filter(c=>c.id!==id);

render();

return;

}

course.room = prompt("Nouvelle salle :",course.room)||course.room;

course.teacher = prompt("Professeur :",course.teacher)||course.teacher;

render();

}

function showCourseModal(){

document.getElementById("modalOverlay").classList.remove("hidden");

document.getElementById("modalTitle").innerHTML="📅 Nouveau cours";

document.getElementById("modalBody").innerHTML=`

<div class="student-form">

<label>Matière</label>

<select id="courseSubject">

<option>Mathématiques</option>
<option>Français</option>
<option>Histoire-Géographie</option>
<option>SVT</option>
<option>Physique-Chimie</option>
<option>Anglais</option>
<option>Espagnol</option>
<option>EMC</option>
<option>Technologie</option>
<option>Arts Plastiques</option>
<option>Musique</option>
<option>EPS</option>

</select>

<label>Professeur</label>

<input id="courseTeacher">

<label>Salle</label>

<input id="courseRoom">

<label>Classe</label>

<input id="courseClass">

<label>Jour</label>

<select id="courseDay">

<option value="0">Lundi</option>
<option value="1">Mardi</option>
<option value="2">Mercredi</option>
<option value="3">Jeudi</option>
<option value="4">Vendredi</option>
<option value="5">Samedi</option>
<option value="6">Dimanche</option>

</select>

<label>Heure de début</label>

<select id="courseStart">

${EDT_HOURS.map((h,i)=>`

<option value="${i+2}">

${h}

</option>

`).join("")}

</select>

<label>Heure de fin</label>

<select id="courseEnd">

${EDT_HOURS.map((h,i)=>`

<option value="${i+3}">

${h}

</option>

`).join("")}

</select>

<br><br>

<div style="display:flex;gap:10px;">

<button
type="button"
style="flex:1;"
onclick="createCourse()">

💾 Ajouter le cours

</button>

<button
type="button"
onclick="closeModal()">

❌

</button>

</div>

<div style="margin-top:20px;display:flex;gap:10px;">

<button
type="button"
onclick="createCourse()">

💾 Créer le cours

</button>

<button onclick="closeModal()">

❌ Annuler

</button>

</div>

</div>

`;

}

function openCahierCours(id){

    const cours = DB.cahier.find(c => c.id === id);

    if(!cours) return;

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalBody =
        document.getElementById("modalBody");

    if(!modalOverlay || !modalTitle || !modalBody){
        console.error("❌ Modale universelle introuvable.");
        return;
    }

    modalTitle.innerHTML = `
        <div style="
            display:flex;
            align-items:center;
            gap:10px;
        ">
            <span style="
                display:flex;
                align-items:center;
                justify-content:center;
                width:38px;
                height:38px;
                border-radius:10px;
                background:#eef2ff;
                font-size:20px;
            ">
                📚
            </span>

            <div>
                <div style="
                    font-size:20px;
                    font-weight:800;
                ">
                    ${cours.subject}
                </div>

                <div style="
                    font-size:12px;
                    color:#777;
                    margin-top:2px;
                    font-weight:500;
                ">
                    Contenu du cours
                </div>
            </div>
        </div>
    `;

    modalBody.innerHTML = `

        <div style="
            display:flex;
            flex-direction:column;
            gap:16px;
        ">

            <!-- PROFESSEUR -->
            <div style="
                background:#f7f8fc;
                border:1px solid #e5e7eb;
                border-radius:12px;
                padding:13px 15px;
            ">

                <div style="
                    font-size:11px;
                    color:#8a8f98;
                    font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:.4px;
                    margin-bottom:5px;
                ">
                    Professeur
                </div>

                <div style="
                    font-size:15px;
                    font-weight:700;
                    color:#20242b;
                ">
                    👨‍🏫 ${cours.teacher || "Professeur non renseigné"}
                </div>

            </div>


            <!-- CONTENU -->
            <div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    font-size:15px;
                    font-weight:800;
                    margin-bottom:8px;
                ">
                    📝 Contenu du cours
                </div>

                <div style="
                    background:#ffffff;
                    border:1px solid #e1e5eb;
                    border-radius:12px;
                    padding:16px;
                    line-height:1.7;
                    white-space:pre-line;
                    overflow-wrap:anywhere;
                    color:#30343b;
                    font-size:14px;
                    box-shadow:0 1px 3px rgba(0,0,0,.04);
                ">
                    ${cours.content || `
                        <span style="color:#999;">
                            Aucun contenu renseigné pour ce cours.
                        </span>
                    `}
                </div>

            </div>


            <!-- RESSOURCE -->
            <div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    font-size:15px;
                    font-weight:800;
                    margin-bottom:8px;
                ">
                    🔗 Ressource
                </div>

                <div style="
                    background:#f7f8fc;
                    border:1px solid #e1e5eb;
                    border-radius:12px;
                    padding:14px 15px;
                ">

                    ${
                        cours.resource
                        ?
                        `
                        <a
                            href="${cours.resource}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="
                                display:inline-flex;
                                align-items:center;
                                gap:8px;
                                color:#3b5bdb;
                                font-weight:700;
                                text-decoration:none;
                            "
                        >
                            🔗 Ouvrir la ressource
                            <span style="font-size:12px;">↗</span>
                        </a>
                        `
                        :
                        `
                        <span style="
                            color:#999;
                            font-size:13px;
                        ">
                            Aucune ressource ajoutée.
                        </span>
                        `
                    }

                </div>

            </div>


            <!-- SUPPRESSION -->
            ${
                isProf()
                ?
                `
                <div style="
                    margin-top:4px;
                    padding-top:14px;
                    border-top:1px solid #e5e7eb;
                ">

                    <div style="
                        font-size:12px;
                        color:#777;
                        margin-bottom:9px;
                        text-align:center;
                    ">
                        🛠️ Une erreur ou un ancien cours ?
                        Vous pouvez le retirer définitivement.
                    </div>

                    <button
                        type="button"
                        onclick="
                            closeModal();
                            deleteCahierCours(${cours.id});
                        "
                        style="
                            width:100%;
                            min-height:44px;
                            border:none;
                            border-radius:10px;
                            background:#fff1f2;
                            color:#dc2626;
                            border:1px solid #fecdd3;
                            font-size:14px;
                            font-weight:800;
                            cursor:pointer;
                            transition:.2s;
                        "
                        onmouseover="this.style.background='#ffe4e6'"
                        onmouseout="this.style.background='#fff1f2'"
                    >
                        🗑️ Supprimer ce cours
                    </button>

                </div>
                `
                :
                ``
            }

        </div>
    `;

    modalOverlay.classList.remove("hidden");
}

function createCourse(){

DB.courses.push({

id:Date.now(),

subject:

document.getElementById("courseSubject").value,

teacher:

document.getElementById("courseTeacher").value,

room:

document.getElementById("courseRoom").value,

className:

document.getElementById("courseClass").value,

day:Number(

document.getElementById("courseDay").value

),

start:Number(

document.getElementById("courseStart").value

),

end:Number(

document.getElementById("courseEnd").value

)

});

document.getElementById("modalOverlay").classList.add("hidden");

render();

}

function createCourseFromCell(day,row){

showCourseModal();

setTimeout(()=>{

document.getElementById("courseDay").value=day;

document.getElementById("courseStart").value=row;

document.getElementById("courseEnd").value=row+2;

},30);

}

function closeModal(){

document

.getElementById("modalOverlay")

.classList.add("hidden");

}

document.addEventListener("click",(e)=>{

if(e.target.id==="closeModal"){

closeModal();

}

});

function renderRecentActivity(){

let activity=[];

DB.notes.forEach(note=>{

activity.push({

date:note.date||"",

icon:"📝",

text:`${note.subject} - ${note.title}`

});

});

DB.travaux.forEach(work=>{

activity.push({

date:work.date||"",

icon:"📚",

text:work.title

});

});

DB.rewards.forEach(reward=>{

activity.push({

date:reward.date||"",

icon:"🏆",

text:reward.title

});

});

DB.events.forEach(event=>{

activity.push({

date:event.date||"",

icon:"🎉",

text:event.title

});

});

activity=activity.reverse().slice(0,10);

if(activity.length===0){

return "<p>Aucune activité récente.</p>";

}

return activity.map(item=>`

<div class="activity-line">

<span>${item.icon}</span>

<span>${item.text}</span>

</div>

`).join("");

}

function dashboardAverage(){

if(DB.notes.length===0){

return "--/20";

}

let total=0;

let coefTotal=0;

DB.notes.forEach(note=>{

const value20=(Number(note.value)*20)/Number(note.outof);

const coef=Number(note.coefficient)||1;

total+=value20*coef;

coefTotal+=coef;

});

if(coefTotal===0) return "--/20";

return (total/coefTotal).toFixed(2)+"/20";

}

function dashboardLastNotes(){

if(DB.notes.length===0){

return "Aucune note enregistrée.";

}

return DB.notes

.slice(-3)

.reverse()

.map(note=>

`${note.subject} : ${note.value}/${note.outof}`

)

.join("<br>");

}

function dashboardLastWorks(){

if(!DB.travaux || DB.travaux.length===0){

return "Aucun travail à faire.";

}

return DB.travaux

.slice(-3)

.reverse()

.map(work=>`📚 ${work.title}`)

.join("<br>");

}

function dashboardRewards(){

if(!DB.rewards || DB.rewards.length===0){

return "Aucune récompense.";

}

return DB.rewards

.slice(-3)

.reverse()

.map(r=>`🏆 ${r.title}`)

.join("<br>");

}

function dashboardVie(){

if(!DB.vie || DB.vie.length===0){

return "Aucun événement.";

}

return DB.vie

.slice(-3)

.reverse()

.map(v=>`⚠️ ${v.title||v.type||"Évènement"}`)

.join("<br>");

}

function dashboardEvents(){

if(!DB.events || DB.events.length===0){

return "Aucun évènement prévu.";

}

return DB.events

.slice(-3)

.reverse()

.map(e=>`🎉 ${e.title}`)

.join("<br>");

}

async function login(){

    const username =
        document.getElementById("loginUser")
        .value
        .trim();

    const password =
        document.getElementById("loginPass")
        .value
        .trim();

    if(username === "" || password === ""){
        alert("❌ Identifiant et mot de passe obligatoires.");
        return;
    }

    const email =
        username.includes("@")
            ? username
            : username + "@monpronote.fr";


    //==========================================================
    // 🔐 CONNEXION SUPABASE
    //==========================================================

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if(error){

        console.error("Erreur connexion :", error);

        alert("❌ Identifiant ou mot de passe incorrect.");

        return;
    }


    const authUser = data.user;


    //==========================================================
    // 👨‍🏫 PROFESSEUR
    //==========================================================

    const role =
        authUser.app_metadata?.role;


    if(role === "prof"){

        currentUser = {

            id: authUser.id,

            role: "prof",

            name: "Professeur",

            username: username,

            authUserId: authUser.id

        };

        isLogged = true;


        // Charger toutes les données pour le professeur

        await Promise.all([

            loadStudents(),

            loadNotes(),

            loadBulletinAppreciations(),

            loadCahier(),

            loadTravauxStatuts(),

            loadTravaux(),

            loadVie()

        ]);


        const userBox =
            document.getElementById("currentUserName");

        if(userBox){

            userBox.textContent =
                "Professeur (prof)";

        }


        document
            .getElementById("loginOverlay")
            .classList.add("hidden");


        showPage("dashboard");

        return;
    }


    //==========================================================
    // 👨‍🎓 ÉLÈVE
    //==========================================================

    const {
        data: student,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select("*")
            .eq("auth_user_id", authUser.id)
            .single();


    if(studentError || !student){

        console.error(
            "Élève introuvable :",
            studentError
        );

        await supabaseClient.auth.signOut();

        alert(
            "⚠️ Ce compte n'est pas encore relié à un élève."
        );

        return;
    }


    currentUser = {

        id: student.id,

        studentId: student.id,

        student_id: student.id,

        role: "eleve",

        name:
            student.firstname +
            " " +
            student.lastname,

        username: student.username,

        authUserId: authUser.id

    };


    isLogged = true;


    // Charger les données autorisées

    await Promise.all([

        loadStudents(),

        loadNotes(),

        loadBulletinAppreciations(),

        loadCahier(),

        loadTravauxStatuts(),

        loadTravaux(),

        loadVie()

    ]);


    // Garder uniquement les données de l'élève connecté

    applyStudentDataScope();


    const userBox =
        document.getElementById("currentUserName");

    if(userBox){

        userBox.textContent =
            `${currentUser.name} (élève)`;

    }


    document
        .getElementById("loginOverlay")
        .classList.add("hidden");


    showPage("dashboard");
}

function generateStudentAccounts(){

DB.students.forEach(student=>{

const alreadyExists=DB.users.find(u=>u.studentId===student.id);

if(alreadyExists) return;

DB.users.push({

id:Date.now()+Math.random(),

studentId:student.id,

role:"eleve",

name:student.firstname+" "+student.lastname,

username:
(student.firstname+"."+student.lastname)
.toLowerCase()
.replaceAll(" ",""),

password:"123456"

});

});

}

async function changeStudentPassword(studentId){

    const student = DB.students.find(
        s => s.id === studentId
    );

    if(!student) return;

    const newPassword = prompt(
        "Nouveau mot de passe :",
        student.password || ""
    );

    if(newPassword === null) return;

    if(newPassword.trim() === ""){

        alert("Le mot de passe ne peut pas être vide.");

        return;

    }

    const password = newPassword.trim();

    const { error } = await supabaseClient
        .from("students")
        .update({
            password: password
        })
        .eq("id", studentId);

    if(error){

        console.error(error);

        alert(
            "Erreur Supabase : " +
            error.message
        );

        return;

    }

    await loadStudents();

    alert("✅ Mot de passe modifié.");

}

function editReward(id){

const reward=DB.rewards.find(r=>r.id===id);

if(!reward) return;

const title=prompt("Titre :",reward.title);
if(title===null) return;

const description=prompt("Description :",reward.description||"");
if(description===null) return;

const studentId=prompt("ID élève :",reward.studentId);
if(studentId===null) return;

const date=prompt("Date :",reward.date||"");
if(date===null) return;

reward.title=title;
reward.description=description;
reward.studentId=Number(studentId);
reward.date=date;

render();

}

function editQuest(id){

const quest = DB.quests.find(q=>q.id===id);

if(!quest) return;

const title = prompt("Titre :", quest.title);
if(title===null) return;

const description = prompt("Description :", quest.description||"");
if(description===null) return;

const xp = prompt("XP gagnés :", quest.xp||0);
if(xp===null) return;

const studentId = prompt("ID élève :", quest.studentId);
if(studentId===null) return;

const status = confirm("Quête validée ?");

quest.title = title;
quest.description = description;
quest.xp = Number(xp);
quest.studentId = Number(studentId);
quest.validated = status;

render();

}

async function editWork(id){

    const work = DB.travaux.find(w => w.id === id);

    if(!work) return;

    const subject = prompt("📚 Matière :", work.subject || "");
    if(subject === null) return;

    const title = prompt("📝 Titre :", work.title || "");
    if(title === null) return;

    const description = prompt(
        "📖 Consigne :",
        work.description || ""
    );
    if(description === null) return;

    const classe = prompt(
        "🏫 Classe :",
        work.classe || ""
    );
    if(classe === null) return;

    const publish = prompt(
        "📅 Date de publication :",
        work.publish || ""
    );
    if(publish === null) return;

    const deadline = prompt(
        "⏰ Date de rendu :",
        work.deadline || ""
    );
    if(deadline === null) return;

    const resource = prompt(
        "📎 Ressource :",
        work.resource || ""
    );
    if(resource === null) return;

    const { data, error } = await supabaseClient
        .from("travaux")
        .update({
            subject,
            title,
            description,
            classe,
            publish,
            deadline,
            resource
        })
        .eq("id", id)
        .select()
        .single();

    if(error){
        console.error("Erreur modification travail :", error);
        alert("❌ Impossible de modifier le travail.");
        return;
    }

    const index = DB.travaux.findIndex(
        w => w.id === id
    );

    if(index !== -1){
        DB.travaux[index] = data;
    }

    render();
}

function editEvent(id){

const event = DB.events.find(e=>e.id===id);

if(!event) return;

const title = prompt("Titre :", event.title);
if(title===null) return;

const description = prompt("Description :", event.description||"");
if(description===null) return;

const date = prompt("Date :", event.date||"");
if(date===null) return;

const start = prompt("Heure de début :", event.startTime||event.start||"");
if(start===null) return;

const end = prompt("Heure de fin :", event.endTime||event.end||"");
if(end===null) return;

event.title = title;
event.description = description;
event.date = date;

if("startTime" in event){

event.startTime = start;

}else{

event.start = start;

}

if("endTime" in event){

event.endTime = end;

}else{

event.end = end;

}

render();

}

console.log("Supabase :", supabaseClient);
console.log("Supabase connecté :", supabaseClient);

async function loadStudents(){

const { data, error } = await supabaseClient
.from("students")
.select("*")
.order("lastname",{ascending:true});

if(error){

console.error(error);

return;

}

DB.students = data || [];

render();

}

async function loadVie(){

    const { data, error } = await supabaseClient
        .from("vie_scolaire")
        .select("*")
        .order("date", { ascending: false });

    if(error){

        console.error(
            "Erreur chargement vie scolaire :",
            error
        );

        return;
    }

    DB.vie = (data || []).map(event => ({
        ...event,
        studentId: event.student_id
    }));

    render();

}

async function deleteStudent(id){

if(!requireProf()) return;

if(!confirm("Supprimer cet élève ?")) return;

const { error } = await supabaseClient
.from("students")
.delete()
.eq("id", id);

if(error){

console.error(error);

alert("Erreur Supabase : " + error.message);

return;

}

await loadStudents();

}

async function loadNotes(){

const { data, error } = await supabaseClient
.from("notes")
.select("*")
.order("date",{ascending:false});

if(error){

console.error(error);

return;

}

DB.notes = (data || []).map(note => ({

...note,

title: note.commentary || "",

coef: note.coefficient,

scale: note.outof,

type: note.type || "Évaluation"

}));

render();

}

async function loadTravauxStatuts(){

    const { data, error } = await supabaseClient
        .from("travaux_statuts")
        .select("*");

    if(error){

        console.error("Erreur chargement travaux_statuts :", error);

        return;
    }

    DB.travauxStatuts = data || [];

    render();
}

async function loadTravauxStatuts(){

    const { data, error } = await supabaseClient
        .from("travaux_statuts")
        .select("*");

    if(error){

        console.error("Erreur chargement travaux_statuts :", error);

        return;
    }

    DB.travauxStatuts = data || [];

    render();
}

async function loadTravaux(){

    const { data, error } = await supabaseClient
        .from("travaux")
        .select("*")
        .order("deadline",{ascending:true});

    if(error){

        console.error("Erreur chargement travaux :", error);

        return;
    }

    DB.travaux = data || [];

    render();
}

function showNoteDetail(id){

    const note = DB.notes.find(n => n.id === id);

    if(!note){

        alert("Note introuvable.");

        return;

    }

    const student = DB.students.find(
        s => s.id === note.studentId
    );

    const studentName = student
        ? `${student.firstname} ${student.lastname}`
        : "Élève inconnu";

    const value = parseFloat(note.value);
    const outof = parseFloat(note.outof);

    let mark20 = "—";

    if(
        !isNaN(value) &&
        !isNaN(outof) &&
        outof > 0
    ){

        mark20 = ((value / outof) * 20)
            .toFixed(2)
            .replace(".00","");

    }

    const classNotes = DB.notes.filter(
    n =>
        n.subject === note.subject &&
        n.title === note.title &&
        n.trimester === note.trimester &&
        !isNaN(parseFloat(n.value)) &&
        !isNaN(parseFloat(n.outof))
);

    let classAverage = "—";
    let highest = "—";
    let lowest = "—";
    let median = "—";

    if(classNotes.length > 0){

        const marks = classNotes
            .map(n =>
                (parseFloat(n.value) /
                parseFloat(n.outof)) * 20
            )
            .filter(n => !isNaN(n))
            .sort((a,b) => a-b);

        if(marks.length > 0){

            const average =
                marks.reduce((a,b) => a+b,0) /
                marks.length;

            classAverage = average
                .toFixed(2)
                .replace(".00","");

            highest = marks[marks.length - 1]
                .toFixed(2)
                .replace(".00","");

            lowest = marks[0]
                .toFixed(2)
                .replace(".00","");

            const middle = Math.floor(marks.length / 2);

            median = marks.length % 2 === 0
                ? ((marks[middle-1] + marks[middle]) / 2)
                    .toFixed(2)
                    .replace(".00","")
                : marks[middle]
                    .toFixed(2)
                    .replace(".00","");

        }

    }

    content.innerHTML = `

        <div class="note-detail-page">

            <div class="note-detail-header">

                <button
                    class="back-btn"
                    onclick="showPage('notes')">

                    ←

                </button>

                <h1>Détail de la note</h1>

                <button
                    class="print-btn"
                    onclick="window.print()">

                    🖨️ Imprimer

                </button>

            </div>


            <!-- INFORMATIONS PRINCIPALES -->

            <div class="note-detail-card">

                <div class="note-detail-main">

                    <div class="note-detail-icon">
                        ➗
                    </div>

                    <div>

                        <h2>
                            ${note.subject || "Matière"}
                        </h2>

                        <p>
                            ${studentName}
                        </p>

                    </div>

                </div>


                <div class="note-detail-score">

                    <strong>
                        ${note.value}/${note.outof}
                    </strong>

                    <span>
                        ${getNoteDisplay(note)}
                    </span>

                </div>


                <div class="note-detail-coef">

                    <span>
                        Coefficient
                    </span>

                    <strong>
                        ${note.coefficient ?? "—"}
                    </strong>

                </div>

            </div>


            <!-- INFORMATIONS -->

            <div class="note-detail-info-card">

                <div class="detail-info-item">

                    <span>📅 Date</span>

                    <strong>
                        ${note.date || "—"}
                    </strong>

                </div>


                <div class="detail-info-item">

                    <span>📄 Type</span>

                    <strong>
                        ${note.type || "—"}
                    </strong>

                </div>


                <div class="detail-info-item">

                    <span>🔢 Note sur</span>

                    <strong>
                        ${note.outof ?? "—"}
                    </strong>

                </div>


                <div class="detail-info-item">

                    <span>⚖️ Ramenée sur 20</span>

                    <strong class="blue-text">
                        ${mark20}/20
                    </strong>

                </div>


                <div class="detail-info-item">

                    <span>📚 Trimestre</span>

                    <strong>
                        ${note.trimester
                            ? "Trimestre " + note.trimester
                            : "—"}
                    </strong>

                </div>

            </div>


            <!-- APPRÉCIATION -->

            <div class="note-detail-section">

                <h2>
                    🏅 Appréciation
                </h2>

                <p>
                    Aucune appréciation renseignée.
                </p>

            </div>


            <!-- STATISTIQUES -->

            <div class="note-detail-section">

                <h2>
                    📊 Statistiques de la classe
                </h2>

                <div class="note-statistics">

                    <div>

                        <span>
                            Moyenne de la classe
                        </span>

                        <strong>
                            ${classAverage}/20
                        </strong>

                    </div>


                    <div>

                        <span>
                            Médiane
                        </span>

                        <strong>
                            ${median}/20
                        </strong>

                    </div>


                    <div>

                        <span>
                            Note la plus haute
                        </span>

                        <strong>
                            ${highest}/20
                        </strong>

                    </div>


                    <div>

                        <span>
                            Note la plus basse
                        </span>

                        <strong>
                            ${lowest}/20
                        </strong>

                    </div>

                </div>

            </div>


            <!-- HISTORIQUE -->

            <div class="note-detail-section">

                <h2>
                    🕘 Historique
                </h2>

                <div class="note-history">

                    <div>

                        <span>
                            ${note.date || "—"}
                        </span>

                        <span>
                            Note obtenue
                        </span>

                        <strong>
                            ${note.value}/${note.outof}
                        </strong>

                    </div>

                </div>

            </div>


            <!-- INFORMATIONS -->

            <div class="note-detail-information">

                <h2>
                    ⓘ Informations
                </h2>

                <p>
                    Note ramenée sur 20 selon le barème
                    de l'évaluation.
                </p>

            </div>

        </div>

    `;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}