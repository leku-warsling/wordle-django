## Setup
1. clone the repository
2. cd into backend directory
3. cp .env.example .env
4. poetry install
5. poetry shell
6. docker-compose up -d
7. poetry run python manage.py migrate
8. poetry run python manage.py runserver
9. cd into client directory
10. npm install
11. npm run dev

## TODO
- Validate guess is a valid word in the dictionary
- Add more tests and find edge cases
- Abstract out the game logic to help with testing
- Add shell script to initialize project and a script to run project
- Review code and add comments or refactor for better readability
- Add type hints to the code for better readability
- Add users and authentication to track games to users (ability to save games, resume games, stats, leaderboard, settings etc)
- Add settings to change game difficulty (word length, time limit, etc), letter hints
- Add leaderboard to track high scores
- Add stats to track games played, games won, games lost, average score, streak etc
- keep game id state in url or local storage to persist game state on refresh then add refresh button to reset game

