
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY not found in environment variables");
    return new Response(
      JSON.stringify({ error: "API key not found" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    console.log("Request received in analyze-symptoms function");
    
    // Parse the request body
    const requestData = await req.json();
    console.log("Request data:", JSON.stringify(requestData));
    
    const { symptoms, image } = requestData;
    
    if (!symptoms || symptoms.trim() === '') {
      return new Response(
        JSON.stringify({ error: "No symptoms provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare messages array with text - modifying formatting instructions
    const messages = [
      {
        role: "system",
        content: `You are an AI medical assistant specialized in first aid guidance. Analyze the symptoms and determine if they are an emergency that requires immediate professional attention. For non-emergencies, suggest appropriate first aid guidance.

Format your response following these strict rules:
1. DO NOT begin with "First Aid Guidelines:" or "What are first aid guidelines for" - start directly with your analysis
2. For step-by-step instructions, use simple text with numbered steps 
3. For symptoms, considerations, or item lists, put each item on a new line with a hyphen (-)
4. Don't use markdown formatting like **text** or bullet points
5. Separate paragraphs with blank lines

Always prioritize safety and be concise but thorough.`
      },
      {
        role: "user",
        content: symptoms
      }
    ];

    // Add image to messages if provided
    if (image) {
      console.log("Image provided, but note that Qwen model might not support image input");
      // Note: Qwen API may not support image input in the same way
    }

    console.log("Calling OpenRouter API with Qwen model...");
    
    const openRouterBody = {
      model: "qwen/qwq-32b:free",
      messages: messages
    };
    
    console.log("Request payload:", JSON.stringify(openRouterBody));
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://lovable.ai",
        "X-Title": "First Aid AI Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(openRouterBody)
    });

    const responseText = await response.text();
    console.log("Raw OpenRouter response:", responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing JSON response:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON response from AI service", rawResponse: responseText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return new Response(
        JSON.stringify({ error: "Error from AI service", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate response format
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Unexpected response format:", data);
      return new Response(
        JSON.stringify({ error: "Unexpected response format from AI service", details: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process the response
    const aiResponse = data.choices[0].message.content;
    
    // Remove any prefixes like "What are first aid guidelines for:"
    let cleanedResponse = aiResponse;
    const prefixesToRemove = [
      "What are first aid guidelines for:", 
      "What are first aid guidelines for", 
      "First aid guidelines for:",
      "First aid guidelines for"
    ];
    
    for (const prefix of prefixesToRemove) {
      if (cleanedResponse.startsWith(prefix)) {
        cleanedResponse = cleanedResponse.substring(prefix.length).trim();
        break;
      }
    }
    
    // Determine if it's an emergency from the AI response
    const isEmergency = /emergency|immediate|urgent|call 911|hospital|ambulance|critical|severe|life-threatening/i.test(cleanedResponse);
    
    // Find the best matching guidance if not an emergency
    let matchingGuidance = null;
    if (!isEmergency) {
      // Basic categorization to find relevant keywords
      const symptomsLower = symptoms.toLowerCase();
      const commonKeywords = {
        "cut": "cuts",
        "burn": "burns",
        "sprain": "sprains",
        "fracture": "fractures",
        "insect": "insect-bites",
        "sting": "insect-bites",
        "bite": "bites",
        "fever": "fever",
        "headache": "headaches",
        "bleeding": "bleeding",
        "choking": "choking"
      };
      
      for (const [keyword, category] of Object.entries(commonKeywords)) {
        if (symptomsLower.includes(keyword)) {
          matchingGuidance = category;
          break;
        }
      }
    }

    console.log("Analysis complete. Emergency:", isEmergency, "Category:", matchingGuidance);
    
    return new Response(
      JSON.stringify({ 
        analysis: cleanedResponse,
        isEmergency,
        category: matchingGuidance
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-symptoms function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
