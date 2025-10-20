import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Get Gemini API key from environment
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.",
        },
        { status: 500 },
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    // Get user data from Supabase
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's business data
    const [productsResult, invoicesResult, categoriesResult, profileResult] =
      await Promise.all([
        supabase.from("products").select("*").limit(100),
        supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("categories").select("*"),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

    const products = productsResult.data || [];
    const invoices = invoicesResult.data || [];
    const categories = categoriesResult.data || [];
    const profile = profileResult.data;

    // Calculate business metrics
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.low_stock_threshold,
    ).length;
    const totalRevenue = invoices.reduce(
      (sum, i) => sum + parseFloat(i.total_amount.toString()),
      0,
    );
    const totalProfit = invoices.reduce(
      (sum, i) => sum + parseFloat(i.total_profit.toString()),
      0,
    );
    const totalSales = invoices.length;

    // Create context for Gemini
    const context = `
You are an AI assistant for ShopEase, an Inventory & Sales Management System. You are helping ${profile?.full_name || profile?.email || "a user"} who is a ${profile?.role || "user"}.

CURRENT BUSINESS DATA:
- Total Products: ${totalProducts}
- Total Stock Units: ${totalStock}
- Low Stock Alerts: ${lowStockProducts} products
- Total Sales: ${totalSales} invoices
- Total Revenue: $${totalRevenue.toFixed(2)}
- Total Profit: $${totalProfit.toFixed(2)}
- Categories: ${categories.length} categories

TOP 10 PRODUCTS:
${products
  .slice(0, 10)
  .map(
    (p) =>
      `- ${p.name}: ${p.quantity} units in stock, Price: $${p.price}, Category: ${p.category}`,
  )
  .join("\n")}

RECENT SALES (Last 5):
${invoices
  .slice(0, 5)
  .map(
    (i) =>
      `- Invoice ${i.invoice_number}: $${i.total_amount} (${i.payment_method}) - ${new Date(i.created_at).toLocaleDateString()}`,
  )
  .join("\n")}

LOW STOCK PRODUCTS:
${products
  .filter((p) => p.quantity <= p.low_stock_threshold)
  .slice(0, 10)
  .map(
    (p) =>
      `- ${p.name}: Only ${p.quantity} units left (threshold: ${p.low_stock_threshold})`,
  )
  .join("\n")}

CATEGORIES:
${categories.map((c) => `- ${c.name}${c.description ? ": " + c.description : ""}`).join("\n")}

Your role is to:
1. Answer questions about their inventory, sales, and business data
2. Provide insights and recommendations based on the data
3. Help with business decisions (what to restock, pricing, trends, etc.)
4. Explain features of the ShopEase system
5. Be helpful, professional, and data-driven

User's Question: ${message}

Please provide a helpful, concise answer based on the business data above. If you're making recommendations, base them on the actual data provided. If the user asks about specific products or sales, reference the data above.
`;

    // Generate AI response using Google Generative AI package
    const result = await model.generateContent(context);
    const response = await result.response;
    const aiResponse = response.text();

    return NextResponse.json({
      response: aiResponse,
      metadata: {
        totalProducts,
        totalStock,
        lowStockProducts,
        totalSales,
        totalRevenue: totalRevenue.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
      },
    });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error",
        hint: "Check server logs for more details",
      },
      { status: 500 },
    );
  }
}
