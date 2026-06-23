"use client";

import { Frown, Clock, MessageCircle } from "lucide-react";

const pains = [
  {
    icon: <Frown className="w-6 h-6" />,
    emoji: "😰",
    title: "差评劝退新客",
    desc: "新客搜到你店，先看评价。看到一条'服务态度差'的差评，划走去找别家了。一条差评劝退的不止一个人。",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    emoji: "😫",
    title: "没空想回复",
    desc: "客人等着回，你忙着服务下一位。憋半天写不出合适的回复，发晚了显得不重视，发不好反而火上浇油。",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    emoji: "😩",
    title: "每条都写不一样的",
    desc: "总不能每条差评都回一样的吧？客人看了觉得敷衍。但每条都仔细想，老板真没这个精力。",
  },
];

export function PainSection() {
  return (
    <section className="bg-neutral-950 py-16 sm:py-20">
      <div className="max-w-lg mx-auto px-5">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            是不是你也这样？
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            差评不可怕，<span className="text-neutral-400">可怕的是没人回</span>
          </h2>
        </div>

        <div className="space-y-4">
          {pains.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 text-2xl">
                {item.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
