export default async function handler(req, res) {
  try {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzg8wX_bZ7yAwrzAdgxB2md2nUrAll41XZLsMy6lOqW3OK301FoGH0BcNboDQRFNTTJ/exec?t=" + Date.now();

    const response = await fetch(scriptURL, {
      method: "GET",
      cache: "no-store"
    });

    const text = await response.text();

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).send(text);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to load list",
      details: error.message
    });
  }
}