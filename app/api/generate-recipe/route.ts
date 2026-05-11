import { NextResponse } from "next/server";

function fallbackRecipe(query: string) {
  const q = query?.trim() || "健康家常晚餐";
  const lower = q.toLowerCase();

  if (lower.includes("牛") || lower.includes("beef")) {
    return {
      nameZh: q.includes("牛") ? q : "日式牛肉饭",
      nameEn: "Japanese Beef Rice Bowl",
      servings: 2,
      tagsZh: ["AI生成", "高蛋白", "日式"],
      tagsEn: ["AI Generated", "Protein", "Japanese"],
      instructionsZh: "洋葱切丝，牛肉片煎至变色，加入酱油、味淋或少量糖调味，配米饭食用。",
      instructionsEn: "Slice onion, cook beef until browned, season with soy sauce and mirin or a little sugar, serve over rice.",
      ingredients: [
        { zh: "牛肉片", en: "Sliced beef", qty: 300, unitZh: "克", unitEn: "g", cat: "meat" },
        { zh: "洋葱", en: "Onion", qty: 1, unitZh: "个", unitEn: "pc", cat: "vegetables" },
        { zh: "米饭", en: "Rice", qty: 2, unitZh: "碗", unitEn: "bowls", cat: "pantry" },
        { zh: "酱油", en: "Soy sauce", qty: 2, unitZh: "勺", unitEn: "tbsp", cat: "sauces" }
      ]
    };
  }

  if (lower.includes("鸡") || lower.includes("chicken")) {
    return {
      nameZh: q.includes("鸡") ? q : "蒜香鸡胸蔬菜碗",
      nameEn: "Garlic Chicken Vegetable Bowl",
      servings: 2,
      tagsZh: ["AI生成", "健康", "高蛋白"],
      tagsEn: ["AI Generated", "Healthy", "Protein"],
      instructionsZh: "鸡胸肉切片腌制，煎熟后加入西兰花和蒜末翻炒，搭配米饭或沙拉。",
      instructionsEn: "Slice and season chicken breast, pan-sear, stir-fry with broccoli and garlic, serve with rice or salad.",
      ingredients: [
        { zh: "鸡胸肉", en: "Chicken breast", qty: 350, unitZh: "克", unitEn: "g", cat: "meat" },
        { zh: "西兰花", en: "Broccoli", qty: 1, unitZh: "颗", unitEn: "head", cat: "vegetables" },
        { zh: "蒜", en: "Garlic", qty: 3, unitZh: "瓣", unitEn: "cloves", cat: "vegetables" },
        { zh: "米饭", en: "Rice", qty: 2, unitZh: "碗", unitEn: "bowls", cat: "pantry" }
      ]
    };
  }

  return {
    nameZh: q,
    nameEn: q,
    servings: 2,
    tagsZh: ["AI生成", "可编辑"],
    tagsEn: ["AI Generated", "Editable"],
    instructionsZh: "这是备用生成菜谱。你可以保存后点击编辑，修改食材、数量和做法。",
    instructionsEn: "This is a fallback generated recipe. Save it and edit ingredients, quantities, and instructions.",
    ingredients: [
      { zh: "蛋白质食材", en: "Protein", qty: 300, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "蔬菜", en: "Vegetables", qty: 2, unitZh: "份", unitEn: "servings", cat: "vegetables" },
      { zh: "主食", en: "Staple", qty: 2, unitZh: "份", unitEn: "servings", cat: "pantry" },
      { zh: "调料", en: "Seasoning", qty: 2, unitZh: "勺", unitEn: "tbsp", cat: "sauces" }
    ]
  };
}

function parseJson(text: string) {
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
        message: "Missing OPENAI_API_KEY. Returned fallback recipe."
      });
    }

    const prompt = `
You are a bilingual recipe generator for a meal planning app.
User language preference: ${language === "en" ? "English" : "Simplified Chinese"}.
Number of people: ${people || 2}.
User request: ${query || "healthy dinner"}.

Return ONLY valid JSON. No markdown. No explanation.

Schema:
{
  "nameZh": "中文菜名",
  "nameEn": "English recipe name",
  "servings": 2,
  "tagsZh": ["标签"],
  "tagsEn": ["tag"],
  "instructionsZh": "简短中文做法",
  "instructionsEn": "short English instructions",
  "ingredients": [
    {
      "zh": "中文食材名",
      "en": "English ingredient name",
      "qty": 1,
      "unitZh": "克/个/勺/碗/份",
      "unitEn": "g/pc/tbsp/bowl/serving",
      "cat": "vegetables"
    }
  ]
}

Rules:
- cat must be one of: vegetables, meat, seafood, dairy, sauces, pantry.
- Generate practical home cooking recipes.
- Use common grocery ingredients in the US.
- Include 4 to 8 ingredients.
- Set servings to 2 by default unless user clearly asks otherwise.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: "OpenAI request failed", detail },
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

    const recipe = parseJson(outputText);

    return NextResponse.json({ recipe, usedFallback: false });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate recipe", detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
