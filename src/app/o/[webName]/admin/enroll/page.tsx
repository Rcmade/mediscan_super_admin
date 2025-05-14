import { currentUser } from "@/action/currentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enrollmentMetadata } from "@/content/metadataContent";
import { PatientEnrollmentForm } from "@/feature/enroll/components/PatientEnrollmentForm";

export const metadata = enrollmentMetadata;
const page = async () => {
  const user = await currentUser();

  return (
    <div className="flex justify-center py-8">

      <Card className="w-[500px] max-w-full">
        <CardHeader>
          <CardTitle>Enter patient information.</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientEnrollmentForm
            defaultValue={{
              // patientName: user?.name || "",
              patients: [],
              phone: user?.phone || "",
            }}
            from={user?.role || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
