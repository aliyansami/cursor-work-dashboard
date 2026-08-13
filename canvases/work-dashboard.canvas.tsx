/**
 * DEPRECATED as the live dashboard.
 *
 * Primary UI: cd web && yarn && yarn dev → http://localhost:5173
 * Agent refreshes write: web/public/data/dashboard.json
 */
import { Callout, Code, H1, Link, Stack, Text } from "cursor/canvas";

export default function WorkDashboardPointer() {
  return (
    <Stack gap={12}>
      <H1>Jarvis Ops Console moved</H1>
      <Text tone="secondary">
        The live board is a yarn React app under web/. Canvas rewrites were too slow and token-heavy.
      </Text>
      <Callout tone="info" title="Run locally">
        cd web && yarn && yarn dev — then open http://localhost:5173
      </Callout>
      <Text size="small" tone="tertiary">
        Agent updates <Code>web/public/data/dashboard.json</Code> on refresh — keep stable ids for Clear
        Done.
      </Text>
      <Link href="http://localhost:5173">Open ops console</Link>
    </Stack>
  );
}
