import SignOutButton from "./sign-out-button";

export default function AdminShell({
  children,
  csrf,
}: {
  children: React.ReactNode;
  csrf: string;
}) {
  return (
    <>
      <header className="admin-header">
        <div className="admin-bar">
          <strong>Staff area</strong>
          <div className="admin-bar-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-link">
              View site
            </a>
            <SignOutButton csrf={csrf} />
          </div>
        </div>
      </header>
      <main id="main-content" className="admin-main">
        {children}
      </main>
    </>
  );
}
