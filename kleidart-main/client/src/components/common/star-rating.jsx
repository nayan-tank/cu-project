import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  // console.log(rating, "rating");

  return [1, 2, 3, 4, 5].map((star, index) => (
    <Button
      key={index}
      className={`lg:p-2 rounded-full sm:h-7 sm:w-8 lg:w-9 lg:h-9 transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:text-primary-foreground"
      }`}
      variant="outline"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`lg:w-6 lg:h-6 w-6 h-4 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
