import html2canvas from 'html2canvas'
import jsPdf from 'jspdf'
import Papa from 'papaparse'
import type { AnalyticsData } from '@/hooks/use-analytics'

export type PDFExportOptions = {
  title?: string
  includeCharts?: boolean
  includeStats?: boolean
  dateRange?: string
}

export async function exportAnalyticsToPDF(
  data: AnalyticsData,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    title = 'Illia Analytics Report',
    includeCharts = true,
    includeStats = true,
    dateRange = 'Last 30 days',
  } = options

  const pdf = new jsPdf('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Title
  pdf.setFontSize(20)
  pdf.setTextColor(40, 40, 40)
  pdf.text(title, pageWidth / 2, yPosition, { align: 'center' })

  yPosition += 10

  // Date range
  pdf.setFontSize(12)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Report Period: ${dateRange}`, pageWidth / 2, yPosition, { align: 'center' })

  yPosition += 20

  // Executive Summary
  pdf.setFontSize(16)
  pdf.setTextColor(40, 40, 40)
  pdf.text('Executive Summary', 20, yPosition)
  yPosition += 10

  pdf.setFontSize(11)
  pdf.setTextColor(60, 60, 60)

  const summaryLines = [
    `Total Searches: ${data.engagement.totalSearches.toLocaleString()}`,
    `Total Matches: ${data.engagement.totalMatches.toLocaleString()}`,
    `Total Leads: ${data.engagement.totalLeads.toLocaleString()}`,
    `Conversion Rate: ${data.engagement.conversionRate.toFixed(1)}%`,
    `Average Provider Rating: ${data.providers.avgRating.toFixed(1)}/5.0`,
    `Total Providers: ${data.providers.totalProviders}`,
    `Verified Providers: ${data.providers.verifiedProviders} (${data.providers.totalProviders > 0 ? ((data.providers.verifiedProviders / data.providers.totalProviders) * 100).toFixed(1) : 0}%)`,
  ]

  summaryLines.forEach((line) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.text(line, 20, yPosition)
    yPosition += 8
  })

  yPosition += 10

  // Top Search Terms
  if (data.search.popularSearchTerms.length > 0) {
    pdf.setFontSize(14)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Top Search Terms', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setTextColor(60, 60, 60)

    data.search.popularSearchTerms.slice(0, 10).forEach((term, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(`${index + 1}. ${term.term}: ${term.count} searches`, 20, yPosition)
      yPosition += 6
    })

    yPosition += 10
  }

  // Top Rated Providers
  if (data.providers.topRatedProviders.length > 0) {
    pdf.setFontSize(14)
    pdf.setTextColor(40, 40, 40)
    pdf.text('Top Rated Providers', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setTextColor(60, 60, 60)

    data.providers.topRatedProviders.slice(0, 10).forEach((provider, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(
        `${index + 1}. ${provider.name}: ${provider.rating.toFixed(1)} stars (${provider.reviewCount} reviews)`,
        20,
        yPosition
      )
      yPosition += 6
    })

    yPosition += 10
  }

  // Charts section (if requested)
  if (includeCharts) {
    // Add charts from DOM elements if they exist
    const chartElements = document.querySelectorAll('[data-chart-type]')

    if (chartElements.length > 0) {
      pdf.setFontSize(14)
      pdf.setTextColor(40, 40, 40)
      pdf.text('Charts & Visualizations', 20, yPosition)
      yPosition += 10

      for (const element of chartElements) {
        try {
          const canvas = await html2canvas(element as HTMLElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
          })

          const imgData = canvas.toDataURL('image/png')
          const imgWidth = 170
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 15
        } catch (_error) {
          // Error handled silently
        }
      }
    }
  }

  // Footer with generation date
  const footerY = pageHeight - 15
  pdf.setFontSize(8)
  pdf.setTextColor(120, 120, 120)
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )

  // Save the PDF
  const filename = `illia-analytics-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(filename)
}

export function exportAnalyticsToCSV(data: AnalyticsData): void {
  // Create engagement metrics CSV
  const engagementData = [
    {
      Metric: 'Total Searches',
      Value: data.engagement.totalSearches,
      'Conversion Rate': `${data.engagement.conversionRate.toFixed(1)}%`,
      'Avg Search Time': `${data.engagement.avgSearchTime.toFixed(2)}s`,
    },
    {
      Metric: 'Total Matches',
      Value: data.engagement.totalMatches,
      'Conversion Rate': '',
      'Avg Search Time': '',
    },
    {
      Metric: 'Total Leads',
      Value: data.engagement.totalLeads,
      'Conversion Rate': '',
      'Avg Search Time': '',
    },
  ]

  // Create search terms CSV
  const searchTermsData = data.search.popularSearchTerms.map((term) => ({
    'Search Term': term.term,
    'Search Count': term.count,
    Percentage: `${((term.count / data.engagement.totalSearches) * 100).toFixed(1)}%`,
  }))

  // Create provider performance CSV
  const providerData = data.providers.topRatedProviders.map((provider) => ({
    'Provider Name': provider.name,
    Rating: provider.rating,
    'Review Count': provider.reviewCount,
    Verified: 'Yes', // You might want to add this field to the data structure
  }))

  // Create search type distribution CSV
  const searchTypeData = data.search.searchTypeDistribution.map((type) => ({
    'Search Type': type.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    Count: type.count,
    Percentage: `${((type.count / data.engagement.totalSearches) * 100).toFixed(1)}%`,
  }))

  // Create provider services distribution CSV
  const servicesData = data.providers.providersByService.map((service) => ({
    Service: service.service.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    'Provider Count': service.count,
    Percentage: `${((service.count / data.providers.totalProviders) * 100).toFixed(1)}%`,
  }))

  // Combine all data into a single CSV with sections
  const csvData = [
    { Section: 'ENGAGEMENT METRICS', '': '', ' ': '', '  ': '' },
    ...engagementData.map((item) => ({
      Section: '',
      '': item.Metric,
      ' ': item.Value.toString(),
      '  ': item['Conversion Rate'] || item['Avg Search Time'] || '',
    })),
    { Section: '', '': '', ' ': '', '  ': '' },
    { Section: 'POPULAR SEARCH TERMS', '': '', ' ': '', '  ': '' },
    ...searchTermsData,
    { Section: '', '': '', ' ': '', '  ': '' },
    { Section: 'TOP RATED PROVIDERS', '': '', ' ': '', '  ': '' },
    ...providerData,
    { Section: '', '': '', ' ': '', '  ': '' },
    { Section: 'SEARCH TYPE DISTRIBUTION', '': '', ' ': '', '  ': '' },
    ...searchTypeData,
    { Section: '', '': '', ' ': '', '  ': '' },
    { Section: 'SERVICES DISTRIBUTION', '': '', ' ': '', '  ': '' },
    ...servicesData,
  ]

  // Convert to CSV
  const csv = Papa.unparse(csvData)

  // Download the CSV file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `illia-analytics-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
