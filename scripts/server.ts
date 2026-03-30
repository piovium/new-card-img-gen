import { createServer } from "vite";
import puppeteer from "puppeteer-core";
import path from "node:path";
import exitHook from "exit-hook";
import type { RenderAppOption } from "../src/App";
import { Elysia, t } from "elysia";
import type {} from "../src/vite-env";
import type { AllRawData, OverrideContext, Version } from "../src/types";
import { ASSETS_API_ENDPOINT, getData } from "../src/shared";
import { overrideData } from "../src/constants";
import { applyOverride } from "../src/override";

const server = await createServer({
  root: path.resolve(import.meta.dirname, ".."),
  server: {
    port: 1337,
    strictPort: true,
    watch: null,
    host: "0.0.0.0",
  },
});
await server.listen();

const address = `http://${import.meta.env.HOSTNAME || "localhost"}:1337`;

const browser = import.meta.env.CHROMIUM_BROWSER_URL
  ? await puppeteer.connect({
      browserURL: import.meta.env.CHROMIUM_BROWSER_URL,
    })
  : await puppeteer.launch({
      executablePath: import.meta.env.CHROMIUM_EXECUTABLE_PATH,
      // headless: false,
      args: ["--no-sandbox"],
    });
const page = await browser.newPage();
await page.goto(address, { waitUntil: "networkidle0" });

enum Language {
  CHS = "CHS",
  EN = "EN",
}
enum RenderFormat {
  Png = "png",
  Jpeg = "jpeg",
  Webp = "webp",
}

const allData = new Map<string, AllRawData>();

const bunServer = new Elysia()
  .onError(({ error }) => {
    return {
      success: false,
      error: "message" in error ? error.message : String(error),
    };
  })
  .post(
    "/render",
    async ({ body }) => {
      const language = body.language || Language.CHS;
      const version = body.version || "latest";
      const dataKey = `${version}-${language}`;
      const versionList = await fetch(`${ASSETS_API_ENDPOINT}/metadata`).then(
        async (r) =>
          r.ok
            ? (
                await r.json()
              ).availableVersions
            : Promise.reject(new Error(await r.text()))
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
          overrideContext
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
      return {
        success: true,
        url: await page.evaluate((opt) => window.renderCardImage(opt), opt),
      };
    },
    {
      body: t.Object({
        id: t.Number(),
        language: t.Optional(t.Enum(Language)),
        cardbackImage: t.Optional(t.String()),
        version: t.Optional(t.String()),
        authorName: t.Optional(t.String()),
        authorImageUrl: t.Optional(t.String()),
        displayId: t.Optional(t.Boolean()),
        displayStory: t.Optional(t.Boolean()),
        mirroredLayout: t.Optional(t.Boolean()),
        debug: t.Optional(t.Boolean()),
        renderFormat: t.Optional(t.Enum(RenderFormat)),
        renderQuality: t.Optional(t.Number()),
      }),
    }
  )
  .listen(process.env.PORT || 3000);
console.log(
  `Elysia running at http://${bunServer.server?.hostname}:${bunServer.server?.port}`
);

exitHook(() => {
  if (import.meta.env.CHROMIUM_BROWSER_URL) {
    browser.disconnect();
  } else {
    browser.close();
  }
  server.close();
});
