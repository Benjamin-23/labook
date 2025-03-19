export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full justify-center flex flex-col  items-center h-screen">
      {children}
    </div>
  );
}
