# College-Diaries
A beginner-friendly open-source website where students add their profiles, photos, skills, and college stories while learning GitHub collaboration and pull requests.

# College Diaries 🎓

College Diaries is a student-built website where students introduce themselves through profiles, photos, skills, and college stories.

This project helps students practise HTML, CSS, JavaScript, Git, and GitHub collaboration.

## Features

- Student profiles with photos
- Introductions, skills, and personal stories
- Search by name, skill, or interest
- Filter profiles by course
- Responsive layout for mobile and desktop

## Technologies

- HTML
- CSS
- JavaScript
- Git and GitHub

## Project Structure

```text
college-diaries/
├── dist/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── images/
│   └── profiles/
│       ├── index.js
│       ├── template.json
│       └── student-name.json
├── README.md
└── LICENSE
```

## Run Locally

Install Python 3, then run this command from the project folder:

```bash
python3 -m http.server 8000 --directory dist
```

On Windows, you can use:

```bash
py -m http.server 8000 --directory dist
```

Open **http://localhost:8000** in your browser.

Use a local server because the website loads profile files using JavaScript.

## How to Contribute

### 1. Fork the Repository

Click **Fork** to create a copy in your GitHub account.

### 2. Clone Your Fork

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR_USERNAME/college-diaries.git
cd college-diaries
```

### 3. Create a Branch

Replace `your-name` with your name:

```bash
git switch -c profile/your-name
```

### 4. Create Your Profile

Copy `dist/profiles/template.json` and rename the copy:

```text
dist/profiles/your-name.json
```

Update it with your details:

```json
{
  "id": "your-name",
  "name": "Your Name",
  "course": "MCA",
  "year": "1st year",
  "bio": "I enjoy learning programming and building websites.",
  "skills": ["HTML", "CSS", "C"],
  "image": "images/your-name.jpg",
  "tint": "#e1e8d9",
  "story": "Write about your interests, projects or favourite college memory."
}
```

### 5. Add Your Photo

Save your photo at:

```text
dist/images/your-name.jpg
```

The filename must match the image path in your profile.

### 6. Register Your Profile

Open `dist/profiles/index.js`.

Add `"your-name.json"` to the existing `window.PROFILE_FILES` array. Keep all existing filenames and separate entries with commas.

### 7. Test Your Changes

Run the website locally and check:

- Your photo and profile appear correctly.
- Your profile appears in search results.
- The course filter works.
- Your diary opens.
- The layout looks good on mobile.

### 8. Commit and Push

```bash
git add dist/profiles/your-name.json dist/profiles/index.js dist/images/your-name.jpg
git commit -m "Add my student profile"
git push -u origin profile/your-name
```

### 9. Open a Pull Request

On GitHub, click **Compare & pull request**.

Select the original repository's `main` branch as the destination.

Include:
- A clear title, such as `Add Aarav's profile`
- A short description of your changes
- A screenshot of your profile

Your teacher will review the PR and request corrections or merge it.

To make corrections, update the same branch, commit, and push again. The existing PR will update automatically.

## Contribution Rules

- Use one branch and one PR per task.
- Edit your own profile and photo.
- Preserve other students' entries in `profiles/index.js`.
- Write meaningful commit messages.
- Use only images you have permission to share.
- Avoid sharing private contact details.
- Test your changes before submitting.

## Practice Tasks

- Add your profile and photo.
- Improve the mobile layout.
- Add a course filter.
- Improve accessibility.
- Fix a bug or improve documentation.

## Sample Profiles

The included profiles and avatars are illustrative examples. Replace them or add real student profiles through pull requests.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
