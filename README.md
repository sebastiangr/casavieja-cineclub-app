# CineClubApp

CineClubApp is a Svelte-based web application designed to provide users with a platform to explore and manage their proposal movies for a comunity cinema club. 
The application features user authentication, movie browsing, and messaging functionalities.

## Features

- **User Authentication**: Users can sign up, log in, and log out.
- **Movie Browsing**: Explore a collection of movies with detailed information.
- **Messaging**: Users can send and receive messages related to their movie preferences.
- **Database Status**: Check the status of the database connection.

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd casavieja-cineclub-app
npm install
```

## Usage

To start the development server, run:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

To create a production version of your app, run:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

## Routes

- **/auth/login**: User login page.
- **/auth/signup**: User signup page.
- **/dashboard**: User dashboard with movie management features.
- **/peliculas**: Browse movies.
- **/messages**: View and send messages.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
