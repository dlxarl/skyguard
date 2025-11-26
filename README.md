# Hack4Defence – Repozytorium Zespołu

Witamy w oficjalnym repozytorium zespołu biorącego udział w hackathonie **Hack4Defence**.  
To repozytorium służy jako główne miejsce przechowywania **całego kodu, dokumentacji oraz zasobów** związanych z projektem realizowanym podczas wydarzenia.

---

## 1. Informacje ogólne o repozytorium

- Każdy zespół posiada **dedykowane repozytorium** oraz **indywidualny Access Token**.
- Access Token służy do wykonywania operacji `push`, `pull` oraz zarządzania kodem.
- Tokeny są ważne **do godziny 06:00**, kiedy zostaną automatycznie wycofane.
- Cała praca projektowa powinna być przechowywana wyłącznie w tym repozytorium.

---

## 2. Struktura pracy i zasady dotyczące branchy

- Głównym branchem jest **master**.
- Tylko kod znajdujący się w branchu **master** będzie oceniany przez organizatorów.
- Możesz tworzyć dodatkowe branche (np. `feature/...`, `fix/...`, `dev`), ale:
  - wszystkie finalne zmiany muszą znaleźć się w **master** przed godziną 06:00,
  - rekomendowane jest używanie merge requestów lub merge bezpośredni, zgodnie z ustaleniami w zespole.

---

## 3. Częstotliwość commitów i aktywność repozytorium

Aby umożliwić organizatorom monitorowanie postępów:

- Zespół powinien wykonywać **co najmniej jeden push na godzinę**.
- Rekomendacja: wykonywać push **o pełnej godzinie** (np. 19:00, 20:00, 21:00...).
- Regularne commitowanie i pushowanie:
  - redukuje ryzyko utraty pracy,
  - ułatwia śledzenie progresu,
  - pomaga w rozwiązywaniu konfliktów.

---

## 4. Technologie i narzędzia

- Dozwolone są **dowolne technologie, języki programowania, frameworki oraz narzędzia**.
- Można używać zarówno narzędzi open source jak i komercyjnych.
- Wybór technologii należy całkowicie do zespołu.

---

## 5. Ramy czasowe Hackathonu

- Start wydarzenia: **18:00**.
- Zakończenie: **06:00 (następnego dnia)**.
- O godzinie **06:00 wszystkie Access Tokeny zostaną wycofane**.
- Cała praca musi znajdować się na branchu **master** przed tą godziną.

---

## 6. Dobre praktyki – zalecenia techniczne i organizacyjne

### Praktyki dotyczące kodu
- Pisz kod zgodnie z przyjętymi standardami (PEP8, PSR-12, Google Style Guide, itp.).
- Używaj czytelnych nazw zmiennych, funkcji oraz modułów.
- Komentuj złożone fragmenty kodu.
- Dziel projekt na logiczne komponenty — unikaj umieszczania wszystkiego w jednym pliku.

### Praktyki dotyczące repozytorium
- Twórz czytelne komunikaty commitów (np. „Add authentication module”, „Fix API bug”).
- Korzystaj z `.gitignore`, by nie umieszczać w repo plików tymczasowych, bibliotek, logów itp.
- Jeśli projekt wymaga instalacji lub konfiguracji – dodaj instrukcję uruchomienia (np. plik `INSTALL.md` lub sekcja w README).

### Praca zespołowa
- Ustal role (backend, frontend, integracja, dokumentacja).
- Komunikuj problemy na bieżąco — hackathon to szybki sprint.
- Ustal wewnętrzny workflow Git (np. dev → master, feature branches).

### Dobre praktyki techniczne
- Waliduj dane wejściowe.
- Obsługuj błędy i nie zakładaj idealnych warunków.
- Jeżeli tworzycie API — przygotujcie chociaż podstawową dokumentację (np. OpenAPI / Swagger w formie YAML/JSON lub opis w markdown).

---

## 7. Kontakt z organizatorami

W razie problemów technicznych (repozytoria, dostęp, tokeny), prosimy o kontakt poprzez oficjalne kanały komunikacyjne hackathonu **Hack4Defence**.

---

**Powodzenia i dobrej zabawy! 🚀**  
Niech wygra najlepszy projekt!

## English version

# Hack4Defence – Team Repository

Welcome to the official repository for your team participating in the **Hack4Defence Hackathon**.  
This repository serves as the main storage for **all code, documentation, and project resources** created during the event.

---

## 1. General Repository Information

- Each team receives a **dedicated repository** and an **individual Access Token**.
- Use your Access Token to perform `push`, `pull`, and manage the code within this repository.
- All Access Tokens are valid **until 06:00**, at which point they will be automatically revoked.
- All project work, results, and final code must be stored exclusively in this repository.

---

## 2. Branch Structure and Rules

- The main branch for evaluation is **master**.
- Only the content located in the **master** branch will be assessed by the organizers.
- You may create additional branches (e.g., `feature/...`, `fix/...`, `dev`), but:
  - all final changes must be merged into **master** before 06:00,
  - use merge requests or direct merges, depending on the team's workflow.

---

## 3. Commit Frequency and Repository Activity

To allow organizers to monitor progress:

- Each team must perform **at least one push per hour**.
- Recommended practice: push **at the full hour** (e.g., 19:00, 20:00, 21:00...).
- Regular commits and pushes:
  - reduce the risk of losing work,
  - help track progress,
  - simplify conflict resolution.

---

## 4. Technologies and Tools

- You are free to use **any technology, programming language, framework, or tool**.
- Both open-source and commercial tools are allowed, as long as licensing conditions are respected.
- Technology choice is entirely up to your team.

---

## 5. Hackathon Timeline

- Hackathon start: **18:00**  
- Hackathon end: **06:00 (next day)**  
- At **06:00**, all Access Tokens will be revoked.
- All final work must be present in the **master** branch before 06:00.

---

## 6. Best Practices – Technical and Organizational Guidelines

### Code Quality Practices
- Follow language-specific style guides (PEP8, PSR-12, Google Style Guide, etc.).
- Use meaningful and readable names for variables, functions, classes, and files.
- Comment complex or non-obvious parts of the code.
- Split your project into logical modules — avoid placing everything in a single file.

### Repository Practices
- Write clear and concise commit messages (e.g., “Add authentication module”, “Fix API error”).
- Use `.gitignore` to exclude unnecessary files such as temporary data, logs, binaries, or dependencies.
- If your project requires installation or configuration steps, add an `INSTALL.md` file or an “Installation / Run Guide” section in this README.

### Teamwork Practices
- Assign roles within the team (backend, frontend, integration, documentation, etc.).
- Communicate actively — a hackathon is a sprint.
- Define an internal Git workflow (e.g., dev → master, feature branches).

### Technical Good Practices
- Validate all input data.
- Handle errors and unexpected cases gracefully.
- If building an API, provide minimal documentation (OpenAPI/Swagger YAML/JSON or a markdown description).
- Consider adding basic logging if relevant to your project.

---

## 7. Contact with Organizers

If you encounter technical issues (repository access, token problems, etc.), please contact the organizers through the official Hack4Defence communication channels.

---

**Good luck and have fun! 🚀**  
May the best project win!