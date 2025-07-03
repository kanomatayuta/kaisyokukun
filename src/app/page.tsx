// src/app/page.tsx
"use client"; // Client Componentとしてマーク

import { useState, useEffect } from "react";
import Image from "next/image";

interface Shop {
  id: string;
  name: string;
  address: string;
  genre: { name: string };
  access: string;
  budget: { name: string };
  urls: { pc: string };
  photo: { pc: { l: string } };
  catch: string;
  shop_detail_memo: string;
  avg_price: string;
  aiAnalysis?: string; // AI分析結果を追加
}

const tokyo23Wards = [
  "選択してください",
  "千代田区",
  "中央区",
  "港区",
  "新宿区",
  "文京区",
  "台東区",
  "墨田区",
  "江東区",
  "品川区",
  "目黒区",
  "大田区",
  "世田谷区",
  "渋谷区",
  "中野区",
  "杉並区",
  "豊島区",
  "北区",
  "荒川区",
  "板橋区",
  "練馬区",
  "足立区",
  "葛飾区",
  "江戸川区",
];

const budgetOptions = {
  指定なし: "",
  "～2000円": "B001",
  "2001～3000円": "B002",
  "3001～4000円": "B003",
  "4001～5000円": "B004",
  "5001～7000円": "B005",
  "7001～10000円": "B006",
  "10001～15000円": "B007",
  "15001～20000円": "B008",
  "20001～30000円": "B009",
  "30001円～": "B010",
};

const smokingOptions = {
  指定なし: "",
  禁煙のみ: "1",
  喫煙可: "0",
};

export default function HomePage() {
  const [keyword, setKeyword] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [smoking, setSmoking] = useState<string>("");
  const [count, setCount] = useState<number>(5);
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastSearchCriteria, setLastSearchCriteria] = useState<{
    keyword: string;
    budget: string;
    smoking: string;
    count: number;
  } | null>(null);

  const fetchShops = async (
    page: number,
    criteria?: typeof lastSearchCriteria
  ) => {
    setIsLoading(true); // リクエスト開始時にローディングをtrueに設定
    setError(null);
    try {
      const currentKeyword = criteria ? criteria.keyword : keyword;
      const currentBudget = criteria ? criteria.budget : budget;
      const currentSmoking = criteria ? criteria.smoking : smoking;
      const currentCount = criteria ? criteria.count : count;

      const params = new URLSearchParams({
        keyword: currentKeyword,
        budget: currentBudget,
        smoking: currentSmoking,
        count: currentCount.toString(),
        start: ((page - 1) * currentCount + 1).toString(),
      });

      const response = await fetch(`/api/shops?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch shops.");
      }
      const data = await response.json();
      if (data.shops && data.shops.length > 0) {
        setShops(data.shops);
      } else {
        if (page > 1) {
          setError("これ以上のお店候補は見つかりませんでした。");
        } else {
          setShops([]);
        }
      }
    } catch (err: any) {
      setError(err.message);
      setShops([]);
    } finally {
      setIsLoading(false); // リクエスト完了時にローディングをfalseに設定
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setLastSearchCriteria({ keyword, budget, smoking, count });
    fetchShops(1, { keyword, budget, smoking, count });
  };

  const handleUpdate = () => {
    if (lastSearchCriteria) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchShops(nextPage, lastSearchCriteria);
    } else {
      setError("先に検索を実行してください。");
    }
  };

  const handleReset = () => {
    setKeyword("選択してください");
    setBudget("");
    setSmoking("");
    setCount(5);
    setShops(null);
    setIsLoading(false);
    setError(null);
    setCurrentPage(1);
    setLastSearchCriteria(null);
  };

  // 初回ロード時にデフォルトの選択肢を設定
  useEffect(() => {
    setKeyword("選択してください");
  }, []);

  const currentBudgetName =
    Object.keys(budgetOptions).find(
      (key) => budgetOptions[key as keyof typeof budgetOptions] === budget
    ) || "指定なし";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800 antialiased">
      {" "}
      {/* 全体の背景をグラデーションに、フォントとテキスト色、アンチエイリアスを調整 */}
      <header className="bg-blue-700 text-white p-6 shadow-xl">
        {" "}
        {/* ヘッダーの背景色を濃くし、影を強調 */}
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight my-2">
            会食くん
          </h1>{" "}
          {/* フォントサイズをレスポンシブに、文字間隔を調整 */}
          <p className="text-lg sm:text-xl opacity-90 mt-2">
            あなたにいつでも最適なお店をご提案します
          </p>
        </div>
      </header>
      <main className="container mx-auto p-4 max-w-4xl py-8">
        {" "}
        {/* メインコンテンツのパディング調整 */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl mb-10 border border-blue-100 transform transition-transform duration-300 hover:scale-[1.005]">
          {" "}
          {/* ボックスの影と角丸、ボーダー、ホバーエフェクトを強調 */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4 border-blue-200">
            {" "}
            {/* 見出しのフォントを太く、下線を追加 */}
            検索条件を入力してください
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {" "}
            {/* グリッドレイアウトで入力項目を整理 */}
            <div className="col-span-1">
              <label
                htmlFor="ward-select"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                エリア (東京都23区)
              </label>
              <select
                id="ward-select"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out bg-white"
              >
                {tokyo23Wards.map((ward) => (
                  <option
                    key={ward}
                    value={ward === "選択してください" ? "" : ward}
                  >
                    {ward}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="budget-select"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                予算 (ディナー)
              </label>
              <select
                id="budget-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out bg-white"
              >
                {Object.entries(budgetOptions).map(([name, code]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="smoking-select"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                喫煙
              </label>
              <select
                id="smoking-select"
                value={smoking}
                onChange={(e) => setSmoking(e.target.value)}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out bg-white"
              >
                {Object.entries(smokingOptions).map(([name, code]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="count-slider"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                表示件数: {count}
              </label>
              <input
                type="range"
                id="count-slider"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {" "}
            {/* ボタンのレイアウトと間隔を調整 */}
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out flex-1 sm:flex-none transform hover:-translate-y-0.5"
              disabled={isLoading || !keyword}
            >
              {isLoading && !shops ? "検索中..." : "お店を検索してAI分析する"}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out flex-1 sm:flex-none transform hover:-translate-y-0.5"
              disabled={isLoading}
            >
              検索条件をリセット
            </button>
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out flex-1 sm:flex-none transform hover:-translate-y-0.5"
              disabled={isLoading || !lastSearchCriteria}
            >
              {isLoading && lastSearchCriteria
                ? "更新中..."
                : "他のお店候補を更新"}
            </button>
          </div>
        </div>
        {/* ローディングポップアップ */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            {" "}
            {/* 背景色と透明度、ぼかしを追加 */}
            <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center transform scale-105">
              {" "}
              {/* ポップアップのデザインとサイズを調整 */}
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-4 border-blue-600 border-opacity-75 mb-6"></div>{" "}
              {/* スピナーのサイズと色を調整 */}
              <p className="text-2xl font-bold text-gray-800 mb-3">
                お店を検索してAI分析中...
              </p>{" "}
              {/* テキストサイズとフォントを調整 */}
              <p className="text-lg text-gray-600">
                しばらくお待ちください。
              </p>{" "}
              {/* テキストサイズとマージンを調整 */}
            </div>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md"
            role="alert"
          >
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {shops !== null && shops.length > 0 && (
          <div className="mt-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg relative mb-6 shadow-md">
              <span className="block sm:inline font-semibold">
                「{lastSearchCriteria?.keyword}」で予算「{currentBudgetName}
                」のお店が見つかりました ({shops.length}件):
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {" "}
              {/* 店舗カードをグリッドレイアウトに */}
              {shops.map((shop, index) => (
                <div
                  key={shop.id}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-[1.01]"
                >
                  <h3 className="text-2xl font-bold mb-5 text-blue-700 border-b pb-3 border-blue-100">
                    {" "}
                    {/* フォントを太く、下線を追加 */}
                    --- お店 {index + 1}: {shop.name} ---
                  </h3>
                  {shop.photo?.pc?.l && (
                    <div className="mb-6 text-center">
                      <Image
                        src={shop.photo.pc.l}
                        alt={shop.name}
                        width={300}
                        height={200}
                        style={{ objectFit: "contain" }}
                        className="mx-auto rounded-lg shadow-md border border-gray-100"
                      />
                    </div>
                  )}
                  <div className="text-gray-700 text-base leading-relaxed">
                    {" "}
                    {/* テキストの色と行間を調整 */}
                    <p className="mb-2">
                      <strong className="text-gray-800">店名:</strong>{" "}
                      {shop.name}
                    </p>
                    <p className="mb-2">
                      <strong className="text-gray-800">住所:</strong>{" "}
                      {shop.address}
                    </p>
                    <p className="mb-2">
                      <strong className="text-gray-800">ジャンル:</strong>{" "}
                      {shop.genre?.name}
                    </p>
                    <p className="mb-2">
                      <strong className="text-gray-800">アクセス:</strong>{" "}
                      {shop.access}
                    </p>
                    <p className="mb-2">
                      <strong className="text-gray-800">
                        予算（ディナー）:
                      </strong>{" "}
                      {shop.budget?.name}
                    </p>
                    <p className="mb-4">
                      <strong className="text-gray-800">PC版URL:</strong>{" "}
                      <a
                        href={shop.urls?.pc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {shop.urls?.pc}
                      </a>
                    </p>
                  </div>
                  <hr className="my-6 border-blue-200" />{" "}
                  {/* 区切り線のデザインを調整 */}
                  <h4 className="text-xl font-bold mb-4 text-gray-800">
                    AIによる会食向け度分析
                  </h4>
                  {shop.aiAnalysis ? (
                    <div className="bg-blue-50 border border-blue-200 text-gray-900 px-5 py-4 rounded-lg relative shadow-inner">
                      {" "}
                      {/* テキスト色をtext-gray-900に変更、影を追加 */}
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {shop.aiAnalysis}
                      </p>{" "}
                      {/* 行間を調整 */}
                    </div>
                  ) : (
                    <p className="text-gray-600">AI分析結果がありません。</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {shops !== null && shops.length === 0 && !error && !isLoading && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative mb-6 shadow-md"
            role="alert"
          >
            <span className="block sm:inline font-semibold">
              「{lastSearchCriteria?.keyword}」で予算「{currentBudgetName}
              」のお店は見つかりませんでした。条件を変えてみてください。
            </span>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-gray-300 text-right p-4 text-sm shadow-inner mt-auto">
        {" "}
        {/* フッターの背景色を濃くし、テキスト色を調整 */}
        <div className="container mx-auto max-w-4xl">
          Powered by{" "}
          <a
            href="https://webservice.recruit.co.jp/docs/hotpepper/reference.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-medium"
          >
            ホットペッパーグルメ Webサービス
          </a>
        </div>
      </footer>
    </div>
  );
}
