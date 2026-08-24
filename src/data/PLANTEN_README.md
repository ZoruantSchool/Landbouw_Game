# Planten toevoegen

Alle plantgegevens staan in `planten.csv`. Eén rij is één plant en wordt automatisch gebruikt in het spel en in het scherm **Alle planten**.

## Nieuwe plant

1. Voeg de PNG-afbeelding toe aan `src/assets`. De bestandsnaam moet beginnen met `plant-`.
2. Kopieer een bestaande rij in `planten.csv` en pas alle kolommen aan.
3. Zet de afbeeldingsnaam in de kolom `afbeelding`.
4. Voeg het nieuwe plant-ID toe aan `plantIds` in ieder level waarin de plant beschikbaar moet zijn.
5. Voer `npm run build` uit om de gegevens te controleren.

## Speciale kolommen

- `correctTerreinen`: meerdere waarden worden met `|` gescheiden, bijvoorbeeld `grasland|oever`.
- `combinaties`: schrijf `plant_id::beschrijving`. Scheid meerdere combinaties met `||`.
- `breedte` en `hoogte`: bepalen hoeveel vakjes de plant inneemt.
- `minOpbrengst` en `maxOpbrengst`: opbrengst bij respectievelijk ongunstige en volledig correcte plaatsing.
- `opbrengstEenheid`: de getoonde eenheid, bijvoorbeeld `kg`.
- Tekst met komma’s moet tussen dubbele aanhalingstekens staan. Het meegeleverde bestand doet dit voor alle tekstvelden.

Geldige terreintypen zijn `akker`, `grasland`, `heuvel`, `oever`, `schaduw` en `water`.
