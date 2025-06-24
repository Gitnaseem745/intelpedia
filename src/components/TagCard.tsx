import { ArrowRight, BookOpen, Code, Database, Lightbulb, Rocket, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TagCardProps {
  tag: {
    id: string;
    name: string;
  };
  index?: number;
}

export const TagCard: React.FC<TagCardProps> = ({ tag, index = 0 }) => {
  const icons = [Code, Database, Rocket, TrendingUp, Search, Lightbulb];
  const IconComponent = icons[index % icons.length] || BookOpen;
  const tagName = tag.name.replaceAll('-', ' ');
  
  return (
    <Link 
      href={`/tag/${tag.name.toLowerCase()}`}
      className="group p-6 bg-card rounded-xl border hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold capitalize">
          {tagName}
        </h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Explore our latest insights and tutorials on {tagName}.
      </p>
      <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
        View Posts
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
