# Todo Summary Assistant

A modern Todo application with AI-powered task summarization.

## Features

- Create, edit, and delete todos
- Mark todos as complete/incomplete
- AI-powered task summarization
- Clean and modern UI
- Real-time updates

## Screenshots

![Todo List Interface](screenshots/todo-list.png)
![Add Todo](screenshots/add-todo.png)
![AI Summary](screenshots/ai-summary.png)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-summary
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Create a `.env` file in the frontend directory with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

4. Start the frontend application:
```bash
npm start
```

The application will be available at http://localhost:3000

## Tech Stack

- React
- TypeScript
- Supabase
- OpenAI API
- Material-UI
- React Router
- React Toastify

## Project Structure

```
todo-summary/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 