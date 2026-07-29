import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * No incremental cache override is configured: every route in this app is
 * statically prerendered and nothing uses ISR or revalidation, so there is no
 * cache to populate and no R2 bucket to provision.
 */
export default defineCloudflareConfig();
