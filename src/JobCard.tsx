export interface JobInfo {
  jobTitle: string;
  postingDate: string;
  companyName: string;
}

function JobCard({ jobInfo }: { jobInfo: JobInfo | null }) {
  if (!jobInfo) {
    return null;
  }
  return (
    <>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">{jobInfo.jobTitle}</div>
          <div className="stat-value">Date: {jobInfo.postingDate}</div>
          <div className="stat-desc">Company: {jobInfo.companyName}</div>
        </div>
      </div>
    </>
  );
}

export default JobCard;
