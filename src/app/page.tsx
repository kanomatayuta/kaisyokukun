// src/app/page.tsx
"use client"; // Client Componentとしてマーク

import { useState, useEffect, FC } from "react";
import Image from "next/image";

// --- 型定義 ---
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

interface SearchCriteria {
  keyword: string;
  budget: string;
  smoking: string;
  count: number;
}

// --- 定数定義 ---
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

// --- ヘッダーコンポーネント ---
const Header: FC = () => (
  // 温かいオレンジ系のグラデーションと強い影で、食欲をそそるリッチなデザインに
  <header className="bg-gradient-to-r from-orange-700 to-amber-800 text-white p-6 shadow-2xl rounded-b-xl animate-fade-in-down">
    <div className="container mx-auto max-w-4xl text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight my-2 drop-shadow-lg">
        会食くん
      </h1>
      <p className="text-lg sm:text-xl opacity-90 mt-2">
        あなたにいつでも最適なお店をご提案します
      </p>
    </div>
  </header>
);

// --- 検索フォームコンポーネント ---
interface SearchFormProps {
  keyword: string;
  setKeyword: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  smoking: string;
  setSmoking: (value: string) => void;
  count: number;
  setCount: (value: number) => void;
  isLoading: boolean;
  shops: Shop[] | null;
  lastSearchCriteria: SearchCriteria | null;
  handleSearch: () => void;
  handleReset: () => void;
  handleUpdate: () => void;
}

const SearchForm: FC<SearchFormProps> = ({
  keyword,
  setKeyword,
  budget,
  setBudget,
  smoking,
  setSmoking,
  count,
  setCount,
  isLoading,
  shops,
  lastSearchCriteria,
  handleSearch,
  handleReset,
  handleUpdate,
}) => (
  // 白い背景に、AI感のあるシャープな影とボーダー、ホバーでわずかに浮き上がる効果
  <div className="bg-white p-8 rounded-2xl shadow-2xl mb-10 border border-orange-100 transform transition-transform duration-300 hover:scale-[1.005] animate-fade-in-up">
    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4 border-amber-200">
      {" "}
      {/* 見出しの下線色を調整 */}
      検索条件を入力してください
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          // 入力フィールドのUIを改善: 影、ボーダー、フォーカス時のリング、カスタム矢印
          className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out bg-white appearance-none pr-8 cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          {tokyo23Wards.map((ward) => (
            <option key={ward} value={ward === "選択してください" ? "" : ward}>
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
          className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out bg-white appearance-none pr-8 cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
          }}
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
          className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out bg-white appearance-none pr-8 cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
          }}
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" // スライダーの色を調整
        />
      </div>
    </div>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      {/* 検索ボタン: 食欲をそそるオレンジ色 */}
      <button
        onClick={handleSearch}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75 transition duration-300 ease-in-out flex-1 sm:flex-none transform hover:-translate-y-0.5 active:scale-95"
        disabled={isLoading || !keyword}
      >
        {isLoading && !shops ? "検索中..." : "お店を検索してAI分析する"}
      </button>
      {/* リセットボタン: ニュートラルなグレー */}
      <button
        onClick={handleReset}
        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out flex-1 sm:flex-none transform hover:-translate-y-0.5 active:scale-95"
        disabled={isLoading}
      >
        検索条件をリセット
      </button>
      {/* 更新ボタン: AI感のあるティールグリーン、非活性時はグレー */}
      <button
        onClick={handleUpdate}
        className={`font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 transition duration-300 ease-in-out flex-1 sm:flex-none
          ${
            isLoading || !lastSearchCriteria // ローディング中、または最初の検索がまだ行われていない場合は非活性
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" // 非活性時のスタイル
              : "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg focus:ring-teal-500 focus:ring-opacity-75 transform hover:-translate-y-0.5 active:scale-95" // 活性時のスタイル
          }`}
        disabled={isLoading || !lastSearchCriteria}
      >
        {isLoading && lastSearchCriteria ? "更新中..." : "他のお店候補を更新"}
      </button>
    </div>
  </div>
);

// --- 店舗カードコンポーネント ---
interface ShopCardProps {
  shop: Shop;
  index: number;
}

const ShopCard: FC<ShopCardProps> = ({ shop, index }) => (
  // カード全体もAI感のあるシャープな影とボーダー、ホバーでわずかに浮き上がる効果
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-[1.01] animate-fade-in">
    <h3 className="text-2xl font-bold mb-5 text-orange-700 border-b pb-3 border-amber-100">
      {" "}
      {/* 見出しの色をオレンジ系に、下線色を調整 */}
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
      <p className="mb-2">
        <strong className="text-gray-800">店名:</strong> {shop.name}
      </p>
      <p className="mb-2">
        <strong className="text-gray-800">住所:</strong> {shop.address}
      </p>
      <p className="mb-2">
        <strong className="text-gray-800">ジャンル:</strong> {shop.genre?.name}
      </p>
      <p className="mb-2">
        <strong className="text-gray-800">アクセス:</strong> {shop.access}
      </p>
      <p className="mb-2">
        <strong className="text-gray-800">予算（ディナー）:</strong>{" "}
        {shop.budget?.name}
      </p>
      <p className="mb-4">
        <strong className="text-gray-800">PC版URL:</strong>{" "}
        <a
          href={shop.urls?.pc}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:underline font-medium"
        >
          {shop.urls?.pc}
        </a>
      </p>
    </div>
    <hr className="my-6 border-amber-200" /> {/* 区切り線の色を調整 */}
    <h4 className="text-xl font-bold mb-4 text-gray-800">
      AIによる会食向け度分析
    </h4>
    {shop.aiAnalysis ? (
      // AI分析結果の背景色をアンバー系に、テキスト色を濃いグレー（視認性向上）
      <div className="bg-amber-50 border border-amber-200 text-gray-900 px-5 py-4 rounded-lg relative shadow-inner">
        <p className="whitespace-pre-wrap leading-relaxed">{shop.aiAnalysis}</p>
      </div>
    ) : (
      <p className="text-gray-600">AI分析結果がありません。</p>
    )}
  </div>
);

// --- ローディングオーバーレイコンポーネント ---
const LoadingOverlay: FC = () => (
  // AI感のある半透明の背景と、中心に配置されたスピナー
  <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
    <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center transform scale-105 animate-pop-in">
      {/* 多層スピナーアニメーション */}
      <div className="relative h-24 w-24 mb-6">
        {/* 背景の薄いリング */}
        <div className="absolute inset-0 border-8 border-solid border-gray-200 rounded-full opacity-75"></div>
        {/* メインの回転リング (オレンジ) */}
        <div className="absolute inset-0 border-8 border-solid border-t-orange-500 border-r-orange-500 border-b-orange-500 border-l-transparent rounded-full animate-spin"></div>
        {/* 逆回転するアクセントリング (少し薄いオレンジ) */}
        <div
          className="absolute inset-0 border-8 border-solid border-t-transparent border-r-transparent border-b-transparent border-l-amber-400 rounded-full animate-spin-reverse"
          style={{ animationDuration: "1.5s" }}
        ></div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
        お店を検索してAI分析中
        {/* ドットアニメーション */}
        <span className="dot-animation ml-1">
          <span className="inline-block w-1.5 h-1.5 bg-orange-800 rounded-full mx-0.5"></span>
          <span className="inline-block w-1.5 h-1.5 bg-orange-800 rounded-full mx-0.5"></span>
          <span className="inline-block w-1.5 h-1.5 bg-orange-800 rounded-full mx-0.5"></span>
        </span>
      </p>
      <p className="text-lg text-gray-600">しばらくお待ちください。</p>
    </div>

    {/* Custom CSS for dot animation and reverse spin */}
    <style jsx>{`
      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.2;
        }
      }
      .dot-animation span {
        animation: blink 1.4s infinite;
      }
      .dot-animation span:nth-child(1) {
        animation-delay: 0s;
      }
      .dot-animation span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .dot-animation span:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes spin-reverse {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(-360deg);
        }
      }
      .animate-spin-reverse {
        animation: spin-reverse 1s linear infinite;
      }
    `}</style>
  </div>
);

// --- フッターコンポーネント ---
const Footer: FC = () => (
  // 濃いグレーの背景に明るいテキスト、AI感のある影
  <footer className="bg-gray-800 text-gray-300 text-right p-4 text-sm shadow-inner mt-auto animate-fade-in-up">
    <div className="container mx-auto max-w-4xl">
      Powered by{" "}
      <a
        href="https://webservice.recruit.co.jp/docs/hotpepper/reference.html"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-400 hover:underline font-medium"
      >
        ホットペッパーグルメ Webサービス
      </a>
    </div>
  </footer>
);

// --- メインページコンポーネント ---
export default function HomePage() {
  const [keyword, setKeyword] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [smoking, setSmoking] = useState<string>("");
  const [count, setCount] = useState<number>(5);
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastSearchCriteria, setLastSearchCriteria] =
    useState<SearchCriteria | null>(null);

  const fetchShops = async (page: number, criteria?: SearchCriteria) => {
    setIsLoading(true);
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
    } catch (err: unknown) {
      // anyをunknownに修正
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました。";
      setError(errorMessage);
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    // キーワードが「選択してください」または空の場合はエラーを表示し、検索を実行しない
    if (keyword === "" || keyword === "選択してください") {
      setError("エリアを選択してください。"); // エラーメッセージを修正
      setShops(null); // 以前の検索結果をクリア
      setLastSearchCriteria(null); // 更新ボタンを非活性のままにする
      setIsLoading(false); // ローディング状態をリセット
      return; // ここで処理を終了
    }
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

  useEffect(() => {
    setKeyword("選択してください");
  }, []);

  const currentBudgetName =
    Object.keys(budgetOptions).find(
      (key) => budgetOptions[key as keyof typeof budgetOptions] === budget
    ) || "指定なし";

  return (
    // 全体の背景を温かいグラデーションに、フォントとテキスト色、アンチエイリアスを調整
    <div
      className="min-h-screen bg-fixed bg-cover bg-center antialiased flex flex-col"
      style={{ backgroundImage: 'url("/backgrand_img.jpeg")' }}
    >
      {" "}
      {/* 背景画像を設定 */}
      <Header />
      <main className="container mx-auto p-4 max-w-4xl py-8 flex-grow">
        <SearchForm
          keyword={keyword}
          setKeyword={setKeyword}
          budget={budget}
          setBudget={setBudget}
          smoking={smoking}
          setSmoking={setSmoking}
          count={count}
          setCount={setCount}
          isLoading={isLoading}
          shops={shops}
          lastSearchCriteria={lastSearchCriteria}
          handleSearch={handleSearch}
          handleReset={handleReset}
          handleUpdate={handleUpdate}
        />

        {isLoading && <LoadingOverlay />}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md animate-fade-in"
            role="alert"
          >
            <strong className="font-bold">お知らせ: </strong> {/* 表現を修正 */}
            <span className="block sm:inline">
              {error.replace("エラー: ", "")}
            </span>{" "}
            {/* エラーメッセージから「エラー: 」を削除 */}
          </div>
        )}

        {shops !== null && shops.length > 0 && (
          <div className="mt-8">
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg relative mb-6 shadow-md animate-fade-in">
              <span className="block sm:inline font-semibold">
                「{lastSearchCriteria?.keyword}」で予算「{currentBudgetName}
                」のお店が見つかりました ({shops.length}件):
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {shops.map((shop, index) => (
                <ShopCard key={shop.id} shop={shop} index={index} />
              ))}
            </div>
          </div>
        )}

        {shops !== null && shops.length === 0 && !error && !isLoading && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative mb-6 shadow-md animate-fade-in"
            role="alert"
          >
            <span className="block sm:inline font-semibold">
              「{lastSearchCriteria?.keyword}」で予算「{currentBudgetName}
              」のお店は見つかりませんでした。条件を変えてみてください。
            </span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
