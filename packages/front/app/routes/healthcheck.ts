export async function loader() {
  try {
    return new Response("OK");
  } catch (_error: unknown) {
    return new Response("ERROR", { status: 500 });
  }
}
