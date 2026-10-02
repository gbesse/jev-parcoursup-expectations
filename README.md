# Jev Parcoursup Expectations

**Compare un profil candidat aux attendus publiés d’une formation Parcoursup.**

[![Tests](https://github.com/gbesse/jev-parcoursup-expectations/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-parcoursup-expectations/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.2 · Documentation française

Jev Parcoursup Expectations transforme un comparaison de candidature sourcé en une catégorie explicite et révisable. Le dépôt sépare les règles vérifiables en code de la comparaison sémantique confiée à Jev.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-parcoursup-expectations.git
cd jev-parcoursup-expectations
npm install
npm run demo
```

Les trois démonstrations utilisent uniquement des données et probabilités synthétiques. Elles n’effectuent aucun appel réseau et ne mesurent pas la qualité réelle de Jev.

## Exemple exécutable

Le scénario principal aboutit à **`alignement_partiel`**. Le fournisseur Jev est simulé et une assertion fait échouer la commande si le contrat change.

```js
import { assessParcoursupExpectations } from "@gbesse/jev-parcoursup-expectations";
import { createFakeProvider } from "@gbesse/jev-parcoursup-expectations/jev";

const provider = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: { decision: {
    type: "choice",
    choice: "partial_alignment",
    probabilities: {
  "strong_alignment": 0.05,
  "partial_alignment": 0.85,
  "weak_alignment": 0.05,
  "unavailable": 0.05
},
    confidence: 0.85,
  } },
  usage: { input_tokens: 120, output_tokens: 0 },
}));

const résultat = await assessParcoursupExpectations({
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
}, provider);
console.log(résultat.label);
```

Le fichier complet est [`examples/demo.mjs`](examples/demo.mjs). Lancez-le avec `npm run demo:principal`.

### Cas limite à tester

[`examples/cas-limite.mjs`](examples/cas-limite.mjs) exerce une règle déterministe propre au domaine. Résultat attendu : **`formation_indisponible`**, avec zéro appel Jev.

```sh
npm run demo:limite
```

`npm run demo` exécute les trois scénarios.

### Décision incertaine à revoir

[`examples/revue-humaine.mjs`](examples/revue-humaine.mjs) simule un dossier incomplet. Une confiance de `0.62` doit produire `review: true` afin que l’incertitude reste visible et qu’aucune action automatique ne soit déclenchée.

```sh
npm run demo:revue
```

Résultat attendu : **`alignement_partiel`**, avec `revue humaine : true`.

## Frontière de décision

Compare un profil candidat aux attendus publiés d’une formation Parcoursup. La sortie sert à ordonner ou préparer une revue humaine. Elle ne constitue ni une décision administrative, ni un avis juridique, ni une garantie d’éligibilité, d’accessibilité, de financement ou de performance.

Les identifiants, dates, valeurs exactes, filtres et cas incontestables restent traités par du code ordinaire. La question et les critères envoyés à Jev sont versionnés dans [`src/index.mjs`](src/index.mjs).

## Sources publiques

- [Cartographie des formations Parcoursup](https://www.data.gouv.fr/datasets/cartographie-des-formations-parcoursup-1)

Conservez l’identifiant amont, l’URL, la date de récupération, le millésime et la licence de chaque donnée. Vérifiez le schéma et les conditions de réutilisation auprès du producteur avant ingestion.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client valide le modèle et les probabilités, refuse les redirections, limite les nouvelles tentatives aux erreurs réseau et HTTP 429/529, puis bloque une requête dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Calibrez les seuils sur un corpus français annoté avant tout usage opérationnel.

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-parcoursup-expectations** : le scénario principal et la frontière déterministe, ainsi que la revue humaine. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI, data.gouv.fr ni l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
