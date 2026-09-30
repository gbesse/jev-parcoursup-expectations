// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { assessParcoursupExpectations } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "exemple-1",
  "text": "Profil solide en mathématiques et projet motivé ; l’attendu de pratique expérimentale reste peu documenté.",
  "source": {
    "url": "https://example.test/donnee-source",
    "date": "2026-09-15"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "partial_alignment", probabilities: {
  "strong_alignment": 0.05,
  "partial_alignment": 0.85,
  "weak_alignment": 0.05,
  "unavailable": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await assessParcoursupExpectations(dossier, provider);
assert.equal(résultat.decision, "partial_alignment");
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
