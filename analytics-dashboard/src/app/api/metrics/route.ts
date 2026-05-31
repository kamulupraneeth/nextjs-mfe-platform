import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const metricData = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          cpuUsage: Math.floor(Math.random() * 40) + 40, // Simulates 40% - 80% CPU
          memoryUsage: Math.floor(Math.random() * 20) + 60, // Simulates 60% - 80% RAM
          networkIn: Math.floor(Math.random() * 300) + 100, // Live Network traffic (MB/s)
          statusCode: Math.random() > 0.05 ? 200 : 500, // Inject 5% failure rates
        };

        // Formats data perfectly for native EventSource parsing
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(metricData)}\n\n`),
        );
      }, 200); // Pumps out data frames 5 times every single second

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
