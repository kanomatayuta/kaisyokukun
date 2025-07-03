// src/app/api/shops/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 環境変数からAPIキーを取得
const HOTPEPPER_API_KEY = process.env.HOTPEPPER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// APIキーが設定されているか確認
if (!HOTPEPPER_API_KEY || !GEMINI_API_KEY) {
  // 設定されていない場合はエラーをスロー
  throw new Error("API keys are not defined in environment variables.");
}

// Gemini AIクライアントを初期化
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// 使用するGeminiモデルを指定
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * GETリクエストハンドラ
 * Hot PepperグルメAPIから店舗情報を取得し、Gemini APIでAI分析を行う
 */
export async function GET(req: NextRequest) {
  // URLのクエリパラメータから検索条件を取得
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const budget = searchParams.get("budget");
  const smoking = searchParams.get("smoking");
  // 表示件数を取得（デフォルトは10件）
  const count = searchParams.get("count")
    ? parseInt(searchParams.get("count") as string)
    : 10;
  // 検索開始位置を取得（ページネーション用、デフォルトは1から開始）
  const start = searchParams.get("start")
    ? parseInt(searchParams.get("start") as string)
    : 1;

  // キーワードが必須であることを確認
  if (!keyword) {
    return NextResponse.json(
      { error: "Keyword is required." },
      { status: 400 }
    );
  }

  // Hot PepperグルメAPIへのリクエストパラメータを準備
  const hotpepperParams: { [key: string]: any } = {
    key: HOTPEPPER_API_KEY,
    keyword: keyword,
    budget: budget || "", // 予算が指定されていなければ空文字列
    format: "json", // JSON形式で結果を要求
    count: count, // 取得件数
    start: start, // 検索開始位置
  };

  // 喫煙条件が指定されていれば追加
  if (smoking) {
    hotpepperParams.no_smoking = smoking;
  }

  // Hot PepperグルメAPIのエンドポイントURL
  const HOTPEPPER_URL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

  try {
    // Hot PepperグルメAPIにリクエストを送信
    const hotpepperResponse = await fetch(
      `${HOTPEPPER_URL}?${new URLSearchParams(hotpepperParams).toString()}`
    );
    // HTTPエラーが発生した場合に例外をスロー
    if (!hotpepperResponse.ok) {
      throw new Error(`Hot Pepper API error: ${hotpepperResponse.statusText}`);
    }
    // レスポンスをJSONとして解析
    const hotpepperData = await hotpepperResponse.json();
    // 店舗情報を取得（見つからなければ空の配列）
    const shops = hotpepperData.results?.shop || [];

    const shopsWithAnalysis: any[] = [];

    // 各店舗に対してAI分析を実行
    for (const shop of shops) {
      // AIに渡す店舗情報を整形
      const shopInfoForAI = `
        店名: ${shop.name}
        ジャンル: ${shop.genre?.name || "なし"}
        アクセス: ${shop.access || "なし"}
        予算（ディナー）: ${shop.budget?.name || "なし"}
        キャッチコピー: ${shop.catch || "なし"}
        お店のこだわり: ${shop.shop_detail_memo || "なし"}
        平均客単価: ${shop.avg_price || "なし"}
      `;

      // Geminiへのプロンプトを生成 (精度向上のため詳細化)
      const geminiPrompt = `
        あなたは広告代理店のベテランマーケターであり、特に企業の会食や接待に適した飲食店を厳選する専門家です。
        以下の飲食店の詳細情報を基に、そのお店が「会食」の用途にどれほど適しているかを厳密に評価してください。

        評価は5段階で行い、以下の基準を厳守してください。
        - 5: 非常に適している（静かで個室完備、質の高い料理、高級感があり、重要な会食に最適）
        - 4: かなり適している（静かで個室がある、料理の質も高く、一般的な会食に十分）
        - 3: 普通（会食にも利用可能だが、特筆すべき点はない。カジュアルな会食向け）
        - 2: あまり適していない（騒がしい、個室がない、料理の質が会食向けではないなど）
        - 1: 全く適していない（会食には不向き）

        特に以下の点を重視して評価してください。
        1. 静かさ: 会話がしやすい環境か。
        2. 個室の有無: プライベートな空間が確保できるか。（情報があれば）
        3. 料理の質（ジャンルから推測）: 会食にふさわしいジャンルか、期待できる質か。
        4. 高級感: 内装、雰囲気、サービスから感じられる高級感。

        評価理由を各項目（静かさ、個室の有無、料理の質、高級感）ごとに具体的に述べ、最後に総合的な5段階評価と簡潔な総評を記述してください。

        --- お店の情報 ---
        ${shopInfoForAI}
        ---

        出力形式:
        会食向け度: [5段階評価の数字]
        評価詳細:
        - 静かさ: [評価理由]
        - 個室の有無: [評価理由]
        - 料理の質: [評価理由]
        - 高級感: [評価理由]
        総評: [簡潔な総評]
      `;

      let aiAnalysis = "AI分析中にエラーが発生しました。";
      try {
        // Gemini APIを呼び出し、テキストを生成
        const result = await model.generateContent(geminiPrompt);
        const response = await result.response;
        aiAnalysis = response.text().trim();
      } catch (geminiError) {
        // Gemini API呼び出し中にエラーが発生した場合
        console.error("Gemini API Error:", geminiError);
        aiAnalysis = `Gemini API呼び出し中にエラーが発生しました: ${geminiError}`;
      }

      // 店舗情報とAI分析結果を結合してリストに追加
      shopsWithAnalysis.push({ ...shop, aiAnalysis });

      // クォータ制限回避のため、API呼び出しの間に待機時間を設ける（例: 3秒）
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // AI分析結果を含む店舗リストをクライアントに返す
    return NextResponse.json({ shops: shopsWithAnalysis });
  } catch (error: any) {
    // APIリクエストまたは処理中にエラーが発生した場合
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
