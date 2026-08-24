# Levels toevoegen

Elk level staat in één bestand: `level-1.ts`, `level-2.ts`, enzovoort. De game vindt bestanden met de naam `level-*.ts` automatisch en sorteert ze op `nummer`.

## Nieuw level

1. Kopieer `LEVEL_TEMPLATE.ts.txt` naar bijvoorbeeld `level-4.ts`.
2. Pas uitsluitend dat nieuwe levelbestand aan.
3. Zet een eventuele nieuwe afbeelding in `src/assets` en importeer die bovenaan het levelbestand.

## Belangrijkste velden

- `nummer`, `titel`, `beschrijving`: wat op de levelkaart verschijnt.
- `plantIds`: welke planten in het level beschikbaar zijn.
- `terreinKaart`: de indeling van het speelbord. Deze kaart staat volledig in het levelbestand en kan daar onafhankelijk worden aangepast.
- `optimalePlaatsing`: de oplossing die voor de score en het resultaatscherm wordt gebruikt.
- `combos`: bonuscombinaties voor dit level.
- `maximaleScore`: de score die overeenkomt met 100%.
- `gerecht`: de beloning die na afronden wordt getoond.
- `heeftUitleg`: opent eerst het uitlegscherm wanneer dit `true` is.

TypeScript controleert tijdens `npm run build` automatisch of verplichte velden ontbreken of terreinwaarden ongeldig zijn.
