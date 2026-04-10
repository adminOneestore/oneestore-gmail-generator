const generateURL = "/api/generate";
const listURL = "/api/list";
const updateURL = "/api/update";

let allRows = [];

window.onload = loadEmailList;

function loadEmailList() {
  fetch(listURL + "?t=" + Date.now())
    .then(res => res.json())
    .then(data => {
      allRows = Array.isArray(data) ? data : [];
      allRows.sort((a, b) => parseCustomDate(b["Tarikh"]) - parseCustomDate(a["Tarikh"]));
      renderTable(allRows);
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

function renderTable(rows) {
  const tbody = document.querySelector("#gmailTable tbody");
  tbody.innerHTML = "";
  rows.forEach(row => addRowToTable(row));
  document.getElementById("counter").textContent = `Total: ${rows.length} email`;
}

function filterTable() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();
  const filtered = allRows.filter(row =>
    (row["Email"] || "").toLowerCase().includes(keyword) ||
    (row["Player List"] || "").toLowerCase().includes(keyword) ||
    (row["Seller"] || "").toLowerCase().includes(keyword)
  );
  renderTable(filtered);
}

function generateEmailFromScript() {
  document.getElementById("output").textContent = "Generating...";
  fetch(generateURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  })
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
  const status = row["Status"] || "AVAILABLE";
  const statusClass = status === "SOLD" ? "status-sold" : status === "FLAGGED" ? "status-flagged" : "status-available";

  tr.innerHTML = `
    <td>
      ${row["Email"] || ""}
      <button class="copy-btn" onclick="copyText('${row["Email"]}')">Copy</button>
    </td>
    <td>
      ${row["Password"] || ""}
      <button class="copy-btn" onclick="copyText('${row["Password"]}')">Copy</button>
    </td>
    <td>${row["Tarikh"] || ""}</td>
    <td><input type="text" value="${row["Player List"] || ""}" /></td>
    <td><input type="text" value="${row["Harga (RM)"] || ""}" /></td>
    <td><input type="text" value="${row["Seller"] || ""}" /></td>
    <td>
      <select onchange="changeStatus(this)">
        <option ${status === "AVAILABLE" ? "selected" : ""}>AVAILABLE</option>
        <option ${status === "SOLD" ? "selected" : ""}>SOLD</option>
        <option ${status === "FLAGGED" ? "selected" : ""}>FLAGGED</option>
      </select>
    </td>
    <td>
      <button onclick="updateRow(this)">Update</button>
      <button class="danger" onclick="deleteRow(this, '${row["Email"]}')">Delete</button>
    </td>
  `;
  tbody.appendChild(tr);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById("output").textContent = "Copied: " + text;
    setTimeout(() => document.getElementById("output").textContent = "", 2000);
  });
}

function changeStatus(select)
