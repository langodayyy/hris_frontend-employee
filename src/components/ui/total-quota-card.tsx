import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type TotalQuotaCardProps = {
  title: string;
  value: string;
  color?: string;
  buttonText?: string;
  buttonHref?: string;
  showFooter?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
};

export function TotalQuotaCard({
  title,
  value,
  color = "bg-primary-900",
  buttonText,
  buttonHref,
  showFooter = true,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
}: TotalQuotaCardProps) {
  return (
    <Card className={`p-0 gap-0 ${className}`}>
      <div className="p-[20px] flex flex-col gap-[10px]">
        <CardHeader className={`flex gap-[25px] items-center p-0 ${headerClassName}`}>
          <span className={`w-3 h-3 rounded-full ${color}`}></span>
          <span className="text-neutral-900 font-medium text-base">
            {title}
          </span>
        </CardHeader>
        <CardContent className={`p-0 ${contentClassName}`}>
          <div className="font-bold text-3xl text-center">{value}</div>
        </CardContent>
      </div>

      {showFooter && buttonText && buttonHref && (
        <CardFooter className={`border-t-2 border-neutral-100 pt-4 w-full flex justify-end p-0 ${footerClassName}`}>
          <div className="w-auto p-[10px]">
            <Link href={buttonHref}>
              <Button>{buttonText}</Button>
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
