# Hero-Animation und Bild-Assets

## Was umgesetzt ist

Die Hero-Szene (`src/components/hero/HeroScene.tsx`) arbeitet mit der Fotografie aus der Designvorlage
(`src/assets/images/hero-scene.webp`, Ausschnitt 647 × 483 px). Auf das Smartphone-Display wird eine
Kamera-Oberfläche projiziert – geometrisch exakt über eine affine Matrix, die aus den vermessenen
Displayecken berechnet ist. Das Kamerabild ist **derselbe Bildausschnitt des Fahrzeugschadens** wie im
Hintergrund; dadurch zeigt das aufgenommene Foto zwangsläufig exakt denselben Schaden.

Ablauf (ca. 7,5 s, Endlosschleife, startet nach dem Seitenaufbau, pausiert außerhalb des Sichtbereichs):

1. Kamerabild schwenkt vom Scheinwerfer auf den Schaden, die Szene rückt minimal näher; leichtes
   Freihand-Wackeln (CSS-Compositor-Animation).
2. Autofokus sucht (Unschärfe 7 px → 2 px → 3,5 px → scharf).
3. Fokusrahmen springt auf und bestätigt mit kurzem Blinken.
4. Auslöser wird gedrückt (Druckanimation exakt über dem Auslöser im Foto).
5. Blitz: Display blitzt weiß, gleichzeitig wird die **reale Fahrzeugoberfläche** am Schaden aufgehellt
   (aufgehellte Kopie derselben Fotografie, weich maskiert) – kein künstlicher Lichtfleck.
6. Das Foto friert ein, schrumpft in die Fotoansicht mit Hinweis „Foto aufgenommen“, die
   Galerie-Vorschau links neben dem Auslöser erscheint.
7. Nach kurzer Pause zurück zum Live-Bild.

Bei `prefers-reduced-motion: reduce` wird ohne Bewegung direkt der Endzustand (Foto auf dem Display)
gezeigt; GSAP wird dann gar nicht geladen.

## Was fehlt – ausdrücklich

**Schritt 1 der Vorgabe („Die Hand mit dem Smartphone bewegt sich dezent zum Schadenbereich“) ist mit dem
vorhandenen Material nicht fotorealistisch umsetzbar.** Hand und Smartphone sind fest in das Standbild
eingebrannt. Sie freizustellen und zu verschieben würde Löcher im Hintergrund erzeugen; eine
„nachgebaute“ Hand wäre die minderwertige Ersatzanimation, die ausgeschlossen wurde.

Außerdem ist die Vorlage nur 1182 px breit: Der Hero-Ausschnitt (647 px) wird auf großen Bildschirmen
auf bis zu ~1100 px hochskaliert und wirkt auf Retina-Displays weich. Gleiches gilt für das Foto im
Abschnitt „Warum Dekic?“ (578 px).

## Benötigte Assets (eine der beiden Varianten)

### Variante A – Video (empfohlen, höchste Wirkung)

- Professionell gedrehtes oder hochwertig generiertes Video der kompletten Sequenz: Hand führt das
  Smartphone zum Schaden, Fokus, Auslösen mit Blitz.
- 3840 × 2160 (mind. 2560 × 1440), 25/30 fps, 6–8 s, **nahtlos loopbar**, ohne Ton,
  ruhiger linker Bereich für den Text (wie in der Vorlage).
- Das Smartphone-Display im Video **leer bzw. als Grünfläche/Tracking-Marker** – die Kamera-Oberfläche
  und das aufgenommene Schadenfoto werden dann wie heute per Code passgenau darübergelegt
  (Displayecken je Frame als Tracking-Daten, z. B. JSON aus After Effects/Nuke).
- Auslieferung: H.264/MP4 + AV1/WebM, Posterbild (erstes Frame) als AVIF/WebP.

### Variante B – Ebenen-Fotos

- Fahrzeug mit Schaden **ohne Hand** als Hintergrund, mind. 3000 px breit.
- Hand + Smartphone **freigestellt** (PNG/WebP mit Alpha), gleiche Lichtsituation und Perspektive,
  Display leer.
- Optional: Nahaufnahme des Schadens in hoher Auflösung für das Kamerabild.

Mit Variante B kann die vorhandene Animation um die Handbewegung (leichte Translation/Rotation mit
Bewegungsunschärfe) erweitert werden, ohne dass sich der Hintergrund verändert.

### Weitere Bilder

- Foto „Sachverständiger mit Tablet“ in hoher Auflösung (mind. 2000 px breit).
- Freigegebenes Logo als Vektordatei (SVG/AI/PDF). Das aktuelle SVG-Logo ist aus der Vorlage
  nachgezeichnet und sollte mit dem Original abgeglichen werden.
- Optional: Porträt/Team-Fotos für „Über uns“.

Alle Bilder nur mit nachgewiesenen Nutzungsrechten (Fotograf/Bildagentur/KI-Lizenzbedingungen) –
das Repository ist öffentlich.
