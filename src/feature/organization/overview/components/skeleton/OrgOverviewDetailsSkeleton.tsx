import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton
export const LoadingSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-left-${i}`} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="w-full">
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-right-${i}`} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="w-full">
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
