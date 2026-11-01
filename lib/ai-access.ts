/** Published crawler preferences, plus a modest request filter for declared AI agents.
 * User-Agent is self-reported: this is not authentication or a guarantee against scraping.
 */
export const AI_ROBOTS_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'CCBot', 'Bytespider',
] as const;

// Google-Extended is a robots.txt control token, not a separate HTTP User-Agent.
const declaredAiAgent = /(?:^|[^a-z0-9])(?:gptbot|oai-searchbot|chatgpt-user|claudebot|claude-searchbot|claude-user|perplexitybot|perplexity-user|ccbot|bytespider)(?=[^a-z0-9]|$)/i;
const policyPaths = new Set(['/robots.txt', '/ai-policy.txt']);

export function restrictAiRequest(userAgent: string | null, pathname: string) {
  return !policyPaths.has(pathname) && declaredAiAgent.test(userAgent || '');
}

export const AI_ACCESS_MESSAGE = 'Automated AI access is not permitted by this website. Please see /ai-policy.txt or contact AL Karrim Lanka Consultants PVT LTD for permission.\n';
