import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}

export function AppointmentStatsCard({
  title,
  value,
  icon,
  description,
}: AppointmentStatsCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-secondary p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
