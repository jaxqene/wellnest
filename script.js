// =========================
// WELLNEST SCRIPT
// =========================

let selectedMood = "";

// =========================
// GREETING
// =========================

const greeting = document.getElementById("greeting");

if (greeting) {
    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.textContent = "Good Morning 🌱";
    } else if (hour < 18) {
        greeting.textContent = "Good Afternoon ☀️";
    } else {
        greeting.textContent = "Good Evening 🌙";
    }
}

// =========================
// MOOD SELECTION
// =========================

const moodButtons = document.querySelectorAll(".mood-btn");

moodButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        moodButtons.forEach(m => {
            m.classList.remove("selected");
        });

        btn.classList.add("selected");

        selectedMood = btn.textContent;

        document.getElementById("selectedMood").value =
            selectedMood;
    });

});

// =========================
// DAILY CHECK IN
// =========================

const checkinForm =
document.getElementById("checkinForm");

if(checkinForm){

checkinForm.addEventListener("submit", e=>{

    e.preventDefault();

    if(selectedMood === ""){
        alert("Please select your mood.");
        return;
    }

    const entry = {

        date: new Date().toLocaleDateString(),

        mood: selectedMood,

        stress:
        Number(document.getElementById("stress").value),

        energy:
        Number(document.getElementById("energy").value),

        sleep:
        Number(document.getElementById("sleep").value),

        journal:
        document.getElementById("journal").value

    };

    let history =
        JSON.parse(
            localStorage.getItem("wellnestHistory")
        ) || [];

    history.push(entry);

    localStorage.setItem(
        "wellnestHistory",
        JSON.stringify(history)
    );

    alert("✅ Check-In Saved Successfully");

    updateDashboard();
    updateStatistics();
    generateSelfCare();

    checkinForm.reset();

});

}

// =========================
// DASHBOARD UPDATE
// =========================

function updateDashboard(){

    const history =
    JSON.parse(
        localStorage.getItem("wellnestHistory")
    ) || [];

    if(history.length === 0) return;

    const latest =
    history[history.length - 1];

    document.getElementById(
        "dashboardMood"
    ).textContent = latest.mood;

    document.getElementById(
        "dashboardStress"
    ).textContent = latest.stress + "/5";

    document.getElementById(
        "dashboardEnergy"
    ).textContent = latest.energy + "/5";

    document.getElementById(
        "dashboardSleep"
    ).textContent = latest.sleep + " hrs";

    let insight =
    "Keep checking in with yourself. Small habits matter.";

    if(latest.sleep < 6){

        insight =
        "Your recent entries show lower sleep. Consider resting earlier.";

    }

    if(latest.stress >= 4){

        insight =
        "Your recent entries show higher stress levels. Consider taking breaks.";

    }

    if(latest.energy <= 2){

        insight =
        "Low energy was recorded. Hydration and movement may help.";

    }

    document.getElementById(
        "insightText"
    ).textContent = insight;

}

// =========================
// STATISTICS
// =========================

function updateStatistics(){

    const history =
    JSON.parse(
        localStorage.getItem("wellnestHistory")
    ) || [];

    if(history.length === 0) return;

    let avgStress =
    history.reduce(
        (sum,item)=>sum+item.stress,0
    ) / history.length;

    let avgEnergy =
    history.reduce(
        (sum,item)=>sum+item.energy,0
    ) / history.length;

    let avgSleep =
    history.reduce(
        (sum,item)=>sum+item.sleep,0
    ) / history.length;

    document.getElementById(
        "avgStress"
    ).textContent =
    avgStress.toFixed(1);

    document.getElementById(
        "avgEnergy"
    ).textContent =
    avgEnergy.toFixed(1);

    document.getElementById(
        "avgSleep"
    ).textContent =
    avgSleep.toFixed(1);

    document.getElementById(
        "avgMood"
    ).textContent =
    history.length;

    renderHistory();

}

// =========================
// HISTORY
// =========================

function renderHistory(){

    const history =
    JSON.parse(
        localStorage.getItem("wellnestHistory")
    ) || [];

    const container =
    document.getElementById(
        "historyContainer"
    );

    if(!container) return;

    container.innerHTML = "";

    history.slice().reverse().forEach(item=>{

        container.innerHTML += `

        <div class="history-item">

            <strong>${item.date}</strong>

            <p>${item.mood}</p>

            <p>Stress: ${item.stress}/5</p>

            <p>Energy: ${item.energy}/5</p>

            <p>Sleep: ${item.sleep} hrs</p>

        </div>

        `;

    });

}

// =========================
// WHY AM I FEELING THIS?
// =========================

const analyzeBtn =
document.getElementById("analyzeBtn");

if(analyzeBtn){

analyzeBtn.addEventListener("click",()=>{

    const feeling =
    document.getElementById(
        "feelingSelect"
    ).value;

    const factor =
    document.getElementById(
        "factorSelect"
    ).value;

    document.getElementById(
        "analysisResult"
    ).innerHTML =

    `You identified <strong>${factor}</strong>
     as a possible factor contributing
     to feeling <strong>${feeling}</strong>.
     This reflection is not a diagnosis
     but may help you understand your experiences.`;

    saveStressFactor(factor);

});

}

// =========================
// STRESS MAP
// =========================

function saveStressFactor(factor){

    let factors =
    JSON.parse(
        localStorage.getItem("stressFactors")
    ) || [];

    factors.push(factor);

    localStorage.setItem(
        "stressFactors",
        JSON.stringify(factors)
    );

    renderStressMap();

}

function renderStressMap(){

    const container =
    document.getElementById(
        "stressMapResults"
    );

    if(!container) return;

    container.innerHTML = "";

    const factors =
    JSON.parse(
        localStorage.getItem("stressFactors")
    ) || [];

    let counts = {};

    factors.forEach(f=>{

        counts[f] = (counts[f] || 0) + 1;

    });

    const total =
    factors.length || 1;

    for(let key in counts){

        const percent =
        Math.round(
            (counts[key]/total)*100
        );

        container.innerHTML += `

        <div class="stress-item">

            <p>
                ${key} (${percent}%)
            </p>

            <div class="progress">
                <div
                class="progress-fill"
                style="width:${percent}%">
                </div>
            </div>

        </div>

        `;

    }

}

// =========================
// ACADEMIC TASKS
// =========================

const taskForm =
document.getElementById("taskForm");

if(taskForm){

taskForm.addEventListener("submit",e=>{

    e.preventDefault();

    const task = {

        name:
        document.getElementById(
            "taskName"
        ).value,

        type:
        document.getElementById(
            "taskType"
        ).value,

        deadline:
        document.getElementById(
            "deadline"
        ).value,

        workload:
        document.getElementById(
            "workload"
        ).value

    };

    let tasks =
    JSON.parse(
        localStorage.getItem(
            "academicTasks"
        )
    ) || [];

    tasks.push(task);

    localStorage.setItem(
        "academicTasks",
        JSON.stringify(tasks)
    );

    taskForm.reset();

    renderTasks();

});

}

function renderTasks(){

    const container =
    document.getElementById(
        "taskContainer"
    );

    if(!container) return;

    container.innerHTML = "";

    const tasks =
    JSON.parse(
        localStorage.getItem(
            "academicTasks"
        )
    ) || [];

    tasks.forEach(task=>{

        let dueDate =
        new Date(task.deadline);

        let today =
        new Date();

        let diff =
        Math.ceil(
        (dueDate - today) /
        (1000*60*60*24)
        );

        container.innerHTML += `

        <div class="task-card">

            <h3>${task.name}</h3>

            <p>${task.type}</p>

            <p>
                Workload:
                ${task.workload}
            </p>

            <p>
                Due in
                ${diff}
                days
            </p>

        </div>

        `;

    });

}

// =========================
// SELF CARE
// =========================

function generateSelfCare(){

    const container =
    document.getElementById(
        "careContainer"
    );

    if(!container) return;

    container.innerHTML = "";

    const history =
    JSON.parse(
        localStorage.getItem(
            "wellnestHistory"
        )
    ) || [];

    if(history.length === 0){

        container.innerHTML =
        "<p>Complete a check-in to receive personalized suggestions.</p>";

        return;
    }

    const latest =
    history[history.length - 1];

    let tips = [];

    if(latest.stress >= 4){

        tips.push({
            title:"High Stress",
            description:
            "Take a 10-minute screen break."
        });

    }

    if(latest.sleep < 6){

        tips.push({
            title:"Low Sleep",
            description:
            "Try preparing for sleep earlier tonight."
        });

    }

    if(latest.energy <= 2){

        tips.push({
            title:"Low Energy",
            description:
            "Take a short walk and drink some water."
        });

    }

    if(tips.length === 0){

        tips.push({
            title:"Keep Going",
            description:
            "You're maintaining healthy wellness habits."
        });

    }

    tips.forEach(tip=>{

        container.innerHTML += `

        <div class="care-card">

            <h3>🌱 ${tip.title}</h3>

            <p>
                ${tip.description}
            </p>

            <button class="secondary-btn">
                Try This
            </button>

        </div>

        `;

    });

}

// =========================
// WEEKLY REFLECTION
// =========================

const saveReflection =
document.getElementById(
    "saveReflection"
);

if(saveReflection){

saveReflection.addEventListener("click",()=>{

    const reflection =
    document.getElementById(
        "weeklyReflection"
    ).value;

    localStorage.setItem(
        "weeklyReflection",
        reflection
    );

    alert(
        "✅ Reflection Saved"
    );

});

}

const reflectionBox =
document.getElementById(
    "weeklyReflection"
);

if(reflectionBox){

reflectionBox.value =
localStorage.getItem(
    "weeklyReflection"
) || "";

}

// =========================
// QUICK CARD ANIMATION
// =========================

document.querySelectorAll(
".quick-card"
).forEach(card=>{

card.addEventListener("click",()=>{

    card.style.transform =
    "scale(.95)";

    setTimeout(()=>{

        card.style.transform =
        "";

    },200);

});

});

// =========================
// INITIAL LOAD
// =========================

updateDashboard();
updateStatistics();
renderStressMap();
renderTasks();
generateSelfCare();