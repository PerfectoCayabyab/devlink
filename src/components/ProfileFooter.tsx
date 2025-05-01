export default function ProfileFooter() {
    return (
      <footer className="text-center py-6 text-sm text-gray-400">
        <p>
          Made with 💙 by <a href="https://github.com/your-username/devlink" target="_blank" rel="noopener noreferrer" className="underline">DevLink</a> · {new Date().getFullYear()}
        </p>
      </footer>
    );
  }
  