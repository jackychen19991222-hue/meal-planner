
"use client";

import { useState } from "react";

export default function Home() {
  const [people, setPeople] = useState(2);

  return (
    <main className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h1 className="text-4xl font-bold">
            一周菜单管家
          </h1>

          <p className="mt-4 text-neutral-600">
            根据人数规划菜单，自动生成购物清单。
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="bg-black text-white px-4 py-2 rounded-xl"
            >
              -
            </button>

            <div className="text-2xl font-semibold">
              {people} 人
            </div>

            <button
              onClick={() => setPeople(people + 1)}
              className="bg-black text-white px-4 py-2 rounded-xl"
            >
              +
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <div className="bg-neutral-100 rounded-2xl p-5">
              <h2 className="font-semibold text-lg">周一</h2>
              <p className="mt-2">番茄炒蛋</p>
            </div>

            <div className="bg-neutral-100 rounded-2xl p-5">
              <h2 className="font-semibold text-lg">周二</h2>
              <p className="mt-2">照烧鸡腿饭</p>
            </div>

            <div className="bg-neutral-100 rounded-2xl p-5">
              <h2 className="font-semibold text-lg">周三</h2>
              <p className="mt-2">牛肉乌冬面</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
