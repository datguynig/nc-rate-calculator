#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Building NewComma Day Rate Calculator...\n')

// Check for required files
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.ts',
  'app/layout.tsx',
  'app/page.tsx'
]

console.log('✅ Checking required files...')
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`❌ Missing required file: ${file}`)
    process.exit(1)
  }
}

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('📁 Created data directory for email storage')
}

// Check environment variables
console.log('🔧 Checking environment configuration...')

// Check for email service configuration
const hasFormspree = process.env.FORMSPREE_ENDPOINT
const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
const hasResend = process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL
const hasAnalytics = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

const emailServices = []
if (hasFormspree) emailServices.push('Formspree')
if (hasSupabase) emailServices.push('Supabase')
if (hasResend) emailServices.push('Resend')

if (emailServices.length > 0) {
  console.log(`✅ Email service(s) configured: ${emailServices.join(', ')}`)
} else {
  console.log('⚠️  No email service configured - will use console logging fallback')
  console.log('   Consider setting up Formspree, Supabase, Resend, or deploying to Netlify')
}

if (hasAnalytics) {
  console.log('✅ Analytics enabled')
} else {
  console.log('⚠️  Analytics not configured')
}

console.log('\n📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Failed to install dependencies')
  process.exit(1)
}

console.log('\n🔍 Running type check...')
try {
  execSync('npm run type-check', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Type check failed')
  process.exit(1)
}

console.log('\n🏗️  Building application...')
try {
  execSync('npm run build', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Build failed')
  process.exit(1)
}

console.log('\n✅ Build completed successfully!')
console.log('\nNext steps:')
console.log('• Run "npm start" to test the production build locally')
console.log('• Deploy to Vercel, Netlify, or your preferred platform')
console.log('• Update your domain in the sitemap.xml file')

if (emailServices.length === 0) {
  console.log('• Set up an email service (Formspree, Supabase, Resend, or Netlify Forms)')
}

if (!hasAnalytics) {
  console.log('• Add Plausible domain to enable analytics')
}

console.log('\n🎉 Ready to launch!')
