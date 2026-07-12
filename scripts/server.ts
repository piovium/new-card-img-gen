import { createServer } from "vite";
import puppeteer from "puppeteer-core";
import path from "node:path";
import exitHook from "exit-hook";
import type { RenderAppOption } from "../src/App.tsx";
import { Hono } from "hono";
import { sValidator } from "@hono/standard-validator";
import { type } from "arktype";
import { serve } from "@hono/node-server";
import type {} from "../src/vite-env.d.ts";
import type { AllRawData, OverrideContext, Version } from "../src/types.ts";
import { ASSETS_API_ENDPOINT, getData } from "../src/shared.ts";
import { overrideData } from "../src/constants.ts";
import { applyOverride } from "../src/override.ts";

const viteServer = await createServer({
  root: path.resolve(import.meta.dirname, ".."),
  server: {
    port: 1337,
    strictPort: true,
    watch: null,
    host: "0.0.0.0",
  },
});
await viteServer.listen();

const address = `http://${process.env.HOSTNAME || "localhost"}:1337`;

const browser = process.env.CHROMIUM_BROWSER_URL
  ? await puppeteer.connect({
      browserURL: process.env.CHROMIUM_BROWSER_URL,
    })
  : await puppeteer.launch({
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
      // headless: false,
      args: ["--no-sandbox"],
    });
const page = await browser.newPage();
await page.goto(address, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => typeof window.renderCardImage === "function");

const Language = {
  CHS: "CHS",
  EN: "EN",
} as const;
const RenderFormat = {
  Png: "png",
  Jpeg: "jpeg",
  Webp: "webp",
} as const;

const allData = new Map<string, AllRawData>();

const inputSchema = type({
  id: "number",
  "language?": type.valueOf(Language),
  "cardbackImage?": "string",
  "version?": "string",
  "authorName?": "string",
  "authorImageUrl?": "string",
  "displayId?": "boolean",
  "displayStory?": "boolean",
  "mirroredLayout?": "boolean",
  "debug?": "boolean",
  "renderFormat?": type.valueOf(RenderFormat),
  "renderQuality?": "number",
});

const app = new Hono()
  .onError((error) => {
    return Response.json({
      success: false,
      error: "message" in error ? error.message : String(error),
    });
  })
  .get('/health', (c) => c.text('ok'))
  .post("/render", sValidator("json", inputSchema), async ({ req }) => {
    const body = await req.json();
    const language = body.language || Language.CHS;
    const version = body.version || "latest";
    const dataKey = `${version}-${language}`;
    const versionList = await fetch(`${ASSETS_API_ENDPOINT}/metadata`).then(
      async (r) =>
        r.ok
          ? ((await r.json()) as { availableVersions: Version[] })
              .availableVersions
          : Promise.reject(new Error(await r.text())),
    );
    if (!allData.has(dataKey)) {
      const data = await getData(version, language);
      const betaVersion = "v9999.0.0" as Version;
      const latestVersion = versionList.at(-1) ?? betaVersion;
      const overrideContext: OverrideContext = {
        version:
          version === "latest"
            ? latestVersion
            : version.endsWith("-beta")
              ? betaVersion
              : (version as Version),
        language: language,
      };
      const overridedData = applyOverride(
        structuredClone(data),
        overrideData,
        overrideContext,
      );
      allData.set(dataKey, overridedData);
    }
    const data = allData.get(dataKey)!;
    const opt: RenderAppOption = {
      data,
      displayId: body.displayId ?? true,
      displayStory: body.displayStory ?? true,
      mode: body.id > 100000 ? "singleActionCard" : "character",
      characterId: body.id,
      actionCardId: body.id,
      cardbackImage: body.cardbackImage ?? "UI_Gcg_CardBack_Championship_11",
      language: body.language ?? "CHS",
      version: (body.version as Version) ?? "latest",
      authorName: body.authorName,
      authorImageUrl:
        body.authorImageUrl ?? new URL("./vite.svg", address).href,
      debug: body.debug ?? false,
      render: {
        format: body.renderFormat,
        quality: body.renderQuality,
      },
    };
    return Response.json({
      success: true,
      // @ts-expect-error DOM types
      url: await page.evaluate((opt) => window.renderCardImage(opt), opt),
    });
  });

const httpServer = serve({
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
});
console.log("Hono running at ", httpServer.address());

exitHook(() => {
  if (process.env.CHROMIUM_BROWSER_URL) {
    browser.disconnect();
  } else {
    browser.close();
  }
  viteServer.close();
  httpServer.close();
});
