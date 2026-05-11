"use client";

import React, { useMemo, useState } from "react";

const translations = {
  zh: {
    appName: "一周菜单管家",
    subtitle: "根据人数规划菜单，自动生成购物清单，保存你的专属菜谱库。",
    planWeek: "一周菜单",
    people: "用餐人数",
    recipeLibrary: "我的菜谱库",
    shoppingList: "购物清单",
    addRecipe: "添加菜谱",
    searchPlaceholder: "搜索菜名或食材...",
    servings: "人份",
    selected: "已选择",
    generate: "生成本周菜单",
    smartTip: "智能建议",
    smartText: "本周多道菜使用鸡蛋和青菜，购物时可以合并购买，减少浪费。",
    emptyPlan: "请选择菜谱来生成菜单",
    days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    meals: ["早餐", "午餐", "晚餐"],
    categories: {
      vegetables: "蔬菜",
      meat: "肉类",
      seafood: "海鲜",
      dairy: "蛋奶",
      sauces: "调料",
      pantry: "主食/干货",
      drinks: "饮品",
    },
  },
  en: {
    appName: "Weekly Meal Planner",
    subtitle: "Plan weekly meals by serving size, generate grocery lists, and save your personal recipes.",
    planWeek: "Weekly Plan",
    people: "People",
    recipeLibrary: "Recipe Library",
    shoppingList: "Shopping List",
    addRecipe: "Add Recipe",
    searchPlaceholder: "Search recipes or ingredients...",
    servings: "servings",
    selected: "Selected",
    generate: "Generate Weekly Plan",
    smartTip: "Smart Tip",
    smartText: "Several recipes use eggs and greens this week. Buy them together to reduce waste.",
    emptyPlan: "Select recipes to generate a plan",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    meals: ["Breakfast", "Lunch", "Dinner"],
    categories: {
      vegetables: "Vegetables",
      meat: "Meat",
      seafood: "Seafood",
      dairy: "Eggs & Dairy",
      sauces: "Sauces",
      pantry: "Pantry",
      drinks: "Drinks",
    },
  },
};

const recipes = [
  {
    id: 1,
    nameZh: "番茄炒蛋",
    nameEn: "Tomato Scrambled Eggs",
    tagsZh: ["家常菜", "快手", "中餐"],
    tagsEn: ["Chinese", "Quick", "Home-style"],
    servings: 2,
    ingredients: [
      { zh: "番茄", en: "Tomatoes", qty: 2, unitZh: "个", unitEn: "pcs", cat: "vegetables" },
      { zh: "鸡蛋", en: "Eggs", qty: 3, unitZh: "个", unitEn: "pcs", cat: "dairy" },
      { zh: "葱", en: "Scallions", qty: 1, unitZh: "根", unitEn: "stalk", cat: "vegetables" },
    ],
  },
  {
    id: 2,
    nameZh: "照烧鸡腿饭",
    nameEn: "Teriyaki Chicken Rice Bowl",
    tagsZh: ["日式", "便当", "高蛋白"],
    tagsEn: ["Japanese", "Bento", "Protein"],
    servings: 2,
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
    ingredients: [
      { zh: "牛肉片", en: "Sliced beef", qty: 250, unitZh: "克", unitEn: "g", cat: "meat" },
      { zh: "乌冬面", en: "Udon", qty: 2, unitZh: "包", unitEn: "packs", cat: "pantry" },
      { zh: "青菜", en: "Greens", qty: 1, unitZh: "把", unitEn: "bunch", cat: "vegetables" },
    ],
  },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": "true",
  };

  const paths: Record<string, React.ReactNode> = {
    calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M3 10h18" /></>,
    cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L23 6H6" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H21" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H21v20H6.5A2.5 2.5 0 0 1 4 19.5z" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    language: <><path d="M5 8h8" /><path d="M7 4h1" /><path d="M9 4h1" /><path d="M11 4h1" /><path d="M4 12c3 0 6-3 7-8" /><path d="M11 12c-1-2-3-4-5-4" /><path d="M15 21l4-9 4 9" /><path d="M16.5 18h5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    circle: <circle cx="12" cy="12" r="9" />,
    sparkles: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" /></>,
  };

  return <svg {...common}>{paths[name] || paths.circle}</svg>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white shadow-sm border border-neutral-100 ${className}`}>{children}</div>;
}

function Button({
  children,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  className?: string;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition active:scale-[0.98]";
  const style = variant === "outline" ? "border border-neutral-200 bg-white hover:bg-neutral-50" : "bg-neutral-950 text-white hover:bg-neutral-800";
  return <button type={type} onClick={onClick} className={`${base} ${style} ${className}`}>{children}</button>;
}

function buildGroceryList(selectedRecipes: typeof recipes, people: number, lang: "zh" | "en") {
  const map: Record<string, any> = {};

  selectedRecipes.forEach((recipe) => {
    const scale = people / recipe.servings;

    recipe.ingredients.forEach((item) => {
      const itemName = lang === "zh" ? item.zh : item.en;
      const unit = lang === "zh" ? item.unitZh : item.unitEn;
      const key = `${item.cat}-${itemName}-${unit}`;

      if (!map[key]) {
        map[key] = { ...item, qty: 0 };
      }

      map[key].qty += item.qty * scale;
    });
  });

  return Object.values(map).reduce<Record<string, any[]>>((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {});
}

export default function MealPlannerApp() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [people, setPeople] = useState(2);
  const [selectedIds, setSelectedIds] = useState([1, 2, 3, 4]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const t = translations[lang];

  const filteredRecipes = recipes.filter((recipe) => {
    const name = lang === "zh" ? recipe.nameZh : recipe.nameEn;
    const ingredients = recipe.ingredients.map((item) => (lang === "zh" ? item.zh : item.en)).join(" ");
    return `${name} ${ingredients}`.toLowerCase().includes(query.toLowerCase());
  });

  const selectedRecipes = recipes.filter((recipe) => selectedIds.includes(recipe.id));
  const groceryByCategory = useMemo(() => buildGroceryList(selectedRecipes, people, lang), [selectedRecipes, people, lang]);

  const toggleRecipe = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{t.appName}</h1>
            <p className="mt-3 text-neutral-600 max-w-2xl">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
              <Icon name="language" className="mr-2" /> {lang === "zh" ? "中文" : "English"}
            </Button>

            <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 shadow-sm">
              <Icon name="users" />
              <span className="text-sm">{t.people}</span>
              <button className="px-2 text-lg" onClick={() => setPeople(Math.max(1, people - 1))}>−</button>
              <strong>{people}</strong>
              <button className="px-2 text-lg" onClick={() => setPeople(people + 1)}>+</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center"><Icon name="calendar" className="mr-2" />{t.planWeek}</h2>
                  <Button><Icon name="sparkles" className="mr-2" />{t.generate}</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {t.days.map((day, dayIndex) => {
                    const recipe = selectedRecipes.length ? selectedRecipes[dayIndex % selectedRecipes.length] : null;

                    return (
                      <div key={day} className="rounded-2xl bg-neutral-100 p-3 min-h-[160px]">
                        <div className="font-semibold mb-3">{day}</div>
                        {t.meals.map((meal) => (
                          <div key={meal} className="mb-2 rounded-xl bg-white p-2 shadow-sm">
                            <div className="text-xs text-neutral-500">{meal}</div>
                            <div className="text-sm font-medium mt-1">
                              {recipe ? (lang === "zh" ? recipe.nameZh : recipe.nameEn) : t.emptyPlan}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <h2 className="text-xl font-semibold flex items-center"><Icon name="book" className="mr-2" />{t.recipeLibrary}</h2>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Icon name="search" className="absolute left-3 top-2.5 text-neutral-400" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="pl-10 pr-3 py-2 rounded-2xl border border-neutral-200 bg-white w-full md:w-64 outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                    <Button variant="outline"><Icon name="plus" className="mr-2" />{t.addRecipe}</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRecipes.map((recipe) => {
                    const isSelected = selectedIds.includes(recipe.id);

                    return (
                      <button
                        key={recipe.id}
                        onClick={() => toggleRecipe(recipe.id)}
                        className={`text-left cursor-pointer rounded-3xl p-4 border bg-white shadow-sm transition hover:-translate-y-0.5 ${isSelected ? "ring-2 ring-neutral-900 border-neutral-900" : "border-neutral-100"}`}
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-lg">{lang === "zh" ? recipe.nameZh : recipe.nameEn}</h3>
                            <p className="text-sm text-neutral-500 mt-1">{recipe.servings} {t.servings}</p>
                          </div>
                          <span className={isSelected ? "text-neutral-950" : "text-neutral-300"}>
                            <Icon name={isSelected ? "check" : "circle"} />
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {(lang === "zh" ? recipe.tagsZh : recipe.tagsEn).map((tag) => (
                            <span key={tag} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>

                        <div className="mt-4 text-sm text-neutral-600">
                          {recipe.ingredients.map((item) => (lang === "zh" ? item.zh : item.en)).join(" · ")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="bg-neutral-950 text-white border-neutral-900">
              <div className="p-5">
                <h2 className="text-xl font-semibold flex items-center"><Icon name="cart" className="mr-2" />{t.shoppingList}</h2>
                <p className="text-sm text-neutral-300 mt-2">{t.selected}: {selectedRecipes.length} · {people} {t.servings}</p>

                <div className="mt-5 space-y-5">
                  {Object.entries(groceryByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <h3 className="text-sm font-semibold text-neutral-300 mb-2">{t.categories[cat as keyof typeof t.categories]}</h3>
                      <div className="space-y-2">
                        {items.map((item) => {
                          const itemName = lang === "zh" ? item.zh : item.en;
                          const unit = lang === "zh" ? item.unitZh : item.unitEn;
                          const key = `${cat}-${itemName}`;

                          return (
                            <button
                              key={key}
                              onClick={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
                              className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-3 py-2 text-left hover:bg-white/15"
                            >
                              <span className={checked[key] ? "line-through text-neutral-400" : ""}>{itemName}</span>
                              <span className="text-sm text-neutral-300 whitespace-nowrap">
                                {Number.isInteger(item.qty) ? item.qty : item.qty.toFixed(1)} {unit}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <h2 className="text-lg font-semibold flex items-center"><Icon name="sparkles" className="mr-2" />{t.smartTip}</h2>
                <p className="text-neutral-600 mt-3 leading-relaxed">{t.smartText}</p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
