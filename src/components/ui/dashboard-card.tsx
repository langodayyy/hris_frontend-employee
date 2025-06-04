import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  icon?: React.ReactNode;
  title: string;
  value: string;
}

export default function DashboardCard({
  icon,
  title,
  value,
}: DashboardCardProps)  {
  return (
    <Card className="p-5 w-full">
      <div className="flex gap-[10px] items-center">
        {icon ?? (
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.2301 15.6688C26.3657 13.3917 25.806 11.1273 24.6251 9.17569C23.4442 7.22409 21.6979 5.67758 19.6179 4.74125C17.5379 3.80492 15.2224 3.52301 12.9784 3.9329C10.7345 4.3428 8.66819 5.42513 7.05352 7.03637C5.43886 8.6476 4.35213 10.7116 3.93746 12.9547C3.52279 15.1977 3.79977 17.5138 4.73168 19.5958C5.66358 21.6779 7.20637 23.4274 9.15545 24.6125C11.1045 25.7975 13.3678 26.3621 15.6451 26.2313M20 23.75H27.5M23.75 20V27.5M15 8.75V15L18.75 18.75"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>{title}</span>
      </div>
      <span className="text-4xl font-bold">{value}</span>
    </Card>
  );
}
