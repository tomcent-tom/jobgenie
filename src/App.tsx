import { useState } from 'react'
import JobGenieLogo from '/logo.png'
import './App.css'

function App() {
  const [jobUrl, setJobUrl] = useState('');
  const [jobInfo, setJobInfo] = useState({jobTitle: '', postingDate: '', companyName: ''});

  const getJobInfo = async () => {
    if (!jobUrl) {
      alert('Please enter a job URL');
      return;
    }

    try {
      // Your URL processing logic here
      const corsProxy = 'https://corsproxy.io/?url=';
      const url = corsProxy + encodeURIComponent(jobUrl)
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find your elements
      const jsonLdScripts = doc.querySelector('script[type="application/ld+json"]');
      if (jsonLdScripts) {
        // Parse the JSON content
        const jsonData = JSON.parse(jsonLdScripts.textContent || '');
        console.log(jsonData);
        setJobInfo({companyName: jsonData.hiringOrganization.name || '...', postingDate: jsonData.datePosted || '...', jobTitle: jsonData.title || '...'});
      } else {
        console.log('No JSON-LD script found');
      }

      
      
    } catch (error) {
      console.error('Error processing URL:', error);
    }
  };
  
  let jobInfoDisplay = '';
  if (jobInfo.jobTitle) {
    jobInfoDisplay = `The job "${jobInfo.jobTitle}" was posted by "${jobInfo.companyName}" on "${jobInfo.postingDate}".`;
  }

  return (
    <>
      <div>
  
          <img src={JobGenieLogo} className="logo" alt="JobGenie logo" />
        
      </div>
      
      <h2>Enter your job url:</h2>
      <div className="card">
      <input 
        type="text" 
        placeholder="Enter job url" 
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
      />
        <button onClick={() => getJobInfo()}>
          Fetch job info
        </button>
        <p>
          {jobInfoDisplay}
        </p>
      </div>
    </>
  )
}

export default App
