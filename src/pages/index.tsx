import { useState } from "react";
import { motion } from "framer-motion";

export default function WeCreditChatBot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setErrorMessage("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setResponse("");
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_message: query }), // ✅ Send correct JSON
      });

      const rawText = await res.text();
      console.log("Raw API Response:", rawText); // 🔥 Debugging

      if (!res.ok) {
        throw new Error(rawText);
      }

      const data = JSON.parse(rawText);
      setResponse(data.response || "No response received.");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to fetch response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #3b82f6, #06b6d4, #10b981)",
        padding: "20px",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "4rem",
          fontWeight: "900",
          color: "white",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        WeCredit Chat Bot
      </motion.h1>

      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "white",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Enter your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flexGrow: "1",
                padding: "15px",
                fontSize: "1.2rem",
                border: "none",
                borderRadius: "15px",
                outline: "none",
                color: "#333",
                marginRight: "10px",
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? "none" : "auto",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "15px 30px",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "white",
                background: isLoading ? "#93c5fd" : "#3b82f6",
                border: "none",
                borderRadius: "15px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "background 0.3s ease",
              }}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {errorMessage && <div style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</div>}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: "2rem",
              background: "white",
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <p style={{ fontSize: "1.2rem", color: "#333" }}>{response}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
