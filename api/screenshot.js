export default async function handler(req, res) {
  const { url, device = 'desktop' } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).send("Invalid URL");
  }

  const accessKey = "a2f3914e75fd4f90ac3f164631bcf9a8"; // Keep this safe later

  const deviceSettings = {
    desktop: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0 Safari/537.36",
      viewport: "1280x800"
    },
    tablet: {
      userAgent: "Mozilla/5.0 (iPad; CPU OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)",
      viewport: "768x1024"
    },
    mobile: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
      viewport: "375x812"
    }
  };

  const { userAgent, viewport } = deviceSettings[device] || deviceSettings.desktop;

  const apiUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${accessKey}&url=${encodeURIComponent(url)}&user_agent=${encodeURIComponent(userAgent)}&viewport=${viewport}&wait_until=page_loaded&response_type=image`;

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
