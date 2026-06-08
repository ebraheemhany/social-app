import Header from "@/component/items/Header";
import BottomNav from "@/component/items/NaveBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("MainLayout rendered"); // ← أضف ده
  return (
    <>
      <Header />
      {children}
      <BottomNav />
    </>
  );
}
