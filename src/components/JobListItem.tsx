import { Job } from "@prisma/client";
import Image from "next/image";
import CompanyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { Banknote, Briefcase, Clock, Globe2, MapPin } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/utils";
import Badge from "./Badge";

type JobListItemProps = {
  job: Job;
};

export default function JobListItem({
  job: {
    title,
    type,
    locationType,
    location,
    salary,
    companyName,
    companyLogoUrl,
    createdAt,
  },
}: JobListItemProps) {
  return (
    <article className="flex cursor-pointer gap-3 rounded-lg border p-5 hover:bg-muted">
      <Image
        src={companyLogoUrl ?? CompanyLogoPlaceholder}
        alt={`${companyName} logo`}
        width={100}
        height={100}
        className="self-center rounded-lg"
      />
      <div className="flex-grow space-y-3 text-left text-sm sm:text-[16px]">
        <div className="text-left">
          <h2 className="text-lg font-medium sm:text-xl">{title}</h2>
          <p className="text-muted-foreground">{companyName}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5 sm:hidden">
            <Briefcase size={16} className="shrink-0" />
            {type}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={16} className="shrink-0" />
            {locationType}
          </p>
          <p className="flex items-center gap-1.5">
            <Globe2 size={16} className="shrink-0" />
            <span className="line-clamp-1">{location || "Worldwide"}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Banknote size={16} className="shrink-0" />
            {formatMoney(salary)}
          </p>
          <p className="flex items-center gap-1.5 sm:hidden">
            <Clock size={16} className="shrink-0" />
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-end justify-between sm:flex">
        <Badge>{type}</Badge>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={16} />
          {formatDate(createdAt)}
        </span>
      </div>
    </article>
  );
}
