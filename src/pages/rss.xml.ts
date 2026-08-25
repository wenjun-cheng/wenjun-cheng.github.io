import type { APIRoute } from "astro";

const SITE = "https://wenjun-cheng.github.io";

interface FeedItem {
  title: string;
  description: string;
  /** RFC 822 date */
  pubDate: string;
  link?: string;
}

// Newest first. Add an entry here whenever there is news to announce.
const items: FeedItem[] = [
  {
    title:
      "HeRo-Nav accepted at the RSS 2026 Workshop on Open World Navigation in the Foundation Model Era",
    description:
      "Our paper “HeRo-Nav: Heterogeneous Multi-Robot Collaboration for Semantic Navigation with Vision Language Models” (co-first author) was accepted at the RSS 2026 Workshop on Open World Navigation in the Foundation Model Era: Robustness and Failure Recovery.",
    pubDate: "Tue, 25 Aug 2026 00:00:00 GMT",
    link: `${SITE}/#publication`,
  },
  {
    title: "Started research on uncertainty-aware decentralized multi-robot object search",
    description:
      "Joined a new project at the University of Michigan (Scalable Spatial Intelligence Lab & Intelligent Robotics and Autonomy Lab) on uncertainty-aware decentralized multi-robot object search.",
    pubDate: "Tue, 25 Aug 2026 00:00:00 GMT",
    link: `${SITE}/#research`,
  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Wenjun Cheng</title>
    <link>${SITE}/</link>
    <description>Updates from Wenjun Cheng — robotics research at the University of Michigan.</description>
    <language>en-us</language>
${items
  .map(
    (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <description>${escapeXml(i.description)}</description>
      <pubDate>${i.pubDate}</pubDate>
      <link>${i.link ?? `${SITE}/`}</link>
      <guid isPermaLink="false">${escapeXml(i.title)}</guid>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
