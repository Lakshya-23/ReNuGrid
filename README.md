# RenuGrid

---
## ✨ Features

-   **Real-time Dashboard:** Instantly view live data from your energy system.
-   **Core Metrics:** Monitor essential stats at a glance:
    -   Bus Voltage (V)
    -   Current Flow (A)
    -   Power Output (W)
    -   System Status (e.g., Consuming)
-   **Modern Dual-Axis Chart:** Visualize Power (W) and Current (A) trends simultaneously on a single, clean graph with gradient fills.
-   **Adaptive Theme:** Seamlessly switch between a beautiful Light and Dark mode using React Context.
-   **Cross-Platform:** Built with Expo to run natively on both iOS and Android from a single codebase.
-   **Animated Splash Screen:** A smooth, animated entry into the application for a professional feel.
-   **Modular & Scalable:** Built with reusable components for easy maintenance and future expansion.

## 🛠️ Tech Stack & Tooling

This project is built using a modern, robust, and scalable mobile development stack.

### **Core Framework & Language**
-   **[React Native](https://reactnative.dev/)**: A JavaScript framework for writing real, natively rendering mobile applications for iOS and Android.
-   **[Expo (SDK 50)](https://expo.dev/)**: A framework and platform for universal React applications. It provides a managed workflow, abstracting away the complexities of native development.
-   **[TypeScript](https://www.typescriptlang.org/)**: A strongly typed superset of JavaScript that adds static types, improving code quality and maintainability.
-   **[NextJs](https://nextjs.org/)**: The core library for building user interfaces with a component-based architecture.
-   **[Arduino](https://www.arduino.cc/)**: For building and controlling electronic projects.

### **UI & Styling**
-   **[Styled Components](https://styled-components.com/)**: A popular CSS-in-JS library that enables component-level styling with the full power of JavaScript.
-   **[React Navigation](https://reactnavigation.org/)**: The de-facto standard for routing and navigation in React Native applications, used here for the stack navigator.
-   **[Expo Vector Icons](https://docs.expo.dev/guides/icons/)**: Provides access to a rich library of icons (Feather, MaterialCommunityIcons, etc.) for a clean UI.

### **Animation & Visualization**
-   **[Moti](https://moti.fyi/)**: A powerful and declarative animation library for React Native, built on top of Reanimated 2. Used for micro-animations and the splash screen.
-   **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)**: The underlying animation engine that enables high-performance, 60 FPS animations on the native UI thread.
-   **[React Native SVG Charts](https://github.com/JesperLekland/react-native-svg-charts)**: A library for creating beautiful and interactive charts and graphs.
-   **[React Native SVG](https://github.com/react-native-svg/react-native-svg)**: Provides SVG support to React Native, a necessary dependency for the charting library.

### **Development Environment & Tooling**
-   **[Node.js](https://nodejs.org/)**: The JavaScript runtime environment used to execute the development server.
-   **[NPM](https://www.npmjs.com/)**: The default package manager for Node.js, used for managing project dependencies.
-   **[Metro Bundler](https://metrobundler.dev/)**: The JavaScript bundler used by React Native to compile code and assets into a single bundle for the app to run.
-   **[Expo Go](https://expo.dev/client)**: A client app for iOS and Android that allows for rapid development and testing without needing to build a native binary.
-   **[ESLint](https://eslint.org/)**: A pluggable and configurable linter tool to find and fix problems in JavaScript and TypeScript code, ensuring code quality and consistency.
-   **[Babel](https://babeljs.io/)**: A JavaScript compiler used to transform modern JavaScript (ES6+) and JSX into code that can run in older environments.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [Git](https://git-scm.com/)
-   [Expo Go](https://expo.dev/client) app on your iOS or Android device.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Lakshya-23/ReNuGrid.git
    cd ReNuGrid
    ```

2.  **Install dependencies:**
    This project uses npm. Run the following command to install all the necessary packages.
    ```bash
    npm install
    ```

3.  **Run the application:**
    Start the Metro development server.
    ```bash
    npx expo start
    ```
    This will open a new tab in your web browser with a QR code.

4.  **Open on your device:**
    -   Open the Expo Go app on your phone.
    -   Scan the QR code from the terminal or the browser.
    -   The RenuGrid app will build and launch on your device.

## 🗺️ Roadmap & Future Plans

RenuGrid is an evolving project. Here are some features planned for the future:

-   [ ] **ThingSpeak Integration:** Replace mock data with live data from a ThingSpeak Cloud API.
-   [ ] **Notifications & Alerts:** Implement push notifications for critical events (e.g., low battery, high power usage).
-   [ ] **Historical Data:** Add a new screen to view historical data with date range selectors.
-   [ ] **User Authentication:** Secure the dashboard with a login system.
-   [ ] **Settings Screen:** Allow users to configure API keys, notification preferences, etc.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to add new features, please feel free to:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
