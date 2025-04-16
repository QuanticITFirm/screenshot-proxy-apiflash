export default async function handler(req, res) {
  const { url, device = 'desktop' } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send("Invalid URL");
  }

  const accessKey = "a2f3914e75fd4f90ac3f164631bcf9a8";

  const deviceSettings = {
    desktop: { device: "desktop" },
    tablet: { device: "tablet" },
    mobile: { device: "mobile" }
  };

  const deviceType = deviceSettings[device]?.device || "desktop";

  const apiUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${accessKey}&url=${encodeURIComponent(url)}&device=${deviceType}&wait_until=page_loaded&response_type=image`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(500).send("Failed to fetch screenshot from ApiFlash.");
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Screenshot proxy error:", err);
    res.status(500).send("Error generating screenshot.");
  }
}