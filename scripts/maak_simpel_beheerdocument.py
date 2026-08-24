from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT = PROJECT_ROOT / "docs" / "Beheerdocumentatie_simpel.docx"


TITLE = "Beheerdocumentatie"


SECTIONS: list[tuple[str, list[str]]] = [
    (
        "Voorblad",
        [
            TITLE,
            "Dit document is bedoeld als korte overdracht voor mensen die de applicatie gaan gebruiken, beheren of later technisch verder willen aanpassen.",
            "In het document staat wat de applicatie doet, hoe het project is opgebouwd, hoe de game lokaal gestart kan worden en hoe een nieuwe versie online gezet kan worden.",
            "__TABLE__:OVERZICHT",
            "__PAGE_BREAK__",
        ],
    ),
    (
        "Deel 1: algemene uitleg",
        [
            "__H2__:Wat is de applicatie?",
            "De applicatie is een educatieve webgame over het opbouwen van een voedselbos. De speler kiest een level, krijgt uitleg en plaatst planten op een speelveld. Door planten op een goede plek te zetten leert de speler hoe verschillende planten elkaar kunnen helpen.",
            "De game is gemaakt om de leerstof op een laagdrempelige manier aan te bieden. De speler hoeft niets te installeren en heeft geen account nodig. De game opent gewoon in een browser, zoals Chrome, Edge of Firefox.",
            "__H2__:Wat is belangrijk om te weten?",
            "Belangrijk om te weten is dat de applicatie geen ingewikkelde server nodig heeft. De game wordt gebouwd als een gewone website en kan daarna op een webserver of hostingomgeving geplaatst worden. Er is geen aparte database en er is ook geen inlogsysteem.",
            "De inhoud van de game staat in de projectbestanden. Denk hierbij aan de levels, planten, afbeeldingen, uitlegteksten en beloningen. Als er later nieuwe inhoud nodig is, kan een ontwikkelaar dit aanpassen in de broncode.",
            "De game slaat geen persoonlijke gegevens van spelers op. De voortgang wordt alleen tijdens het spelen bijgehouden. Als de gebruiker de pagina opnieuw laadt, begint de game opnieuw. Daardoor is het beheer eenvoudiger en is het privacyrisico laag.",
            "__H2__:Controle na oplevering",
            "Na een wijziging of nieuwe oplevering is het verstandig om de game kort na te lopen. Open de website, start de game, kies een level en controleer of de belangrijkste knoppen reageren. Kijk ook of afbeeldingen goed laden en of het eindscherm zichtbaar wordt na het afronden van een level.",
            "Als er een probleem is, helpt het om kort op te schrijven wat er gebeurde. Noteer bijvoorbeeld welk level open stond, welke knop werd gebruikt, welke browser werd gebruikt en wat er op het scherm te zien was. Met die informatie kan een technische beheerder sneller bepalen waar het probleem zit.",
            "__H2__:Beheerafspraken",
            "Voor toekomstig beheer is het handig om één persoon verantwoordelijk te maken voor het online zetten van nieuwe versies. Zo blijft duidelijk welke versie online staat en wie wijzigingen heeft doorgevoerd.",
            "Het is ook verstandig om oude werkende versies niet meteen te verwijderen. Als een nieuwe versie onverwacht problemen geeft, kan de vorige versie sneller worden teruggezet.",
            "__PAGE_BREAK__",
        ],
    ),
    (
        "Deel 2: voor technische mensen",
        [
            "__H2__:Technische opzet",
            "Het project is gemaakt met Vue, TypeScript en Vite. Vue wordt gebruikt voor de schermen en componenten van de game. TypeScript helpt om fouten in data en code eerder te vinden. Vite wordt gebruikt om de ontwikkelomgeving te starten en om de productieversie te bouwen.",
            "De applicatie heeft geen eigen backend, database of inlogsysteem. Na het bouwen ontstaat een statische website in de map dist. Die map bevat de HTML-, JavaScript-, CSS- en assetbestanden die nodig zijn om de game in de browser te draaien.",
            "__H2__:Benodigdheden",
            "Voor lokaal beheer is Node.js nodig. In package.json staat dat Node.js versie 20.19 of hoger gebruikt kan worden. Verder is npm nodig om de packages te installeren en de scripts uit te voeren.",
            "Na het openen van het project kunnen de packages geïnstalleerd worden met npm install. Dit maakt de map node_modules aan. Dit hoeft meestal alleen opnieuw als node_modules ontbreekt of als package.json is aangepast.",
            "__H2__:Lokaal starten en bouwen",
            "Tijdens ontwikkeling kan de applicatie gestart worden met npm run dev. Vite opent dan een lokale ontwikkelserver. In de terminal staat op welk lokaal adres de game bereikbaar is.",
            "Voor een versie die online gezet kan worden, gebruik je npm run build. Dit commando controleert de TypeScript-code en maakt daarna de productieversie. Als het commando zonder foutmelding klaar is, staat de nieuwe versie in de map dist.",
            "Het is verstandig om vóór het opleveren altijd npm run build uit te voeren. Daarmee worden veel technische fouten eerder zichtbaar dan wanneer je alleen in de browser test.",
            "__H2__:Belangrijke mappen en bestanden",
            "De start van de applicatie zit in src/main.ts. Daarna wordt App.vue geladen. De hoofdlogica van de game staat in src/components/spel/VoedselbosSpel.vue. De losse schermen, zoals het startscherm, levelkeuzescherm en eindscherm, staan in src/components/spel/schermen.",
            "De levelbestanden staan in src/data/levels. Elk level heeft een eigen bestand, bijvoorbeeld level-1.ts, level-2.ts en level-3.ts. Afbeeldingen staan in src/assets. Algemene types voor de game staan in src/types/spel.ts en in src/data/levels/types.ts.",
            "__H2__:Levels aanpassen",
            "Als er een nieuw level toegevoegd moet worden, kan een bestaand levelbestand als voorbeeld gebruikt worden. Er staat ook een templatebestand in src/data/levels. Een level bevat onder andere de titel, beschrijving, beschikbare planten, terreinindeling, score-informatie en de beloning die na het level getoond wordt.",
            "Let bij het aanpassen van levels vooral op de namen van planten, de imports van afbeeldingen en de terreinindeling. Een kleine typfout kan ervoor zorgen dat het level niet goed geladen wordt.",
            "Na het aanpassen of toevoegen van een level is het belangrijk om npm run build uit te voeren. Daarmee worden veel fouten zichtbaar, bijvoorbeeld als een verplicht veld mist of als een afbeelding verkeerd is gekoppeld.",
            "__H2__:Online plaatsen",
            "Om de game online te zetten, plaats je de inhoud van de map dist op de webserver of hostingomgeving. Zorg dat index.html bereikbaar is en dat de assets mee worden geplaatst. De hosting hoeft geen Node-server te draaien, omdat de gebouwde game als statische website werkt.",
            "Als de website op een submap geplaatst wordt, moet gecontroleerd worden of alle bestanden nog goed laden. Vooral afbeeldingen en JavaScript-bestanden kunnen anders verkeerd worden opgehaald.",
            "__H2__:Foutmeldingen en beheer",
            "De applicatie maakt zelf geen aparte logbestanden aan. Bij problemen kijk je daarom eerst in de browserconsole. Als de game online staat, kunnen daarnaast de logs van de webserver of hostingomgeving bekeken worden.",
            "Bij problemen is een logische volgorde: controleer eerst of npm install is uitgevoerd, controleer daarna of de juiste Node-versie gebruikt wordt en voer vervolgens npm run build uit. Als de build goed gaat maar de website online niet werkt, controleer dan of alle bestanden uit dist goed zijn geplaatst.",
            "Als afbeeldingen ontbreken, controleer dan of de bestanden nog in src/assets staan en of de importnaam klopt. Als een level niet opent, controleer dan het levelbestand en kijk of het level goed wordt geëxporteerd via src/data/levels/index.ts.",
            "Als een nieuwe versie problemen geeft, kan de vorige werkende versie teruggezet worden. Daarom is het verstandig om wijzigingen via Git bij te houden of de vorige dist-map tijdelijk te bewaren voordat een nieuwe versie online wordt gezet.",
            "__H2__:Beveiliging en privacy",
            "Omdat er geen accounts en geen persoonsgegevens worden opgeslagen, is het privacyrisico laag. Toch is het verstandig om de website via HTTPS aan te bieden. Ook is het goed om af en toe de gebruikte packages te controleren en bij te werken wanneer dat nodig is.",
            "Bij het bijwerken van packages moet daarna opnieuw gecontroleerd worden of npm run build goed werkt en of de game in de browser nog normaal speelbaar is.",
        ],
    ),
    (
        "Korte overdracht",
        [
            "Voor het beheren van dit project zijn Node.js, npm en toegang tot de broncode nodig. De applicatie kan lokaal gestart worden met npm install en daarna npm run dev. Een versie voor online gebruik wordt gemaakt met npm run build.",
            "De gebouwde versie staat in dist. Deze map kan op een webserver of hostingomgeving geplaatst worden. Na het online zetten moet gecontroleerd worden of de game opent, of de levels zichtbaar zijn en of de belangrijkste schermen goed werken.",
            "De belangrijkste beheerpunten zijn het bewaren van de broncode, het controleren van wijzigingen met npm run build, het goed plaatsen van de dist-map en het terug kunnen zetten van een vorige werkende versie als er iets misgaat.",
        ],
    ),
]


def paragraph(text: str, style: str | None = None) -> str:
    if text == "__PAGE_BREAK__":
        return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
    if text == "__TABLE__:OVERZICHT":
        return table(
            [
                ["Onderdeel", "Uitleg"],
                ["Type applicatie", "Educatieve webgame die in de browser draait."],
                ["Gebruikersgegevens", "Er worden geen accounts of persoonlijke gegevens opgeslagen."],
                ["Techniek", "Vue, TypeScript en Vite."],
                ["Online zetten", "Maak eerst een build met npm run build en plaats daarna de inhoud van dist online."],
                ["Belangrijk beheer", "Controleer na wijzigingen of de game opent, de levels zichtbaar zijn en de knoppen werken."],
            ]
        )
    if text.startswith("__H2__:"):
        text = text.removeprefix("__H2__:")
        style = "Heading2"
    style_xml = f'<w:pPr><w:pStyle w:val="{style}"/></w:pPr>' if style else ""
    return (
        "<w:p>"
        f"{style_xml}"
        "<w:r>"
        "<w:t xml:space=\"preserve\">"
        f"{escape(text)}"
        "</w:t>"
        "</w:r>"
        "</w:p>"
    )


def table_cell(text: str, header: bool = False) -> str:
    shading = '<w:shd w:fill="D9EAD3"/>' if header else ""
    bold = "<w:b/>" if header else ""
    return (
        "<w:tc>"
        "<w:tcPr>"
        '<w:tcW w:w="4500" w:type="dxa"/>'
        f"{shading}"
        "</w:tcPr>"
        "<w:p>"
        "<w:r>"
        f"<w:rPr>{bold}</w:rPr>"
        '<w:t xml:space="preserve">'
        f"{escape(text)}"
        "</w:t>"
        "</w:r>"
        "</w:p>"
        "</w:tc>"
    )


def table(rows: list[list[str]]) -> str:
    row_xml: list[str] = []
    for index, row in enumerate(rows):
        cells = "".join(table_cell(cell, header=index == 0) for cell in row)
        row_xml.append(f"<w:tr>{cells}</w:tr>")

    return (
        "<w:tbl>"
        "<w:tblPr>"
        '<w:tblW w:w="0" w:type="auto"/>'
        '<w:tblBorders>'
        '<w:top w:val="single" w:sz="6" w:space="0" w:color="6AA84F"/>'
        '<w:left w:val="single" w:sz="6" w:space="0" w:color="6AA84F"/>'
        '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="6AA84F"/>'
        '<w:right w:val="single" w:sz="6" w:space="0" w:color="6AA84F"/>'
        '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="B6D7A8"/>'
        '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="B6D7A8"/>'
        "</w:tblBorders>"
        "</w:tblPr>"
        + "".join(row_xml)
        + "</w:tbl>"
    )


def document_xml() -> str:
    body: list[str] = []
    first = True

    for heading, paragraphs in SECTIONS:
        if not first:
            body.append(paragraph(""))
        first = False
        body.append(paragraph(heading, "Heading1"))
        for item in paragraphs:
            if item == TITLE:
                body.append(paragraph(item, "Title"))
            else:
                body.append(paragraph(item))

    body.append(
        '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>'
    )

    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        "<w:body>"
        + "".join(body)
        + "</w:body></w:document>"
    )


def styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="170" w:line="300" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="22"/><w:color w:val="222222"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:before="200" w:after="260"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="38"/><w:color w:val="1F5E3B"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="420" w:after="170"/>
      <w:pBdr><w:bottom w:val="single" w:sz="8" w:space="6" w:color="6AA84F"/></w:pBdr>
    </w:pPr>
    <w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="1F5E3B"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:before="260" w:after="90"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="38761D"/></w:rPr>
  </w:style>
</w:styles>
"""


def content_types_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>
"""


def root_rels_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>
"""


def document_rels_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"""


def core_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        f"<dc:title>{escape(TITLE)}</dc:title>"
        "</cp:coreProperties>"
    )


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types_xml())
        docx.writestr("_rels/.rels", root_rels_xml())
        docx.writestr("word/document.xml", document_xml())
        docx.writestr("word/styles.xml", styles_xml())
        docx.writestr("word/_rels/document.xml.rels", document_rels_xml())
        docx.writestr("docProps/core.xml", core_xml())
    print(OUTPUT)


if __name__ == "__main__":
    main()
