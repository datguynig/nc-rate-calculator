# NewComma Day Rate Calculator

A production-ready Next.js application that helps creative freelancers calculate fair day, hourly, and project rates. Built with TypeScript, Tailwind CSS, and designed for accessibility and performance.

## Features

- 🧮 **Smart Rate Calculation**: Blends income-based formula with market benchmarks
- 📊 **Multi-Format Rates**: Day, hourly, and project pricing options  
- 🌍 **Location-Aware**: Adjusts rates for different countries and markets
- 📱 **Mobile-First Design**: Responsive across all devices
- ♿ **Accessible**: WCAG AA compliant with keyboard navigation
- 📧 **Email Capture**: Integrates with Mailchimp or local fallback
- 📄 **PDF Reports**: Generate branded rate reports
- 📈 **Analytics Ready**: Supports Plausible Analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom UI library
- **PDF Generation**: jsPDF
- **Email**: Mailchimp API (with fallback)
- **Analytics**: Plausible (optional)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Choose One Email Option)

Create a `.env.local` file in the root directory with **one** of these options:

#### Option 1: Formspree (Recommended - Works Everywhere)
```bash
# Create a free form at formspree.io
FORMSPREE_ENDPOINT=https://formspree.io/f/xldwbedl

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain.com
```

#### Option 2: Supabase (If You Want a Database)
```bash
# Create a project at supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain.com
```

#### Option 3: Resend (Simple Email Notifications)
```bash
# Get API key from resend.com  
RESEND_API_KEY=re_your_api_key
NOTIFICATION_EMAIL=your@email.com

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain.com
```

#### Option 4: Netlify Forms (If Deploying to Netlify)
```bash
# No environment variables needed!
# Just deploy to Netlify and forms work automatically

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_domain.com
```

### 3. Development Server

```bash
npm run dev
```

### Codespaces: Testing Email + PDF

1. In the Codespace terminal, create `.env.local` with your endpoint:
```bash
echo "FORMSPREE_ENDPOINT=https://formspree.io/f/xldwbedl" > .env.local
```
2. Start the dev server:
```bash
npm run dev
```
3. Open the forwarded port in a browser (not the preview) and go to `/calculator`.
4. Fill out the form. To personalize rates, provide Annual income target and Billable days.
5. On results, click "Download PDF Report". If prompted, enter email; the PDF will download automatically after success.
6. Check your Formspree dashboard or email for the submission.

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Build for Production

```bash
# Optional: Run build check script
npm run build:check

# Build the application
npm run build

# Test production build locally
npm start
```

## Static Assets Setup

The app includes SVG versions of icons and images. For optimal compatibility, convert these to the required formats:

1. **Favicon**: Convert `public/favicon.svg` to `public/favicon.ico` (32x32px)
2. **Apple Touch Icon**: Convert `public/apple-touch-icon.svg` to PNG (180x180px)
3. **OG Image**: Convert `public/og-image.svg` to JPG (1200x630px)

You can use online converters or tools like:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Squoosh](https://squoosh.app/) for image optimization

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
├── app/
│   ├── api/subscribe/        # Email subscription endpoint
│   ├── calculator/          # Calculator page
│   ├── privacy/            # Privacy policy
│   ├── globals.css         # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── forms/             # Form components
│   ├── results/           # Results display
│   └── ui/               # Reusable UI components
├── lib/
│   ├── rates.ts          # Rate calculation logic
│   ├── format.ts         # Formatting utilities
│   ├── pdf-generator.ts  # PDF generation
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

## Component Library

The app includes a reusable UI component system:

- **Button**: Primary, secondary, tertiary, ghost variants
- **Input**: With labels, validation, and help text
- **Select**: Dropdown with search and validation
- **Card**: Content containers with headers
- **Badge**: Small labels and tags
- **Modal**: Accessible dialog overlays
- **Stepper**: Multi-step form progress
- **ResultGrid**: Rate display components

## Rate Calculation Logic

The calculator uses a sophisticated algorithm that:

1. **Calculates income-based rates** using annual targets, overhead (25%), profit buffer (15%), and billable days
2. **Applies market benchmarks** based on discipline, experience, and location
3. **Factors in project variables** like complexity, usage rights, and rush jobs
4. **Blends approaches** for balanced, realistic pricing
5. **Provides three options**: Conservative, recommended (highlighted), and premium

### Supported Disciplines

- Design
- Photography  
- Videography
- Writing
- Marketing
- Illustration
- Motion Graphics
- Web Development
- UI/UX Design
- Music
- Animation
- 3D/CGI
- Other

### Global Rate Adjustments

Rates are automatically adjusted for location:
- UK/EU: 1.0x (baseline)
- US: 1.1x
- Canada/Australia: 1.05x
- UAE: 1.05x
- South Africa: 0.7x
- Nigeria/Ghana/Kenya: 0.55-0.6x
- India: 0.55x
- Brazil: 0.65x

## Email Capture Options Explained

### 🎯 Formspree (Recommended)
**Best for:** Simple setup, works everywhere
- Create free account at [formspree.io](https://formspree.io)
- Create a new form, get your endpoint URL
- Handles spam protection automatically
- Emails sent to your inbox
- Free tier: 50 submissions/month

### 🗄️ Supabase 
**Best for:** When you want to store data in a database
- Create project at [supabase.com](https://supabase.com)
- Create a `subscribers` table with columns: `email`, `discipline`, `country`, `created_at`
- Get your URL and service role key
- Free tier: 50,000 rows, 500MB database

**Supabase Table Setup:**
```sql
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  discipline text,
  country text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 📧 Resend
**Best for:** When you want email notifications
- Create account at [resend.com](https://resend.com)
- Verify your sending domain
- Get API key from dashboard
- Sends you an email for each subscriber
- Free tier: 100 emails/day

### 🚀 Netlify Forms
**Best for:** Zero configuration (if deploying to Netlify)
- No setup required!
- Just deploy to Netlify
- View submissions in Netlify dashboard
- Free tier: 100 submissions/month
- Automatically handles spam protection

## Analytics

The app supports Plausible Analytics (privacy-focused). Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to your domain to enable tracking.

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management in modals
- Color contrast compliance (WCAG AA)
- Reduced motion support

## Performance

- Static generation where possible
- Optimized images and fonts
- Minimal bundle size
- Client-side rate calculations
- Progressive loading
- Mobile-first design

## Brand Guidelines

The design follows NewComma's brand language:
- **Colors**: Clean whites, rich blacks, accent gradient (#ffcbb0 to #ff9a6b)
- **Typography**: Inter font family with clear hierarchy
- **Layout**: Generous whitespace, rounded corners, subtle shadows
- **Motion**: Gentle transitions respecting reduced motion preferences

## Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run type-check  # TypeScript checking

# Maintenance
npm audit          # Check for vulnerabilities
npm outdated      # Check for package updates
```

## Environment Variables Reference

| Variable | Required | Description |
|## Final Setup Required

After deploying, you'll need to provide:

### 1. Email Service Credentials (Choose One)
Pick the option that works best for you:
- **Formspree**: `FORMSPREE_ENDPOINT`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- **Resend**: `RESEND_API_KEY` + `NOTIFICATION_EMAIL`
- **Netlify Forms**: No setup needed if deploying to Netlify

### 2. Update URLs in Code
Replace placeholder URLs with your actual links:
- `https://home.newcomma.com/pricing` → Your pricing page
- `privacy@newcomma.com` → Your support email
- Update sitemap.xml domain
- Update OG image metadata URLs

### 3. Analytics Setup (Optional)
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

### 4. Convert Asset Formats
The SVG assets need conversion for full compatibility:
- `favicon.svg` → `favicon.ico`
- `apple-touch-icon.svg` → `apple-touch-icon.png`  
- `og-image.svg` → `og-image.jpg`

## Values You Need to Provide

**Required:**
- Domain name for deployment
- Pricing page URL for CTA buttons
- Support email address
- Email service setup (choose one option above)

**Optional but Recommended:**
- Plausible Analytics domain for tracking
- Custom branding adjustments

----------|----------|-------------|
| `MAILCHIMP_API_KEY` | No | Your Mailchimp API key for email capture |
| `MAILCHIMP_LIST_ID` | No | Target audience ID in Mailchimp |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Domain for Plausible Analytics |

## Customization

### Adding New Disciplines
Edit `DISCIPLINES` array in `lib/rates.ts` and add corresponding baseline rates.

### Updating Rate Logic
Modify calculations in `lib/rates.ts`. The system is designed to be flexible and extensible.

### Styling Changes
Update Tailwind config in `tailwind.config.ts` and global styles in `app/globals.css`.

### Form Fields
Add new form fields in `components/forms/CalculatorForm.tsx` and update the `CalculatorInputs` interface.

## Support

For technical issues or feature requests, please:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include environment details and steps to reproduce

## License

Private commercial license. Not for redistribution.

---

Built with ❤️ for creative freelancers worldwide.