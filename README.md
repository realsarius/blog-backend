# Blog Backend

Backend for the Blog application built with **Node.js** and **Express**.

## Features
- RESTful API for blog posts and user management
- MongoDB integration with Mongoose
- Authentication with JWT tokens
- End-to-end testing with Playwright
- Integration testing for backend services

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Playwright** for E2E testing
- **Node Test Runner & Supertest** for integration testing
- **ESLint** for code linting

---

## Environment Variables

Create a `.env` file in the project root with the following content:

```
MONGODB_URI=your_mongodb_uri
TEST_MONGODB_URI=your_test_mongodb_uri
PORT=port
SECRET=your_jwt_secret_key
```

Replace `<your_mongodb_uri>`, and `<your_test_mongodb_uri>` with your actual MongoDB Atlas credentials.

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blog-backend.git
   cd blog-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:<port>`

---

## Running Tests

### Linting
```bash
npm run eslint -- --fix
```

### Integration Tests
```bash
npm run test
```

### End-to-End (E2E) Tests
```bash
npm run test:e2e
```

### Run All Tests
```bash
npm run test:all
```

---

## Development

This repository uses a GitHub Actions workflow for development. **Direct pushes to the `main` branch are prohibited.**

To deploy changes:
1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin feature/your-feature-name
   ```
3. **Open a Pull Request** to merge into the `main` branch. Merging triggers the deployment pipeline.

---

## Future Improvements
- ~~Fix broken integration and E2E tests related to authentication.~~
- Add role-based access control (RBAC).
- Improve error handling and validation.
- Set up Docker for containerization.

---

## License

This project is licensed under the MIT License.

---

## Author

[Berkan Sözer](https://berkansozer.com/)

---

## Contact

For any questions or feedback, feel free to reach out!

📧 Email: berkansozer@outlook.com

🌐 Website: [berkansozer.com](https://berkansozer.com/)
