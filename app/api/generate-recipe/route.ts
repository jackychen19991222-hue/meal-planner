import { NextResponse } from "next/server";

function fallbackRecipe(query: string) {
  const q = query || "健康家常晚餐";
  return {
    nameZh: q.includes("鸡") ? q : `${q} 鸡胸蔬菜碗`,
    nameEn: "AI Chicken Vegetable Bowl",
    servings: 2,
    tagsZh: ["AI生成", "可编辑", "健康"],
    tagsEn: ["AI Generated", "Editable", "Healthy"],
    instructionsZh: "将蛋白质食材煎熟，蔬菜焯水或翻炒，搭配主食后调味。你可以保存后继续编辑。",
    instructionsEn: "Cook the protein, prepare vegetables, serve with a staple, and season to taste. You can edit after saving.",
    ingredients: [
      { zh: "鸡胸肉", en: "Chicken breast", qty: 300, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "西兰花", en: "Broccoli", qty: 1, unitZh: "颗", unitEn: "head", cat: "vegetables" },
      { zh: "米饭", en: "Rice", qty: 2, unitZh: "碗", unitEn: "bowls", cat: "pantry" },
      { zh: "酱油", en: "Soy sauce", qty: 2, unitZh: "勺", unitEn: "tbsp", cat: "sauces" }
    ]
  };
}

function tryParseJson(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const { query, people, language } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        recipe: fallbackRecipe(query),
        usedFallback: true,
        message: "OPENAI_API_KEY is missing. Returned fallback recipe."
      });
    }

    const prompt = `
You are a bilingual recipe generator for a weekly meal planning app.
User language preference: ${language === "en" ? "English" : "Simplified Chinese"}.
People: ${people || 2}.
User request: ${query}.

Return ONLY valid JSON. No markdown.
Use this schema:
{
  "nameZh": "Chinese recipe name",
  "nameEn": "English recipe name",
  "servings": 2,
  "tagsZh": ["标签1", "标签2"],
  "tagsEn": ["tag1", "tag2"],
  "instructionsZh": "简短中文做法",
  "instructionsEn": "short English instructions",
  "ingredients": [
    {
      "zh": "中文食材名",
      "en": "English ingredient name",
      "qty": 1,
      "unitZh": "克/个/勺/碗/份",
      "unitEn": "g/pc/tbsp/bowl/serving",
      "cat": "vegetables | meat | seafood | dairy | sauces | pantry"
    }
  ]
}

Rules:
- Generate practical home-cooking recipes.
- Keep ingredients easy to buy in US grocery stores.
- Include 4 to 8 ingredients.
- The cat field must be one of: vegetables, meat, seafood, dairy, sauces, pantry.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "OpenAI request failed", detail: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    const outputText =
      data.output_text ||
      data.output?.flatMap((item: any) => item.content || [])
        ?.map((content: any) => content.text || "")
        ?.join("") ||
      "";

    const recipe = tryParseJson(outputText);

    return NextResponse.json({
      recipe,
      usedFallback: false
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate recipe", detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
