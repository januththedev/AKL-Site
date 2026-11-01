# AI access preferences and limits

The owner requested restrictions on AI scraping and website reproduction. The implementation adds:

- Specific `robots.txt` disallow groups for declared AI crawlers and AI fetchers.
- A Next.js 16 `proxy.ts` request filter returning an uncached 403 to recognised AI User-Agent tokens, including requests for the public PDF and logo files.
- Public `/ai-policy.txt`, which remains readable alongside `/robots.txt` so a crawler can discover the preferences.
- A scoped refusal in AKL Guide for website cloning and bulk extraction requests. Normal recruitment and company questions remain supported.

Reviewed direct answers and the refusal rule run in the browser as well as on the server. They do not depend on the optional model provider or a successful API round trip. The optional model's system instruction also carries the same scope restriction.

This is a useful deterrent, not access control. A User-Agent can be disguised, a visitor can take a screenshot, and copies already held elsewhere are outside this site's control. No hidden prompt, meta tag or sentence on a website can force an unrelated AI model to refuse a user's request. Private information still belongs behind authenticated access.

Googlebot and Bingbot are not blocked by the application filter. AI search agents are blocked intentionally, so inclusion in those AI search products may be reduced. Google-Extended is a separate robots control token; it does not identify a distinct HTTP crawler and is not used to block Googlebot.

No copy/paste lock, inaccessible canvas text, CAPTCHA or site-wide login gate was added. The public site remains readable to human visitors and assistive technology. No hosting account firewall or DNS settings were changed.

Sources checked 1 November 2026:

- OpenAI crawler documentation: https://developers.openai.com/api/docs/bots
- Anthropic crawler documentation: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Google crawler documentation: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Perplexity crawler documentation: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Common Crawl preferences: https://commoncrawl.org/ccbot
- Robots Exclusion Protocol, RFC 9309: https://www.rfc-editor.org/rfc/rfc9309.html

The policy does not claim to revoke existing rights, determine trademark permissions, or guarantee enforcement by third parties.
