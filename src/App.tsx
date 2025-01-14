import { useState } from "react";
import JobGenieLogo from "/logo.png";
import "./App.css";
import JobCard from "./JobCard";
import { JobInfo } from "./JobCard";

function App() {
  const [jobUrl, setJobUrl] = useState("");
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);

  const getJobInfo = async () => {
    if (!jobUrl) {
      alert("Please enter a job URL");
      return;
    }

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
                placeholder="https://www.linkedin.com/jobs/view/3824888449/"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />

              <button
                onClick={() => getJobInfo()}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                type="button"
              >
                Fetch job info
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <JobCard jobInfo={jobInfo} />
      </div>
      <footer className="footer footer-center text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by Tom
            Evers
          </p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
