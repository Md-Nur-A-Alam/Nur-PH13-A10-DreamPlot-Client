import FeaturedProperties from "@/component/FeaturedProperties/FeaturedProperties";
import HeroBanner from "@/component/HeroBanner/HeroBanner";
import PopularCities from "@/component/PopularCities/PopularCities";
import Review from "@/component/Review/Review";
import Specialty from "@/component/Specialty/Speciality";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <FeaturedProperties/>
      <Specialty/>
      <PopularCities/>
      <Review/>
    </div>
  );
}
