import { Suspense, useState } from "react";
import JobGenieLogo from "/logo.png";
import "./App.css";
import JobCard from "./JobCard";
import { JobInfo } from "./JobCard";

type JobSite = {
  name: string;
  isValid: (url: string) => boolean;
};

const jobSites: JobSite[] = [
  {
    name: "Lever",
    isValid: (url: string) =>
      /^https?:\/\/(jobs\.)?lever\.co\/[\w-]+\/[\w-]+(?:\/[\w-]+)?$/.test(url),
  },
];

function App() {
  const [jobUrl, setJobUrl] = useState("");
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getJobInfo = async () => {
    if (!jobUrl) {
      alert("Please enter a job URL");
      return;
    }

    setIsLoading(true);

    try {
      // Your URL processing logic here
      const corsProxy = "https://corsproxy.io/?url=";
      const url = corsProxy + encodeURIComponent(jobUrl);
      const response = await fetch(url);
      const html = await response.text();

      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Find your elements
      const jsonLdScripts = doc.querySelector(
        'script[type="application/ld+json"]'
      );
      if (jsonLdScripts) {
        // Parse the JSON content
        const jsonData = JSON.parse(jsonLdScripts.textContent || "");
        console.log(jsonData);
        setJobInfo({
          companyName: jsonData.hiringOrganization.name || "...",
          postingDate: jsonData.datePosted || "...",
          jobTitle: jsonData.title || "...",
        });
      } else {
        console.log("No JSON-LD script found");
      }
    } catch (error) {
      console.error("Error processing URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getValidSite = (url: string): string | null => {
    try {
      new URL(url); // Basic URL validation
      for (const site of jobSites) {
        if (site.isValid(url)) {
          return site.name;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="p-8 flex flex-col items-center">
        <img src={JobGenieLogo} className="logo w-96" alt="JobGenie logo" />
        <h1 className="text-xl font-bold text-blue-900 text-center">
          Find the job posted date.
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold">Enter your job url:</h1>
            {/* Add flex container for input and button */}
            <div className="flex w-full gap-2">
              <input
                type="url"
                className="flex-1 p-2 border rounded"
                placeholder="https://jobs.lever.co/pennylane/145d939a-833c-4824-bd2d-410bca6e342b"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                disabled={isLoading}
              />

              <button
                onClick={() => getJobInfo()}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                type="button"
                disabled={isLoading}
              >
                Fetch job info
              </button>
            </div>
            <div className="label w-full text-left">
              <span className="label-text-alt text-gray-500">
                Supported sources (more coming soon!):
                <ul className="mt-1 space-y-1">
                  {jobSites.map((site) => (
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className={`size-6 ${
                          jobUrl && site.name === getValidSite(jobUrl)
                            ? "text-green-500"
                            : "text-gray-200"
                        }`}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <span>{site.name}</span>
                    </li>
                  ))}
                </ul>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Suspense
          fallback={
            <div>
              <span className="loading loading-ring loading-lg"></span>
            </div>
          }
        >
          <JobCard jobInfo={jobInfo} isLoading={isLoading} />
        </Suspense>
      </div>
      <footer className="footer footer-center text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by Tom
            Evers
          </p>
          <a
            href="https://github.com/tomcent-tom/jobgenie"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <svg
              height="24"
              width="24"
              viewBox="0 0 16 16"
              className="fill-current"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </aside>
      </footer>
    </div>
  );
}

export default App;
