import fetch from 'node-fetch';

interface EmailDoc {
  id: string;
  email: string;
  [key: string]: any;
}

async function listEmails(): Promise<void> {
  try {
    const response = await fetch('http://localhost:3001/api/landing-emails');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as EmailDoc[];
    const emails = data.map(doc => doc.email).join(' ');
    
    console.log(emails);
  } catch (error) {
    console.error('Error fetching emails:', (error as Error).message);
    process.exit(1);
  }
}

listEmails();