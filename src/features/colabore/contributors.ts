import { autoRefresh, feedMessage, loadFeed } from "./github";
import { mergeContributors, parseContributors } from "./model";
import { contributorCard } from "./render";
import { updateList } from "../../scripts/motion";

const root = document.querySelector<HTMLElement>("[data-contributors]");
if (root) {
  const list = root.querySelector<HTMLElement>("[data-contributors-list]");
  const status = root.querySelector<HTMLElement>("[data-contributors-status]");
  let busy = false;
  let lastAttempt = 0;
  async function update(): Promise<void> {
    if (busy || document.hidden || Date.now() - lastAttempt < 60_000) return;
    busy = true;
    lastAttempt = Date.now();
    list?.setAttribute("aria-busy", "true");
    try {
      const feed = await loadFeed("contributors", parseContributors);
      const people = mergeContributors(feed.items);
      if (list) updateList(list, people.map(contributorCard));
      if (status)
        status.textContent = `${feedMessage(feed)}${people.length ? "" : " Os créditos aparecerão quando o GitHub registrar contribuições elegíveis."}`;
    } catch {
      if (status)
        status.textContent =
          "Os créditos não puderam ser consultados agora. Veja as pessoas que contribuíram nos links dos projetos abaixo.";
    } finally {
      busy = false;
      list?.setAttribute("aria-busy", "false");
    }
  }
  void update();
  autoRefresh(update);
}
