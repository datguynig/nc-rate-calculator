import jsPDF from 'jspdf'
import { AllRates, CalculatorInputs } from './rates'
import { formatCurrency, formatDiscipline, formatExperience } from './format'

export function generateRatesPDF(rates: AllRates, inputs: CalculatorInputs) {
  const pdf = new jsPDF()
  
  // Set up fonts and colors
  const primaryColor: [number, number, number] = [0, 0, 0]
  const accentColor: [number, number, number] = [255, 203, 176]
  const textColor: [number, number, number] = [100, 100, 100]
  const [pr, pg, pb] = primaryColor
  const [ar, ag, ab] = accentColor
  const [tr, tg, tb] = textColor
  
  let yPosition = 30
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 30

  // Header with logo placeholder
  pdf.setFontSize(24)
  pdf.setTextColor(pr, pg, pb)
  pdf.text('NewComma', margin, yPosition)
  
  pdf.setFontSize(18)
  yPosition += 15
  pdf.text('Day Rate Calculator Report', margin, yPosition)

  // Date
  pdf.setFontSize(10)
  pdf.setTextColor(tr, tg, tb)
  yPosition += 8
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, margin, yPosition)

  // Inputs Summary
  yPosition += 20
  pdf.setFontSize(14)
  pdf.setTextColor(pr, pg, pb)
  pdf.text('Your Details', margin, yPosition)
  
  pdf.setFontSize(10)
  pdf.setTextColor(...textColor)
  yPosition += 10
  
  const details = [
    `Discipline: ${formatDiscipline(inputs.discipline)}`,
    `Experience: ${formatExperience(inputs.experience)}`,
    `Location: ${inputs.location}`,
    `Work Type: ${inputs.workType}`,
    `Complexity: ${inputs.complexity}`,
    `Usage Rights: ${inputs.usageRights}`,
    ...(inputs.rushJob ? ['Rush Job: Yes'] : []),
  ]
  
  details.forEach(detail => {
    pdf.text(detail, margin, yPosition)
    yPosition += 6
  })

  // Day Rates
  yPosition += 15
  pdf.setFontSize(14)
  pdf.setTextColor(...primaryColor)
  pdf.text('Recommended Day Rates', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(12)
  
  // Rate boxes
  const boxWidth = 50
  const boxHeight = 25
  const boxSpacing = 10
  const startX = margin
  
  // Conservative rate
  pdf.rect(startX, yPosition, boxWidth, boxHeight)
  pdf.text('Conservative', startX + 5, yPosition + 8)
  pdf.setFontSize(14)
  pdf.text(formatCurrency(rates.day.low, inputs.currency), startX + 5, yPosition + 18)
  
  // Recommended rate (highlighted)
  const recX = startX + boxWidth + boxSpacing
  pdf.setFillColor(ar, ag, ab)
  pdf.rect(recX, yPosition, boxWidth, boxHeight, 'F')
  pdf.rect(recX, yPosition, boxWidth, boxHeight)
  pdf.setFontSize(10)
  pdf.text('Recommended', recX + 5, yPosition + 8)
  pdf.setFontSize(14)
  pdf.text(formatCurrency(rates.day.mid, inputs.currency), recX + 5, yPosition + 18)
  
  // Premium rate
  const premX = recX + boxWidth + boxSpacing
  pdf.rect(premX, yPosition, boxWidth, boxHeight)
  pdf.setFontSize(10)
  pdf.text('Premium', premX + 5, yPosition + 8)
  pdf.setFontSize(14)
  pdf.text(formatCurrency(rates.day.high, inputs.currency), premX + 5, yPosition + 18)

  // Hourly and Project rates
  yPosition += 40
  pdf.setFontSize(12)
  pdf.setTextColor(pr, pg, pb)
  pdf.text('Alternative Rate Formats', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(10)
  pdf.setTextColor(tr, tg, tb)
  
  const rateFormats = [
    `Hourly: ${formatCurrency(rates.hour.low, inputs.currency)} - ${formatCurrency(rates.hour.high, inputs.currency)}`,
    `Project: ${formatCurrency(rates.project.low, inputs.currency)} - ${formatCurrency(rates.project.high, inputs.currency)}`,
  ]
  
  rateFormats.forEach(format => {
    pdf.text(format, margin, yPosition)
    yPosition += 8
  })

  // Reasoning
  yPosition += 15
  pdf.setFontSize(12)
  pdf.setTextColor(pr, pg, pb)
  pdf.text('Calculation Reasoning', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(10)
  pdf.setTextColor(tr, tg, tb)
  const splitReasoning = pdf.splitTextToSize(rates.day.reasoning, pageWidth - (margin * 2))
  pdf.text(splitReasoning, margin, yPosition)
  yPosition += splitReasoning.length * 6

  // Tips
  yPosition += 10
  pdf.setFontSize(12)
  pdf.setTextColor(pr, pg, pb)
  pdf.text('Negotiation Tips', margin, yPosition)
  
  yPosition += 10
  pdf.setFontSize(10)
  pdf.setTextColor(tr, tg, tb)
  
  rates.day.tips.forEach((tip, index) => {
    const tipText = `${index + 1}. ${tip}`
    const splitTip = pdf.splitTextToSize(tipText, pageWidth - (margin * 2))
    pdf.text(splitTip, margin, yPosition)
    yPosition += splitTip.length * 6 + 2
  })

  // Footer CTA
  yPosition += 20
  pdf.setFontSize(10)
  pdf.setTextColor(...textColor)
  pdf.text('Want more freelancing resources?', margin, yPosition)
  yPosition += 6
  pdf.text('Join NewComma Plus for templates, contracts, and expert guidance.', margin, yPosition)
  yPosition += 6
  pdf.text('Visit: home.newcomma.com/pricing', margin, yPosition)

  // Download the PDF
  const filename = `newcomma-rates-${inputs.discipline.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`
  pdf.save(filename)
}
