"use client";

import { useMemo, useState } from "react";

type Lang = "zh" | "en";

type Ingredient = {
  zh: string;
  en: string;
  qty: number;
  unitZh: string;
  unitEn: string;
  cat: "vegetables" | "meat" | "seafood" | "dairy" | "sauces" | "pantry";
};

type Recipe = {
  id: number;
  nameZh: string;
  nameEn: string;
  tagsZh: string[];
  tagsEn: string[];
  servings: number;
  scoreTags: string[];
  ingredients: Ingredient[];
};

const text = {
  zh: {
    appName: "一周菜单管家",
    subtitle: "AI 推荐一周菜单，自动合并购物清单，适合家庭备餐。",
    aiTitle: "AI 推荐菜单",
    preference: "饮食偏好",
    avoid: "不想吃 / 过敏食材",
    people: "用餐人数",
    generate: "AI 推荐一周菜单",
    selected: "已选择",
    week: "本周菜单",
    recipes: "菜谱库",
    shopping: "购物清单",
    smartNote: "推荐理由",
    note: "已根据你的偏好优先选择食材重复率高、做法简单、适合一周备餐的菜。",
    placeholderPreference: "例如：健康、快手、中餐、日式、高蛋白",
    placeholderAvoid: "例如：牛肉、海鲜、鸡蛋",
    servings: "人份",
    days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    categories: {
      vegetables: "蔬菜",
      meat: "肉类",
      seafood: "海鲜",
      dairy: "蛋奶",
      sauces: "调料",
      pantry: "主食/干货",
    },
  },
  en: {
    appName: "Weekly Meal Planner",
    subtitle: "AI-recommended weekly meals with an automatic grocery list.",
    aiTitle: "AI Meal Recommendation",
    preference: "Preference",
    avoid: "Avoid / Allergies",
    people: "People",
    generate: "Generate AI Weekly Plan",
    selected: "Selected",
    week: "Weekly Plan",
    recipes: "Recipe Library",
    shopping: "Shopping List",
    smartNote: "Recommendation Reason",
    note: "The plan prioritizes simple recipes, reusable ingredients, and balanced weekly prep.",
    placeholderPreference: "Example: healthy, quick, Chinese, Japanese, high protein",
    placeholderAvoid: "Example: beef, seafood, eggs",
    servings: "servings",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    categories: {
      vegetables: "Vegetables",
      meat: "Meat",
      seafood: "Seafood",
      dairy: "Eggs & Dairy",
      sauces: "Sauces",
      pantry: "Pantry",
    },
  },
};

const recipes: Recipe[] = [
  {
    id: 1,
    nameZh: "番茄炒蛋",
    nameEn: "Tomato Scrambled Eggs",
    tagsZh: ["家常菜", "快手", "中餐"],
    tagsEn: ["Chinese", "Quick", "Home"],
    servings: 2,
    scoreTags: ["快手", "中餐", "健康", "quick", "chinese", "healthy"],
    ingredients: [
      { zh: "番茄", en: "Tomatoes", qty: 2, unitZh: "个", unitEn: "pcs", cat: "vegetables" },
      { zh: "鸡蛋", en: "Eggs", qty: 3, unitZh: "个", unitEn: "pcs", cat: "dairy" },
      { zh: "葱", en: "Scallions", qty: 1, unitZh: "根", unitEn: "stalk", cat: "vegetables" },
    ],
  },
  {
    id: 2,
    nameZh: "照烧鸡腿饭",
    nameEn: "Teriyaki Chicken Bowl",
    tagsZh: ["日式", "便当", "高蛋白"],
    tagsEn: ["Japanese", "Bento", "Protein"],
    servings: 2,
    scoreTags: ["日式", "高蛋白", "快手", "japanese", "protein", "quick"],
    ingredients: [
      { zh: "鸡腿肉", en: "Chicken thigh", qty: 400, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "米饭", en: "Rice", qty: 2, unitZh: "碗", unitEn: "bowls", cat: "pantry" },
      { zh: "照烧汁", en: "Teriyaki sauce", qty: 3, unitZh: "勺", unitEn: "tbsp", cat: "sauces" },
    ],
  },
  {
    id: 3,
    nameZh: "三文鱼牛油果沙拉",
    nameEn: "Salmon Avocado Salad",
    tagsZh: ["健康", "低碳水", "轻食"],
    tagsEn: ["Healthy", "Low-carb", "Light"],
    servings: 2,
    scoreTags: ["健康", "低碳水", "高蛋白", "healthy", "low carb", "protein"],
    ingredients: [
      { zh: "三文鱼", en: "Salmon", qty: 300, unitZh: "克", unitEn: "g", cat: "seafood" },
      { zh: "牛油果", en: "Avocado", qty: 1, unitZh: "个", unitEn: "pc", cat: "vegetables" },
      { zh: "生菜", en: "Lettuce", qty: 1, unitZh: "包", unitEn: "bag", cat: "vegetables" },
    ],
  },
  {
    id: 4,
    nameZh: "牛肉乌冬面",
    nameEn: "Beef Udon",
    tagsZh: ["日式", "热汤", "简单"],
    tagsEn: ["Japanese", "Noodles", "Easy"],
    servings: 2,
    scoreTags: ["日式", "简单", "快手", "japanese", "easy", "quick"],
    ingredients: [
      { zh: "牛肉片", en: "Sliced beef", qty: 250, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "乌冬面", en: "Udon", qty: 2, unitZh: "包", unitEn: "packs", cat: "pantry" },
      { zh: "青菜", en: "Greens", qty: 1, unitZh: "把", unitEn: "bunch", cat: "vegetables" },
    ],
  },
  {
    id: 5,
    nameZh: "蒜蓉西兰花鸡胸",
    nameEn: "Garlic Broccoli Chicken Breast",
    tagsZh: ["健康", "高蛋白", "减脂"],
    tagsEn: ["Healthy", "Protein", "Lean"],
    servings: 2,
    scoreTags: ["健康", "高蛋白", "减脂", "healthy", "protein", "lean"],
    ingredients: [
      { zh: "鸡胸肉", en: "Chicken breast", qty: 350, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "西兰花", en: "Broccoli", qty: 1, unitZh: "颗", unitEn: "head", cat: "vegetables" },
      { zh: "蒜", en: "Garlic", qty: 3, unitZh: "瓣", unitEn: "cloves", cat: "vegetables" },
    ],
  },
  {
    id: 6,
    nameZh: "虾仁炒饭",
    nameEn: "Shrimp Fried Rice",
    tagsZh: ["快手", "中餐", "剩饭友好"],
    tagsEn: ["Quick", "Chinese", "Rice"],
    servings: 2,
    scoreTags: ["快手", "中餐", "简单", "quick", "chinese", "easy"],
    ingredients: [
      { zh: "虾仁", en: "Shrimp", qty: 250, unitZh: "克", unitEn: "g", cat: "seafood" },
      { zh: "米饭", en: "Rice", qty: 2, unitZh: "碗", unitEn: "bowls", cat: "pantry" },
      { zh: "鸡蛋", en: "Eggs", qty: 2, unitZh: "个", unitEn: "pcs", cat: "dairy" },
    ],
  },
];

function buildGroceryList(selectedRecipes: Recipe[], people: number, lang: Lang) {
  const map: Record<string, Ingredient & { qty: number }> = {};

  selectedRecipes.forEach((recipe) => {
    const scale = people / recipe.servings;
    recipe.ingredients.forEach((item) => {
      const itemName = lang === "zh" ? item.zh : item.en;
      const unit = lang === "zh" ? item.unitZh : item.unitEn;
      const key = `${item.cat}-${itemName}-${unit}`;
      if (!map[key]) map[key] = { ...item, qty: 0 };
      map[key].qty += item.qty * scale;
    });
  });

  return Object.values(map).reduce<Record<string, (Ingredient & { qty: number })[]>>((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {});
}

function recommendRecipes(preference: string, avoid: string) {
  const preferenceWords = preference.toLowerCase().split(/[,\s，、]+/).filter(Boolean);
  const avoidWords = avoid.toLowerCase().split(/[,\s，、]+/).filter(Boolean);

  const safeRecipes = recipes.filter((recipe) => {
    const textForRecipe = [
      recipe.nameZh,
      recipe.nameEn,
      ...recipe.tagsZh,
      ...recipe.tagsEn,
      ...recipe.ingredients.flatMap((item) => [item.zh, item.en]),
    ].join(" ").toLowerCase();

    return !avoidWords.some((word) => textForRecipe.includes(word));
  });

  const scored = safeRecipes.map((recipe) => {
    let score = 0;
    const searchable = [recipe.nameZh, recipe.nameEn, ...recipe.scoreTags, ...recipe.tagsZh, ...recipe.tagsEn].join(" ").toLowerCase();

    preferenceWords.forEach((word) => {
      if (searchable.includes(word)) score += 3;
    });

    if (recipe.tagsZh.includes("快手") || recipe.tagsEn.includes("Quick")) score += 1;
    if (recipe.tagsZh.includes("健康") || recipe.tagsEn.includes("Healthy")) score += 1;

    return { recipe, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.recipe.id - b.recipe.id)
    .map((item) => item.recipe)
    .slice(0, 4);
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [people, setPeople] = useState(2);
  const [preference, setPreference] = useState("健康 快手 中餐 高蛋白");
  const [avoid, setAvoid] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 5, 6]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const t = text[lang];

  const selectedRecipes = recipes.filter((recipe) => selectedIds.includes(recipe.id));
  const grocery = useMemo(() => buildGroceryList(selectedRecipes, people, lang), [selectedRecipes, people, lang]);

  const handleAIRecommend = () => {
    const result = recommendRecipes(preference, avoid);
    setSelectedIds(result.map((recipe) => recipe.id));
    setChecked({});
  };

  const toggleRecipe = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  return (
    <main className="min-h-screen bg-neutral-100 p-4 md:p-8 text-neutral-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t.appName}</h1>
            <p className="mt-3 text-neutral-600">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="rounded-2xl bg-white px-4 py-2 shadow-sm border"
          >
            {lang === "zh" ? "中文 / English" : "English / 中文"}
          </button>
        </header>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">✨ {t.aiTitle}</h2>

              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <label className="block">
                  <span className="text-sm text-neutral-600">{t.preference}</span>
                  <input
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    placeholder={t.placeholderPreference}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-neutral-600">{t.avoid}</span>
                  <input
                    value={avoid}
                    onChange={(e) => setAvoid(e.target.value)}
                    placeholder={t.placeholderAvoid}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-neutral-600">{t.people}</span>
                  <div className="mt-2 flex items-center justify-between rounded-2xl border px-4 py-3">
                    <button onClick={() => setPeople(Math.max(1, people - 1))} className="text-xl">−</button>
                    <strong>{people}</strong>
                    <button onClick={() => setPeople(people + 1)} className="text-xl">+</button>
                  </div>
                </label>
              </div>

              <button
                onClick={handleAIRecommend}
                className="mt-5 w-full md:w-auto rounded-2xl bg-black text-white px-6 py-3 font-medium hover:bg-neutral-800"
              >
                {t.generate}
              </button>

              <div className="mt-4 rounded-2xl bg-neutral-100 p-4">
                <div className="font-semibold">{t.smartNote}</div>
                <p className="mt-1 text-sm text-neutral-600">{t.note}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">{t.week}</h2>
              <div className="grid md:grid-cols-7 gap-3 mt-5">
                {t.days.map((day, index) => {
                  const recipe = selectedRecipes[index % Math.max(selectedRecipes.length, 1)];
                  return (
                    <div key={day} className="rounded-2xl bg-neutral-100 p-4 min-h-[130px]">
                      <div className="font-semibold">{day}</div>
                      <div className="mt-3 rounded-xl bg-white p-3 text-sm shadow-sm">
                        {recipe ? (lang === "zh" ? recipe.nameZh : recipe.nameEn) : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">{t.recipes}</h2>
              <div className="grid md:grid-cols-2 gap-4 mt-5">
                {recipes.map((recipe) => {
                  const isSelected = selectedIds.includes(recipe.id);
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => toggleRecipe(recipe.id)}
                      className={`text-left rounded-3xl border p-5 transition hover:-translate-y-0.5 ${
                        isSelected ? "border-black ring-2 ring-black" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-lg">{lang === "zh" ? recipe.nameZh : recipe.nameEn}</h3>
                          <p className="text-sm text-neutral-500 mt-1">{recipe.servings} {t.servings}</p>
                        </div>
                        <div>{isSelected ? "✓" : "○"}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(lang === "zh" ? recipe.tagsZh : recipe.tagsEn).map((tag) => (
                          <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs">{tag}</span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="bg-neutral-950 text-white rounded-3xl p-6 shadow-sm h-fit lg:sticky lg:top-6">
            <h2 className="text-2xl font-semibold">{t.shopping}</h2>
            <p className="mt-2 text-neutral-300 text-sm">{t.selected}: {selectedRecipes.length} · {people} {t.servings}</p>

            <div className="mt-6 space-y-6">
              {Object.entries(grocery).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-neutral-300 mb-2">
                    {t.categories[category as keyof typeof t.categories]}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const name = lang === "zh" ? item.zh : item.en;
                      const unit = lang === "zh" ? item.unitZh : item.unitEn;
                      const key = `${category}-${name}`;

                      return (
                        <button
                          key={key}
                          onClick={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className="w-full flex justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left hover:bg-white/15"
                        >
                          <span className={checked[key] ? "line-through text-neutral-500" : ""}>{name}</span>
                          <span className="text-neutral-300 whitespace-nowrap">
                            {Number.isInteger(item.qty) ? item.qty : item.qty.toFixed(1)} {unit}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
