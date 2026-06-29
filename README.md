<div align="center">

# Hybrid Multi-Language Code-Aware Search Engine
### Intelligent Source Code Retrieval with Explainable Ranking

<p align="center">

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg)]()
[![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)]()
[![Research](https://img.shields.io/badge/Published-IJERCSE-red.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]()

</p>

A lightweight, explainable, and hybrid source code retrieval system integrating **Abstract Syntax Tree (AST) parsing**, **Semantic Search**, **Hybrid Ranking**, and **Explainable AI (XAI)** to deliver accurate snippet-level code retrieval across multiple programming languages.

> 📖 Published in the **International Journal of Engineering Research in Computer Science and Engineering (IJERCSE)**  
> 🎓 Final Year Research Project • Puducherry Technological University  
> ⭐ Awarded **Highest Grade (S Grade)**

</div>

---

# Overview

Modern software repositories contain millions of lines of source code spread across multiple programming languages. Traditional keyword-based search systems often fail to understand source code structure, semantics, and developer intent, resulting in poor retrieval quality.

This project introduces a **Hybrid Multi-Language Code-Aware Search Engine** capable of understanding both the structural and semantic characteristics of source code while providing **transparent and explainable ranking** for every retrieved result.

Unlike conventional search engines that retrieve entire files, this system performs **snippet-level retrieval**, allowing developers to locate the exact function, class, or method relevant to their query.

---

# Key Features

- Hybrid Information Retrieval Framework
- Multi-language source code analysis
- Abstract Syntax Tree (AST) parsing
- Snippet-level indexing
- Semantic Search using Vector Embeddings
- Hybrid Ranking Algorithm
- Explainable AI (XAI) Ranking
- GitHub Repository Indexing
- Low-latency Retrieval
- Modular Backend Architecture
- Interactive React Dashboard
- Repository Performance Evaluation

---

# Supported Languages

- Python
- Java
- C
- C++

The architecture has been designed to support additional programming languages with minimal parser extensions.

---

# Dataset Setup

To keep this repository lightweight and focused on the implementation of the search engine, the evaluation datasets are **not included**.

The search engine can dynamically index both **local repositories** and **GitHub repositories**.

During research and evaluation, the following open-source repositories were used as representative datasets:

- Python
- Java
- C-Plus-Plus
- FastAPI
- Flask
- Requests
- Java Design Patterns

Create a folder named:

```text
datasets/
```

inside the project root and clone one or more repositories.

Example:

```text
datasets/
├── Python/
├── Java/
├── C-Plus-Plus/
├── fastapi/
├── flask/
├── requests/
└── java-design-patterns/
```

The indexing pipeline automatically scans these repositories, extracts structural information, generates searchable snippets, and builds the retrieval index.

---

# System Architecture

```
                GitHub / Local Repository
                          │
                          ▼
                Multi-Language Loader
                          │
                          ▼
                 Language Detection
                          │
                          ▼
              Language Specific Parser
                          │
                          ▼
             Abstract Syntax Tree (AST)
                          │
                          ▼
                 Snippet Extraction
                          │
                          ▼
                  Index Construction
                          │
                          ▼
                  Query Processing
                          │
                          ▼
          Hybrid Ranking (Structural +
              Semantic Similarity)
                          │
                          ▼
          Explainable Ranking Module
                          │
                          ▼
             Ranked Search Results
```

---

# Workflow

1. Load one or more local or GitHub repositories.
2. Detect repository programming language.
3. Parse source files using AST.
4. Extract functions, classes, methods, and identifiers.
5. Generate snippet-level searchable units.
6. Build structural and semantic indexes.
7. Process user queries.
8. Perform semantic similarity search.
9. Apply hybrid ranking.
10. Generate explainable search results.

---

# Technology Stack

## Backend

- Python
- FastAPI

## Frontend

- React
- Tailwind CSS

## Core Technologies

- Information Retrieval
- Semantic Search
- Explainable AI (XAI)
- Abstract Syntax Trees
- Vector Embeddings
- Cosine Similarity
- Hybrid Ranking
- Query Processing
- Source Code Analysis

---

# Hybrid Ranking

The final retrieval score combines structural relevance with semantic similarity.

```
Final Score =
α × Structural Score
+
β × Semantic Score
```

Where

- Structural Score evaluates AST similarity, identifiers, keywords, and code structure.
- Semantic Score evaluates vector similarity using embeddings.

This hybrid approach significantly improves retrieval precision compared to conventional keyword search.

---

# Explainable Ranking

Unlike traditional black-box search systems, every retrieved result is accompanied by an explanation describing why it was ranked.

Example explanation:

✔ Function name matches query

✔ High semantic similarity

✔ Relevant AST structure

✔ Matching identifiers

✔ Strong overall relevance score

This improves transparency, developer trust, and interpretability.

---

# Evaluation Datasets

The proposed retrieval framework was evaluated on multiple real-world open-source repositories covering different programming languages and software domains.

Evaluation repositories included:

- Python
- Java
- C++
- FastAPI
- Flask
- Requests
- Java Design Patterns

The evaluation validated:

- Multi-language parsing
- AST generation
- Snippet extraction
- Semantic retrieval
- Explainable ranking
- Query latency
- Retrieval accuracy

Using heterogeneous repositories ensured that the system generalized across different software architectures and programming paradigms.

---

# Performance Evaluation

The system was evaluated using standard Information Retrieval metrics.

- Precision@K
- Recall@K
- Mean Reciprocal Rank (MRR)
- Normalized Discounted Cumulative Gain (NDCG)
- Hit Rate
- Query Latency

Experimental evaluation demonstrated improved retrieval accuracy, explainability, and response efficiency over conventional keyword-based search techniques.

---

# Repository Structure

```
Hybrid-Multi-Language-Code-Aware-Search-Engine/

├── frontend/
├── parsers/
├── search/
├── embeddings/
├── evaluation/
├── snippets/
├── utils/
├── docs/
├── assets/
├── datasets/          (User-created; not included)
├── api.py
├── main.py
├── requirements.txt
└── README.md
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/Khusheell/Hybrid-Multi-Language-Code-Aware-Intelligent-Search-System.git
```

Install backend dependencies.

```bash
pip install -r requirements.txt
```

Install frontend dependencies.

```bash
cd frontend
npm install
```

Run the backend.

```bash
python main.py
```

Run the frontend.

```bash
npm start
```

---

# Future Enhancements

- JavaScript parser
- Go parser
- Rust parser
- Transformer-based embeddings
- Large Language Model integration
- Automatic GitHub repository cloning
- Incremental repository indexing
- Distributed indexing
- VS Code Extension
- Intelligent Code Recommendation
- Repository Summarization
- AI-assisted Query Refinement

---

# Research Publication

**Title**

Code Aware Search Engine with Explainable Ranking

**Journal**

International Journal of Engineering Research in Computer Science and Engineering (IJERCSE)

Volume 13 • Issue 06 • June 2026

---

# Authors

## Lead Developer

**S. Khusheel Manideep**

## Team Members

S. Sai Madhav

P. Jaswanth

S. Charan Teja

Department of Computer Science & Engineering

Puducherry Technological University

---

# Acknowledgements

The authors sincerely thank **Dr. P. Salini**, Department of Computer Science & Engineering, Puducherry Technological University, for continuous guidance, mentorship, and support throughout the research and development of this project.

---

<div align="center">

⭐ If you found this project useful, please consider giving it a Star.

</div>
