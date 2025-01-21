import { JobInfo } from "./JobCard";

export type JobSite = {
    name: string;
    isValid: (url: string) => boolean;
    extractFn: (url: Document) => JobInfo | null;
  };
  
export const jobSites: JobSite[] = [
    {
      name: "Lever",
      isValid: (url: string) =>
        /^https?:\/\/(jobs\.)?lever\.co\/[\w-]+\/[\w-]+(?:\/[\w-]+)?$/.test(url),
      extractFn: (url: Document) => {
        const jsonLdScripts = url.querySelector(
          'script[type="application/ld+json"]'
        );
        if (jsonLdScripts) {
          // Parse the JSON content
          const jsonData = JSON.parse(jsonLdScripts.textContent || "");
          console.log(jsonData);
          return ({
            companyName: jsonData.hiringOrganization.name || "...",
            postingDate: jsonData.datePosted || "...",
            jobTitle: jsonData.title || "...",
          });
        } else {
          console.log("No JSON-LD script found");
          return null;
        }
      },
    },
    {
      name: "Teamtailor",
      isValid: (url: string) =>
        /^https?:\/\/[\w-]+\.teamtailor\.com\/[\w-]+\/[\w-]+(?:\/[\w-]+)?$/.test(url),
      extractFn: (url: Document) => {
        const published_time_tag = url.querySelector(
          'meta[property="article:published_time"]'
        ) || null;

        const title_tag = url.querySelector(
            'meta[property="og:title"]'
        ) || null;

        const company_name_tag = url.querySelector(
            'meta[property="og:site_name"]'
        ) || null;

        return {
            companyName: company_name_tag?.getAttribute("content") || "...",
            postingDate: published_time_tag?.getAttribute("content")?.substring(0, 10) || "...",
            jobTitle: title_tag?.getAttribute("content") || "...",
        };

      },
      
    },
    {
        name: "Pinpoint",
        isValid: (url: string) =>
          /^https?:\/\/[\w-]+\.pinpointhq\.com\/[\w-]+\/[\w-]+(?:\/[\w-]+)?$/.test(url),
        extractFn: (url: Document) => {
            const jsonLdScripts = url.querySelector(
                'script[type="application/ld+json"]'
              );
              if (jsonLdScripts) {
                // Parse the JSON content
                const jsonData = JSON.parse(jsonLdScripts.textContent || "");
                console.log(jsonData);
                return ({
                  companyName: jsonData.hiringOrganization.name || "...",
                  postingDate: jsonData.datePosted?.substring(0, 10) || "...",
                  jobTitle: jsonData.title || "...",
                });
              } else {
                console.log("No JSON-LD script found");
                return null;
              }
  
        },
        
      },
];
