import { URL } from "node:url";
const { fetch, WebSocket } = globalThis;
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { Buffer } from "node:buffer";
import { setTimeout as delay } from "node:timers/promises";

export async function openBrowser() {
  const executable = [
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/var/lib/flatpak/app/com.google.Chrome/x86_64/stable/active/files/extra/chrome",
  ].find((file) => file && existsSync(file));
  if (!executable)
    throw new Error("Instale Chrome/Chromium ou informe CHROME_BIN.");
  const directory = path.resolve("dist");
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".png": "image/png",
    ".mp4": "video/mp4",
    ".vtt": "text/vtt",
  };
  const server = createServer(async (request, response) => {
    try {
      const route = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      if (!route.startsWith("/KineinSite/")) throw new Error("Base inválida");
      const file = path.resolve(directory, route.slice("/KineinSite/".length));
      if (file !== directory && !file.startsWith(`${directory}${path.sep}`))
        throw new Error("Caminho inválido");
      const resolved = route.endsWith("/")
        ? path.join(file, "index.html")
        : file;
      const body = await readFile(resolved);
      response.writeHead(200, {
        "Content-Type":
          types[path.extname(resolved)] ?? "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/KineinSite/`;
  const profile = await mkdtemp(path.join(tmpdir(), "kinein-browser-"));
  const chrome = spawn(
    executable,
    [
      "--headless",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      `--user-data-dir=${profile}`,
      "--remote-debugging-port=0",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  let socket;
  async function close() {
    socket?.close();
    if (chrome.exitCode === null) {
      const exited = new Promise((resolve) => chrome.once("exit", resolve));
      chrome.kill();
      await Promise.race([exited, delay(3000)]);
      if (chrome.exitCode === null) {
        chrome.kill("SIGKILL");
        await exited;
      }
    }
    await new Promise((resolve) => server.close(resolve));
    await rm(profile, {
      recursive: true,
      force: true,
      maxRetries: 20,
      retryDelay: 100,
    });
  }
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let output = "";
      const timeout = globalThis.setTimeout(
        () => reject(new Error("Chrome não iniciou em 20 s.")),
        20000,
      );
      chrome.once("error", (error) => {
        globalThis.clearTimeout(timeout);
        reject(error);
      });
      chrome.stderr.on("data", (chunk) => {
        output += chunk.toString();
        const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) {
          globalThis.clearTimeout(timeout);
          resolve(match[1]);
        }
      });
    });
    const address = new URL(endpoint);
    const targets = await (
      await fetch(`http://${address.host}/json/list`)
    ).json();
    socket = new WebSocket(
      targets.find((target) => target.type === "page").webSocketDebuggerUrl,
    );
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    let id = 0;
    const pending = new Map();
    const errors = [];
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const callback = pending.get(message.id);
        pending.delete(message.id);
        if (message.error)
          callback.reject(new Error(JSON.stringify(message.error)));
        else callback.resolve(message.result);
      } else if (message.method === "Runtime.exceptionThrown")
        errors.push(message.params.exceptionDetails);
      else if (
        message.method === "Log.entryAdded" &&
        message.params.entry.level === "error"
      )
        errors.push(message.params.entry);
    });
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const requestId = ++id;
        pending.set(requestId, { resolve, reject });
        socket.send(JSON.stringify({ id: requestId, method, params }));
      });
    }
    async function evaluate(expression) {
      const result = await send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (result.exceptionDetails)
        throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    }
    async function navigate(route = "") {
      await send("Page.navigate", { url: new URL(route, base).href });
      for (let i = 0; i < 100; i++) {
        if (
          await evaluate(
            `location.href === ${JSON.stringify(new URL(route, base).href)} && document.readyState === 'complete' && document.documentElement.dataset.enhanced === 'true'`,
          )
        )
          return;
        await delay(50);
      }
      throw new Error(`Página não ficou pronta: ${route}`);
    }
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Log.enable");
    return {
      base,
      send,
      evaluate,
      navigate,
      errors,
      close,
      screenshot: async () =>
        Buffer.from(
          (
            await send("Page.captureScreenshot", {
              format: "png",
              captureBeyondViewport: false,
            })
          ).data,
          "base64",
        ),
    };
  } catch (error) {
    await close();
    throw error;
  }
}
