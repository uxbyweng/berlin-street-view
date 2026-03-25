import { auth } from "@/auth";
import { BackgroundMap } from "@/components/map/background-map";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="relative h-svh overflow-hidden">
        <BackgroundMap />
        <section className="relative z-10 mx-auto flex h-svh max-w-md items-center px-4 py-12">
          <div className="w-full rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md">
            <h1 className="text-2xl font-bold">Access denied</h1>
            <p className="mt-2 text-muted-foreground">
              You need to sign in to view your profile.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative h-svh overflow-hidden">
      <BackgroundMap />
      <section className="relative z-10 mx-auto flex max-w-md items-center px-4 py-6">
        <div className="w-full rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            This page is prepared and will be expanded later.
          </p>
        </div>
      </section>
    </div>
  );
}
