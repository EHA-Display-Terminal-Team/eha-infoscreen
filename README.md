# eha-infoscreen

Infoscreen for East Helsinki Airport
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Contributors
If you have questions about this project, please contact us at olli.salo@myy.haaga-helia.fi or arttu.saily@myy.haaga-helia.fi. Phone numbers can be provided through email, if future discussions required.
  - [Olli](https://github.com/Ullebror)
  - [Serica](https://github.com/sericakitty)
  - [Edoardo](https://github.com/edoardovac/)
  - [Miikka](https://github.com/MiikkaSa)




![infoscreen_screenshot](https://github.com/user-attachments/assets/4ca7f59f-3b35-49d5-b71d-5a38c9f3d63d)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Deploying Your GitHub Project to Vercel

This guide provides step-by-step instructions on how to deploy your GitHub project to Vercel. It covers creating an account, connecting your repository, setting environment variables, configuring a PostgreSQL database or blob storage via Vercel, and setting up GitHub Actions for continuous deployment.

## Creating a Vercel Account and Connecting Your Repository

### Create a Vercel Account:

1. Visit the [Vercel Sign Up page](https://vercel.com/signup).
2. Choose **Continue with GitHub** to sign up using your GitHub account.
3. Authorize Vercel to access your GitHub repositories when prompted.

### Import Your GitHub Repository:

1. After signing in, click on **New Project**.
2. Select **Import Git Repository**.
3. Search for your repository or enter its URL.
4. Click on the repository to proceed.

### Configure Project Settings:

1. Review the **Project Name** and **Root Directory**.
2. Select the appropriate **Framework Preset** if your project uses one.
3. Click **Deploy** to initiate the deployment.

## Setting Environment Variables

Environment variables store sensitive information like API keys and database credentials.

### Access Project Settings:

1. In the Vercel dashboard, select your project.
2. Navigate to the **Settings** tab.

### Add Environment Variables:

1. Scroll to the **Environment Variables** section.
2. Click **Add** to create a new variable.
3. Enter the **Name** and **Value** for each variable.
4. Choose the appropriate **Environment** (Production, Preview, Development).
5. Repeat for all required variables.

### Required Environment Variables:

#### PostgreSQL Database:

-   `POSTGRES_DATABASE`
-   `POSTGRES_HOST`
-   `POSTGRES_PASSWORD`
-   `POSTGRES_USER`
-   `POSTGRES_PRISMA_URL`
-   `POSTGRES_URL_NO_SSL`
-   `POSTGRES_URL_NON_POOLING`
-   `POSTGRES_URL`

#### Blob Storage (Rain Map):

-   `BLOB_READ_WRITE_TOKEN`

#### ADSB Integration:

-   `ADSB_USERKEY`

#### Runway Integration:

-   `RUNWAY_ID`
-   `RUNWAY_SECRET`

#### GitHub Action (Development Branch Preview):

-   `API_KEY_DEV`

## Configuring PostgreSQL Database and Blob Storage via Vercel

### Setting Up a PostgreSQL Database

1. **Navigate to the Storage Tab:**

    - In your Vercel dashboard, select your project.
    - Go to the **Storage** tab in the project settings.

2. **Add a PostgreSQL Database:**
    - Click **Add** under the PostgreSQL section.
    - Follow the prompts to set up a database instance.
    - Once created, the necessary environment variables (e.g., `POSTGRES_DATABASE`, `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`) will be automatically added to your project.

### Setting Up Blob Storage

1. **Navigate to the Storage Tab:**

    - In the same **Storage** tab, look for the **Blob Storage** section.

2. **Add Blob Storage:**

    - Click **Add** under the Blob Storage section.
    - Follow the prompts to configure the storage service.
    - Once set up, the required credentials (e.g., `BLOB_READ_WRITE_TOKEN`) will be automatically added to your environment variables.

3. **Verify Credentials:**

    - Navigate to the **Environment Variables** section in your project settings to confirm the variables have been added.

4. **Verifying connection:**
    - Please check how to implement storage connection to your code.

## Setting Up GitHub Actions for Deployment

Automate your deployment process using GitHub Actions.

### Add Secrets to GitHub Repository:

1. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2. Add the following secrets:
    - `VERCEL_TOKEN`: Your Vercel token.
    - `VERCEL_ORG_ID`: Your Vercel project name.
    - `VERCEL_PROJECT_ID`: Found in your Vercel project's settings.
    - `API_KEY_DEV`: GitHub token for development branch previews.

### Create GitHub Action Workflow:

Create a new file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to Vercel

on:
    push:
        branches:
            - main # Production
            - dev # Preview

jobs:
    deploy:
        runs-on: ubuntu-latest

        steps:
            - name: Check out code
              uses: actions/checkout@v2

            - name: Set up Node.js
              uses: actions/setup-node@v2
              with:
                  node-version: '20'

            - name: Install dependencies
              run: npm install

            - name: Build project
              run: npm run build

            - name: Deploy to Vercel
              env:
                  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
                  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
                  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
                  API_KEY: ${{ secrets.API_KEY_DEV }}
              run: |
                  if [ "${{ github.ref }}" == "refs/heads/main" ]; then
                    npx vercel --prod
                  else
                    npx vercel –pre
```

### Verify the Workflow:

1. Commit and push the changes to your repository.
2. The GitHub Action should trigger automatically on pushes to the `main` or `dev` branches.

---

## How the GitHub Action Works

The GitHub Action is designed to streamline the deployment process for your project. Here’s how it works:

### Triggering the Action:

-   The action is triggered automatically whenever changes are pushed to the `main` or `dev` branches of your GitHub repository.

### Branch-Specific Deployments:

1. **Main Branch:**

    - Changes in the `main` branch trigger a deployment to the **production environment** on Vercel.
    - This ensures that updates are reflected in the live, public-facing version of your application.

2. **Dev Branch:**
    - Changes in the `dev` branch trigger a deployment to the **preview environment** on Vercel.
    - This allows you to test and validate updates before merging them into the `main` branch.

### Steps in the Workflow:

1. **Check out code:**

    - The workflow fetches the latest version of your project from the GitHub repository.

2. **Set up Node.js:**

    - The Node.js environment is prepared to build and run your project.

3. **Install dependencies:**

    - All required packages are installed.

4. **Build project:**

    - The project is built using your defined build script.

5. **Deploy to Vercel:**
    - The project is deployed to Vercel using the appropriate environment (`production` or `preview`).

### Environment Variables and Secrets:

-   The workflow uses secrets stored in your GitHub repository (e.g., `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`) to authenticate and securely deploy your project.

---

## Additional Notes

### Finding Vercel IDs and Tokens:

-   **VERCEL_TOKEN:**
    -   Generate this in your Vercel account under **Settings > Tokens**.
-   **VERCEL_ORG_ID:**
    -   This is typically your Vercel username or team name.
-   **VERCEL_PROJECT_ID:**
    -   Found in your Vercel project under **Settings > General > Project ID**.

### Environment Variables in Vercel:

-   Ensure all environment variables are set for the correct environments (**Production**, **Preview**, **Development**).

### GitHub Actions Secrets:

-   Keep your secrets secure; do not commit them to your repository.

---

## Conclusion

By following this guide, you have successfully:

1. Deployed your GitHub project to Vercel.
2. Configured environment variables.
3. Set up a PostgreSQL database or blob storage directly via the Vercel Storage tab.
4. Implemented continuous deployment with GitHub Actions.

With the GitHub Action in place:

-   Any updates pushed to the `dev` branch are automatically deployed to the **Preview environment** on Vercel, allowing you to test changes in an isolated environment.
-   Once the updates are ready for release, merging them into the `main` branch triggers a deployment to the **Production environment**, ensuring a seamless update to your live application.

For further assistance, refer to the [Vercel Documentation](https://vercel.com/docs) and the [GitHub Actions Documentation](https://docs.github.com/en/actions).

---

Happy Coding!
