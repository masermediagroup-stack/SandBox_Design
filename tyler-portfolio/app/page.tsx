import { FeaturedGrid } from "@/components/sections/FeaturedGrid";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeFooter } from "@/components/sections/HomeFooter";
import styles from "@/styles/home-page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HomeHero />
      <FeaturedGrid />
      <HomeFooter />
    </div>
  );
}
