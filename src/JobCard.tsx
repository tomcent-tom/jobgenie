export interface JobInfo {
  jobTitle: string;
  postingDate: string;
  companyName: string;
}

function JobCard({ jobInfo, isLoading }: { jobInfo: JobInfo | null, isLoading: boolean }) {
  return (
    <div className="card w-full max-w-2xl min-h-[200px]">
        {isLoading ? (
        <div className="card-body flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-ring loading-lg"></span>
            <p className="text-gray-500">Fetching job details...</p>
          </div>
        </div>
      ) : jobInfo ? (
          <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">{jobInfo.jobTitle}</div>
          <div className="stat-value text-blue-950">Posted Date: {jobInfo.postingDate}</div>
          <div className="stat-desc">Company: {jobInfo.companyName}</div>
        </div>
      </div>
   
    ) : (
        <div className="stats shadow"></div>
    )}
     </div>
  );
}

export default JobCard;
