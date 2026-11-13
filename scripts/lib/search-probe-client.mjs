// Somente a cópia de diagnóstico carrega este módulo. Nada é importado antes
// de runC0: permite medir carregamento sob demanda e CSP sem bypass de DevTools.
const { document, performance, URL } = globalThis;
globalThis.c0Violations = [];
document.addEventListener("securitypolicyviolation", (event) => {
  globalThis.c0Violations.push({
    directive: event.effectiveDirective,
    blocked: event.blockedURI,
  });
});
globalThis.runC0 = async (query, options = {}, searchOptions = {}) => {
  const start = performance.now();
  try {
    const pagefind = await import("./pagefind/pagefind.js");
    await pagefind.options({
      baseUrl: new URL("./", import.meta.url).pathname,
      ...options,
    });
    const found = await pagefind.search(query, searchOptions);
    const results = await Promise.all(
      found.results.slice(0, 8).map(async (item) => {
        const data = await item.data();
        return {
          url: data.url,
          meta: data.meta,
          excerpt: data.excerpt,
          sub_results: data.sub_results,
          anchors: data.anchors,
        };
      }),
    );
    return {
      query,
      total: found.results.length,
      results,
      ms: performance.now() - start,
    };
  } catch (error) {
    return { query, error: String(error), ms: performance.now() - start };
  }
};
globalThis.c0Ready = true;
