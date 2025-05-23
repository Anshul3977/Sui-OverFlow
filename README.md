# SuiSports Legends 🏏⚡

![SuiSports Legends Banner](https://via.placeholder.com/1200x400.png?text=SuiSports+Legends)  
**A Decentralized Fantasy Sports Platform on the Sui Blockchain**

---

## 📝 Project Overview

**SuiSports Legends** is a decentralized fantasy sports platform built on the Sui blockchain, designed to bring the excitement of fantasy cricket into the Web3 ecosystem. The platform enables users to collect cricket player NFTs, build competitive teams, join weekly leagues, trade in a marketplace, stake assets, track performance on leaderboards, and manage personalized profiles—all while leveraging the security, speed, and scalability of the Sui blockchain.

SuiSports Legends combines the thrill of fantasy sports with the benefits of blockchain technology, ensuring transparent ownership of digital assets (NFTs), secure transactions, and a decentralized user experience. Whether you're a cricket enthusiast, a blockchain developer, or a casual gamer, this platform offers an engaging and innovative way to interact with fantasy sports in a decentralized environment.

---

## ✨ Key Features

- **Dashboard**: Provides an overview of user stats, including wallet balance, number of NFTs owned, active leagues, and recent activities.
- **My Collection**: Displays a gallery of player NFTs with details like name, team, position, rarity, stats, and images, with options to stake or unstake for league participation.
- **Team Builder**: Allows users to create teams by selecting up to 5 players from their collection, enabling strategic team composition for league competitions.
- **Weekly Leagues**: Users can join active or upcoming leagues, compete for SUI-based prize pools, and track league status (active, ended, or upcoming).
- **Marketplace**: A dynamic marketplace to buy and sell player NFTs using SUI tokens, featuring advanced filtering (by position, rarity) and sorting (by price, rarity).
- **Staking**: Stake NFTs to make them eligible for league participation, with restrictions on unstaking during active leagues to ensure fairness.
- **Leaderboard**: Displays real-time rankings of users based on their team performance in active leagues, fostering competition.
- **Profile**: A comprehensive user profile showcasing stats (total SUI won, leagues joined, NFTs owned), team details, rewards history, and a "Share on X" feature for social engagement.

---

## 🛠️ Tech Stack

### Frontend
- **React**: For building a dynamic, component-based user interface.
- **TypeScript**: Ensures type safety and improves code maintainability.
- **Tailwind CSS**: For rapid, responsive styling with a utility-first approach.
- **Framer Motion**: Adds smooth animations to enhance the user experience (e.g., card transitions, confetti effects).
- **Lucide Icons**: Provides a lightweight, modern icon set for UI elements.
- **React-Confetti**: Adds celebratory effects for rewarding user actions (e.g., claiming rewards).

### Backend
- **Node.js & Express.js**: A lightweight server to handle API requests and manage state in demo mode.
- **CORS**: Enables cross-origin requests between the frontend and backend.

### Blockchain
- **Sui Blockchain (Testnet)**: Powers NFT transactions, staking, and league entries with fast, low-cost operations.
- **@mysten/sui.js**: Official Sui JavaScript SDK for interacting with the blockchain (e.g., fetching balances, executing transactions).
- **@mysten/wallet-kit**: Simplifies wallet connection and transaction signing for users.

### Development Tools
- **Vite**: Used as the build tool for the frontend, offering fast development and hot module replacement.
- **ESLint & Prettier**: Enforce code quality and consistent formatting across the project.

---

## 🏗️ Architecture

SuiSports Legends follows a client-server architecture with a clear separation of concerns:

1. **Frontend (Client)**:
   - Built with React and TypeScript, hosted on `http://localhost:5173` by default.
   - Handles UI rendering, user interactions, and API calls to the backend.
   - Integrates with the Sui Wallet Kit for wallet connection and transaction signing.
   - Uses Tailwind CSS for styling and Framer Motion for animations to provide a polished user experience.

2. **Backend (Server)**:
   - Built with Node.js and Express, running on `http://localhost:3000` by default.
   - Provides RESTful API endpoints for fetching marketplace listings, user data, NFTs, and handling mock transactions (e.g., league joining, NFT purchases).
   - Maintains a mock in-memory database (`userData` and `marketplaceListings`) to simulate blockchain state in demo mode, with infrastructure in place for full on-chain integration.

3. **Blockchain (Sui Testnet)**:
   - Used for real wallet balance fetching and transaction execution (e.g., NFT purchases, staking fees).
   - In demo mode, most blockchain interactions are mocked to simplify testing, but the project is designed to support full on-chain functionality with a marketplace smart contract.

---

## 📥 Setup Instructions

### Prerequisites
- **Node.js**: Version 16 or higher.
- **npm**: Package manager (yarn can also be used).
- **Sui Wallet**: Install the Sui Wallet Chrome extension or another compatible wallet.
- **Sui Testnet Access**: Obtain test SUI tokens from the Sui Testnet faucet (e.g., via the Sui Wallet or Discord faucet bot).
- **Git**: For cloning the repository.

### Installation Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Anshul3977/suisports-legends.git
   cd suisports-legends
   ```

2. **Install Frontend Dependencies**:
   - Navigate to the `client` directory and install dependencies.
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**:
   - Navigate to the `server` directory and install dependencies.
   ```bash
   cd ../server
   npm install
   ```

4. **Run the Backend Server**:
   - Start the Express server to handle API requests.
   ```bash
   node server.js
   ```
   - The server will be accessible at `http://localhost:3000`.

5. **Run the Frontend**:
   - Start the React app in the `client` directory.
   ```bash
   cd ../client
   npm run dev
   ```
   - The app will be accessible at `http://localhost:5173`.

6. **Connect Wallet**:
   - Open the app in your browser (`http://localhost:5173`).
   - Click "Connect Wallet" in the top-right corner and connect your Sui Wallet.
   - Ensure your wallet has test SUI tokens (minimum ~10 SUI recommended for a full experience).

---

## 🖥️ Usage Guide

To get started with *SuiSports Legends*, follow this step-by-step guide:

1. **Dashboard** (`/`):
   - View your wallet balance, number of NFTs owned, active leagues, and recent activities.
   - Explore trending leagues like "Champions League T20" with a 150 SUI prize pool.

2. **My Collection** (`/my-collection`):
   - Browse your NFT collection, including players like MS Dhoni, Ben Stokes, and Shreyas Iyer with updated images.
   - Stake an NFT (e.g., Ravindra Jadeja) for a 0.05 SUI fee to make it eligible for leagues.

3. **Team Builder** (`/team-builder`):
   - Build a team by selecting 5 players from your collection (e.g., Rohit Sharma, MS Dhoni, Jasprit Bumrah, Shubman Gill, Ravindra Jadeja).
   - Submit the team to prepare for league participation.

4. **Weekly Leagues** (`/leagues`):
   - Join an active league like "T20 Blast Weekly" (entry fee: 0.8 SUI, 45/100 participants).
   - Upon joining, you’ll see a confirmation: "You have joined T20 Blast Weekly! Your team is now competing in this league. Entry fee of 0.8 SUI has been deducted."

5. **Marketplace** (`/marketplace`):
   - Filter by position (e.g., "All-rounder") to find Ben Stokes (12.8 SUI).
   - Purchase an NFT (e.g., Shreyas Iyer for 5 SUI) and see it added to your collection.

6. **Staking** (`/staking`):
   - Stake another NFT (e.g., Rishabh Pant) to make it eligible for leagues.
   - Attempt to unstake an NFT in an active league to understand the restrictions.

7. **Leaderboard** (`/leaderboard`):
   - Check your ranking in "T20 Blast Weekly" (e.g., 3rd place with 300 points).

8. **Profile** (`/profile`):
   - View your stats (leagues joined, NFTs owned, SUI won).
   - Share your achievements on X with a pre-filled tweet: "Check out my SuiSports Legends stats! I’ve won 0.00 SUI, joined 1 league, and own 6 NFTs."

---

## 🧪 Edge Cases & Error Handling

SuiSports Legends is designed with robustness in mind, handling various edge cases to ensure a smooth user experience:

### Weekly Leagues
- **Joining an Ended League**: Attempting to join "IPL Fantasy Week 6" (ended) results in: "This league has ended. Please choose an active or upcoming league."
- **No Team Submitted**: If no team is built, joining a league prompts: "Please build and submit a team in Team Builder before joining a league."
- **Insufficient Balance**: If the user lacks the entry fee (e.g., 0.8 SUI), they’ll see: "Insufficient balance! You need 0.8 SUI to join, but you only have X SUI."

### Marketplace
- **Insufficient Balance for Purchase**: Attempting to buy an NFT (e.g., Ben Stokes for 12.8 SUI) with insufficient funds results in: "Insufficient balance! You need 12.8 SUI, but you only have X SUI."
- **NFT Unavailable**: If an NFT is already purchased, the user sees: "NFT may no longer be available or owned by seller."
- **Wallet Not Connected**: Attempting to buy without a connected wallet prompts: "Please connect your wallet to purchase NFTs."

### Staking
- **Unstaking During Active League**: Unstaking an NFT in an active league (e.g., "T20 Blast Weekly") results in: "Cannot unstake this NFT because it is part of an active league team. Wait until the league ends on 2025-05-27."
- **Insufficient Staking Fee**: If the user lacks the 0.05 SUI staking fee, they’ll see: "Insufficient balance! You need 0.05 SUI to stake, but you only have X SUI."

### Profile
- **Sharing Without Wallet**: Attempting to share on X without a connected wallet prompts: "Please connect your wallet to share your profile."
- **Tweet Length**: The "Share on X" feature ensures tweets stay within the 280-character limit, even with dynamic user stats.

### General
- **Network Errors**: API calls (e.g., fetching marketplace listings) handle errors gracefully with user-friendly messages like: "Failed to load marketplace data. Please try again."
- **UI Responsiveness**: The app is fully responsive, ensuring usability on both mobile and desktop devices.

---

## 📸 Screenshots

| Dashboard | Marketplace | Profile |
|-----------|-------------|---------|
| ![Dashboard](https://via.placeholder.com/300x200.png?text=Dashboard) | ![Marketplace](https://via.placeholder.com/300x200.png?text=Marketplace) | ![Profile](https://via.placeholder.com/300x200.png?text=Profile) |

| Weekly Leagues | Team Builder | Leaderboard |
|----------------|--------------|-------------|
| ![Weekly Leagues](https://via.placeholder.com/300x200.png?text=Weekly+Leagues) | ![Team Builder](https://via.placeholder.com/300x200.png?text=Team+Builder) | ![Leaderboard](https://via.placeholder.com/300x200.png?text=Leaderboard) |

*(Replace placeholder images with actual screenshots for a professional presentation.)*

---

## 🚀 Deployment Guide

To deploy *SuiSports Legends* to a production environment, follow these steps:

### Frontend Deployment
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to a hosting platform like Vercel, Netlify, or GitHub Pages.
3. Set environment variables in the hosting platform (e.g., API base URL):
   ```
   VITE_API_BASE_URL=https://your-backend-url
   ```

### Backend Deployment
1. Deploy the Express server to a platform like Heroku, Render, or AWS EC2.
2. Configure CORS to allow requests from the production frontend domain.
3. Replace the in-memory mock database with a persistent database (e.g., MongoDB) for scalability.
4. Set environment variables for the backend:
   ```
   PORT=3000
   SUI_NETWORK=testnet
   ```

### Blockchain Integration
1. Deploy a marketplace smart contract on Sui to handle atomic NFT transfers.
2. Update the backend to interact with the contract for all transactions (purchases, staking, league entries).
3. Ensure the Sui Wallet Kit is configured to use the production network (e.g., `mainnet` instead of `testnet`).

---

## 🔮 Future Enhancements

- **Full On-Chain Integration**: Deploy a Sui smart contract for the marketplace to enable atomic NFT transfers and eliminate mock data.
- **Live Cricket Stats**: Integrate a live sports API (e.g., CricAPI) to fetch real-time player stats, dynamically updating NFT performance in leagues.
- **Multi-Chain Support**: Extend compatibility to other blockchains like Aptos or Ethereum for broader accessibility.
- **Mobile App**: Develop iOS and Android apps using React Native for a native mobile experience.
- **Advanced Analytics**: Add detailed team and player analytics to help users strategize for leagues.
- **Community Features**: Introduce global leaderboards, user forums, and in-app chat to foster community engagement.
- **NFT Upgrades**: Allow users to upgrade their NFTs (e.g., improve stats) through in-game achievements or staking rewards.

---

## 🤝 Contributing

We welcome contributions to *SuiSports Legends*! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them with a descriptive message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request on the main repository, describing your changes in detail.

Please ensure your code adheres to the project’s coding standards (enforced by ESLint and Prettier) and includes appropriate tests if applicable.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Sui Blockchain Team**: For providing excellent documentation, Testnet support, and developer tools that made this project possible.
- **Open-Source Community**: For libraries like React, Tailwind CSS, Framer Motion, and the Sui JavaScript SDK, which were instrumental in development.
- **Cricket Fans**: For inspiring us to create a platform that celebrates the sport we love.

---

## 📬 Contact

For questions, feedback, or collaboration opportunities, please reach out:  
- **Email**: palarpwaranshul@gmail.com  
- **GitHub Issues**: Open an issue on this repository for bug reports, feature requests, or general inquiries.

---

**Experience the future of fantasy sports with SuiSports Legends! ⚡**

