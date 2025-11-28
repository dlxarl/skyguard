## 🇵🇱 **Polska Wersja**

# Hack4Defence – Repozytorium Zespołu

Witamy w oficjalnym repozytorium zespołu biorącego udział w hackathonie **Hack4Defence**.  
To repozytorium służy jako główne miejsce przechowywania **całego kodu, dokumentacji oraz zasobów** tworzonych podczas wydarzenia.

---

## 📁 Informacje ogólne o repozytorium

- Każdy zespół posiada **dedykowane repozytorium** oraz **indywidualny Access Token**.
- Access Token służy do wykonywania operacji `push`, `pull` i zarządzania kodem.
- Tokeny są ważne **do godziny 06:00**, kiedy zostaną automatycznie wycofane.
- Wszelkie prace projektowe muszą być przechowywane w tym repozytorium.

---

## 🔀 Struktura pracy i zasady dotyczące branchy

- Głównym, ocenianym branchem jest **master**.
- Tylko zawartość znajdująca się na branchu **master** będzie brana pod uwagę podczas oceny.
- Można tworzyć dodatkowe branche (np. `feature/...`, `fix/...`, `dev`), jednak:
  - wszystkie finalne zmiany muszą zostać zmergowane do **master** przed 06:00,
  - merge requesty lub merge bezpośredni zależą od wewnętrznych ustaleń zespołu.

---

## ⏱️ Częstotliwość commitów i aktywność repozytorium

Aby umożliwić organizatorom monitorowanie postępów:

- Każdy zespół musi wykonywać **co najmniej jeden push co 2 godziny**.
- Zalecenie: push **o pełnych parzystych godzinach** (np. 20:00, 22:00, 00:00, 02:00...).
- Regularne pushowanie:
  - minimalizuje ryzyko utraty pracy,
  - dokumentuje postępy zespołu,
  - ułatwia rozwiązywanie konfliktów merge.

---

## 🛠️ Technologie i narzędzia

- Uczestnicy mogą korzystać z **dowolnych technologii, języków programowania, frameworków i narzędzi**.
- Dozwolone są rozwiązania open source oraz komercyjne (zgodnie z licencją).
- Wybór technologii pozostaje całkowicie w gestii zespołu.

---

## ⏰ Ramy czasowe Hackathonu

- Start wydarzenia: **18:00**
- Koniec wydarzenia: **06:00 (następnego dnia)**
- O godzinie **06:00 wszystkie Access Tokeny zostaną wycofane**.
- Cała praca musi być umieszczona na branchu **master** przed godziną 06:00.

---

## 🚫🤖 Zakaz używania narzędzi AI

Aby zapewnić uczciwą rywalizację oraz realizację idei hackathonu:

### **Bezwzględnie zabrania się korzystania z jakichkolwiek narzędzi opartych o AI**, w tym w szczególności:
- ChatGPT (wszystkie wersje)
- GitHub Copilot
- Perplexity
- Codeium
- Tabnine
- Google Gemini / Bard
- Jakiekolwiek inne narzędzia generujące kod lub tekst
- Botów i asystentów AI w IDE lub przeglądarce

Zespoły muszą polegać wyłącznie na **własnej wiedzy, umiejętnościach i manualnym tworzeniu kodu**.

Naruszenie tego zakazu może skutkować **karami lub dyskwalifikacją**.

---

## 🌟 Dobre praktyki – zalecenia

### Jakość kodu
- Stosuj standardy kodowania odpowiednie dla wybranego języka (PEP8, PSR-12, Google Style Guide itd.).
- Używaj czytelnych i znaczących nazw zmiennych, funkcji, klas i plików.
- Komentuj złożoną logikę.
- Dziel projekt na moduły, unikaj jednego monolitycznego pliku.

### Dobre praktyki dla repozytorium
- Twórz przejrzyste komunikaty commitów (np. „Dodano moduł logowania”, „Naprawiono błąd uwierzytelniania API”).
- Wykorzystuj `.gitignore`, aby nie umieszczać w repo plików tymczasowych, logów, artefaktów buildów itp.
- Jeśli projekt wymaga instalacji lub konfiguracji, dodaj instrukcję uruchamiania (README lub `INSTALL.md`).

### Praca zespołowa
- Podziel role wewnątrz zespołu (backend, frontend, testy, dokumentacja itp.).
- Komunikuj problemy na bieżąco — hackathon to szybkie środowisko pracy.
- Ustal workflow Gita (np. dev → master, feature branches).

### Dobre praktyki techniczne
- Waliduj dane wejściowe.
- Obsługuj błędy i sytuacje wyjątkowe.
- Jeśli tworzycie API — dodajcie chociaż podstawową dokumentację (OpenAPI/Swagger lub opis w Markdown).
- Rozważcie dodanie logowania, jeśli ma to znaczenie dla projektu.

---

## 📞 Kontakt z organizatorami

W przypadku problemów technicznych (repozytoria, dostęp, tokeny), prosimy o kontakt poprzez oficjalne kanały komunikacyjne hackathonu **Hack4Defence**.

---

**Powodzenia i świetnej zabawy! 🚀**  
Niech wygra najlepszy projekt!


## 🇬🇧 **English Version**

# Hack4Defence – Team Repository

Welcome to the official repository for your team participating in the **Hack4Defence Hackathon**.  
This repository serves as the main storage for **all code, documentation, and project resources** created during the event.

---

## 📁 General Repository Information

- Each team receives a **dedicated repository** and an **individual Access Token**.
- Use your Access Token to perform `push`, `pull`, and manage your code.
- All Access Tokens are valid **until 06:00**, when they will be automatically revoked.
- All project work, results, and final code must be stored exclusively in this repository.

---

## 🔀 Branch Structure and Rules

- The main branch for evaluation is **master**.
- Only the content located in the **master** branch will be assessed by the organizers.
- You may create additional branches (e.g., `feature/...`, `fix/...`, `dev`), but:
  - all final changes must be merged into **master** before 06:00,
  - use merge requests or direct merges depending on team workflow.

---

## ⏱️ Commit Frequency and Repository Activity

To help organizers track progress:

- Each team must perform **at least one push every 2 hours**.
- Recommended practice: push **at every second full hour** (e.g., 20:00, 22:00, 00:00, 02:00...).
- Regular pushing:
  - reduces the risk of losing work,
  - helps document team progress,
  - makes it easier to handle merge conflicts.

---

## 🛠️ Technologies and Tools

- You are free to use **any technology, programming language, framework, or tool**.
- Both open-source and commercial tools are allowed, as long as licensing is respected.
- Technology selection is entirely up to your team.

---

## ⏰ Hackathon Timeline

- Hackathon start: **18:00**
- Hackathon end: **06:00 (next day)**
- At **06:00**, all Access Tokens will be revoked.
- All final work must be pushed to the **master** branch before 06:00.

---

## 🚫🤖 Prohibited Tools – No AI Usage Allowed

To ensure fairness and maintain the intended challenge level:

### **The use of AI-based tools is strictly prohibited**, including but not limited to:
- ChatGPT (all versions)
- GitHub Copilot
- Perplexity
- Codeium
- Tabnine
- Google Gemini / Bard
- Any other code-generation or text-generation AI
- Automated bot assistance inside IDEs or browsers

Teams must rely solely on their **knowledge, skills, and manual coding abilities**.

Violation of this rule may result in **penalties or disqualification**.

---

## 🌟 Best Practices – Technical and Organizational Guidelines

### Code Quality
- Follow language-specific style guides (PEP8, PSR-12, Google Style Guide, etc.).
- Use clear and meaningful names for variables, functions, and modules.
- Comment complex logic when needed.
- Split the code base into logical modules — avoid monolithic files.

### Repository Good Practices
- Write clean commit messages (e.g., “Add login module”, “Fix API authentication bug”).
- Use `.gitignore` to exclude temporary files, logs, and build artifacts.
- Provide installation or run instructions if needed (README section or `INSTALL.md`).

### Teamwork Practices
- Assign internal roles (backend, frontend, documentation, testing, etc.).
- Communicate frequently — this is a fast-paced event.
- Agree on Git workflow rules (e.g., dev → master, feature branches).

### Technical Good Practices
- Validate input data.
- Handle errors properly.
- If building an API, include minimal documentation (OpenAPI/Swagger or Markdown).
- Add logging if relevant and helpful.

---

## 📞 Contact with Organizers

For repository or access issues, please contact the organizers through the official **Hack4Defence** communication channels.

---

**Good luck and have fun! 🚀**  
May the best project win!