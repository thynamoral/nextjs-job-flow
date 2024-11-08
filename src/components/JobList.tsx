import { JobFilterValues } from "@/lib/validations";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type JobListProps = {
  jobFilterValues: JobFilterValues;
};

export default async function JobList({
  jobFilterValues: { q, type, location, remote },
}: JobListProps) {
  const searchQuery = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchQueryToDatabase: Prisma.JobWhereInput = searchQuery
    ? {
        OR: [
          { companyName: { search: searchQuery } },
          { title: { search: searchQuery } },
          { type: { search: searchQuery } },
          { location: { search: searchQuery } },
          { locationType: { search: searchQuery } },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchQueryToDatabase,
      type ? { type: type } : {},
      location ? { location: location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
