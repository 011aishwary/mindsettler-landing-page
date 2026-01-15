export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
        console.error("No message provided in the request");
      return Response.json({ error: "Message is required" }, { status: 400 });
    }
    console.log("Received message:", message);
    const apiRes = await fetch(
      "https://mindsettler-chatbot.onrender.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "question": message }),
      }
    );

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error("Backend error:", text);
      return Response.json(
        { error: "Backend error", details: text },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    console.log("Backend response data:", data);

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: "Internal server error", message: err.message },
      { status: 500 }
    );
  }
}