const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzg8wX_bZ7yAwrzAdgxB2md2nUrAll41XZLsMy6lOqW3OK301FoGH0BcNboDQRFNTTJ/exec";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=list`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
