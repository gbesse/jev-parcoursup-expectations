// Objectif : vérifier la normalisation, la règle déterministe et la décision sémantique.
import test from "node:test";
import assert from "node:assert/strict";
import { candidateCase, assessParcoursupExpectations } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const edge = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-16"
  },
  "formationStatus": "closed"
};
test("exige une source", () => assert.throws(() => candidateCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => { const provider = createFakeProvider(() => { throw new Error("appel interdit"); }); assert.equal((await assessParcoursupExpectations(edge, provider)).decision, "unavailable"); assert.equal(provider.calls, 0); });
test("classe un dossier sourcé", async () => { const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "partial_alignment", probabilities: {
  "strong_alignment": 0.05,
  "partial_alignment": 0.85,
  "weak_alignment": 0.05,
  "unavailable": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 10, output_tokens: 0 } })); const result = await assessParcoursupExpectations({
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
}, provider); assert.equal(result.decision, "partial_alignment"); assert.equal(result.review, false); });
