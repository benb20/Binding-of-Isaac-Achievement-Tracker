# Binding of Isaac Achievement Tracker

This is a Node.js application that allows users to track their achievements in the game "The Binding of Isaac" through Steam authentication. It retrieves the user's Steam achievements and displays their progress, categorizing them based on character and boss requirements.

## Prerequisites

- Node.js (v12 or above)
- npm (Node Package Manager)
- Steam API key (required for accessing Steam data)

## Getting Started

1. Clone the repository or download the source code.
2. Install the dependencies by running the following command in the project directory: ```npm install```
3. Obtain a Steam API key by creating a Steam Web API account.
4. Replace the `key` variable in the `app.js` file with your Steam API key.
5. Start the application by running the following command:
6. Access the application in your web browser at `http://localhost:3000`.

## Usage

- Click the "Login" button to authenticate with your Steam account.
- Once logged in, you will see your achievements progress displayed.
- Achievements are categorized by characters and bosses.
- Unlocked achievements are displayed separately.
- Click on an achievement image to view more details on the official Binding of Isaac Wiki.

## Features

- Steam authentication using Passport.js and the Steam Web API.
- Retrieves achievement data from the Steam API.
- Retrieves additional achievement details from a local JSON file.
- Categorizes achievements based on character and boss requirements.
- Displays achievement progress and overall completion percentage.

## File Structure

- `app.js`: The main Node.js application file.
- `public/`: Contains static files (CSS, JS, images).
- `views/`: Contains the EJS view templates.

## Dependencies

- Express: Fast and minimalist web framework for Node.js.
- Axios: Promise-based HTTP client for making API requests.
- Passport: Authentication middleware for Node.js.
- Passport-Steam: Steam authentication strategy for Passport.
- Express-Session: Session middleware for Express.
- EJS: Templating engine for generating dynamic HTML pages.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).



