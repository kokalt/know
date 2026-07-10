import { Link } from "react-router-dom";

interface CategoryTagProps {
  name: string;
  count: number;
}

export function CategoryTag({ name, count }: CategoryTagProps) {
  return (
    <Link
      to={`/articles?category=${encodeURIComponent(name)}`}
      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
    >
      <span className="font-medium">{name}</span>
      <span className="ml-2 text-sm text-blue-500">({count})</span>
    </Link>
  );
}
