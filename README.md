# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/dff34ed4-75c8-4afd-80bf-a05b58faa391

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/dff34ed4-75c8-4afd-80bf-a05b58faa391) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenAI API (for intelligent employee selection)

## Features

- Search for companies and employees
- Automatically select relevant employees using OpenAI's intelligent analysis
- View detailed employee information
- Responsive UI with modern design
- Data caching with Supabase for improved performance

## API Keys

This project uses the following APIs:

1. **Apollo.io API** - For searching companies and employees
2. **OpenAI API** - For intelligent employee selection based on relevance to a query
3. **Supabase** - For data caching and persistence

To use your own OpenAI API key, update the key in `src/utils/apiKeys.ts`.

## Supabase Integration

The application uses Supabase to cache API responses for better performance. This provides several benefits:

1. **Reduced API calls**: Avoids hitting Apollo's API rate limits
2. **Faster responses**: Cached data loads instantly
3. **Offline capabilities**: Data remains available even when APIs are down

The data is automatically cached when fetched and retrieved on subsequent requests with the same parameters. The cache is valid for 24 hours, after which fresh data will be fetched.

### Cache Management

Users can see when cached data is being used through a "Cached Data" indicator. There's also an option to manually clear the cache and fetch fresh data when needed.

### Database Structure

The application uses two main tables in Supabase:
- `companies` - Stores company information from Apollo
- `employee_cache` - Stores employee search results with query parameters

## OpenAI Integration

The application uses OpenAI to intelligently select the most relevant employees based on your search query. Here's how it works:

1. When you enable "AI Selection" on the Employee List page, the app sends the list of employees along with your query to OpenAI.
2. OpenAI analyzes the job titles, departments, and other information to determine which employees are most relevant.
3. The API returns a list of selected employee IDs, which are then highlighted in the interface.

The OpenAI integration is structured for security and maintainability:
- API requests are proxied through a serverless function to protect API keys
- The proxy endpoint handles error management and response parsing
- There's a fallback to manual selection if the API encounters issues

### Technical Implementation

The OpenAI integration follows the pattern:
- `src/lib/openaiApi.ts` - Client-side service that prepares data for OpenAI
- `api/openai-proxy.cjs` - Serverless function that handles actual API calls
- `src/utils/apiKeys.ts` - Securely manages API keys

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/dff34ed4-75c8-4afd-80bf-a05b58faa391) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
