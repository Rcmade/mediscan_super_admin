import { Metadata } from "next";

export const enrollmentMetadata: Metadata = {
  title: "Patient Enrollment | Healthcare Portal",
  description:
    "Enroll new patients and manage patient information in our healthcare system.",
  keywords:
    "patient enrollment, healthcare registration, patient information, medical forms",
  openGraph: {
    title: "Patient Enrollment | Healthcare Portal",
    description:
      "Enroll new patients and manage patient information in our healthcare system.",
    type: "website",
    siteName: "Your Healthcare Portal",
    locale: "en_US",
  },
  robots: {
    index: false, // Prevent indexing of patient-related pages for privacy
    follow: false,
  },
};
