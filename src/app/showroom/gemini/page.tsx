"use client";

import React, { useState } from "react";

interface ArticleInput {
  id: string;
  title: string;
  abstract: string;
}

interface ArticleOutput extends ArticleInput {
  titulo_es?: string;
  abstract_es?: string;
  resumen_es?: string;
}

const initialArticles: ArticleInput[] = [
  {
    id: "1",
    title:
      "The Impact of Artificial Intelligence on Modern Software Development",
    abstract:
      "Artificial intelligence (AI) is profoundly reshaping software development methodologies. This paper explores how AI-driven tools for code generation, automated testing, and bug detection are enhancing productivity and code quality, while also discussing the challenges and ethical considerations introduced by these technologies.",
  },
  {
    id: "2",
    title: "Quantum Computing: A New Frontier for Complex Problem Solving",
    abstract:
      "Quantum computing promises to revolutionize fields by solving problems currently intractable for classical computers. We review the fundamental principles of quantum mechanics enabling these capabilities, survey current hardware and algorithmic advancements, and discuss potential applications in cryptography, materials science, and drug discovery.",
  },
  {
    id: "3",
    title: "Advancements in Renewable Energy Storage Solutions",
    abstract:
      "Efficient energy storage is crucial for the widespread adoption of renewable energy sources like solar and wind. This article examines recent breakthroughs in battery technology, hydrogen fuel cells, and other storage mechanisms, evaluating their scalability, cost-effectiveness, and environmental impact.",
  },
  {
    id: "4",
    title: "The Role of Big Data Analytics in Personalized Medicine",
    abstract:
      "Big data analytics is enabling a shift towards personalized medicine by leveraging vast amounts of patient data, including genomics, proteomics, and electronic health records. We discuss how machine learning algorithms are being used to predict disease risk, tailor treatments, and improve patient outcomes.",
  },
  {
    id: "5",
    title: "Ethical Implications of Autonomous Systems in Society",
    abstract:
      "As autonomous systems, from self-driving cars to AI decision-makers, become more prevalent, their ethical implications require careful consideration. This paper analyzes key ethical challenges, including accountability, bias in algorithms, job displacement, and the potential impact on human autonomy and societal values.",
  },
];

export default function GeminiShowroomPage() {
  const [articles, setArticles] = useState<ArticleInput[]>(initialArticles);
  const [processedArticles, setProcessedArticles] = useState<ArticleOutput[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingOutput, setStreamingOutput] = useState<string>(""); // To show raw stream progress

  // Function to allow editing of titles and abstracts if needed (optional)
  const handleInputChange = (
    index: number,
    field: "title" | "abstract",
    value: string
  ) => {
    const updatedArticles = [...articles];
    updatedArticles[index] = { ...updatedArticles[index], [field]: value };
    setArticles(updatedArticles);
  };

  const processAbstracts = async () => {
    setIsLoading(true);
    setError(null);
    setProcessedArticles([]);
    setStreamingOutput("");
    let accumulatedJsonString = "";

    try {
      const response = await fetch("/api/traduccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articles }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to process error response" }));
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        // SSE format is "data: <json_fragment>\n\n"
        // A single chunk from reader.read() might contain multiple SSE messages or partial messages.
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonDataPart = line.substring(6); // Remove "data: " prefix
            if (jsonDataPart.trim()) {
              accumulatedJsonString += jsonDataPart;
              setStreamingOutput((prev) => prev + jsonDataPart); // Update raw stream for visual feedback
            }
          }
        }
      }

      // Final processing of accumulated JSON string
      // Check if it's empty or just whitespace before parsing
      if (accumulatedJsonString.trim()) {
        try {
          const result = JSON.parse(accumulatedJsonString) as ArticleOutput[];
          // Merge results with original articles to ensure all data is present
          const updatedProcessedArticles = articles.map((original) => {
            const processed = result.find((p) => p.id === original.id);
            return { ...original, ...processed };
          });
          setProcessedArticles(updatedProcessedArticles);
        } catch (parseError) {
          console.error(
            "Failed to parse final JSON:",
            parseError,
            "Accumulated string:",
            accumulatedJsonString
          );
          setError(
            "Failed to parse results from API. Raw output: " +
              accumulatedJsonString
          );
        }
      } else {
        setError("Received empty or invalid data from API.");
      }
    } catch (err) {
      console.error("Error processing abstracts:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Gemini API Showroom: Abstract Translation & Summarization</h1>
      <p>
        This page sends 5 academic abstracts to a Next.js API route, which then
        uses the Gemini API to translate titles and abstracts to Spanish, and
        generate a Spanish summary for each. Results are streamed back.
      </p>
      <p>
        <em>
          Remember to set your <code>GEMINI_API_KEY</code> in{" "}
          <code>.env.local</code> and install <code>@google/genai</code>.
        </em>
      </p>

      {/* You can replace this button with your custom Button component from components/buttons */}
      <button
        onClick={processAbstracts}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginBottom: "20px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Processing..." : "Translate & Summarize Abstracts"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h2>Input Abstracts (English)</h2>
      {articles.map((article, index) => (
        // Consider replacing this div with a custom ProCard component if available
        <div
          key={article.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>
            <input
              type="text"
              value={article.title}
              onChange={(e) =>
                handleInputChange(index, "title", e.target.value)
              }
              style={{
                width: "100%",
                fontSize: "1.17em",
                border: "1px solid #eee",
                padding: "5px",
              }}
            />
          </h3>
          <textarea
            value={article.abstract}
            onChange={(e) =>
              handleInputChange(index, "abstract", e.target.value)
            }
            rows={5}
            style={{ width: "100%", border: "1px solid #eee", padding: "5px" }}
          />
        </div>
      ))}

      {streamingOutput && (
        <div>
          <h2>Raw Streaming Output (for debugging/visualization):</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {streamingOutput}
          </pre>
        </div>
      )}

      {processedArticles.length > 0 && (
        <div>
          <h2>Processed Abstracts (Spanish Translations & Summaries)</h2>
          {processedArticles.map((article) => (
            // Consider replacing this div with a custom ProCard component if available
            <div
              key={article.id}
              style={{
                border: "1px solid #4CAF50",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>
                Original Title (EN):{" "}
                {initialArticles.find((a) => a.id === article.id)?.title}
              </h3>
              {article.titulo_es && (
                <p>
                  <strong>Título (ES):</strong> {article.titulo_es}
                </p>
              )}
              <h4>Original Abstract (EN):</h4>
              <p>
                <small>
                  {initialArticles.find((a) => a.id === article.id)?.abstract}
                </small>
              </p>
              {article.abstract_es && (
                <p>
                  <strong>Abstract (ES):</strong> {article.abstract_es}
                </p>
              )}
              {article.resumen_es && (
                <p>
                  <strong>Resumen (ES):</strong> {article.resumen_es}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
