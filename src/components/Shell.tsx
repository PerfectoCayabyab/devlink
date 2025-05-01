import ProfileFooter from "./ProfileFooter";
import ProfileHeader from "./ProfileHeader";


export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProfileHeader />
      <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
        {children}
      </div>
      <ProfileFooter />
    </>
  );
}
