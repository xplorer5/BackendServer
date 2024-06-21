import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Ping endpoint (always returns true)
app.get('/ping', (req, res) => {
  res.json(true);
});

// Submit endpoint (stores submission data in JSON file)
app.post('/submit', (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const submission = {
    name,
    email,
    phone,
    github_link,
    stopwatch_time,
  };

  // Read existing submissions
  const submissions = JSON.parse(fs.readFileSync('db.json', 'utf8'));

  // Add new submission
  submissions.push(submission);

  // Write updated submissions to db.json
  fs.writeFileSync('db.json', JSON.stringify(submissions, null, 2));

  res.json({ message: 'Submission saved successfully' });
});

// Read endpoint (retrieves a specific submission by index)
app.get('/read', (req, res) => {
  const index = parseInt(req.query.index as string);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Invalid index parameter' });
  }

  const submissions = JSON.parse(fs.readFileSync('db.json', 'utf8'));

  if (index < 0 || index >= submissions.length) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const submission = submissions[index];
  res.json(submission);
});

export default app;
