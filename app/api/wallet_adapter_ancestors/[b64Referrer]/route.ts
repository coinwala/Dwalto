import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://wallet.coinwala.io",
];

function corsMiddleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  const isAllowedOrigin = ALLOWED_ORIGINS.some((allowedOrigin) =>
    origin.startsWith(allowedOrigin)
  );
  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "",
    "Access-Control-Allow-Methods": "GET,OPTIONS,POST,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  return corsHeaders;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { b64Referrer: string } }
) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsMiddleware(request),
    });
  }

  try {
    const { b64Referrer } = params;

    if (!b64Referrer) {
      return NextResponse.json(
        { error: "Missing referrer" },
        {
          status: 400,
          headers: corsMiddleware(request),
        }
      );
    }

    let decodedData: string;
    try {
      decodedData = Buffer.from(b64Referrer, "base64").toString("utf-8");
    } catch (decodeError) {
      console.error("Base64 decoding error:", decodeError);
      return NextResponse.json(
        { error: "Invalid base64 encoding" },
        {
          status: 400,
          headers: corsMiddleware(request),
        }
      );
    }
    let referrerData: { clientId: string; referrerUrl: string };
    try {
      referrerData = JSON.parse(decodedData);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON data" },
        {
          status: 400,
          headers: corsMiddleware(request),
        }
      );
    }
    if (!referrerData.clientId) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        {
          status: 400,
          headers: corsMiddleware(request),
        }
      );
    }

    const sanitizedUrl = sanitizeUrlForAllowList(referrerData.referrerUrl);

    // Allowlist of permitted domains
    const ALLOWED_DOMAINS = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://wallet.coinwala.io",
    ];

    if (!ALLOWED_DOMAINS.includes(sanitizedUrl)) {
      return NextResponse.json(
        { error: "Unauthorized referrer" },
        {
          status: 403,
          headers: corsMiddleware(request),
        }
      );
    }
    return NextResponse.json(
      {
        ancestor: sanitizedUrl,
      },
      {
        headers: corsMiddleware(request),
      }
    );
  } catch (error) {
    console.error("Referrer validation error:", error);
    return NextResponse.json(
      { error: "Invalid referrer data" },
      {
        status: 400,
        headers: corsMiddleware(request),
      }
    );
  }
}

function sanitizeUrlForAllowList(urlString: string): string {
  try {
    const url = new URL(urlString);
    const { protocol, hostname, port } = url;
    return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
  } catch (error) {
    console.error("Invalid URL:", error);
    throw new Error("Invalid URL format");
  }
}
