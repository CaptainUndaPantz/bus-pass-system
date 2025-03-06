function hashPassword(password) {
    return btoa(password); // Base64 encoding
}

// Load users from LocalStorage
let users = JSON.parse(localStorage.getItem("users")) || [];
let loggedInUser = null;
let passes = JSON.parse(localStorage.getItem("busPasses")) || [];

function login() {
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const hashedPassword = hashPassword(password);

    const user = users.find(u => u.username.toLowerCase() === username && u.password === hashedPassword);

    if (user) {
        loggedInUser = user;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        document.getElementById("app").style.display = "block";
        alert(`Login successful! Welcome, ${user.username}`);
        loadHistory();
    } else {
        alert("Invalid login. Please check your username and password.");
    }
}

function register() {
    const username = prompt("Enter a username:").trim();
    if (!username) return alert("Username cannot be empty.");
    const password = prompt("Enter a password:");
    if (!password) return alert("Password cannot be empty.");

    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        alert("Username already exists. Try a different one.");
        return;
    }

    const hashedPassword = hashPassword(password);
    users.push({ username, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Now you can log in.");
}

function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully.");
    window.location.reload();
}

function loadHistory() {
    const tbody = document.getElementById("history");
    tbody.innerHTML = "";
    const search = document.getElementById("search").value.toLowerCase();

    passes.filter(p => p.person.toLowerCase().includes(search)).forEach((pass, index) => {
        const row = `<tr>
            <td>${pass.person}</td>
            <td>${pass.category}</td>
            <td>${pass.date}</td>
            <td>${pass.time}</td>
            <td><button onclick="cancelPass(${index})">Cancel</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function requestPass() {
    if (!loggedInUser) {
        alert("Please log in.");
        return;
    }

    const person = document.getElementById("personName").value.trim();
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!person || !date || !time) {
        alert("All fields are required!");
        return;
    }

    passes.push({ person, category, date, time });
    localStorage.setItem("busPasses", JSON.stringify(passes));
    loadHistory();
}

function cancelPass(index) {
    passes.splice(index, 1);
    localStorage.setItem("busPasses", JSON.stringify(passes));
    loadHistory();
}

function exportCSV() {
    let csv = "Name,Category,Date,Time\n";
    passes.forEach(p => {
        csv += `${p.person},${p.category},${p.date},${p.time}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bus_passes.csv";
    link.click();
}

window.onload = function () {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
        loggedInUser = storedUser;
        document.getElementById("app").style.display = "block";
        loadHistory();
    }
};
