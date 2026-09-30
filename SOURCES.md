# Isnad Source Governance

## Registry Purpose

`data/sources/approved-source-registry.json` is preparation metadata for future source selection. It records source families, categories, usage rules, status, and governance notes. It is not the corpus and does not download, copy, scrape, or embed religious source text.

Every registry entry currently declares `ingested: false`. No source is claimed as present in the corpus.

## Future Ingestion Requirements

Before ingestion, each concrete source must have:

- a stable source identifier
- a URL or reference
- content category
- acquisition method
- license or usage status where applicable
- retrieval date
- source and text verification notes
- preserved attribution and source framing

Metadata must not promise author, institution, volume, page, or URL fields that the source does not reliably provide.

## Source Policy

- Qur'anic text must come from an approved and verified text source.
- Tafsir must remain distinguishable from Qur'anic text.
- Hadith must not be attributed without source and accepted grading metadata supported by the corpus.
- General fiqh material must not become an autonomous personal fatwa or automatic independent tarjih.
- Sensitive Sharia terminology should prefer approved terminology references over naive machine translation.

## Provenance and Text Separation

Original source material remains separate from generated explanations. Future evidence chunks must retain immutable IDs so an answer claim can be traced through chunk, document, source, and verification metadata. Generated summaries are never authoritative source truth.

The registry is currently governance preparation only. It makes no claim of corpus coverage, source ingestion, or completed verification.