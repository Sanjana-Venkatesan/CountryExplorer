# Country Explorer App

This is a React-based web application that allows users to explore various countries, search for specific countries, view detailed information about each country, and take a fun flag quiz. The app features a light/dark theme toggle and pagination for efficient browsing.

## Features
- **Country List**: Displays a list of countries with options to search and view details.
- **Country Details**: View detailed information about each country, including the region, sub-region, languages spoken, borders, and more.
- **Flag Quiz**: Start a quiz to test your knowledge of flags.
- **Light/Dark Theme Toggle**: Switch between light and dark themes for better user experience.
- **Pagination**: Browse through countries with pagination.

## Technologies Used
- **React**: JavaScript library for building user interfaces.
- **Context API**: Used for managing global states (like theme switching).
- **CSS-in-JS**: For styling the components dynamically.

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   cd <project-directory>
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

   This will start the app and open it in your default web browser.

## Folder Structure

- `src/` - Contains all the source code for the application.
  - `components/` - Contains reusable components like `ThemeSwitcher`, `CountryQuiz`, etc.
  - `services/` - Contains the service to fetch country data.
  - `App.js` - Main file where components are rendered and app logic is handled.
  - `styles.js` - Contains styles used for the app with light/dark theme support.

## Usage

1. **Searching for Countries**: Type the name of the country in the search bar to filter the country list.
2. **Viewing Country Details**: Click on "Show details" to view more information about a country.
3. **Taking the Flag Quiz**: Click on "Start Flag Quiz" to begin the quiz and test your knowledge of flags.
4. **Switch Themes**: Toggle between light and dark themes to customize the app's look.

## Contributing

If you'd like to contribute to this project:
1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
