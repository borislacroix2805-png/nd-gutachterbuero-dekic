# Hero-Animation und Bild-Assets

## Was umgesetzt ist

Die Hero-Szene (`src/components/hero/HeroScene.tsx`) arbeitet mit der Fotografie aus der Designvorlage
(`src/assets/images/hero-scene.webp`, Ausschnitt 647 × 483 px). Auf das Smartphone-Display wird eine
Kamera-Oberfläche projiziert – geometrisch exakt über eine affine Matrix, die aus den vermessenen
Displayecken berechnet ist. Das Kamerabild ist **derselbe Bildausschnitt des Fahrzeugschadens** wie im
Hintergrund; dadurch zeigt das aufgenommene Foto zwangsläufig exakt denselben Schaden.

Ablauf (ca. 2,8 s): startet beim ersten Aufruf, sobald ca. 60 % der Szene sichtbar sind. Das fertige Foto
bleibt stehen. Erst wenn die Szene den Sichtbereich vollständig verlassen hat, wird sie zurückgesetzt und
beim Zurückscrollen (wieder ca. 60 % sichtbar) komplett neu abgespielt; kleine Scrollbewegungen lösen nichts aus
(IntersectionObserver).

1. Livebild minimal unscharf (2,5 px); der Fokusrahmen erscheint mittig über dem Rissbild.
2. Die Kamera stellt in 0,5 s scharf, der Fokusrahmen bestätigt mit kurzem Blinken.
3. Der Auslöser wird sichtbar aktiviert (Scheibe drückt sich ein und dunkelt kurz ab); der Finger bleibt unbewegt.
4. Zeitgleich kräftiger LED-Blitz von ca. 190 ms (schnell an, kurz gehalten, weich abklingend): Scheinwerfer,
   beschädigter Kotflügel und Lackfläche werden kaltweiß aufgehellt (aufgehellte Kopie derselben Fotografie,
   weich maskiert), dazu Glanzlichter auf Scheinwerferglas, Chromleiste, Kotflügelkante und im Zentrum des
   Rissbilds. Hand und Smartphone bleiben unbeleuchtet, keine Vollbild-Überblendung, kein Lichtkegel.
   Das Display blinkt kurz dunkel wie in echten Kamera-Apps.
5. Das aufgenommene Foto ersetzt das Livebild – gleicher Bildausschnitt, gleiche Displaymaske, ohne Sprung.
   Danach erscheint nur die Galerie-Vorschau – keine Texteinblendung; das fertige Schadenfoto bleibt stehen.

Bildausschnitt im Display: Szene x 451–605, y 264–476 (Seitenverhältnis des Displays). Das Zentrum des
Rissbilds (Bildpunkt 528 | 370) liegt exakt in der Displaymitte; das Bild deckt das Display vollständig ab.
Perspektive: Das Kamerabild wird per Homographie auf die vier gemessenen Innenecken des Kamerabereichs
abgebildet (oben links 168.8 | 99.6, oben rechts 318.9 | 122.1, unten rechts 285.4 | 336.3, unten links
126.4 | 311.1 in Bildpixeln) – die Bildränder laufen parallel zu den Displaykanten, ohne Überstand.

**Fahrzeug, Hintergrund, Hand und Smartphone werden nie bewegt, gezoomt oder skaliert.** Die E2E-Tests prüfen
in Chromium und WebKit: Hintergrund pixelgleich vor/nach der Animation; Blitz-Frame (eingefroren) hellt
Kotflügel/Scheinwerfer um mindestens 25 % auf; Display-Ecken auf ±1 Bildpixel an den vermessenen Innenecken; keine Texteinblendung; Foto und Livebild deckungsgleich;
Schadenszentrum und Fokusrahmen mittig (±2 %); Bild deckt das Display ab; Neustart nur nach vollständigem
Verlassen und Zurückscrollen.
Die Phasen stehen als `data-phase` am Element `.hero-scene` (bereit, start, fokus, scharf, ausloesen, foto, fertig).

Bei `prefers-reduced-motion: reduce` wird ohne Bewegung direkt der Endzustand (Foto auf dem Display)
gezeigt; GSAP wird dann gar nicht geladen.

## Was fehlt – ausdrücklich

**Ausrichten des Smartphones und der Fingerdruck auf den Auslöser sind mit dem vorhandenen Material nicht
fotorealistisch umsetzbar** und wurden deshalb bewusst nicht animiert:

- Hand und Smartphone sind fest in das Standbild eingebrannt (geprüft: es gibt nur diese eine Fotografie,
  keine Ebenen). Freistellen und Verschieben würde hinter Hand und Smartphone Löcher bzw. eine doppelte
  Handkontur freilegen – rund ein Drittel der Szene müsste rekonstruiert werden.
- Der rechte Daumen liegt im Foto unterhalb und rechts neben dem Smartphone, **nicht am Auslöser**. Ein
  Fingerdruck verlangt eine andere Fingerhaltung – das geht nur mit neuem Material, nicht durch Verzerren.
- Eine per CSS bewegte eingebrannte Hand oder eine nachgebaute Hand wäre die ausgeschlossene
  minderwertige Ersatzanimation.

Außerdem ist die Vorlage nur 1182 px breit: Der Hero-Ausschnitt (647 px) wird auf großen Bildschirmen
auf bis zu ~1100 px hochskaliert und wirkt auf Retina-Displays weich. Gleiches gilt für das Foto im
Abschnitt „Warum Dekic?“ (578 px).

## Benötigte Assets (eine der beiden Varianten)

### Variante A – Video (empfohlen, höchste Wirkung)

- Professionell gedrehtes oder hochwertig generiertes Video der Sequenz: Hand richtet das Smartphone
  minimal auf den Schaden aus, kommt zur Ruhe, Daumen tippt auf den Auslöser, Blitz.
- **Kamera auf Stativ, Fahrzeug und Hintergrund absolut unbewegt** (nur Hand und Smartphone bewegen sich);
  Kameraposition und Licht wie in der Vorlage.
- 3840 × 2160 (mind. 2560 × 1440), 25/30 fps, 4–6 s, endet auf einem ruhigen Standbild (kein Loop nötig),
  ohne Ton, ruhiger linker Bereich für den Text (wie in der Vorlage).
- Bei Drehung mit echtem Blitz: zweiter Take ohne Blitz, damit der Lichtimpuls exakt auf 100–150 ms
  getimt werden kann.
- Das Smartphone-Display im Video **leer bzw. als Grünfläche/Tracking-Marker** – die Kamera-Oberfläche
  und das aufgenommene Schadenfoto werden dann wie heute per Code passgenau darübergelegt
  (Displayecken je Frame als Tracking-Daten, z. B. JSON aus After Effects/Nuke).
- Auslieferung: H.264/MP4 + AV1/WebM, Posterbild (erstes Frame) als AVIF/WebP.

### Variante B – Ebenen-Fotos

- Fahrzeug mit Schaden **ohne Hand** als Hintergrund, mind. 3000 px breit.
- Hand + Smartphone **freigestellt** (PNG/WebP mit Alpha), gleiche Lichtsituation und Perspektive,
  Display leer.
- Für den Fingerdruck zusätzlich: Hand in zwei Haltungen (Daumen über dem Auslöser / Daumen auf dem
  Auslöser) oder eine kurze freigestellte Videosequenz der Daumenbewegung mit Alpha-Kanal
  (WebM/VP9 bzw. HEVC mit Alpha für Safari).
- Optional: Nahaufnahme des Schadens in hoher Auflösung für das Kamerabild.

Mit Variante B kann die vorhandene Animation um die Handbewegung (wenige Pixel Translation, ca. 1–2°
Neigung, langsames Ausschwingen, danach Stillstand) erweitert werden, ohne dass sich der Hintergrund
verändert. Die Kamera-Oberfläche wandert dann als Kind-Ebene mit dem Smartphone mit.

Ein KI-Bildwerkzeug (Inpainting) könnte den Hintergrund ohne Hand rekonstruieren. Das ist kostenpflichtig,
braucht geklärte Nutzungsrechte und muss visuell abgenommen werden – nur nach Freigabe.

### Weitere Bilder

- Foto „Sachverständiger mit Tablet“ in hoher Auflösung (mind. 2000 px breit).
- Freigegebenes Logo als Vektordatei (SVG/AI/PDF). Das aktuelle SVG-Logo ist aus der Vorlage
  nachgezeichnet und sollte mit dem Original abgeglichen werden.
- Optional: Porträt/Team-Fotos für „Über uns“.

Alle Bilder nur mit nachgewiesenen Nutzungsrechten (Fotograf/Bildagentur/KI-Lizenzbedingungen) –
das Repository ist öffentlich.
