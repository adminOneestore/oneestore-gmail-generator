const generateURL = "/api/generate";
const listURL = "/api/list";
const updateURL = "/api/update";

window.onload = loadEmailList;

function loadEmailList() {
  fetch(listURL + "?t=" + Date.now())
    .then(res => res.json())
    .then(data => {
      const rows = Array.isArray(data) ? data : [];
      const tbody = document.querySelector("#gmailTable tbody");
      tbody.innerHTML = "";
      rows.sort((a, b) => parseCustomDate(b["Tarikh"]) - parseCustomDate(a["Tarikh"]));
      rows.forEach(row => addRowToTable(row));
    })
    .catch(err => console.error("Gagal load:", err));
}

function parseCustomDate(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split(" ");
  if (parts.length < 2) return new Date(0);
  const [datePart, timePart] = parts;
  const [day, month, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");
  return new Date(year, month - 1, day, hour, minute, second);
}

function generateEmailFromScript() {
  document.getElementById("output").textContent = "Generating...";
  fetch(generateURL + "?t=" + Date.now())
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        document.getElementById("output").textContent = "Error: " + data.error;
        return;
      }
      document.getElementById("output").textContent = "Generated: " + (data.Email || "undefined");
      loadEmailList();
    })
    .catch(err => {
      document.getElementById("output").textContent = "Error!";
      console.error(err);
    });
}

document.getElementById("generateBtn").addEventListener("click", generateEmailFromScript);

function addRowToTable(row) {
  const tbody = document.querySelector("#gmailTable tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row["Email"] || ""}</td>
    <td>${row["Password"] || ""}</td>
    <td>${row["Tarikh"] || ""}</td>
    <td><input type="text" value="${row["Player List"] || ""}" /></td>
    <td><input type="text" value="${row["Harga (RM)"] || ""}" /></td>
    <td><input type="text" value="${row["Seller"] || ""}" /></td>
    <td><button onclick="updateRow(this)">Update</button></td>
  `;
  tbody.appendChild(tr);
}

function updateRow(btn) {
  const tr = btn.closest("tr");
  const email = tr.children[0].innerText;
  const data = {
    "Email": email,
    "Player List": tr.children[3].children[0].value,
    "Harga (RM)": tr.children[4].children[0].value,
    "Seller": tr.children[5].children[0].value
  };
  fetch(updateURL + "?t=" + Date.now(), {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) alert("Updated!");
      else alert("Gagal update.");
    })
    .catch(err => {
      console.error(err);
      alert("Gagal update.");
    });
}