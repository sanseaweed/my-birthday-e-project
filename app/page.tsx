"use client";

import React, { useEffect, useMemo, useState } from "react";

const merch = [
  {
    name: "Signature Poster",
    desc: "“Your date, found in infinity.”",
    price: "₩19,000",
  },
  {
    name: "Couple Poster",
    desc: "“Your birthdays,y found within the same infinite sequence.”",
    price: "₩35,000",
  },
  {
    name: "Metal Card",
    desc: "“Carry your infinity.”",
    price: "₩24,900",
  },
];

function normalizeDigits(dateValue: string, mode: "MMDD" | "YYYYMMDD") {
  if (!dateValue) return "";

  const clean = dateValue.replace(/[^\d-]/g, "");

  if (mode === "MMDD") {
    if (/^\d{4}$/.test(clean)) return clean;
    if (/^\d{2}-\d{2}$/.test(clean)) return clean.replace("-", "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [, month, day] = clean.split("-");
      return `${month}${day}`;
    }
    return "";
  }

  if (/^\d{8}$/.test(clean)) return clean;
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean.replace(/-/g, "");
  return "";
}

function formatOrdinal(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

export default function Page() {
  const [mode, setMode] = useState<"MMDD" | "YYYYMMDD">("MMDD");
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [eDigits, setEDigits] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadEDigits = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const res = await fetch("/e.txt");
        if (!res.ok) {
          throw new Error("e.txt 파일을 불러오지 못했습니다.");
        }

        const data = await res.text();
        const cleaned = data.replace(/[^\d]/g, "");
        setEDigits(cleaned);
      } catch (error) {
        console.error(error);
        setLoadError("e.txt 파일을 불러오지 못했습니다. public 폴더 안에 e.txt가 있는지 확인해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    loadEDigits();
  }, []);

  const pattern = useMemo(() => normalizeDigits(input, mode), [input, mode]);

  const result = useMemo(() => {
    if (!eDigits) return null;
    if (!pattern) return null;

    const index = eDigits.indexOf(pattern);

    if (index === -1) {
      return { found: false as const, pattern };
    }

    const start = Math.max(0, index - 18);
    const end = Math.min(eDigits.length, index + pattern.length + 18);
    const snippet = eDigits.slice(start, end);

    return {
      found: true as const,
      pattern,
      index,
      decimalPosition: index + 1,
      snippet,
    };
  }, [pattern, eDigits]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-4 inline-block rounded-full border border-white/20 px-4 py-1 text-sm text-white/80">
              My Birthday e
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              무한한 소수 e 속에서
              <br />
              당신의 생일을 찾으세요.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              당신의 생일이 자연상수 e의 몇 번째 자리에서 등장하는지 보여주고,
              그 순간을 포스터·액자·기프트로 만들어 주는 개인화 브랜드입니다.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-bold">∞</div>
                <p className="mt-2 text-sm text-white/65">무한한 숫자 안의 개인 좌표</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-bold">Fast</div>
                <p className="mt-2 text-sm text-white/65">업로드한 e 파일에서 즉시 검색</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-bold">Gift</div>
                <p className="mt-2 text-sm text-white/65">결과를 상품으로 확장 가능</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Find your birthday in e</h2>
            <p className="mt-2 text-sm text-white/65">
              public/e.txt 파일을 읽어서 생일 숫자를 검색합니다.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setMode("MMDD")}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  mode === "MMDD" ? "bg-white text-black" : "bg-white/10 text-white"
                }`}
              >
                MMDD
              </button>
              <button
                type="button"
                onClick={() => setMode("YYYYMMDD")}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  mode === "YYYYMMDD" ? "bg-white text-black" : "bg-white/10 text-white"
                }`}
              >
                YYYYMMDD
              </button>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-white/70">
                {mode === "MMDD" ? "예: 0315 또는 03-15" : "예: 20080315 또는 2008-03-15"}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === "MMDD" ? "0315" : "2008-03-15"}
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-black px-4 text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="h-12 rounded-2xl bg-white px-6 font-medium text-black transition hover:opacity-90"
                >
                  찾기
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
              <p>파일 상태: {loading ? "불러오는 중..." : loadError ? "오류" : "준비 완료"}</p>
              {!loading && !loadError && <p className="mt-1">불러온 숫자 길이: {eDigits.length.toLocaleString()}자리</p>}
              {loadError && <p className="mt-1 text-red-300">{loadError}</p>}
            </div>

            {!submitted && (
              <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-black/20 p-5 text-sm leading-6 text-white/60">
                생일을 입력하면 e 속에서 해당 숫자가 처음 등장하는 위치와 주변 숫자를 보여줍니다.
              </div>
            )}

            {submitted && !pattern && (
              <div className="mt-5 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5 text-sm text-yellow-100">
                입력 형식을 확인해 주세요. {mode === "MMDD" ? "MMDD" : "YYYYMMDD"} 형식이어야 합니다.
              </div>
            )}

            {submitted && loading && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/75">
                e 파일을 불러오는 중입니다.
              </div>
            )}

            {submitted && !loading && loadError && (
              <div className="mt-5 rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-100">
                e 파일을 먼저 준비해야 검색할 수 있습니다.
              </div>
            )}

            {submitted && !loading && !loadError && pattern && result?.found && (
              <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
                <p className="text-sm text-white/60">검색 결과</p>
                <h3 className="mt-1 text-2xl font-semibold">{pattern} 발견됨</h3>
                <p className="mt-2 text-sm text-white/70">
                  e의 소수점 아래 <span className="font-semibold text-white">{formatOrdinal(result.decimalPosition)}</span> 자리부터 시작합니다.
                </p>

                <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-4 font-mono text-sm leading-7 break-all text-white/85">
                  <span className="text-white/35">…</span>
                  {result.snippet.split(result.pattern)[0]}
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-black">{result.pattern}</span>
                  {result.snippet.split(result.pattern)[1]}
                  <span className="text-white/35">…</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm text-white/55">시작 위치</div>
                    <div className="mt-1 text-xl font-semibold">{result.decimalPosition.toLocaleString()}번째</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm text-white/55">검색 값</div>
                    <div className="mt-1 text-xl font-semibold">{result.pattern}</div>
                  </div>
                </div>
              </div>
            )}

            {submitted && !loading && !loadError && pattern && result && !result.found && (
              <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-white/60">검색 결과</p>
                <h3 className="mt-1 text-2xl font-semibold">{pattern}를 찾지 못했어요</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  현재 업로드된 e 파일 범위 안에서는 이 숫자 조합이 보이지 않습니다. 더 긴 e 파일을 넣으면 찾을 가능성이 올라갑니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-12">
        <h2 className="text-3xl font-semibold">서비스 구조</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">1. 생일 입력</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              사용자가 MMDD 또는 YYYYMMDD 형식으로 생일을 입력합니다.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">2. e에서 탐색</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              public 폴더의 e.txt 안에서 해당 숫자 패턴의 첫 등장 위치를 찾습니다.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">3. 상품으로 전환</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              검색 결과를 포스터, 액자, 커플 에디션 같은 상품으로 연결합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <h2 className="text-3xl font-semibold">추천 상품</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {merch.map((item) => (
            <div key={item.name} className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6">
              <div className="mb-5 flex h-40 items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20">
                <div className="text-center">
                  <div className="mb-3 text-3xl">∞</div>
                  <div className="font-mono text-sm tracking-widest text-white/45">2.718281828459045...</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{item.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-semibold">{item.price}</span>
                <button className="rounded-2xl bg-white px-4 py-2 font-medium text-black transition hover:opacity-90">
                  주문하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
