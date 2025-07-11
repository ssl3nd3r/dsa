"use client";
import Header from "./Header";
import Footer from "./Footer";
import Loading from "./loading";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const {loading} = useSelector((state: RootState) => state.ui)
  const {loading: propertyLoading} = useSelector((state: RootState) => state.property)
  const {loading: authLoading} = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    console.log('loading', loading);
    console.log('propertyLoading', propertyLoading);
    console.log('authLoading', authLoading);
  }, [loading, propertyLoading, authLoading])


  return (
    <>
      {pathname !== '/login' && pathname !== '/verify-login' && pathname !== '/profile' && (  
        <Loading loading={loading || propertyLoading || authLoading} />
      )}
      <Header />
      {children}
      <Footer />
    </>
  );
} 