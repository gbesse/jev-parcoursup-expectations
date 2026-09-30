// Objectif : vérifier que les types publics sont importables.
import { candidateCase, assessParcoursupExpectations } from "../src/index.mjs";
const dossier = candidateCase({
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
});
void assessParcoursupExpectations(dossier, { decide: async () => ({}) });
