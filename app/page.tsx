"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

type Lang = "zh" | "en";
type Category = "vegetables" | "meat" | "seafood" | "dairy" | "sauces" | "pantry";

type Ingredient = {
  zh: string;
  en: string;
  qty: number;
  unitZh: string;
  unitEn: string;
  cat: Category;
};

type Recipe = {
  id: string;
  user_id?: string;
  nameZh: string;
  nameEn: string;
  tagsZh: string[];
  tagsEn: string[];
  servings: number;
  instructionsZh: string;
  instructionsEn: string;
  ingredients: Ingredient[];
};

const ui = {
  zh: {
    appName: "一周菜单管家",
    subtitle: "Google 登录后保存你的菜单，用 OpenAI API 真正生成菜谱和购物清单。",
    signIn: "使用 Google 登录",
    signOut: "退出登录",
    notConfigured: "Supabase 还没配置。你仍然可以试用 AI 菜谱，但登录和云端保存暂时不可用。",
    aiTitle: "AI 生成菜谱",
    aiInput: "描述你想吃什么",
    aiPlaceholder: "例如：低脂高蛋白鸡胸便当、日式牛肉饭、适合两个人吃的辣味晚餐",
    generate: "生成菜谱",
    generating: "正在生成...",
    saveRecipe: "保存到我的菜单库",
    people: "用餐人数",
    weekPlan: "本周菜单",
    library: "我的菜单库",
    shopping: "购物清单",
    selected: "已选择",
    servings: "人份",
    edit: "编辑",
    delete: "删除",
    save: "保存",
    cancel: "取消",
    addCustom: "自己写菜单",
    search: "搜索菜单...",
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
    subtitle: "Sign in with Google, save your recipes, and generate recipes using OpenAI API.",
    signIn: "Sign in with Google",
    signOut: "Sign out",
    notConfigured: "Supabase is not configured yet. You can test AI recipes, but login and cloud saving are disabled.",
    aiTitle: "AI Recipe Generator",
    aiInput: "Describe what you want to eat",
    aiPlaceholder: "Example: low-fat chicken bento, Japanese beef bowl, spicy dinner for two",
    generate: "Generate Recipe",
    generating: "Generating...",
    saveRecipe: "Save to My Library",
    people: "People",
    weekPlan: "Weekly Plan",
    library: "My Recipe Library",
    shopping: "Shopping List",
    selected: "Selected",
    servings: "servings",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    addCustom: "Write My Own Recipe",
    search: "Search recipes...",
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

const starterRecipes: Recipe[] = [
  {
    id: "starter-1",
    nameZh: "番茄炒蛋",
    nameEn: "Tomato Scrambled Eggs",
    tagsZh: ["家常菜", "快手"],
    tagsEn: ["Home", "Quick"],
    servings: 2,
    instructionsZh: "番茄切块，鸡蛋打散，先炒蛋再炒番茄，合并调味。",
    instructionsEn: "Cut tomatoes, beat eggs, cook eggs first, then tomatoes, combine and season.",
    ingredients: [
      { zh: "番茄", en: "Tomatoes", qty: 2, unitZh: "个", unitEn: "pcs", cat: "vegetables" },
      { zh: "鸡蛋", en: "Eggs", qty: 3, unitZh: "个", unitEn: "pcs", cat: "dairy" },
      { zh: "葱", en: "Scallions", qty: 1, unitZh: "根", unitEn: "stalk", cat: "vegetables" },
    ],
  },
  {
    id: "starter-2",
    nameZh: "照烧鸡腿饭",
    nameEn: "Teriyaki Chicken Bowl",
    tagsZh: ["日式", "高蛋白"],
    tagsEn: ["Japanese", "Protein"],
    servings: 2,
    instructionsZh: "鸡腿肉煎熟，加入照烧汁收汁，搭配米饭。",
    instructionsEn: "Pan-sear chicken thigh, reduce with teriyaki sauce, serve with rice.",
    ingredients: [
      { zh: "鸡腿肉", en: "Chicken thigh", qty: 400, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "米饭", en: "Rice", qty: 2, unitZh: "碗", unitEn: "bowls", cat: "pantry" },
      { zh: "照烧汁", en: "Teriyaki sauce", qty: 3, unitZh: "勺", unitEn: "tbsp", cat: "sauces" },
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

function dbToRecipe(row: any): Recipe {
  return {
    id: row.id,
    user_id: row.user_id,
    nameZh: row.name_zh,
    nameEn: row.name_en,
    tagsZh: row.tags_zh || [],
    tagsEn: row.tags_en || [],
    servings: row.servings || 2,
    instructionsZh: row.instructions_zh || "",
    instructionsEn: row.instructions_en || "",
    ingredients: row.ingredients || [],
  };
}

function recipeToDb(recipe: Recipe, userId: string) {
  return {
    id: recipe.id.startsWith("starter") ? crypto.randomUUID() : recipe.id,
    user_id: userId,
    name_zh: recipe.nameZh,
    name_en: recipe.nameEn,
    tags_zh: recipe.tagsZh,
    tags_en: recipe.tagsEn,
    servings: recipe.servings,
    instructions_zh: recipe.instructionsZh,
    instructions_en: recipe.instructionsEn,
    ingredients: recipe.ingredients,
  };
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [people, setPeople] = useState(2);
  const [user, setUser] = useState<any>(null);
  const [recipes, setRecipes] = useState<Recipe[]>(starterRecipes);
  const [selectedIds, setSelectedIds] = useState<string[]>(["starter-1", "starter-2"]);
  const [query, setQuery] = useState("适合两个人的高蛋白中式晚餐");
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const t = ui[lang];

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadRecipes() {
      if (!supabase || !user) {
        setRecipes(starterRecipes);
        return;
      }

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRecipes(data.map(dbToRecipe));
      }
    }

    loadRecipes();
  }, [user]);

  const selectedRecipes = recipes.filter((recipe) => selectedIds.includes(recipe.id));
  const grocery = useMemo(() => buildGroceryList(selectedRecipes, people, lang), [selectedRecipes, people, lang]);

  const filteredRecipes = recipes.filter((recipe) => {
    const text = [recipe.nameZh, recipe.nameEn, ...recipe.tagsZh, ...recipe.tagsEn].join(" ").toLowerCase();
    return text.includes(search.toLowerCase());
  });

  async function signInWithGoogle() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  async function generateRecipe() {
    setLoading(true);
    setGeneratedRecipe(null);

    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, people, language: lang }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generate failed");

      setGeneratedRecipe({
        id: crypto.randomUUID(),
        ...data.recipe,
      });
    } catch (error: any) {
      alert(error.message || "生成失败");
    } finally {
      setLoading(false);
    }
  }

  async function saveRecipe(recipe: Recipe) {
    if (supabase && user) {
      const payload = recipeToDb(recipe, user.id);
      const { data, error } = await supabase
        .from("recipes")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      const saved = dbToRecipe(data);
      setRecipes((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        return exists ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev];
      });
      setGeneratedRecipe(null);
      return;
    }

    setRecipes((prev) => [recipe, ...prev]);
    setGeneratedRecipe(null);
  }

  async function deleteRecipe(id: string) {
    if (supabase && user && !id.startsWith("starter")) {
      await supabase.from("recipes").delete().eq("id", id);
    }

    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  }

  function toggleRecipe(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  function startEdit(recipe: Recipe) {
    setEditingId(recipe.id);
    setEditText(JSON.stringify(recipe, null, 2));
  }

  async function saveEdit() {
    try {
      const recipe = JSON.parse(editText);
      await saveRecipe(recipe);
      setEditingId(null);
    } catch {
      alert("JSON 格式不正确");
    }
  }

  function addBlankRecipe() {
    const blank: Recipe = {
      id: crypto.randomUUID(),
      nameZh: "我的新菜单",
      nameEn: "My New Recipe",
      tagsZh: ["自定义"],
      tagsEn: ["Custom"],
      servings: 2,
      instructionsZh: "写下做法。",
      instructionsEn: "Write instructions.",
      ingredients: [
        { zh: "食材", en: "Ingredient", qty: 1, unitZh: "份", unitEn: "serving", cat: "vegetables" },
      ],
    };
    startEdit(blank);
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-4 md:p-8 text-neutral-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t.appName}</h1>
            <p className="mt-3 text-neutral-600 max-w-3xl">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} className="rounded-2xl bg-white px-4 py-2 shadow-sm border">
              {lang === "zh" ? "中文" : "English"}
            </button>

            {user ? (
              <button onClick={signOut} className="rounded-2xl bg-black text-white px-4 py-2">
                {t.signOut}
              </button>
            ) : (
              <button onClick={signInWithGoogle} disabled={!isSupabaseConfigured} className="rounded-2xl bg-black disabled:bg-neutral-400 text-white px-4 py-2">
                {t.signIn}
              </button>
            )}
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="rounded-3xl bg-yellow-50 border border-yellow-200 p-4 text-yellow-900">
            {t.notConfigured}
          </div>
        )}

        {user && (
          <div className="rounded-3xl bg-white border p-4 text-sm text-neutral-600">
            Logged in as: {user.email}
          </div>
        )}

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">✨ {t.aiTitle}</h2>

              <label className="block mt-5">
                <span className="text-sm text-neutral-600">{t.aiInput}</span>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.aiPlaceholder}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-2xl bg-neutral-100 px-4 py-3 flex items-center gap-3">
                  <span>{t.people}</span>
                  <button onClick={() => setPeople(Math.max(1, people - 1))}>−</button>
                  <strong>{people}</strong>
                  <button onClick={() => setPeople(people + 1)}>+</button>
                </div>

                <button onClick={generateRecipe} disabled={loading} className="rounded-2xl bg-black text-white px-6 py-3 disabled:bg-neutral-400">
                  {loading ? t.generating : t.generate}
                </button>
              </div>

              {generatedRecipe && (
                <div className="mt-5 rounded-3xl bg-neutral-100 p-5">
                  <h3 className="text-xl font-semibold">{lang === "zh" ? generatedRecipe.nameZh : generatedRecipe.nameEn}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(lang === "zh" ? generatedRecipe.tagsZh : generatedRecipe.tagsEn).map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs">{tag}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-neutral-600">{lang === "zh" ? generatedRecipe.instructionsZh : generatedRecipe.instructionsEn}</p>
                  <div className="mt-4 text-sm text-neutral-700">
                    {generatedRecipe.ingredients.map((item) => `${lang === "zh" ? item.zh : item.en} ${item.qty}${lang === "zh" ? item.unitZh : item.unitEn}`).join(" · ")}
                  </div>
                  <button onClick={() => saveRecipe(generatedRecipe)} className="mt-4 rounded-2xl bg-black text-white px-4 py-2">
                    {t.saveRecipe}
                  </button>
                </div>
              )}
            </div>

            {editingId && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">{t.edit}</h2>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={16}
                  className="w-full rounded-2xl border p-4 font-mono text-sm"
                />
                <div className="mt-4 flex gap-2">
                  <button onClick={saveEdit} className="rounded-2xl bg-black text-white px-4 py-2">{t.save}</button>
                  <button onClick={() => setEditingId(null)} className="rounded-2xl bg-white border px-4 py-2">{t.cancel}</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">{t.weekPlan}</h2>
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-semibold">{t.library}</h2>
                <div className="flex gap-2">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="rounded-2xl border px-4 py-2" />
                  <button onClick={addBlankRecipe} className="rounded-2xl bg-black text-white px-4 py-2">{t.addCustom}</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                {filteredRecipes.map((recipe) => {
                  const isSelected = selectedIds.includes(recipe.id);

                  return (
                    <div key={recipe.id} className={`rounded-3xl border p-5 ${isSelected ? "border-black ring-2 ring-black" : "border-neutral-200"}`}>
                      <button onClick={() => toggleRecipe(recipe.id)} className="w-full text-left">
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-lg">{lang === "zh" ? recipe.nameZh : recipe.nameEn}</h3>
                            <p className="text-sm text-neutral-500 mt-1">{recipe.servings} {t.servings}</p>
                          </div>
                          <div>{isSelected ? "✓" : "○"}</div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(lang === "zh" ? recipe.tagsZh : recipe.tagsEn).map((tag) => (
                            <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs">{tag}</span>
                          ))}
                        </div>
                      </button>

                      <div className="mt-4 flex gap-2">
                        <button onClick={() => startEdit(recipe)} className="rounded-2xl bg-neutral-100 px-4 py-2 text-sm">{t.edit}</button>
                        <button onClick={() => deleteRecipe(recipe.id)} className="rounded-2xl bg-red-50 text-red-700 px-4 py-2 text-sm">{t.delete}</button>
                      </div>
                    </div>
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
