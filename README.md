# 🎨 FakeTube – Viral Video Simulator

[www.fake-tube.com](https://www.fake-tube.com)

FakeTube is a fun and interactive YouTube viral simulator. Upload any video and watch it rack up fake views, likes, comments, and subscribers with real-time analytics and adjustable growth rates.

---

## 🚀 Features

- 📥 Upload your own video.
- 📈 Real-time counters: views, likes, subs, comments.
- 💬 Simulated live comment feed.
- 📊 Animated analytics graph tracking growth over time.
- ⏸️ Pause and resume the simulation.
- 🎛️ Individual controls for adjusting growth speeds.

---

## 🛠️ Getting Started

### Clone the Repository

```bash
git clone https://github.com/Hardwipe/yt-viral-sim.git
cd yt-viral-sim
```

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

---

## 🧪 Running Tests

FakeTube uses **Vitest + React Testing Library** for unit testing and coverage.

### Run Tests (Watch Mode)

```bash
npm run test
```

### Run Tests Once

```bash
npm run test:run
```

### Generate Coverage Report

```bash
npm run coverage
```

---

## 📊 Coverage Report

After running coverage:

- A `coverage/` folder will be generated
- Open the report locally:

```bash
open coverage/index.html
```

This provides a full interactive breakdown of:
- Statements
- Branches
- Functions
- Lines

---

## ⚙️ CI / GitHub Actions

Tests and coverage automatically run on:

- Push to `main`
- Pull requests into `main`

The pipeline:
- Installs dependencies
- Builds the project
- Runs coverage tests
- Uploads the coverage report as an artifact

### Viewing Coverage from CI

1. Go to **GitHub → Actions**
2. Click a workflow run
3. Scroll to **Artifacts**
4. Download `coverage-report`
5. Open `index.html`

---

## 👥 Contributing

We welcome contributions! Here’s how to help:

1. **Fork the repository.**
2. **Create a new branch** for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit:

   ```bash
   git commit -m "Add feature: [your description]"
   ```

4. **Push to your branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** describing your change.

---

## 🧠 Development Notes

- Tests are located alongside components (e.g. `Component.test.jsx`)
- Mocking is used for isolated testing of UI logic
- Timers are controlled via `vi.useFakeTimers()` for deterministic simulations

---

## 📄 License

MIT License.

---

## ❤️ Support the Project

If you enjoy using FakeTube, please consider donating via the button on the site to support future development!

---

*FakeTube is a satirical project and not affiliated with YouTube or Google.*