import prisma from "@/lib/prisma";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import { jobTypes } from "@/lib/job-types";
import { jobFilterSchema, JobFilterValues } from "@/lib/validations";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const parsedValues = jobFilterSchema.parse(values);

  const { q, type, location, remote } = parsedValues;

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

type JobFilterSideBarProps = {
  defaultFilterValues: JobFilterValues;
};

export default async function JobFilterSideBar({
  defaultFilterValues,
}: JobFilterSideBarProps) {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((location) =>
      location.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <div className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultFilterValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              type="text"
              placeholder="Title, company, etc."
              defaultValue={defaultFilterValues.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultFilterValues.type ?? ""}
            >
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultFilterValues.location ?? ""}
            >
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remote"
              id="remote"
              className="scale-150 accent-black"
              defaultChecked={defaultFilterValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
        </div>
      </form>
    </div>
  );
}
