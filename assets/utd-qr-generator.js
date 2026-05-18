(() => {
  const UTD_ORANGE = "#e87500";
  const UTD_GREEN = "#154734";
  const WHITE = "#ffffff";
  const LINE = "#d9dcdf";

  const form = document.querySelector("#utd-qr-form");
  const urlInput = document.querySelector("#utd-url-input");
  const sizeSelect = document.querySelector("#utd-size-select");
  const badgeSelect = document.querySelector("#utd-badge-select");
  const downloadButton = document.querySelector("#utd-download-button");
  const statusText = document.querySelector("#utd-status");
  const metaText = document.querySelector("#utd-qr-meta");
  const previewCanvas = document.querySelector("#utd-qr-canvas");

  const logo = new Image();
  logo.decoding = "async";
  const scriptUrl = document.currentScript ? document.currentScript.src : "assets/utd-qr-generator.js";
  logo.src = new URL("utd-emblem.svg", scriptUrl).href;

  let renderToken = 0;
  let currentUrl = "";
  let currentQr = null;

  const logoReady = new Promise((resolve) => {
    logo.addEventListener("load", () => resolve(true), { once: true });
    logo.addEventListener("error", () => resolve(false), { once: true });
  });

  function normalizeUrl(rawValue) {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      throw new Error("Paste a URL first.");
    }

    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Use an http or https URL.");
    }

    return parsed.href;
  }

  function isFinderModule(x, y, size) {
    const inTop = y < 7;
    const inLeft = x < 7;
    const inRight = x >= size - 7;
    const inBottom = y >= size - 7;
    return (inTop && inLeft) || (inTop && inRight) || (inBottom && inLeft);
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function fillRoundedRect(ctx, x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    roundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
  }

  function drawFinder(ctx, x, y, moduleSize) {
    const outer = moduleSize * 7;
    const middle = moduleSize * 5;
    const inner = moduleSize * 3;
    const outerRadius = Math.max(2, moduleSize * 0.75);
    const middleRadius = Math.max(2, moduleSize * 0.54);
    const innerRadius = Math.max(2, moduleSize * 0.36);

    fillRoundedRect(ctx, x, y, outer, outer, outerRadius, UTD_ORANGE);
    fillRoundedRect(ctx, x + moduleSize, y + moduleSize, middle, middle, middleRadius, WHITE);
    fillRoundedRect(ctx, x + moduleSize * 2, y + moduleSize * 2, inner, inner, innerRadius, UTD_ORANGE);
  }

  function drawLogoBadge(ctx, size, badgeRatio, hasLogo) {
    const badgeSize = Math.round(size * badgeRatio);
    const x = Math.round((size - badgeSize) / 2);
    const y = x;
    const radius = Math.round(badgeSize * 0.16);

    ctx.save();
    ctx.shadowColor = "rgba(21, 71, 52, 0.18)";
    ctx.shadowBlur = Math.max(10, Math.round(size * 0.018));
    ctx.shadowOffsetY = Math.max(3, Math.round(size * 0.005));
    fillRoundedRect(ctx, x, y, badgeSize, badgeSize, radius, WHITE);
    ctx.restore();

    ctx.lineWidth = Math.max(2, Math.round(size * 0.002));
    ctx.strokeStyle = "rgba(21, 71, 52, 0.2)";
    roundedRect(ctx, x, y, badgeSize, badgeSize, radius);
    ctx.stroke();

    if (!hasLogo) {
      ctx.fillStyle = UTD_ORANGE;
      ctx.font = `700 ${Math.round(badgeSize * 0.28)}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("UTD", size / 2, size / 2);
      return;
    }

    const logoSize = Math.round(badgeSize * 0.78);
    const logoX = Math.round((size - logoSize) / 2);
    const logoY = logoX;
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
  }

  async function drawBrandedQr(canvas, value, outputSize, badgeRatio) {
    const hasLogo = await logoReady;
    const qr = qrcodegen.QrCode.encodeText(value, qrcodegen.QrCode.Ecc.HIGH);
    const quietModules = 4;
    const totalModules = qr.size + quietModules * 2;
    const moduleSize = Math.max(1, Math.floor(outputSize / totalModules));
    const qrPixelSize = moduleSize * totalModules;
    const margin = Math.floor((outputSize - qrPixelSize) / 2);
    const origin = margin + quietModules * moduleSize;
    const ctx = canvas.getContext("2d");

    canvas.width = outputSize;
    canvas.height = outputSize;
    ctx.clearRect(0, 0, outputSize, outputSize);
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, outputSize, outputSize);

    ctx.fillStyle = UTD_GREEN;
    for (let y = 0; y < qr.size; y += 1) {
      for (let x = 0; x < qr.size; x += 1) {
        if (!qr.getModule(x, y) || isFinderModule(x, y, qr.size)) {
          continue;
        }

        const inset = Math.max(1, moduleSize * 0.15);
        const cell = Math.max(1, moduleSize - inset * 2);
        fillRoundedRect(
          ctx,
          origin + x * moduleSize + inset,
          origin + y * moduleSize + inset,
          cell,
          cell,
          Math.max(1, cell * 0.24),
          UTD_GREEN,
        );
      }
    }

    drawFinder(ctx, origin, origin, moduleSize);
    drawFinder(ctx, origin + (qr.size - 7) * moduleSize, origin, moduleSize);
    drawFinder(ctx, origin, origin + (qr.size - 7) * moduleSize, moduleSize);
    drawLogoBadge(ctx, outputSize, badgeRatio, hasLogo);

    ctx.lineWidth = Math.max(1, Math.round(outputSize * 0.002));
    ctx.strokeStyle = LINE;
    ctx.strokeRect(0.5, 0.5, outputSize - 1, outputSize - 1);

    return qr;
  }

  async function renderPreview() {
    const token = ++renderToken;
    const outputSize = Number(sizeSelect.value);
    const badgeRatio = Number(badgeSelect.value);

    try {
      currentUrl = normalizeUrl(urlInput.value);
      const qr = await drawBrandedQr(previewCanvas, currentUrl, 1024, badgeRatio);
      if (token !== renderToken) {
        return;
      }

      currentQr = qr;
      downloadButton.disabled = false;
      urlInput.setAttribute("aria-invalid", "false");
      statusText.textContent = `Ready for ${outputSize}px PNG export.`;
      metaText.textContent = `${qr.size} x ${qr.size} modules, high correction`;
    } catch (error) {
      if (token !== renderToken) {
        return;
      }

      currentUrl = "";
      currentQr = null;
      downloadButton.disabled = true;
      urlInput.setAttribute("aria-invalid", "true");
      statusText.textContent = error.message;
      metaText.textContent = "No QR generated";
    }
  }

  function makeFilename(urlValue, size) {
    let hostname = "utd-link";
    try {
      hostname = new URL(urlValue).hostname.replace(/^www\./, "");
    } catch {
      hostname = "utd-link";
    }

    const safeHost = hostname.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `utd-qr-${safeHost || "link"}-${size}px.png`;
  }

  async function downloadPng() {
    if (!currentUrl || !currentQr) {
      await renderPreview();
    }

    if (!currentUrl) {
      return;
    }

    const outputSize = Number(sizeSelect.value);
    const badgeRatio = Number(badgeSelect.value);
    const exportCanvas = document.createElement("canvas");
    await drawBrandedQr(exportCanvas, currentUrl, outputSize, badgeRatio);
    exportCanvas.toBlob((blob) => {
      if (!blob) {
        statusText.textContent = "Could not create PNG.";
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = makeFilename(currentUrl, outputSize);
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      statusText.textContent = `Downloaded ${outputSize}px PNG.`;
    }, "image/png");
  }

  let inputTimer = null;
  function queuePreview() {
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(renderPreview, 120);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPreview();
  });
  urlInput.addEventListener("input", queuePreview);
  sizeSelect.addEventListener("change", renderPreview);
  badgeSelect.addEventListener("change", renderPreview);
  downloadButton.addEventListener("click", downloadPng);

  renderPreview();
})();
