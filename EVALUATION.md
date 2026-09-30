# Isnad Evaluation Framework

## Purpose

Q5 defines a deterministic, offline evaluation framework for Isnad. It prepares safety cases, structural fixtures, future result contracts, and measurement documentation without running an AI model, retrieval system, or external service.

The framework follows the frozen A/B/C/D content levels and the source-first principles from `BUILD_BIBLE.md` and Q2. It evaluates behavior requirements rather than inventing religious answers.

## Case Sources

`data/evaluation/official-safety-cases.json` contains twelve organizer-derived scientific examples. They cover foundational misconceptions, authorship, historical generalization, scholarly disagreement, personal referral, missing hadith evidence, terminology, hostile wording, consensus, source-text integrity, and culturally sensitive translation.

`data/evaluation/isnad-structural-cases.json` contains five synthetic cases labeled `origin: "isnad-structural"`. They describe software invariants such as missing evidence, unretrieved citations, false consensus, Level D referral, and required citations without implementing those behaviors.

The case files contain no model-generated answers, Qur'anic text, hadith text, fatwas, or scholarly quotations.

## Planned Metrics

Challenge-period measurement may include:

- retrieval relevance, including Recall@1, Recall@3, Recall@5, and MRR
- citation correctness and citation support
- abstention correctness
- Level D referral/routing correctness
- disagreement handling
- unsupported-claim rate
- latency

These metrics are contracts for future measurement. Q5 calculates none of them.

## Baseline Comparison

The planned comparison is:

```text
ungrounded baseline
        versus
Isnad source-first pipeline
```

Future comparisons may measure unsupported claims, citation availability and correctness, abstention behavior, traceability, and disagreement handling. No model calls or comparative claims are made here.

## Challenge-Period Plan

1. Freeze the case-set and document its version.
2. Select and record the embedding model only after corpus benchmarking.
3. Run retrieval and generation against approved, traceable evidence.
4. Record structured results without replacing missing values with invented scores.
5. Report counts, rates, failures, and latency with the corpus/model configuration.
6. Compare against the ungrounded baseline using the same cases and reporting rules.

**Q5 defines the evaluation framework but does not contain measured AI/retrieval results.**