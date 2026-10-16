# ArtBridge matching: an artist-led starting point

## Recommendation

Use **content-based reciprocal matching, with complementary techniques and human choice** for the initial small-cohort CSV workspace. This is a design recommendation for ArtBridge's current data, not a claim that one algorithm is universally best.

The prototype does not use a trained model, infer personalities from artwork, assess artistic quality, use popularity or income, or report a probability of successful collaboration. It has no collaborative-filtering interaction history. Fictional preference profiles demonstrate the mechanism separately from the real Grace Lee × Ezekiel Charles Loishooki collaboration materials.

## Research reviewed

1. **Pizzato, Rej, Chung, Koprinska & Kay (2010), RECON: A Reciprocal Recommender for Online Dating.** RecSys, DOI: https://doi.org/10.1145/1864708.1864747. Defines recommendation where the people on both sides have preferences. Useful conceptual background, not artist-specific evidence.
2. **Vitale, Parotsidis & Gentile (2018), Online Reciprocal Recommendation with Theoretical Performance Guarantees.** NeurIPS 31. https://papers.nips.cc/paper_files/paper/2018/hash/97af07a14cacba681feacf3012730892-Abstract.html. Mutual interest is the objective, rather than one user's preference for an item. The paper studies sequential learning under stated assumptions; this app does not implement its online algorithm or inherit its guarantees.
3. **Palomares (2020), Reciprocal Recommendation: Matching Users with the Right Users.** SIGIR, pp. 2429–2431. https://doi.org/10.1145/3397271.3401420. Synthesizes bidirectional preference modeling for people-to-people recommendation, including learning and skill sharing. Author-institution record: https://researchoutput.ncku.edu.tw/en/publications/reciprocal-recommendation-matching-users-with-the-right-users/.
4. **Büyükboyaci & Robbett (2019), Team formation with complementary skills.** Journal of Economics & Management Strategy 28(4), 713–733. https://doi.org/10.1111/jems.12296. An experiment supports the value of self-selected complementary teams when members can specialize. It is not a study of international artist collaboration, so transfer to ArtBridge is an inference to test.

## Alternatives

| Approach | Benefit | Current limitation | Decision |
| --- | --- | --- | --- |
| Similarity only | Simple to explain | Can reproduce the same style and ignore what the partner wants | Use shared themes as one component |
| Collaborative filtering | Learns from interaction patterns | No reliable interaction history for the small initial cohort | Defer |
| Embeddings / LLM reranking | Can interpret rich artist statements across languages | Opaque preference inference, external costs, and insufficient validation | Defer; keep explicit artist-selected tags first |
| Reciprocal matching + complementary techniques | Considers both artists, explainable without training data | Depends on accurate volunteered preferences; weights need testing | Initial implementation |
| Forced one-to-one assignment | Can optimize a whole cohort | Removes exploration and may treat a score as consent | Do not auto-assign |

## Exact implementation (`matching.js`)

1. Require different IDs, affirmative workspace inclusion consent, complete techniques, desired techniques, themes, formats, dates, and mutually compatible preferred partner regions.
2. Exclude non-overlapping date windows and pairs without a shared project format.
3. For the directed fit A → B:
   - 35% Jaccard overlap of selected themes.
   - 40% coverage of A's desired techniques by B's offered techniques.
   - 25% Jaccard overlap of desired collaboration formats.
4. Compute B → A in the same way.
5. Combine the two directed fits using their harmonic mean, then round to a 0–100 connection index. A zero on one side yields zero overall. This aggregation and the weights are ArtBridge design choices, not reported paper parameters.
6. Show the shared themes, techniques, formats and actual overlapping dates. Keep both artist choice and opt-out possible; saving a shortlist or project draft sends no message and records no partner acceptance.

Language is not a ranking penalty. English, Korean and Kiswahili are interface and translation choices. Actual cross-time-zone communication slots are not yet collected, so date overlap must not be read as meeting-time compatibility.

## Pilot before claiming effectiveness

Ask artists whether suggestions feel relevant and respectful, and compare the prototype with shared-theme-only and random eligible baselines. Track both parties' independent interest, explanation usefulness, decline reasons, completed collaborations and distribution of exposure. Do not reuse this local single-user UI as proof of independent two-party consent. Test weights and translated tags with the actual artists. Establish a consented evaluation process before recording real outcomes.

Research checked: 2026-10-16. No artist-specific accuracy or success-rate claim has been established.
