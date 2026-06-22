type AppHeaderProps = {
  userEmail: string | null;
  onLogout: () => void;
};

export function AppHeader({ userEmail, onLogout }: AppHeaderProps) {
  return (
    <header>
      <h1>AccountingApp</h1>

      <div>
        <span>{userEmail}</span>
        <button type="button" onClick={onLogout}>
          Выйти
        </button>
      </div>
    </header>
  );
}